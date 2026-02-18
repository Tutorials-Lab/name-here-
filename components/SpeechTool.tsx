
import React, { useState, useRef } from 'react';
import { AudioTrack, AppStatus } from '../types';
import { generateSpeech, decodeAudioData } from '../services/gemini';

const voices = [
  { id: 'Kore', name: 'Kore', desc: 'Warm & Professional', icon: '🎙️' },
  { id: 'Puck', name: 'Puck', desc: 'Energetic & Youthful', icon: '🎧' },
  { id: 'Charon', name: 'Charon', desc: 'Deep & Authoritative', icon: '📻' },
  { id: 'Fenrir', name: 'Fenrir', desc: 'Stoic & Calm', icon: '❄️' },
  { id: 'Zephyr', name: 'Zephyr', desc: 'Airy & Ethereal', icon: '🌬️' },
];

const SpeechTool: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleSynthesize = async () => {
    if (!text.trim() || status === AppStatus.LOADING) return;

    setStatus(AppStatus.LOADING);
    try {
      const audioBytes = await generateSpeech(text, selectedVoice as any);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
      
      const newTrack: AudioTrack = {
        id: Date.now().toString(),
        text,
        voice: selectedVoice,
        timestamp: Date.now(),
      };

      setTracks((prev) => [newTrack, ...prev]);
      playBuffer(buffer);
      setStatus(AppStatus.IDLE);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
    }
  };

  const playBuffer = (buffer: AudioBuffer) => {
    if (!audioContextRef.current) return;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="glass p-8 rounded-3xl border-slate-800 shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 text-slate-100 flex items-center">
          <span className="bg-indigo-600/20 text-indigo-400 p-2 rounded-lg mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </span>
          Text to Natural Speech
        </h3>

        <div className="space-y-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Input Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to lifelike speech..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-6 h-40 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-100 resize-none transition-all placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Select Persona</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`p-4 rounded-2xl border text-center transition-all group ${
                    selectedVoice === voice.id
                      ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{voice.icon}</div>
                  <div className={`text-sm font-bold ${selectedVoice === voice.id ? 'text-indigo-400' : 'text-slate-300'}`}>
                    {voice.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{voice.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSynthesize}
            disabled={status === AppStatus.LOADING || !text.trim()}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xl shadow-xl shadow-indigo-600/20"
          >
            {status === AppStatus.LOADING ? 'Synthesizing Audio...' : 'Generate Voice'}
          </button>
        </div>
      </div>

      {tracks.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">Recent Creations</h4>
          <div className="space-y-3">
            {tracks.map((track) => (
              <div key={track.id} className="glass p-4 rounded-2xl border-slate-800 flex items-center justify-between group hover:border-indigo-500/50 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-xl">
                    {voices.find(v => v.id === track.voice)?.icon}
                  </div>
                  <div className="max-w-md">
                    <p className="text-sm text-slate-200 line-clamp-1">{track.text}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Voice: {track.voice}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 italic">
                  Just now
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechTool;
