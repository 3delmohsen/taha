import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { getFatwaResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const AIFatwaView: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message based on language
  useEffect(() => {
    setMessages([
        { 
          id: 'welcome', 
          role: 'model', 
          text: t('welcomeMsg')
        }
    ]);
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const answer = await getFatwaResponse(userMsg.text);

    const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: answer
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
       {/* Header */}
       <div className="bg-white p-4 shadow-sm border-b border-slate-100 flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-lg text-white">
             <Bot size={24} />
          </div>
          <div>
             <h2 className="font-bold text-slate-800">{t('fatwaTitle')}</h2>
             <p className="text-xs text-slate-500 flex items-center gap-1">
               <Sparkles size={10} className="text-amber-500" /> {t('poweredBy')}
             </p>
          </div>
       </div>

       {/* Disclaimer */}
       <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center gap-2">
            <AlertCircle size={14} className="text-amber-600 shrink-0" />
            <p className="text-[10px] text-amber-800 leading-tight">
                {t('disclaimer')}
            </p>
       </div>

       {/* Chat Area */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((msg) => (
             <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
             >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-600'
                }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none'
                }`}>
                    {msg.text.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                </div>
             </div>
          ))}
          
          {isLoading && (
              <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Bot size={16} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rtl:rounded-tr-none ltr:rounded-tl-none shadow-sm border border-slate-100">
                      <div className="flex gap-1">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                      </div>
                  </div>
              </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       {/* Input Area */}
       <div className="p-4 bg-white border-t border-slate-100">
          <div className="relative flex items-center bg-slate-100 rounded-full px-2 py-2">
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('placeholder')}
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none"
             />
             <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-full transition-all ${
                    input.trim() ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-400'
                }`}
             >
                <Send size={18} className={input.trim() ? 'ltr:translate-x-0.5 rtl:-translate-x-0.5' : ''} />
             </button>
          </div>
       </div>
    </div>
  );
};

export default AIFatwaView;
