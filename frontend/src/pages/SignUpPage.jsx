import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
       await register(email, password);

       await login(email, password);

       navigate('/');

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to register. The email might already be in use.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-center text-white">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-center text-sm font-medium">{error}</p>}
          <div>
            <label className="text-sm font-bold text-gray-400">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full mt-2 p-3 bg-gray-800 rounded-md border border-gray-700 focus:border-blue-500 focus:ring-blue-500 text-white" 
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-400">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full mt-2 p-3 bg-gray-800 rounded-md border border-gray-700 focus:border-blue-500 focus:ring-blue-500 text-white" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Sign Up'}
          </button>
        </form>
         <p className="text-center text-sm text-gray-400">
          Already have an account? <Link to="/sign-in" className="font-medium text-blue-500 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}