 import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CgSpinner } from 'react-icons/cg';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Define the logout function separately so it can be used in the interceptor
  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
    } catch (error) {
      console.error("Logout request failed, but clearing client state anyway.", error);
    } finally {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // This interceptor checks every API response from the server.
    const responseInterceptor = axios.interceptors.response.use(
      // If the response is successful (e.g., status 200), just pass it through.
      response => response,
      // If the response is an error...
      async (error) => {
        // ...and the error is specifically a 401 Unauthorized...
        if (error.response?.status === 401) {
          console.log("Session expired or token is invalid. Automatically logging out.");
          // ...and the user *thought* they were logged in...
          if (isAuthenticated) {
            // ...then update the frontend state to reflect they are now logged out.
            setIsAuthenticated(false);
          }
        }
        // Always pass the error along for other components to handle if needed.
        return Promise.reject(error);
      }
    );

    // This function runs once when the app first loads.
    const verifyUser = async () => {
      try {
        // It calls the backend to check if the browser's cookie has a valid token.
        const response = await axios.get('http://localhost:5000/api/auth/verify');
        setIsAuthenticated(response.data.loggedIn);
      } catch (error) {
        // If the verify call fails, the user is not authenticated.
        setIsAuthenticated(false);
      } finally {
        // After checking, stop showing the main loading spinner.
        setIsLoading(false);
      }
    };
    verifyUser();
    
    // Cleanup function to remove the interceptor when the app unmounts.
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };

  }, [isAuthenticated]); // Rerun this effect if the authentication state changes.

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    if (response.status === 200) {
      setIsAuthenticated(true);
    }
    return response;
  };

  const register = (email, password) => {
    return axios.post('http://localhost:5000/api/auth/register', { email, password });
  };
  
  // Display a full-page loading spinner only on the initial app load.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <CgSpinner className="animate-spin text-blue-500" size={60} />
      </div>
    );
  }

  const value = {
    isAuthenticated,
    isLoading: !isLoading, // Invert isLoading for components that might use it
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};