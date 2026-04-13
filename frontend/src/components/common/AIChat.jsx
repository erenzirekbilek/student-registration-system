import { useState, useRef, useEffect } from 'react';
import { SendIcon, CloseIcon, ChatIcon, SparklesIcon, BotIcon, UserIcon, MinimizeIcon } from './Icons';

const AIChat = ({ userId, role = 'STUDENT' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. Ask me about school regulations, grades, absences, or any administrative procedures.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickSuggestions = [
    'How do I check my grades?',
    'What is the attendance policy?',
    'How to request a transcript?',
    'Contact academic advisor'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

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
        body: JSON.stringify({
          question: messageText,
          role: role
        })
      });

      const data = await response.json();

      const cleanContent = (text) => {
        if (!text) return '';
        return text
          .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
          .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
          .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
          .replace(/<think>[\s\S]*?/gi, '')
          .replace(/<\/snippet>/gi, '')
          .replace(/^final_answer:\s*/gi, '')
          .replace(/^Final Answer:\s*/gi, '')
          .replace(/^\s*$/gm, '')
          .trim();
      };

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: cleanContent(data.answer) || 'I apologize, but I couldn\'t process your request at the moment.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting to the AI service. Please try again later.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickSuggestion = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <>
      {/* Floating Button */}
    <button
  onClick={() => setIsOpen(true)}
  className={`fixed bottom-8 right-8 z-50 group flex items-center gap-3 transition-all duration-300 ${
    isOpen ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'
  }`}
>
  {/* Hover'da çıkan küçük bir bilgilendirme balonu (Opsiyonel ama şık) */}
  <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-surface-100 text-[12px] font-bold text-surface-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    Hemen Sor
  </span>

  <div className="relative w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-200 group-hover:bg-red-700 group-hover:scale-105 transition-all duration-300">
    <BotIcon size={24} className="text-white" />
    
    {/* Bildirim noktası - daha sade, kırmızı zemin üzerinde beyaz bir halka */}
    <span className="absolute top-0 right-0 w-3 h-3 bg-white border-2 border-red-600 rounded-full animate-pulse"></span>
  </div>
</button>

      {/* Chat Panel */}
      <div
        className={`fixed z-50 transition-all duration-300 ease-out ${
          isOpen 
            ? isMinimized 
              ? 'bottom-6 right-6 w-80 h-16' 
              : 'bottom-6 right-6 w-[420px] h-[600px]'
            : 'bottom-6 right-6 w-16 h-16 opacity-0 pointer-events-none translate-y-4'
        } bg-white rounded-2xl shadow-2xl border border-surface-200 flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div 
          className={`px-5 py-4 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 flex items-center justify-between cursor-pointer ${isMinimized ? 'rounded-2xl' : ''}`}
          onClick={() => !isOpen || setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BotIcon className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">AI Assistant</h3>
              <p className="text-white/70 text-xs">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              <MinimizeIcon className={`text-white/80 w-5 h-5 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <CloseIcon className="text-white/80 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Content */}
        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-surface-50 to-white">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Avatar */}
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mr-2">
                      <BotIcon className="text-white w-5 h-5" />
                    </div>
                  )}
                  
                  <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-br-md'
                          : 'bg-white text-surface-700 border border-surface-100 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <span className="text-xs text-surface-400 mt-1 px-1">
                      {msg.timestamp ? formatTime(msg.timestamp) : ''}
                    </span>
                  </div>

                  {/* User Avatar */}
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-200 flex items-center justify-center ml-2">
                      <UserIcon className="text-surface-500 w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <BotIcon className="text-white w-5 h-5" />
                    </div>
                    <div className="bg-white px-5 py-3 rounded-2xl border border-surface-100 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-xs text-surface-500 font-medium">AI thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 1 && !isLoading && (
              <div className="px-4 pb-2">
                <p className="text-xs text-surface-400 mb-2 font-medium">Quick questions</p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSuggestion(suggestion)}
                      className="px-3 py-1.5 bg-surface-100 hover:bg-primary-50 hover:text-primary-600 text-surface-600 text-xs rounded-full transition-all duration-200 border border-surface-200 hover:border-primary-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-surface-100 bg-white">
              <div className="flex items-center space-x-3 bg-surface-50 rounded-2xl px-4 py-2 border border-surface-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-500/10 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-surface-700 placeholder-surface-400 focus:outline-none text-sm"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    input.trim() && !isLoading
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md hover:shadow-lg hover:scale-105'
                      : 'bg-surface-200 text-surface-400 cursor-not-allowed'
                  }`}
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-center text-xs text-surface-400 mt-2">
                AI may produce inaccurate information
              </p>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default AIChat;