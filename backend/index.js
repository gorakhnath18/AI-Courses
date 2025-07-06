 import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { 
  getRoadmapPrompt, 
  getModuleDetailPrompt, 
  getDeepDivePrompt, 
  getQuizPrompt, 
  getSearchAnswerPrompt 
} from './prompt.js';

import User from './models/User.js';
import Course from './models/Course.js';
import { findBestYouTubeVideos } from './services/youtubeService.js';

// --- Initialize & DB Connection ---
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('MongoDB connection error:', err));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

// --- Middleware ---
const allowedOrigins = [
    'http://localhost:5173',
    'https://course-ai-brown.vercel.app'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      callback(new Error(msg), false);
    }
  },
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());


// --- Helper Function ---
function cleanAndParseJson(text) {
  let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  try { return JSON.parse(cleanedText); }
  catch (error) { throw new Error("Invalid JSON response from AI model"); }
}

// --- PUBLIC ROUTES ---
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the AI Courses Backend API!');
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || password.length < 6) return res.status(400).json({ msg: 'Please provide an email and a password of at least 6 characters.' });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'An account with this email already exists.' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ msg: 'User registered successfully!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- UPDATED LOGIN ROUTE ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Explicitly set cookie options for cross-site deployment
    res.cookie('token', token, { 
        httpOnly: true, 
        secure: true, // Must be true for SameSite=None
        sameSite: 'None', // Allows Vercel to send cookie to Render
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 
    }).json({ msg: 'Logged in successfully' });

  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- UPDATED LOGOUT ROUTE ---
app.post('/api/auth/logout', (req, res) => {
    res.cookie('token', '', { 
      httpOnly: true, 
      secure: true,
      sameSite: 'None',
      path: '/',
      expires: new Date(0) 
    }).json({ msg: 'Logged out successfully' });
});

app.get('/api/auth/verify', (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json({ loggedIn: false });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ loggedIn: true, userId: decoded.id });
    } catch (err) { res.json({ loggedIn: false }); }
});

// --- AUTHENTICATION MIDDLEWARE ---
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: 'Authorization denied. No token.' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (e) { res.status(401).json({ msg: 'Token is not valid' }); }
};

// --- PROTECTED API ROUTES ---

app.post('/api/generate-roadmap', authMiddleware, async (req, res) => {
  try {
    const { topic } = req.body;
    const prompt = getRoadmapPrompt(topic);
    const result = await model.generateContent(prompt);
    const roadmapData = cleanAndParseJson(result.response.text());
    const newCourse = new Course({
      userId: req.userId,
      title: roadmapData.title,
      originalPrompt: topic,
      roadmap: roadmapData.roadmap,
      lessons: roadmapData.roadmap.map(item => ({ title: item.title, isGenerated: false })),
    });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) { res.status(500).json({ error: 'Failed to generate roadmap.' }); }
});

app.post('/api/courses/:courseId/generate-module', authMiddleware, async (req, res) => {
  try {
    const { moduleTitle, moduleDescription } = req.body;
    const course = await Course.findOne({ _id: req.params.courseId, userId: req.userId });
    if (!course) return res.status(404).json({ error: 'Course not found or access denied.' });
    const existingLesson = course.lessons.find(lesson => lesson.title === moduleTitle);
    if (existingLesson && existingLesson.isGenerated) return res.json(existingLesson);
    const prompt = getModuleDetailPrompt(moduleTitle, moduleDescription);
    const result = await model.generateContent(prompt);
    const moduleDetailData = cleanAndParseJson(result.response.text());
    if (!moduleDetailData || typeof moduleDetailData.detailedNotes === 'undefined') throw new Error('AI returned invalid notes structure.');
    const newLessonData = {
      title: moduleDetailData.title || moduleTitle,
      notes: moduleDetailData.detailedNotes,
      deepDiveTopics: moduleDetailData.deepDiveTopics || [],
      flashcards: moduleDetailData.flashcards || [],
      youtubeVideos: [],
      isGenerated: true,
    };
    const lessonIndex = course.lessons.findIndex(l => l.title === moduleTitle);
    if (lessonIndex > -1) course.lessons[lessonIndex] = newLessonData;
    else course.lessons.push(newLessonData);
    await course.save();
    res.json(newLessonData);
  } catch (error) { res.status(500).json({ error: `Failed to generate module detail. Reason: ${error.message}` }); }
});

app.post('/api/deep-dive', authMiddleware, async (req, res) => {
  try {
    const { originalText, subTopic } = req.body;
    const prompt = getDeepDivePrompt(originalText, subTopic);
    const result = await model.generateContent(prompt);
    res.json(cleanAndParseJson(result.response.text()));
  } catch (error) { res.status(500).json({ error: 'Failed to generate deep dive content.' }); }
});

app.post('/api/search-module', authMiddleware, async (req, res) => {
  try {
    const { contextNotes, userQuestion } = req.body;
    if (!contextNotes || !userQuestion) return res.status(400).json({ error: 'Context and question are required.' });
    const prompt = getSearchAnswerPrompt(contextNotes, userQuestion);
    const result = await model.generateContent(prompt);
    const answerData = cleanAndParseJson(result.response.text());
    res.json(answerData);
  } catch (error) {
    console.error('Error in /search-module:', error.message);
    res.status(500).json({ error: 'Failed to answer question.' });
  }
});

app.post('/api/fetch-videos', authMiddleware, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'A search query is required.' });
    }
    console.log(`Fetching YouTube videos for query: "${query}"`);
    const videos = await findBestYouTubeVideos(query, 2);
    res.json(videos);
  } catch (error) {
    console.error('Error in /fetch-videos endpoint:', error.message);
    res.status(500).json({ error: 'Failed to fetch videos.' });
  }
});

app.get('/api/courses', authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch courses.' }); }
});

app.get('/api/courses/:id', authMiddleware, async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id, userId: req.userId });
        if (!course) return res.status(404).json({ error: 'Course not found or access denied.' });
        res.json(course);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch course.' }); }
});

app.delete('/api/courses/:id', authMiddleware, async (req, res) => {
  try {
    const deletedCourse = await Course.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deletedCourse) return res.status(404).json({ error: 'Course not found or access denied.' });
    res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (error) { res.status(500).json({ error: 'Failed to delete course.' }); }
});

app.post('/api/generate-quiz', authMiddleware, async (req, res) => {
  try {
    const { lessonTopic, questionCount } = req.body;
    if (!lessonTopic || !questionCount) return res.status(400).json({ error: 'Lesson topic and question count are required.' });
    const prompt = getQuizPrompt(lessonTopic, questionCount);
    const result = await model.generateContent(prompt);
    res.json(cleanAndParseJson(result.response.text()));
  } catch (error) { res.status(500).json({ error: 'Failed to generate quiz.' }); }
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});