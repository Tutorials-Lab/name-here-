
import React, { useState, useRef, useEffect } from 'react';
import { Message, AppStatus } from '../types';
import { generateChatResponse } from '../services/gemini';

const ChatTool: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am Lumina. How can I assist you with your creative work today?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === AppStatus.LOADING) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setStatus(AppStatus.LOADING);

    try {
      const response = await generateChatResponse(input, []);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I'm sorry, I couldn't generate a response.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStatus(AppStatus.IDLE);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div 
        ref={scrollRef}
        className="flex-1 space-y-6 overflow-y-auto pb-6 scroll-smooth pr-2 custom-scrollbar"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'glass text-slate-100 rounded-tl-none border-slate-700'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {status === AppStatus.LOADING && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl rounded-tl-none px-5 py-4 border-slate-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-auto pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-100 transition-all placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={status === AppStatus.LOADING || !input.trim()}
          className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 bg-indigo-600 p-2 rounded-xl text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatTool;
