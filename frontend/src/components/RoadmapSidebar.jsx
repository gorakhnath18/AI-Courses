import { CgSpinner } from 'react-icons/cg';

function RoadmapSidebar({ roadmap = [], activeModuleTitle, loadingModuleTitle }) {
  return (
    <aside className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h2 className="font-display text-xl font-bold text-white mb-4">Learning Roadmap</h2>
      <ul className="space-y-2">
        {roadmap.map((module) => (
          <li key={module.title}>
            <button className={`w-full text-left p-3 rounded-md transition-all duration-200 text-sm flex justify-between items-center ${activeModuleTitle === module.title ? 'bg-blue-600 text-white font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}>
              <span>{module.title}</span>
              {loadingModuleTitle === module.title && <CgSpinner className="animate-spin" size={20} />}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
export default RoadmapSidebar;