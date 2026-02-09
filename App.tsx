
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Trash2, Info } from 'lucide-react';
import { Header } from './components/Header';
import { Message as MessageComponent } from './components/Message';
import { Fileset, Message } from './types';
import { getFilesets, handleRagChat, DEFAULT_FILESET_ID } from './services/domoService';

const App: React.FC = () => {
  const [filesets, setFilesets] = useState<Fileset[]>([]);
  const [selectedFilesetId, setSelectedFilesetId] = useState<string>(DEFAULT_FILESET_ID);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am PrivacyGuard AI. I can help you navigate international data privacy regulations and organizational policies. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFilesets = async () => {
      const data = await getFilesets();
      setFilesets(data);
    };
    fetchFilesets();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await handleRagChat(userMessage.content, selectedFilesetId);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        sources: response.sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear this conversation?')) {
      setMessages([messages[0]]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header 
        filesets={filesets} 
        selectedFilesetId={selectedFilesetId} 
        onSelectFileset={setSelectedFilesetId} 
      />

      <main className="flex-1 overflow-hidden relative flex flex-col items-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Chat Area */}
        <div className="w-full max-w-4xl flex-1 overflow-y-auto px-4 py-8 scrollbar-hide z-0">
          <div className="space-y-2">
            {messages.map((msg) => (
              <MessageComponent key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-indigo-500 px-12 py-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <span className="text-[10px] font-semibold uppercase tracking-widest ml-1">Analyzing Data Privacy...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="w-full max-w-4xl px-4 pb-8">
          <form 
            onSubmit={handleSendMessage}
            className="glass-panel p-2 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-200"
          >
            <button
              type="button"
              onClick={clearChat}
              title="Clear Chat"
              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 size={20} />
            </button>
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about GDPR, data residency, or privacy policies..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 py-3 px-2 text-sm md:text-base"
              disabled={isLoading}
            />

            <div className="flex items-center gap-1">
              {isLoading ? (
                <div className="px-4 py-3 bg-indigo-100 text-indigo-600 rounded-xl flex items-center gap-2">
                  <Sparkles size={18} className="animate-spin" />
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                >
                  <span className="hidden md:inline font-semibold text-sm">Send Query</span>
                  <Send size={18} />
                </button>
              )}
            </div>
          </form>
          
          <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
            <span className="flex items-center gap-1"><Info size={12}/> AI-Powered Context</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>GDPR COMPLIANT</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>SECURE DOMO AI LAYER</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
