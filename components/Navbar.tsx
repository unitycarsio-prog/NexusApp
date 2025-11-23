import React, { useState } from 'react';
import { Search, PlusCircle, Home, LayoutGrid, UserCircle, LogOut, LogIn } from 'lucide-react';
import { User, ViewState } from '../types';

interface NavbarProps {
  onNavigate: (page: ViewState) => void;
  onSearch: (query: string) => void;
  activePage: string;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onSearch, activePage, user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onNavigate('HOME')}
          >
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <LayoutGrid size={24} />
            </div>
            <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              NexusStore
            </span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
                placeholder="Ask AI to find apps (e.g. 'Games to relax')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={() => onNavigate('HOME')}
              className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${activePage === 'HOME' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
              title="Home"
            >
              <Home size={24} />
            </button>

            {user?.role === 'DEVELOPER' && (
              <button 
                onClick={() => onNavigate('PUBLISH')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${activePage === 'PUBLISH' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                <PlusCircle size={18} />
                <span className="hidden sm:inline">Publish</span>
              </button>
            )}

            {user ? (
                <div className="flex items-center ml-2 border-l border-slate-200 pl-4 space-x-3">
                    {user.avatarUrl && (
                        <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full shadow-sm border border-slate-200" />
                    )}
                    <div className="flex flex-col items-start hidden sm:flex">
                        <span className="text-sm font-bold text-slate-800 leading-none">{user.name}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{user.role}</span>
                    </div>
                     <button
                        onClick={() => onNavigate('PROFILE')}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="My Profile"
                     >
                        <UserCircle size={20} />
                     </button>
                     <button 
                        onClick={onLogout}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Sign Out"
                     >
                        <LogOut size={20} />
                     </button>
                </div>
            ) : (
                <button
                    onClick={() => onNavigate('AUTH')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    <LogIn size={18} />
                    <span className="hidden sm:inline">Sign In</span>
                </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Search (Visible only on small screens) */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit}>
           <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
        </form>
      </div>
    </nav>
  );
};