 import mongoose from 'mongoose';

// A sub-schema for items in the high-level roadmap
const roadmapItemSchema = new mongoose.Schema({
    title: String,
    description: String,
});

// A sub-schema for the detailed, generated lesson content
const lessonSchema = new mongoose.Schema({
    title: String,
    // The 'notes' field is now an array of strings to match the new prompt structure.
    notes: [String], 
    deepDiveTopics: [String],
    flashcards: [{ front: String, back: String }],
    youtubeVideos: [{ videoId: String, title: String }],
    isGenerated: { type: Boolean, default: false } // To track if a module's content has been generated
});

// The main schema for an entire course
const courseSchema = new mongoose.Schema({
    // This is the crucial link to the User model
    userId: { 
      type: String, 
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    originalPrompt: { 
      type: String, 
      required: true 
    },
    roadmap: [roadmapItemSchema],
    lessons: [lessonSchema],
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
});

const Course = mongoose.model('Course', courseSchema);

export default Course;