import React from 'react';
import { ShieldAlert, Shield, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PostureShield = ({ posture }) => {
  const { t } = useLanguage();

  const getPostureStyles = () => {
    switch (posture?.toLowerCase()) {
      case 'danger':
      case 'defensive':
        return {
          color: 'text-red-400',
          borderColor: 'border-red-500/30',
          bgColor: 'bg-red-500/5',
          shadow: 'shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)]',
          Icon: ShieldAlert,
          label: posture.toUpperCase()
        };
      case 'aggressive':
        return {
          color: 'text-green-400',
          borderColor: 'border-green-500/30',
          bgColor: 'bg-green-500/5',
          shadow: 'shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]',
          Icon: ShieldCheck,
          label: 'AGGRESSIVE'
        };
      case 'neutral':
      default:
        return {
          color: 'text-yellow-400',
          borderColor: 'border-yellow-500/30',
          bgColor: 'bg-yellow-500/5',
          shadow: 'shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)]',
          Icon: Shield,
          label: posture ? posture.toUpperCase() : 'NEUTRAL'
        };
    }
  };

  const { color, borderColor, bgColor, shadow, Icon, label } = getPostureStyles();
  const isDanger = posture?.toLowerCase() === 'danger' || posture?.toLowerCase() === 'defensive';

  return (
    <div className="relative flex flex-col items-center justify-center py-10 md:py-16 px-6 md:px-10 h-auto w-full overflow-visible">
      {/* Protected Background Layer */}
      <div className={`absolute inset-0 z-0 rounded-2xl border ${borderColor} ${bgColor} ${shadow} backdrop-blur-md transition-all duration-700 overflow-hidden`}>
        {/* Subtle background glow effect behind the icon */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full ${bgColor} blur-3xl opacity-50`}></div>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-gray-400 font-sans font-semibold text-xs tracking-[0.2em] uppercase">{t('postureTitle')}</h2>
          <div className="relative group/tooltip flex items-center cursor-help">
            <span className="text-gray-500/50 hover:text-gray-400 transition-colors bg-white/5 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">?</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 border border-white/10 text-gray-200 text-[10px] font-sans rounded shadow-xl opacity-0 group-hover/tooltip:opacity-100 group-active/tooltip:opacity-100 transition-opacity pointer-events-none z-[999] text-left leading-relaxed">
              <strong className="block text-white mb-1">{t('whatItIs')}</strong> {t('postureWhatDesc')}
              <strong className="block text-white mt-2 mb-1">{t('howToUse')}</strong> {t('postureHowDesc')}
            </div>
          </div>
        </div>
        
        <div className={`mb-6 ${color} opacity-70 ${isDanger ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''}`}>
          <Icon size={64} strokeWidth={1.5} />
        </div>
        
        <div className={`font-mono text-2xl md:text-3xl font-bold tracking-widest ${color} text-center drop-shadow-md leading-tight`}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default PostureShield;
