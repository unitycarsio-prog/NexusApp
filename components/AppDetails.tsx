import React, { useState } from 'react';
import { X, Star, Share2, Download, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { AppItem } from '../types';

interface AppDetailsProps {
  app: AppItem;
  onClose: () => void;
  isInstalled: boolean;
  onInstall: (appId: string) => void;
}

export const AppDetails: React.FC<AppDetailsProps> = ({ app, onClose, isInstalled, onInstall }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = () => {
    if (app.fileUrl) {
        setDownloading(true);
        onInstall(app.id);
        // Reset state after a delay to simulate interaction
        setTimeout(() => setDownloading(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 sm:pb-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl h-[90vh] sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
        
        {/* Header Image / Banner */}
        <div className="h-48 bg-gradient-to-r from-slate-100 to-slate-200 relative shrink-0">
             {/* If we had a banner image, it would go here. Using a pattern for now. */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/50 hover:bg-white p-2 rounded-full backdrop-blur-md transition-all"
            >
                <X size={24} className="text-slate-800" />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 no-scrollbar">
            <div className="px-6 sm:px-10 -mt-12 pb-10 relative">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-8">
                    <img 
                        src={app.iconUrl} 
                        alt={app.name} 
                        className="w-32 h-32 rounded-3xl shadow-2xl border-4 border-white bg-white" 
                    />
                    <div className="flex-1">
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{app.name}</h1>
                        <div className="text-blue-600 font-medium mb-2">{app.developer}</div>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider">{app.category}</span>
                            <span>{app.version}</span>
                            <span>{app.size}</span>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4 sm:mt-0">
                         <button className="p-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                            <Share2 size={20} />
                        </button>
                        
                        {app.fileUrl ? (
                             <a 
                                href={app.fileUrl}
                                download={app.fileName || `${app.name}.apk`}
                                onClick={handleDownloadClick}
                                className={`flex-1 sm:flex-none px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 min-w-[160px] bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30`}
                            >
                                <Download size={20} />
                                {app.price === 0 ? 'Download' : `$${app.price}`}
                            </a>
                        ) : (
                            <button disabled className="flex-1 sm:flex-none px-8 py-3 rounded-full font-bold text-slate-400 bg-slate-100 cursor-not-allowed">
                                Unavailable
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Screenshots */}
                        {app.screenshots && app.screenshots.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
                                {app.screenshots.map((src, idx) => (
                                    <img 
                                        key={idx} 
                                        src={src} 
                                        className="h-64 sm:h-80 rounded-xl shadow-md object-cover snap-center border border-slate-100" 
                                        alt="Screenshot" 
                                    />
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">About this app</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {app.description}
                            </p>
                        </section>

                        {/* Ratings */}
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Ratings & Reviews</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-5xl font-extrabold text-slate-900">{app.rating.toFixed(1)}</div>
                                <div className="flex flex-col">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < Math.round(app.rating) ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-slate-400">{app.downloads} downloads</span>
                                </div>
                            </div>
                            
                            {/* Reviews List */}
                            <div className="space-y-4">
                                {app.reviews && app.reviews.length > 0 ? app.reviews.map(review => (
                                    <div key={review.id} className="bg-slate-50 p-4 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold text-slate-800">{review.user}</span>
                                            <span className="text-xs text-slate-400">{review.date}</span>
                                        </div>
                                        <div className="flex text-yellow-400 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-slate-600">{review.comment}</p>
                                    </div>
                                )) : (
                                    <p className="text-slate-400 italic">No reviews yet.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-4">Information</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-slate-200">
                                    <span className="text-slate-500">Provider</span>
                                    <span className="font-medium text-slate-900">{app.developer}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-200">
                                    <span className="text-slate-500">Size</span>
                                    <span className="font-medium text-slate-900">{app.size}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-200">
                                    <span className="text-slate-500">Category</span>
                                    <span className="font-medium text-slate-900">{app.category}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-200">
                                    <span className="text-slate-500">File Type</span>
                                    <span className="font-medium text-slate-900 truncate max-w-[150px]">{app.fileName || 'Binary'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 text-blue-800 text-sm">
                            <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                            <p>
                                <strong>Verified Security:</strong> Nexus has verified that this app is free from malware and respects user privacy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};