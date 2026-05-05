import React from 'react';
import { Terminal } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ActionableIntel = ({ intel }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-auto p-5 md:p-8 relative overflow-visible">
      {/* Protected Background Layer */}
      <div className="absolute inset-0 z-0 rounded-2xl border border-white/10 bg-slate-900/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-md overflow-hidden">
        {/* Refined Scanline effect overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30"></div>
      </div>

      <div className="relative z-10 flex items-center gap-3 mb-4 md:mb-6 border-b border-white/5 pb-4 md:pb-5">
        <Terminal className="text-blue-400" size={20} strokeWidth={1.5} />
        <h2 className="text-gray-300 font-sans font-semibold text-xs tracking-[0.2em] uppercase">{t('intelTitle')}</h2>
        <div className="relative group/tooltip flex items-center cursor-help">
          <span className="text-blue-500/50 hover:text-blue-400 transition-colors bg-blue-500/10 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">?</span>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 border border-white/10 text-gray-200 text-[10px] font-sans rounded shadow-xl opacity-0 group-hover/tooltip:opacity-100 group-active/tooltip:opacity-100 transition-opacity pointer-events-none z-[999] text-left leading-relaxed">
            <strong className="block text-white mb-1">{t('whatItIs')}</strong> {t('intelWhatDesc')}
            <strong className="block text-white mt-2 mb-1">{t('howToUse')}</strong> {t('intelHowDesc')}
          </div>
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="font-sans text-gray-300 text-sm leading-loose whitespace-pre-wrap">
          {intel || t('intelAwaiting')}
        </p>
      </div>
    </div>
  );
};

export default ActionableIntel;
