import React from 'react';
import { Target, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const KillZoneTarget = ({ btcTarget, ethTarget, solTarget, isProUser, onUpgradeClick }) => {
  const { t } = useLanguage();
  return (
    <div className={`flex flex-col items-center justify-center p-5 md:p-8 h-auto relative overflow-visible group ${!isProUser ? 'min-h-[420px] sm:min-h-[380px]' : ''}`}>
      
      {/* Protected Background Layer */}
      <div className="absolute inset-0 z-0 rounded-2xl border border-white/10 bg-slate-900/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-md overflow-hidden">
        {/* Glassmorphism gradient reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        {/* Decorative tactical corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-red-500/40 rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-red-500/40 rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-red-500/40 rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-red-500/40 rounded-br-lg"></div>
      </div>
      
      <div className="flex items-center gap-3 mb-5 md:mb-6 text-red-400 relative z-10">
        <Target size={20} strokeWidth={1.5} />
        <h2 className="font-sans font-semibold text-xs tracking-[0.2em] uppercase">{t('killzoneTitle')}</h2>
        <div className="relative group/tooltip flex items-center cursor-help">
          <span className="text-red-500/50 hover:text-red-400 transition-colors bg-red-500/10 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">?</span>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 border border-white/10 text-gray-200 text-[10px] font-sans rounded shadow-xl opacity-0 group-hover/tooltip:opacity-100 group-active/tooltip:opacity-100 transition-opacity pointer-events-none z-[999] text-left leading-relaxed">
            <strong className="block text-white mb-1">{t('whatItIs')}</strong> {t('killzoneWhatDesc')}
            <strong className="block text-white mt-2 mb-1">{t('howToUse')}</strong> {t('killzoneHowDesc')}
          </div>
        </div>
      </div>
      
      <div className="relative w-full z-10">
        <div className={`flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-8 w-full justify-center transition-all duration-300 ${!isProUser ? 'blur-md select-none' : ''}`}>
          <div className="flex flex-col items-center">
            <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">{t('btcCluster')}</div>
            <div className={`font-sans font-bold text-white tracking-tight shadow-red-500/20 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)] ${btcTarget?.includes('JAMMED') ? 'text-xs md:text-sm text-red-400' : 'text-2xl md:text-3xl'}`}>
              {btcTarget || '---'}
            </div>
          </div>
          
          {/* Divider */}
          <div className="hidden sm:block w-px h-10 bg-white/10 mt-2"></div>
          <div className="sm:hidden h-px w-24 bg-white/10 mx-auto"></div>
          
          <div className="flex flex-col items-center">
            <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">{t('ethCluster')}</div>
            <div className={`font-sans font-bold text-white tracking-tight shadow-blue-500/20 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)] ${ethTarget?.includes('JAMMED') ? 'text-xs md:text-sm text-red-400' : 'text-2xl md:text-3xl'}`}>
              {ethTarget || '---'}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-10 bg-white/10 mt-2"></div>
          <div className="sm:hidden h-px w-24 bg-white/10 mx-auto"></div>

          <div className="flex flex-col items-center">
            <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">{t('solCluster')}</div>
            <div className={`font-sans font-bold text-white tracking-tight shadow-purple-500/20 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] ${solTarget?.includes('JAMMED') ? 'text-xs md:text-sm text-red-400' : 'text-2xl md:text-3xl'}`}>
              {solTarget || '---'}
            </div>
          </div>
        </div>
      </div>

      {/* Freemium Paywall Overlay - Moved to Outermost Container */}
      {!isProUser && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-md bg-slate-900/60 rounded-2xl overflow-hidden py-6 px-4">
          <Lock className="text-yellow-500 mb-3 shrink-0" size={32} />
          <h3 className="text-white font-sans font-bold tracking-widest uppercase mb-1">{t('encryptedData')}</h3>
          <p className="text-gray-400 text-xs mb-5">{t('encryptedDesc')}</p>
          
          <div className="text-left bg-white/5 border border-white/5 rounded-lg p-4 mb-2 w-full max-w-[280px]">
            <p className="text-gray-300 font-sans font-semibold text-[10px] uppercase tracking-widest mb-3">{t('unlockProAccess')}</p>
            <ul className="text-gray-400 text-xs font-sans space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span> {t('feature1')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span> {t('feature2')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span> {t('feature3')}
              </li>
            </ul>
          </div>

          <a 
            href="https://buy.stripe.com/6oU14oded2rbbzdao67ok02"
            className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-300 text-[10px] sm:text-xs tracking-widest uppercase w-full max-w-[280px] text-center"
          >
            START 7-DAY FREE TRIAL
          </a>
          <p className="text-xs text-gray-400 mt-2">Then $29/month. Cancel anytime.</p>

        </div>
      )}
    </div>
  );
};

export default KillZoneTarget;
