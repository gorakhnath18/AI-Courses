 import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // We need this to check the current path

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // --- CSS Classes ---
  const baseLinkClass = "px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 transform hover:scale-105";
  const activeAuthLinkClass = "bg-blue-600 text-white shadow-lg shadow-blue-500/30";
  const inactiveAuthLinkClass = "bg-gray-700 text-gray-300 hover:bg-gray-600";
  const myCoursesInactiveClass = "bg-gray-900 border border-gray-700 text-gray-400 hover:border-blue-500 hover:text-white";

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="text-2xl font-display font-bold text-blue-800  transition-colors">
            Course.ai
          </NavLink>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              // --- LOGGED-IN VIEW ---
              <>
                <NavLink
                  to="/my-courses"
                  className={({ isActive }) =>
                    `${baseLinkClass} ${isActive ? activeAuthLinkClass : myCoursesInactiveClass}`
                  }
                >
                  My Courses
                </NavLink>
                <button
                  onClick={handleLogout}
                  className={`${baseLinkClass} bg-red-600/80 border border-red-500/50 text-white hover:bg-red-700`}
                >
                  Logout
                </button>
              </>
            ) : (
              // --- LOGGED-OUT VIEW (UPDATED) ---
              <>
                <NavLink
                  to="/sign-in"
                  className={({ isActive }) => {
                    // Make the Sign In button active on the home page ('/') OR on the sign-in page itself.
                    const isHomePage = location.pathname === '/';
                    return `${baseLinkClass} ${isActive || isHomePage ? activeAuthLinkClass : inactiveAuthLinkClass}`;
                  }}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/sign-up"
                  className={({ isActive }) =>
                    `${baseLinkClass} ${isActive ? activeAuthLinkClass : inactiveAuthLinkClass}`
                  }
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;