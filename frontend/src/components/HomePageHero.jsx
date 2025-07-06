 import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import { useAuth } from '../context/AuthContext';

function HomePageHero() {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRoadmapGeneration = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate('/sign-in');
      return;
    }

    const topic = event.target.elements.prompt.value;
    if (!topic) {
      alert("Please enter a topic to explore.");
      return;
    }

    setIsLoading(true);
    try {
       const response = await api.post('/generate-roadmap', { topic });
      navigate(`/course/${response.data._id}`, { state: { course: response.data } });
      
    } catch (error) {
      console.error("Error generating roadmap:", error.response ? error.response.data : error.message);
      
      if (error.response?.status === 401) {
          alert("Your session has expired. Please sign in again.");
          navigate('/sign-in');
      } else {
          alert("Failed to generate the course roadmap. The server might be down or an unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center py-12 sm:py-20">
      <h1 className="text-4xl font-display font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
        Adaptive Learning <span className="text-blue-500">Explorer</span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400 sm:text-xl">
        Enter any topic to generate a dynamic learning roadmap and dive deep into each concept on-demand.
      </p>
      <form onSubmit={handleRoadmapGeneration} className="mt-10 max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            name="prompt"
            className="w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg px-5 py-4 text-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder='e.g., "Data Science"'
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-bold px-6 py-2 rounded-md shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 disabled:bg-blue-800 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Building Roadmap...' : (isAuthenticated ? 'Explore' : 'Get Started')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default HomePageHero;