import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api.js';
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
     const responseInterceptor = axios.interceptors.response.use(
       response => response,
       async (error) => {
         if (error.response?.status === 401) {
          console.log("Session expired or token is invalid. Automatically logging out.");
           if (isAuthenticated) {
             setIsAuthenticated(false);
          }
        }
         return Promise.reject(error);
      }
    );

     const verifyUser = async () => {
      try {
         const response = await api.get('/auth/verify');
        setIsAuthenticated(response.data.loggedIn);
      } catch (error) {
         setIsAuthenticated(false);
      } finally {
         setIsLoading(false);
      }
    };
    verifyUser();
    
     return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };

  }, [isAuthenticated]);  
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.status === 200) {
      setIsAuthenticated(true);
    }
    return response;
  };

  const register = (email, password) => {
    return axios.post('http://localhost:5000/api/auth/register', { email, password });
  };
  
   if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <CgSpinner className="animate-spin text-blue-500" size={60} />
      </div>
    );
  }

  const value = {
    isAuthenticated,
    isLoading: !isLoading,  
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};