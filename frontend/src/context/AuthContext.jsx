import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // For the prototype, we'll use a simple state variable.
  // We'll add real logic later.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock functions
  const login = (email, password) => {
    setIsLoading(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const register = (email, password) => {
    setIsLoading(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    return new Promise(resolve => {
      setIsAuthenticated(false);
      resolve();
    });
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};