 import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login("test@test.com", "password");
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-center text-white">Sign In to AI Courses</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-400">Email</label>
            <input type="email" required className="w-full mt-2 p-3 bg-gray-800 rounded-md border border-gray-700 text-white" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-400">Password</label>
            <input type="password" required className="w-full mt-2 p-3 bg-gray-800 rounded-md border border-gray-700 text-white" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold transition-colors disabled:bg-blue-800">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Don't have an account? <Link to="/sign-up" className="font-medium text-blue-500 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}