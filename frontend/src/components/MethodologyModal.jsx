import React from 'react';
import { X, BookOpen, Layers, BarChart, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const MethodologyModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      
      {/* Modal Content Box */}
      <div 
        className="relative w-full max-w-3xl max-h-[80vh] flex flex-col bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Fixed at top) */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900 z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-500" size={24} />
            <h2 className="text-white font-sans font-bold tracking-widest uppercase">{t('methodTitle')}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <div className="space-y-8 text-gray-300 font-sans text-sm leading-relaxed">
            <p className="text-gray-400 italic">
              {t('methodIntro')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/5">
                <BarChart className="text-blue-400 mb-4" size={28} />
                <h3 className="font-semibold text-gray-200 mb-2">{t('methodPillar1Title')}</h3>
                <p className="text-xs text-gray-400">{t('methodPillar1Desc')}</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/5">
                <Layers className="text-red-400 mb-4" size={28} />
                <h3 className="font-semibold text-gray-200 mb-2">{t('methodPillar2Title')}</h3>
                <p className="text-xs text-gray-400">{t('methodPillar2Desc')}</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/5">
                <Activity className="text-yellow-400 mb-4" size={28} />
                <h3 className="font-semibold text-gray-200 mb-2">{t('methodPillar3Title')}</h3>
                <p className="text-xs text-gray-400">{t('methodPillar3Desc')}</p>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl">
              <h4 className="font-semibold text-blue-400 mb-2 tracking-wider uppercase text-xs">{t('methodSynthesisTitle')}</h4>
              <p className="text-gray-300">
                {t('methodSynthesisDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodologyModal;
