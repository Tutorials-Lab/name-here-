
import React, { useState } from 'react';
import { GeneratedImage, AppStatus } from '../types';
import { generateImage } from '../services/gemini';

const ImageTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);

  const handleGenerate = async () => {
    if (!prompt.trim() || status === AppStatus.LOADING) return;

    setStatus(AppStatus.LOADING);
    try {
      const url = await generateImage(prompt, aspectRatio);
      const newImg: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt,
        timestamp: Date.now(),
      };
      setImages((prev) => [newImg, ...prev]);
      setStatus(AppStatus.IDLE);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-1 space-y-6">
        <div className="glass p-6 rounded-3xl border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-100">Creation Settings</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Detailed Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic cyber-punk cityscape at sunset..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 h-32 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-100 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {(["1:1", "16:9", "9:16"] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      aspectRatio === ratio
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={status === AppStatus.LOADING || !prompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
            >
              {status === AppStatus.LOADING ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Rendering...
                </span>
              ) : 'Generate Masterpiece'}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">History</h3>
          <span className="text-xs text-slate-500">{images.length} items generated</span>
        </div>
        
        {images.length === 0 ? (
          <div className="h-[500px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500 bg-slate-900/20">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">No imagery yet.</p>
            <p className="text-sm mt-1">Provide a prompt on the left to begin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative glass rounded-2xl overflow-hidden border-slate-800 hover:border-slate-600 transition-all">
                <img src={img.url} alt={img.prompt} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="text-xs text-white line-clamp-2 italic">"{img.prompt}"</p>
                  <button 
                    onClick={() => window.open(img.url, '_blank')}
                    className="mt-2 text-[10px] font-bold uppercase bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2 rounded-lg transition-all"
                  >
                    View Fullscreen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageTool;
