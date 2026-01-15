
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User } from 'lucide-react';
import { queryAIAgent } from '../services/geminiService';

interface AIAgentProps {
  appData: any;
}

const AIAgent: React.FC<AIAgentProps> = ({ appData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Escuta eventos externos para disparar consultas (Ex: cliques em notícias)
  useEffect(() => {
    const handleExternalQuery = (e: any) => {
      const externalQuery = e.detail.query;
      setIsOpen(true);
      triggerAISearch(externalQuery);
    };

    window.addEventListener('ask-ai', handleExternalQuery);
    return () => window.removeEventListener('ask-ai', handleExternalQuery);
  }, [appData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatHistory, isOpen]);

  const triggerAISearch = async (text: string) => {
    if (!text.trim() || loading) return;

    setChatHistory(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    
    try {
      const result = await queryAIAgent(text, appData);
      setChatHistory(prev => [...prev, { role: 'ai', text: result }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Erro na conexão com o oráculo." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = query.trim();
    setQuery('');
    triggerAISearch(userMessage);
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fechar assistente de IA" : "Abrir assistente de IA"}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-110 active:scale-95 transition-all z-[100] group"
      >
        {isOpen ? <X size={28} /> : <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />}
      </button>

      {/* Janela de Chat */}
      {isOpen && (
        <div 
          id="ai-chat-window"
          className="fixed bottom-28 right-8 w-[90vw] md:w-96 h-[500px] bento-card flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-8 zoom-in-95 duration-300 border-white/20 shadow-2xl"
        >
          <div className="p-5 bg-indigo-500/10 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Inteligência MAOOE</h3>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">Mecanismo Ativo</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white p-1">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
            {chatHistory.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <Sparkles size={40} className="text-indigo-400" />
                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed px-6">
                  Toque em uma notícia no feed ou pergunte sobre seus gastos.
                </p>
              </div>
            )}
            
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${chat.role === 'user' ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'}`}>
                  {chat.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSearch} className="p-4 border-t border-white/10 bg-black/20">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-0 text-xs font-bold text-white transition-all placeholder:text-gray-600"
                placeholder="Pergunte sobre o mercado..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" disabled={loading} className="absolute right-2 top-1.5 p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-30">
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAgent;
