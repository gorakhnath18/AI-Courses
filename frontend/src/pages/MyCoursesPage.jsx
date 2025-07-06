import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { CgSpinner } from 'react-icons/cg';

function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
         const response = await api.get('/courses');
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
         if (error.response?.status === 401) {
          alert("Your session has expired. Please sign in again.");
          navigate('/sign-in');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [navigate]);  

  const handleDelete = async (courseId, event) => {
    event.preventDefault(); 
    event.stopPropagation();  

    if (window.confirm('Are you sure you want to permanently delete this course?')) {
      try {
         await api.delete(`/courses/${courseId}`);
        setCourses(currentCourses => currentCourses.filter(course => course._id !== courseId));
      } catch (error) {
        console.error('Failed to delete course:', error);
        if (error.response?.status === 401) {
            alert("Your session has expired. Please sign in again.");
            navigate('/sign-in');
        } else {
            alert('Could not delete the course. Please try again.');
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <CgSpinner className="animate-spin text-blue-500 mx-auto" size={40} />
        <p className="mt-4 text-lg text-gray-400">Loading your saved courses...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-display font-bold text-white mb-8">
        My Saved Courses
      </h1>
      
      {courses.length === 0 ? (
        <div className="text-center bg-gray-900 border border-gray-700 rounded-lg p-12">
          <h3 className="text-2xl font-bold text-white">No Courses Found</h3>
          <p className="text-gray-400 mt-2">You haven't generated any courses yet. Go create one!</p>
          <Link to="/" className="mt-6 inline-block bg-blue-600 text-white font-bold px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Generate a New Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link to={`/course/${course._id}`} key={course._id} className="relative block group">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 h-full flex flex-col justify-between transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-blue-500">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 italic truncate">
                    Prompt: "{course.originalPrompt}"
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Created on: {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={(e) => handleDelete(course._id, e)}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 focus:opacity-100"
                title="Delete Course"
              >
                ✕ 
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCoursesPage;