import React, { useState } from 'react';
import { Wand2, Upload, Loader2, FileUp, X } from 'lucide-react';
import { AppCategory, AppItem, User } from '../types';
import { generateAppDescription } from '../services/geminiService';

interface PublishAppProps {
  user: User;
  onPublish: (app: AppItem) => void;
  onCancel: () => void;
}

export const PublishApp: React.FC<PublishAppProps> = ({ user, onPublish, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: AppCategory.PRODUCTIVITY,
    description: '',
    price: 0
  });
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    if (!formData.name) {
        alert("Please enter an App Name first.");
        return;
    }
    setIsGenerating(true);
    const desc = await generateAppDescription(formData.name, formData.category);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
        alert("Please upload an app bundle/file to publish.");
        return;
    }

    // Create a Blob URL for local "download" simulation
    const fileUrl = URL.createObjectURL(file);

    const newApp: AppItem = {
        id: Date.now().toString(),
        ...formData,
        developer: user.name, // Real developer name
        developerId: user.id,
        iconUrl: `https://picsum.photos/seed/${formData.name.replace(/\s/g, '')}/200/200`, // Still using mock icon for demo
        screenshots: [`https://picsum.photos/seed/${Date.now()}/400/800`],
        rating: 0,
        downloads: '0',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        version: '1.0.0',
        reviews: [],
        fileUrl: fileUrl,
        fileName: file.name
    };
    onPublish(newApp);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Publish Your App</h1>
        <p className="text-slate-500 mt-2">Upload your app package and let the world discover your creation.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">App Name</label>
                    <input
                        required
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. SuperTasker"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <select
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as AppCategory})}
                    >
                        {Object.values(AppCategory).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Price ($)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                    />
                </div>
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">App File (APK, IPA, ZIP)</label>
                     {!file ? (
                        <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 hover:bg-slate-50 transition-colors text-center cursor-pointer">
                            <input 
                                type="file" 
                                required
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            <FileUp className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                            <span className="text-sm text-slate-500">Click to upload binary</span>
                        </div>
                     ) : (
                         <div className="flex items-center justify-between border border-slate-200 bg-blue-50 rounded-lg p-2.5">
                             <div className="flex items-center overflow-hidden">
                                <FileUp className="h-5 w-5 text-blue-600 mr-2 shrink-0" />
                                <span className="text-sm text-blue-900 truncate">{file.name}</span>
                             </div>
                             <button 
                                type="button" 
                                onClick={() => setFile(null)}
                                className="text-slate-400 hover:text-red-500 ml-2"
                            >
                                <X size={18} />
                            </button>
                         </div>
                     )}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <button
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={isGenerating}
                        className="text-xs flex items-center text-purple-600 hover:text-purple-700 font-semibold bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full transition-colors"
                    >
                        {isGenerating ? <Loader2 className="animate-spin w-3 h-3 mr-1"/> : <Wand2 className="w-3 h-3 mr-1" />}
                        Generate with AI
                    </button>
                </div>
                <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Describe your app..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
                <p className="text-xs text-slate-400 mt-1 text-right">Powered by Google Gemini</p>
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
                    className="px-8 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all flex items-center"
                >
                    <Upload className="w-5 h-5 mr-2" />
                    Publish App
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};