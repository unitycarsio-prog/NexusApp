import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 mb-8 shadow-2xl shadow-slate-900/20">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16 lg:py-20 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-lg">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide uppercase mb-4">
            New Feature
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Discover Apps with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">NexusStore</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Experience the future of app discovery. Use natural language to find exactly what you need, or let our AI curate collections just for you.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-full font-bold transition-colors shadow-lg flex items-center">
              Explore Now
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center group">
              For Developers <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        {/* Hero Image / Graphic */}
        <div className="hidden md:block relative w-80 h-80 lg:w-96 lg:h-96 mt-8 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl rotate-3 opacity-80"></div>
            <div className="absolute inset-0 bg-slate-800 rounded-2xl -rotate-3 shadow-xl overflow-hidden border border-slate-700">
                <div className="p-6 space-y-4">
                    <div className="h-8 bg-slate-700/50 rounded-lg w-3/4 animate-pulse"></div>
                    <div className="h-32 bg-slate-700/30 rounded-lg w-full"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="aspect-square bg-slate-700/50 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};