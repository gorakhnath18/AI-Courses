import { mockCourseList } from '../lib/mockData';
import CourseCard from '../components/CourseCard';

function MyCoursesPage() {
  return (
    <div>
      <h1 className="text-4xl font-display font-bold text-white mb-8">
        My Saved Courses
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourseList.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default MyCoursesPage;