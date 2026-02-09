
import React from 'react';
import { User, ShieldCheck, FileText, ExternalLink } from 'lucide-react';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex flex-col mb-6 ${isAssistant ? 'items-start' : 'items-end'}`}>
      <div className={`flex gap-3 max-w-[85%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
          isAssistant ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border'
        }`}>
          {isAssistant ? <ShieldCheck size={18} /> : <User size={18} />}
        </div>

        <div className={`px-4 py-3 rounded-2xl shadow-sm ${
          isAssistant 
            ? 'bg-white border text-slate-800 rounded-tl-none' 
            : 'bg-indigo-600 text-white rounded-tr-none'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {isAssistant && message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Sources Referenced</span>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border rounded-md text-[10px] text-slate-600 hover:bg-slate-100 transition-colors">
                    <FileText size={10} className="text-indigo-400" />
                    <span className="truncate max-w-[150px]">{source}</span>
                    <ExternalLink size={8} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <span className="text-[10px] text-slate-400 mt-1 px-11">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};
