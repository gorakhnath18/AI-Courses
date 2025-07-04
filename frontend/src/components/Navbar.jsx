 import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="text-2xl font-display font-bold text-white hover:text-blue-500">AI Courses</NavLink>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/my-courses" className="px-4 py-2 rounded-md text-sm font-bold bg-gray-700 text-gray-300 hover:bg-gray-600">My Courses</NavLink>
                <button onClick={logout} className="px-4 py-2 rounded-md text-sm font-bold bg-red-600 text-white hover:bg-red-700">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/sign-in" className="px-4 py-2 rounded-md text-sm font-bold bg-gray-700 text-gray-300 hover:bg-gray-600">Sign In</NavLink>
                <NavLink to="/sign-up" className="px-4 py-2 rounded-md text-sm font-bold bg-blue-600 text-white hover:bg-blue-700">Sign Up</NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Navbar;