
import React from 'react';
import { Shield, Globe, Database } from 'lucide-react';
import { Fileset } from '../types';

interface HeaderProps {
  filesets: Fileset[];
  selectedFilesetId: string;
  onSelectFileset: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ filesets, selectedFilesetId, onSelectFileset }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-b bg-white shadow-sm z-10 gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg animate-pulse">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">PrivacyGuard AI</h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Globe size={12} className="text-indigo-500" />
            <span>International Data Privacy Expert</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:flex-none">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Database size={16} />
          </div>
          <select
            value={selectedFilesetId}
            onChange={(e) => onSelectFileset(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            {filesets.map((fs) => (
              <option key={fs.id} value={fs.id}>
                {fs.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
