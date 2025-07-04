import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  return (
    <Link to={`/course/${course._id}`} className="relative block group">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 h-full flex flex-col justify-between transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-blue-500 group-hover:shadow-xl group-hover:shadow-blue-500/10">
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
    </Link>
  );
}
export default CourseCard;