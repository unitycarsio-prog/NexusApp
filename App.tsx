import React, { useState } from 'react';
import { MOCK_APPS } from './constants';
import { AppItem, ViewState, AppCategory, User } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AppCard } from './components/AppCard';
import { AppDetails } from './components/AppDetails';
import { PublishApp } from './components/PublishApp';
import { Auth } from './components/Auth';
import { semanticSearchApps } from './services/geminiService';
import { Loader2, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>(MOCK_APPS);
  const [view, setView] = useState<ViewState>('HOME');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<AppItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQueryText, setSearchQueryText] = useState('');
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // Handle navigation
  const navigateTo = (page: ViewState) => {
    if (page === 'PUBLISH' && !user) {
        setView('AUTH');
        return;
    }
    setView(page);
    window.scrollTo(0, 0);
  };

  // Handle Login/Logout
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('HOME');
  };

  const handleLogout = () => {
    setUser(null);
    setView('HOME');
  };

  // Handle app selection
  const handleAppClick = (app: AppItem) => {
    setSelectedApp(app);
  };

  // Handle app installation (Mock record keeping)
  const handleInstall = (appId: string) => {
    setInstalledApps(prev => [...prev, appId]);
  };

  // Handle new app publish
  const handlePublish = (newApp: AppItem) => {
    setApps(prev => [newApp, ...prev]);
    setView('HOME');
  };

  // Handle Search
  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQueryText(query);
    setView('SEARCH_RESULTS');
    
    try {
        // Use Gemini for semantic search
        const matchedIds = await semanticSearchApps(query, apps);
        
        let results: AppItem[] = [];
        
        if (matchedIds.length > 0) {
             results = matchedIds
                .map(id => apps.find(a => a.id === id))
                .filter((a): a is AppItem => !!a);
        } else {
            results = apps.filter(app => 
                app.name.toLowerCase().includes(query.toLowerCase()) ||
                app.category.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        setSearchResults(results);
    } catch (err) {
        console.error("Search failed", err);
        setSearchResults([]);
    } finally {
        setIsSearching(false);
    }
  };

  // Helper to render app grid
  const renderAppGrid = (items: AppItem[], title: string) => (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        </div>
        {items.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map(app => (
                    <AppCard key={app.id} app={app} onClick={handleAppClick} />
                ))}
            </div>
        ) : (
            <p className="text-slate-400 italic">No apps available in this section yet.</p>
        )}
       
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar 
        activePage={view} 
        onNavigate={navigateTo} 
        onSearch={handleSearch} 
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main>
        {view === 'HOME' && (
          <>
            <Hero />
            
            {apps.length === 0 ? (
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Welcome to Nexus App Store</h2>
                    <p className="text-slate-500 mb-8 max-w-xl mx-auto">The store is currently empty. Be the first developer to publish an app and share it with the world!</p>
                    {user?.role === 'DEVELOPER' ? (
                        <button 
                            onClick={() => navigateTo('PUBLISH')}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all"
                        >
                            <Plus className="mr-2" />
                            Publish First App
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigateTo('AUTH')}
                            className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:bg-slate-800 transition-all"
                        >
                            Get Started
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {renderAppGrid(apps.filter(a => a.category === AppCategory.GAMES || a.category === AppCategory.ENTERTAINMENT).slice(0, 4), "Featured Games & Fun")}
                    {renderAppGrid(apps, "All Apps")}
                </>
            )}
          </>
        )}

        {view === 'AUTH' && (
            <Auth onLogin={handleLogin} />
        )}

        {view === 'SEARCH_RESULTS' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    {isSearching ? 'Asking AI...' : `Results for "${searchQueryText}"`}
                </h2>
                
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
                        <p>Searching the Nexus...</p>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {searchResults.map(app => (
                            <AppCard key={app.id} app={app} onClick={handleAppClick} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-lg text-slate-500">No apps found matching your query.</p>
                        <button 
                            onClick={() => setView('HOME')}
                            className="mt-4 text-blue-600 hover:underline"
                        >
                            Go back home
                        </button>
                    </div>
                )}
            </div>
        )}

        {view === 'PUBLISH' && user && (
          <PublishApp 
            user={user}
            onPublish={handlePublish} 
            onCancel={() => setView('HOME')} 
          />
        )}
      </main>

      {/* App Details Modal */}
      {selectedApp && (
        <AppDetails 
          app={selectedApp} 
          onClose={() => setSelectedApp(null)} 
          isInstalled={installedApps.includes(selectedApp.id)}
          onInstall={handleInstall}
        />
      )}
    </div>
  );
};

export default App;