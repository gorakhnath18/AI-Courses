import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import EmbeddedVideo from './EmbeddedVideo';
import Flashcard from './Flashcard';
import Quiz from './Quiz';
import { CgSpinner } from 'react-icons/cg';
import { FaYoutube, FaLightbulb, FaExpandArrowsAlt, FaQuestionCircle, FaUser, FaRobot } from 'react-icons/fa';

const DeepDiveChip = ({ text, onClick, isLoading }) => (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className="bg-gray-700/50 border border-gray-600 rounded-full px-4 py-2 text-sm text-blue-300 flex items-center gap-2 hover:bg-gray-600 transition-all disabled:cursor-not-allowed disabled:opacity-60"
    >
        {isLoading ? <CgSpinner className="animate-spin" /> : <FaLightbulb />}
        <span>{text}</span>
    </button>
);

function ModuleView({ moduleData }) {
  // State Management
  const [quizData, setQuizData] = useState(null);
  const [questionCount, setQuestionCount] = useState(3);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [areVideosLoading, setAreVideosLoading] = useState(false);
  const [deepDiveContent, setDeepDiveContent] = useState('');
  const [deepDiveTopic, setDeepDiveTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [qaHistory, setQaHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate(); // For redirecting on auth errors

  // Effects
  useEffect(() => {
    // Reset all temporary states when a new module is selected
    setVideos([]);
    setAreVideosLoading(false);
    setDeepDiveContent('');
    setDeepDiveTopic('');
    setQuizData(null);
    setIsQuizLoading(false);
    setSearchQuery('');
    setQaHistory([]);
    setIsSearching(false);
    setSearchError('');
  }, [moduleData]);

  // A helper function to handle API errors, especially auth errors
  const handleApiError = (error, defaultMessage = "An unexpected error occurred.") => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      alert("Your session has expired. Please sign in again.");
      navigate('/sign-in');
    } else {
      alert(error.response?.data?.error || defaultMessage);
    }
  };

  // Event Handlers (now using the centralized 'api' instance)

  const handleFetchVideos = async () => {
    setAreVideosLoading(true);
    try {
      const videoSearchQuery = `${moduleData.title} tutorial explained`;
      const response = await api.post('/fetch-videos', { query: videoSearchQuery });
      setVideos(response.data);
    } catch (error) {
      handleApiError(error, "Could not fetch videos at this time.");
    } finally {
      setAreVideosLoading(false);
    }
  };

  const handleDeepDive = async (topic) => {
    setDeepDiveTopic(topic);
    try {
      const combinedNotes = Array.isArray(moduleData.notes) ? moduleData.notes.join('\n') : moduleData.notes;
      const response = await api.post('/deep-dive', {
        originalText: combinedNotes,
        subTopic: topic,
      });
      setDeepDiveContent(prev => prev + `\n\n--- Deeper Explanation: ${topic} ---\n\n` + response.data.deeperExplanation);
    } catch (error) {
      handleApiError(error, "Could not generate a deeper explanation.");
    } finally {
      setDeepDiveTopic('');
    }
  };
  
  const handleGenerateQuiz = async () => {
    setIsQuizLoading(true);
    setQuizData(null);
    try {
      const response = await api.post('/generate-quiz', {
        lessonTopic: moduleData.title,
        questionCount: questionCount
      });
      setQuizData(response.data);
    } catch (error) {
      handleApiError(error, "Sorry, we couldn't generate a quiz right now.");
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const currentQuestion = searchQuery.trim();
    if (!currentQuestion) return;
    setIsSearching(true);
    setSearchError('');
    try {
      const combinedNotes = Array.isArray(moduleData.notes) ? moduleData.notes.join('\n') : moduleData.notes;
      const response = await api.post('/search-module', {
        contextNotes: combinedNotes,
        userQuestion: currentQuestion,
      });
      setQaHistory(prevHistory => [ ...prevHistory, { question: currentQuestion, answer: response.data.answer } ]);
      setSearchQuery('');
    } catch (error) {
      handleApiError(error, "Sorry, I couldn't find an answer to that question right now.");
      setSearchError(error.response?.data?.error || "An error occurred.");
    } finally {
      setIsSearching(false);
    }
  };
  
  // Data Parsing & Render Logic (no changes here)
  const deepDiveTopics = moduleData?.deepDiveTopics || [];
  if (!moduleData) {
    return ( <div className="flex items-center justify-center h-full bg-gray-900 border border-gray-700 rounded-lg p-8"><p className="text-gray-400 text-xl">Select a module from the roadmap to begin your learning journey.</p></div> );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 md:p-8 space-y-8">
      <h2 className="font-display text-3xl font-bold text-white">{moduleData.title}</h2>
      
      <div className="space-y-4 text-gray-300 whitespace-pre-wrap leading-relaxed">
        {Array.isArray(moduleData.notes) ? moduleData.notes.map((p, i) => <p key={i}>{p}</p>) : <p>{moduleData.notes}</p>}
      </div>
      
      {deepDiveContent && ( <div className="bg-gray-800/50 p-4 rounded-lg border border-blue-900/50"><p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{deepDiveContent}</p></div> )}

      {deepDiveTopics.length > 0 && (
          <div className="border-t border-gray-700 pt-6">
              <h4 className="font-bold text-lg text-blue-400 mb-3 flex items-center gap-2"><FaExpandArrowsAlt /> Explore Further</h4>
              <div className="flex flex-wrap gap-3">
                  {deepDiveTopics.map(topic => ( <DeepDiveChip key={topic} text={topic} onClick={() => handleDeepDive(topic)} isLoading={deepDiveTopic === topic} /> ))}
              </div>
          </div>
      )}
      
      <div className="border-t border-gray-700 pt-6">
        <h4 className="font-bold text-lg text-blue-400 mb-4 flex items-center gap-2"><FaQuestionCircle /> Ask a Question</h4>
        <div className="space-y-6 mb-4 max-h-[400px] overflow-y-auto pr-2">
          {qaHistory.map((qa, index) => (
            <div key={index} className="space-y-4">
              <div className="flex justify-end"><div className="bg-blue-900/50 p-4 rounded-lg max-w-xl"><div className="flex items-center gap-2 mb-2"><FaUser className="text-blue-300" /><span className="font-bold text-blue-300">You</span></div><p className="text-gray-200">{qa.question}</p></div></div>
              <div className="flex justify-start"><div className="bg-green-900/50 border border-green-700/50 p-4 rounded-lg max-w-xl"><div className="flex items-center gap-2 mb-2"><FaRobot className="text-green-300" /><span className="font-bold text-green-300">Course.ai</span></div><p className="text-gray-200 whitespace-pre-wrap">{qa.answer}</p></div></div>
            </div>
          ))}
          {isSearching && ( <div className="flex justify-start mb-4"><div className="bg-gray-800 p-4 rounded-lg inline-flex items-center gap-2"><CgSpinner className="animate-spin text-gray-400" /><span className="text-gray-400 italic">Thinking...</span></div></div>)}
          {searchError && <p className="text-red-400 mb-4">{searchError}</p>}
        </div>
        <form onSubmit={handleSearchSubmit} className="flex gap-2 sticky bottom-0 bg-gray-900 py-2">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ask a follow-up question..." className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500" disabled={isSearching} />
          <button type="submit" disabled={isSearching} className="bg-green-600 text-white font-bold px-5 py-2 rounded-md shadow-lg hover:bg-green-700 transition-all disabled:bg-gray-500 flex items-center gap-2">
            {isSearching ? <CgSpinner className="animate-spin" /> : 'Ask'}
          </button>
        </form>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <button onClick={handleFetchVideos} disabled={areVideosLoading || videos.length > 0} className="bg-red-600/80 text-white font-bold px-5 py-2 rounded-md shadow-lg hover:bg-red-700 transition-all disabled:bg-gray-600 flex items-center gap-2">
            {areVideosLoading ? <CgSpinner className="animate-spin"/> : <FaYoutube />}
            <span>{videos.length > 0 ? 'Videos Loaded' : 'Show Relevant Videos'}</span>
        </button>
        {videos.length > 0 && (
           <div className="grid grid-cols-1 gap-6 mt-4">
           {videos.map(video => <EmbeddedVideo key={video.videoId} {...video} />)}
          </div>
        )}
      </div>

      <div className="border-t border-gray-700 pt-6">
          <h4 className="font-bold text-lg text-blue-400 mb-4">Generate Practice Quiz</h4>
          <div className="flex items-center gap-4">
            <input type="number" value={questionCount} onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 1))} className="bg-gray-900 border border-gray-600 rounded-md w-20 text-center py-2 text-white" min="1" max="10" />
            <button onClick={handleGenerateQuiz} disabled={isQuizLoading} className="bg-blue-600 text-white font-bold px-5 py-2 rounded-md shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isQuizLoading ? 'Generating...' : `Generate ${questionCount} Questions`}
            </button>
          </div>
          {quizData && ( 
            <div className="mt-6">
              <h4 className="font-bold text-lg text-blue-400 mb-3">Your Practice Quiz</h4>
              <Quiz questions={quizData} />
            </div>
          )}
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="font-bold text-lg text-blue-400 mb-3">Flashcards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleData.flashcards.map((card, index) => <Flashcard key={index} card={card} />)}
        </div>
      </div>
    </div>
  );
}

export default ModuleView;