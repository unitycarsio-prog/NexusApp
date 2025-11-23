import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { RefreshCw, User as UserIcon, Save, AlertCircle, Loader2, Eye, EyeOff, Copy, Check } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  onCancel: () => void;
}

const avatarStyles = ['adventurer', 'bottts', 'pixel-art', 'miniavs', 'lorelei', 'notionists-neutral', 'fun-emoji'];

const generateAvatarUrl = () => {
    const style = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    const seed = crypto.randomUUID();
    return `https://api.dicebear.com/8.x/${style}/svg?seed=${seed}`;
};


export const Profile: React.FC<ProfileProps> = ({ user, onUpdate, onCancel }) => {
  const [username, setUsername] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [avatarOptions, setAvatarOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // UID visibility state
  const [showUid, setShowUid] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateAndSetAvatars = () => {
    const options = Array.from({ length: 6 }, generateAvatarUrl);
    setAvatarOptions(options);
  };
  
  // Generate avatars on component mount
  useEffect(() => {
    generateAndSetAvatars();
  }, []);

  const getStoredUsers = () => {
    try {
      const stored = localStorage.getItem('nexus_users');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

    const normalizedUsername = username.trim().toLowerCase();
    
    // Check if username is valid
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      setIsLoading(false);
      return;
    }

    // Check if username is taken by ANOTHER user
    if (username.trim().toLowerCase() !== user.name.toLowerCase()) {
      const users = getStoredUsers();
      const exists = users.some((u: any) => u.username.toLowerCase() === normalizedUsername);
      if (exists) {
        setError('This username is already taken. Please choose another.');
        setIsLoading(false);
        return;
      }
    }

    // If all checks pass, call the update function
    onUpdate({
      ...user,
      name: username.trim(),
      avatarUrl: avatarUrl
    });

    setIsLoading(false);
  };

  const handleCopyUid = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };


  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-2">View and edit your account details.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <form onSubmit={handleSaveChanges} className="space-y-8">
            {error && (
             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
             </div>
            )}
            
            {/* Avatar Section */}
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium text-slate-800">Your Avatar</label>
                    <button 
                        type="button" 
                        onClick={generateAndSetAvatars}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
                    >
                        <RefreshCw size={14}/> Get New Avatars
                    </button>
                </div>
                <div className="flex items-center gap-6">
                    <img src={avatarUrl} alt="Current Avatar" className="w-24 h-24 rounded-full shadow-md border-4 border-white" />
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 flex-1">
                        {avatarOptions.map(url => (
                            <img
                                key={url}
                                src={url}
                                alt="Avatar option"
                                onClick={() => setAvatarUrl(url)}
                                className={`w-full aspect-square rounded-full cursor-pointer transition-all duration-200 ring-offset-2 ${avatarUrl === url ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* User Details Section */}
            <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                    <div className="relative">
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 pl-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                         <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Account Role</label>
                    <div className="w-full px-4 py-2 rounded-lg bg-slate-100 text-slate-500 font-medium">
                        {user.role}
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Secret User ID</label>
                     <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                readOnly
                                type={showUid ? "text" : "password"}
                                value={user.id}
                                className="w-full px-4 py-2 rounded-lg bg-slate-100 text-slate-600 font-mono tracking-wider border-0"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowUid(!showUid)}
                            className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                            title={showUid ? "Hide UID" : "Show UID"}
                        >
                            {showUid ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        <button
                            type="button"
                            onClick={handleCopyUid}
                            className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Copy UID"
                        >
                            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">Keep this secret. It's unique to your account.</p>
                </div>
            </div>
            

            <div className="pt-4 flex items-center justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-2 rounded-lg font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                    Save Changes
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};