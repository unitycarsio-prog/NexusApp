import React from 'react';
import { Star, Download } from 'lucide-react';
import { AppItem } from '../types';

interface AppCardProps {
  app: AppItem;
  onClick: (app: AppItem) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
  return (
    <div 
      onClick={() => onClick(app)}
      className="group relative bg-white rounded-2xl p-4 hover:shadow-xl transition-all duration-300 border border-slate-100 cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="relative">
            <img 
            src={app.iconUrl} 
            alt={app.name} 
            className="w-16 h-16 rounded-2xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
            />
            {app.price === 0 && (
                <span className="absolute -bottom-2 -right-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                    FREE
                </span>
            )}
        </div>
        <div className="flex items-center bg-slate-50 px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-xs font-semibold text-slate-700">{app.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <h3 className="font-bold text-slate-900 text-lg mb-1 truncate pr-2">{app.name}</h3>
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">{app.category}</p>
      <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-grow leading-relaxed">
        {app.description}
      </p>
      
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">{app.downloads} downloads</span>
        <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors">
            <Download size={16} />
        </button>
      </div>
    </div>
  );
};