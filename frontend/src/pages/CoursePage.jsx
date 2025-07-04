 import { useState } from 'react';
import { mockCourse, mockModule } from '../lib/mockData';
import RoadmapSidebar from '../components/RoadmapSidebar';
import ModuleView from '../components/ModuleView';

function CoursePage() {
  // We use state to track which module is currently selected
  const [activeModule, setActiveModule] = useState(null);
  const course = mockCourse; // Use our mock course data

  // This function is passed to the sidebar. It updates the active module.
  const handleModuleClick = (module) => {
    // For the prototype, we'll always show the same mock module content
    setActiveModule(mockModule);
  };

  return (
    <div>
      <h1 className="text-4xl font-display font-bold text-white mb-2">{course.title}</h1>
      <p className="text-lg text-gray-400 mb-8">Prompt: "{course.originalPrompt}"</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <RoadmapSidebar 
            roadmap={course.roadmap}
            onModuleClick={handleModuleClick}
            activeModuleTitle={activeModule?.title}
          />
        </div>
        <div className="lg:col-span-3">
          <ModuleView moduleData={activeModule} />
        </div>
      </div>
    </div>
  );
}

export default CoursePage;