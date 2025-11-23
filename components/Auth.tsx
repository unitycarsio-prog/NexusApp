import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { LayoutGrid, Check, User as UserIcon, Loader2, AlertCircle, Lock } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [role, setRole] = useState<UserRole>('USER');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper to simulate database access
  const getStoredUsers = () => {
    try {
      const stored = localStorage.getItem('nexus_users');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const saveUserToStorage = (userCreds: any) => {
    const users = getStoredUsers();
    users.push(userCreds);
    localStorage.setItem('nexus_users', JSON.stringify(users));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getStoredUsers();
    const normalizedUsername = formData.username.trim().toLowerCase();

    if (isLogin) {
      // LOGIN LOGIC
      const userFound = users.find((u: any) => 
        u.username.toLowerCase() === normalizedUsername && u.password === formData.password
      );

      if (userFound) {
        // Create session user object (exclude password)
        const sessionUser: User = {
          id: userFound.id,
          name: userFound.username, // Using username as display name
          role: userFound.role,
          avatarUrl: `https://ui-avatars.com/api/?name=${userFound.username}&background=0D8ABC&color=fff`
        };
        onLogin(sessionUser);
      } else {
        setError('Invalid username or password.');
      }
    } else {
      // SIGNUP LOGIC
      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters.');
        setIsLoading(false);
        return;
      }
      
      if (formData.password.length < 4) {
        setError('Password must be at least 4 characters.');
        setIsLoading(false);
        return;
      }

      // Check for duplicates
      const exists = users.some((u: any) => u.username.toLowerCase() === normalizedUsername);
      if (exists) {
        setError('This username is already taken. Please choose another.');
        setIsLoading(false);
        return;
      }

      // Create new user record
      const newUserCreds = {
        id: Date.now().toString(),
        username: formData.username.trim(), // Keep original case for display
        password: formData.password,
        role: role
      };

      saveUserToStorage(newUserCreds);

      const sessionUser: User = {
        id: newUserCreds.id,
        name: newUserCreds.username,
        role: newUserCreds.role,
        avatarUrl: `https://ui-avatars.com/api/?name=${newUserCreds.username}&background=0D8ABC&color=fff`
      };
      
      onLogin(sessionUser);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white p-3 rounded-xl shadow-lg">
              <LayoutGrid size={32} />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {isLogin ? 'Sign in to Nexus' : 'Create Account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isLogin ? 'New to Nexus?' : 'Already have an account?'}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ username: '', password: '' });
            }}
            className="ml-1 font-medium text-blue-600 hover:text-blue-500"
          >
            {isLogin ? 'Create an account' : 'Sign in instead'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200 sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {error && (
             <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
             </div>
          )}

          <form className="space-y-6" onSubmit={handleAuth}>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  required
                  autoComplete="username"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {!isLogin && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">I want to...</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div 
                            onClick={() => setRole('USER')}
                            className={`cursor-pointer rounded-lg border p-3 flex items-center justify-center space-x-2 transition-all ${role === 'USER' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}
                        >
                            <span>Download</span>
                            {role === 'USER' && <Check size={16} />}
                        </div>
                        <div 
                            onClick={() => setRole('DEVELOPER')}
                            className={`cursor-pointer rounded-lg border p-3 flex items-center justify-center space-x-2 transition-all ${role === 'DEVELOPER' ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}
                        >
                            <span>Publish</span>
                            {role === 'DEVELOPER' && <Check size={16} />}
                        </div>
                    </div>
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};