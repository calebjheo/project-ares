import React from 'react';
import { Terminal } from 'lucide-react';

const ActionableIntel = ({ intel }) => {
  return (
    <div className="flex flex-col h-auto rounded-2xl border border-white/10 bg-slate-900/40 p-5 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-md relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4 md:mb-6 border-b border-white/5 pb-4 md:pb-5 relative z-20">
        <Terminal className="text-blue-400" size={20} strokeWidth={1.5} />
        <h2 className="text-gray-300 font-sans font-semibold text-xs tracking-[0.2em] uppercase">Actionable Intel</h2>
        <div className="relative group flex items-center cursor-help">
          <span className="text-blue-500/50 hover:text-blue-400 transition-colors bg-blue-500/10 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">?</span>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 border border-white/10 text-gray-200 text-[10px] font-sans rounded shadow-xl opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity pointer-events-none z-50 text-center leading-relaxed">
            AI-synthesized narrative explaining the math behind the Posture Shield.
          </div>
        </div>
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
