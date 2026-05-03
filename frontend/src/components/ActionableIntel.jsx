import React from 'react';
import { Terminal } from 'lucide-react';

const ActionableIntel = ({ intel }) => {
  return (
    <div className="flex flex-col h-auto rounded-2xl border border-white/10 bg-slate-900/40 p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-md relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-5 relative z-20">
        <Terminal className="text-blue-400" size={20} strokeWidth={1.5} />
        <h2 className="text-gray-300 font-sans font-semibold text-xs tracking-[0.2em] uppercase">Actionable Intel</h2>
      </div>
      
      <div className="relative z-20">
        <p className="font-sans text-gray-300 text-sm leading-loose whitespace-pre-wrap">
          {intel || 'Awaiting quantitative synthesis...'}
        </p>
      </div>
      
      {/* Refined Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30 z-10"></div>
    </div>
  );
};

export default ActionableIntel;
