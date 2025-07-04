 import { FaYoutube, FaLightbulb, FaExpandArrowsAlt } from 'react-icons/fa';
import EmbeddedVideo from './EmbeddedVideo';
import Flashcard from './Flashcard';
import Quiz from './Quiz';

// A sub-component for the interactive deep dive chips
const DeepDiveChip = ({ text }) => (
    <button className="bg-gray-700/50 border border-gray-600 rounded-full px-4 py-2 text-sm text-blue-300 flex items-center gap-2 hover:bg-gray-600">
        <FaLightbulb />
        <span>{text}</span>
    </button>
);

function ModuleView({ moduleData }) {
  if (!moduleData) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 border border-gray-700 rounded-lg p-8">
        <p className="text-gray-400 text-xl">Select a module from the roadmap to begin your learning journey.</p>
      </div>
    );
  }

  // Extract deep dive topics from the notes for our buttons
  const deepDiveTopics = moduleData.notes.match(/potential 'deepDiveTopics' for further exploration: (.*)/)?.[1].split(', ').map(t => t.replace(/['."]/g, '').trim()) || [];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 md:p-8 space-y-8">
      <h2 className="font-display text-3xl font-bold text-white">{moduleData.title}</h2>
      
      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{moduleData.notes}</p>
      
      {deepDiveTopics.length > 0 && (
          <div>
              <h4 className="font-bold text-lg text-blue-400 mb-3 flex items-center gap-2"><FaExpandArrowsAlt /> Explore Further</h4>
              <div className="flex flex-wrap gap-3">
                  {deepDiveTopics.map(topic => <DeepDiveChip key={topic} text={topic} />)}
              </div>
          </div>
      )}
      
      <div className="border-t border-gray-700 pt-6">
        <h3 className="font-bold text-lg text-blue-400 mb-4 flex items-center gap-2"><FaYoutube /> Relevant Videos</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {moduleData.youtubeVideos.map(video => <EmbeddedVideo key={video.videoId} {...video} />)}
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="font-bold text-lg text-blue-400 mb-4">Flashcards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleData.flashcards.map((card, index) => <Flashcard key={index} card={card} />)}
        </div>
      </div>
    </div>
  );
}

export default ModuleView;