import { useState, useRef, useEffect } from 'react';
import { SendIcon, CloseIcon, BotIcon, UserIcon, MinimizeIcon } from './Icons';

const AIChat = ({ userId, role = 'STUDENT' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Merhaba! Okul yönetmelikleri, notlar veya devamsızlık gibi konularda size nasıl yardımcı olabilirim?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickSuggestions = [
    'Notlarımı nasıl kontrol ederim?',
    'Devamsızlık politikası nedir?',
    'Transkript talebi nasıl yapılır?',
    'Danışmanla iletişime geç'
  ];

  // AI yanıtındaki "düşünce balonlarını" temizleyen profesyonel temizleyici
  const cleanAIResponse = (text) => {
    if (!text) return '';
    return text
      .replace(/<(thinking|thought|think|reasoning)>[\s\S]*?(<\/\1>|$)/gi, '')
      .replace(/^final_answer:\s*/gi, '')
      .trim();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isMinimized]);

  const sendMessage = async (text = null) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!text) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId || '',
          'X-User-Role': role
        },
        body: JSON.stringify({ question: messageText, role })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: cleanAIResponse(data.answer) || 'Üzgünüm, şu an yanıt veremiyorum.',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 transition-all duration-500 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
      >
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-slate-600 hidden md:block">
          Bir sorun mu var?
        </div>
        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300">
          <BotIcon size={24} className="text-white" />
        </div>
      </button>

      {/* Main Chat Panel */}
      <div
        className={`fixed z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isOpen 
            ? isMinimized 
              ? 'bottom-8 right-8 w-72 h-16' 
              : 'bottom-8 right-8 w-[400px] h-[600px]'
            : 'bottom-8 right-8 w-0 h-0 opacity-0 pointer-events-none'
        } bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div 
          className="p-5 bg-white/80 backdrop-blur-md border-b border-slate-50 flex items-center justify-between cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                <BotIcon size={18} />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-[14px] leading-none">Asistan</h3>
              <p className="text-slate-400 text-[11px] mt-1 font-medium">Şu an çevrimiçi</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
              <MinimizeIcon size={18} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-2 hover:bg-red-50 group rounded-full transition-colors text-slate-400">
              <CloseIcon size={18} className="group-hover:text-red-500" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#FAFBFC]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%]">
                    <div className={`px-4 py-3 rounded-2xl text-[13px] leading-[1.5] shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[10px] mt-1.5 text-slate-400 font-semibold px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-center gap-2 animate-pulse">
                   <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 1 && !isLoading && (
              <div className="px-5 py-2 bg-[#FAFBFC]">
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s)} className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-900 text-slate-600 hover:text-slate-900 text-[11px] font-bold rounded-xl transition-all shadow-sm">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-5 bg-white">
              <div className="relative flex items-center bg-slate-50 rounded-2xl px-4 py-1.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-200 border border-slate-100">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Bir mesaj yazın..."
                  className="flex-1 bg-transparent py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className={`p-2 transition-all ${
                    input.trim() && !isLoading ? 'text-slate-900 hover:scale-110 active:scale-95' : 'text-slate-300'
                  }`}
                >
                  <SendIcon size={20} />
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-wider">
                Yapay zeka hata yapabilir.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AIChat;