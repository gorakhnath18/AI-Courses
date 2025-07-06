 import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import RoadmapSidebar from '../components/RoadmapSidebar';
import ModuleView from '../components/ModuleView';
import { CgSpinner } from 'react-icons/cg';

function CoursePage() {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  const [loadingModuleTitle, setLoadingModuleTitle] = useState(null);

  const location = useLocation();
  const { courseId } = useParams();

   useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true);
      setActiveModule(null);
      try {
        if (location.state?.course) {
          setCourse(location.state.course);
        } else if (courseId) {
          const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
          setCourse(response.data);
        }
      } catch (error) {
        console.error("Failed to load course:", error);
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadCourse();
  }, [courseId, location.state]);

    useEffect(() => {
     if (course && location.state?.course && !activeModule && !loadingModuleTitle) {
       const firstModule = course.roadmap[0];
      if (firstModule) {
        console.log("Auto-generating first module:", firstModule.title);
         handleModuleClick(firstModule);
      }
    }
   }, [course]);

   const handleModuleClick = async (module) => {
    if (loadingModuleTitle) return;
    const existingLesson = course.lessons.find(l => l.title === module.title && l.isGenerated);
    if (existingLesson) {
      setActiveModule(existingLesson);
      return;
    }
    setLoadingModuleTitle(module.title);
    try {
      const url = `http://localhost:5000/api/courses/${course._id}/generate-module`;
      const response = await axios.post(url, {
        moduleTitle: module.title,
        moduleDescription: module.description
      });
      const newLesson = response.data;
      setActiveModule(newLesson);
      setCourse(prevCourse => ({
          ...prevCourse,
          lessons: prevCourse.lessons.map(l => l.title === newLesson.title ? newLesson : l)
      }));
    } catch (error) {
      console.error("Error generating module:", error.response ? error.response.data : error.message);
      alert("Could not generate module content. Please try again.");
    } finally {
      setLoadingModuleTitle(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <CgSpinner className="animate-spin text-blue-500 mx-auto" size={40} />
        <p className="mt-4 text-lg text-gray-400">Loading Course...</p>
      </div>
    );
  }

  if (!course) {
    return <div className="text-center text-xl text-red-500">Could not load the course.</div>;
  }
  
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
            loadingModuleTitle={loadingModuleTitle}
          />
        </div>
        <div className="lg:col-span-3">
          {loadingModuleTitle ? (
              <div className="flex items-center justify-center h-full bg-gray-900 border border-gray-700 rounded-lg p-8">
                  <CgSpinner className="animate-spin text-blue-500" size={40} />
                  <p className="ml-4 text-gray-400 text-xl">Generating module: {loadingModuleTitle}...</p>
              </div>
          ) : (
              <ModuleView moduleData={activeModule} />
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;