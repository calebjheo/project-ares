import React from 'react';
import { ShieldAlert, Shield, ShieldCheck } from 'lucide-react';

const PostureShield = ({ posture }) => {
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
    <div className={`relative flex flex-col items-center justify-center py-10 md:py-16 px-6 md:px-10 h-auto w-full rounded-2xl border ${borderColor} ${bgColor} ${shadow} backdrop-blur-md transition-all duration-700 overflow-hidden`}>
      {/* Subtle background glow effect behind the icon */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full ${bgColor} blur-3xl opacity-50`}></div>
      
      <h2 className="text-gray-400 font-sans font-semibold text-xs tracking-[0.2em] mb-4 uppercase z-10">Market Posture</h2>
      
      <div className={`mb-6 ${color} opacity-70 z-10 ${isDanger ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''}`}>
        <Icon size={64} strokeWidth={1.5} />
      </div>
      
      <div className={`font-mono text-2xl md:text-3xl font-bold tracking-widest ${color} z-10 text-center drop-shadow-md leading-tight`}>
        {label}
      </div>
    </div>
  );
};

export default PostureShield;
