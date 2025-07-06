import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MyCoursesPage from './pages/MyCoursesPage';
import CoursePage from './pages/CoursePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/sign-in" />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-800 text-gray-300 flex flex-col">
      { }
      <Router> 
        <Navbar />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/my-courses" element={ <ProtectedRoute> <MyCoursesPage /> </ProtectedRoute> } />
            <Route path="/course/:courseId" element={ <ProtectedRoute> <CoursePage /> </ProtectedRoute> } />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;