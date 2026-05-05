import React, { useState } from 'react';
import { X, BookOpen, Layers, BarChart, Activity, Crosshair, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FieldManualModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('engine'); // 'engine', 'killzone', 'rules'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      
      {/* Modal Content Box */}
      <div 
        className="relative w-full max-w-3xl max-h-[80vh] flex flex-col bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900 z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-500" size={24} />
            <h2 className="text-white font-sans font-bold tracking-widest uppercase">{t('fieldManual')}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs Navigation (Also fixed) */}
        <div className="flex px-6 border-b border-white/5 bg-slate-900 overflow-x-auto no-scrollbar flex-shrink-0 z-10">
          <button 
            onClick={() => setActiveTab('engine')}
            className={`px-4 py-4 text-xs font-semibold tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap ${activeTab === 'engine' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            {t('fmTabEngine')}
          </button>
          <button 
            onClick={() => setActiveTab('killzone')}
            className={`px-4 py-4 text-xs font-semibold tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap ${activeTab === 'killzone' ? 'border-red-500 text-red-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            {t('fmTabKillzone')}
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-4 text-xs font-semibold tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap ${activeTab === 'rules' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            {t('fmTabRules')}
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 font-sans no-scrollbar">
          
          {activeTab === 'engine' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <p className="text-gray-400 italic text-sm">
                {t('fmEngineIntro')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                  <BarChart className="text-blue-400 mb-3" size={20} />
                  <h3 className="font-semibold text-gray-200 mb-1">{t('fmEngineFlowsTitle')}</h3>
                  <p className="text-xs text-gray-400">{t('fmEngineFlowsDesc')}</p>
                </div>
                <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                  <Activity className="text-yellow-400 mb-3" size={20} />
                  <h3 className="font-semibold text-gray-200 mb-1">{t('fmEngineRetailTitle')}</h3>
                  <p className="text-xs text-gray-400">{t('fmEngineRetailDesc')}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'killzone' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3 text-red-400">
                <Crosshair size={24} />
                <h3 className="font-bold tracking-widest uppercase">{t('fmKzTitle')}</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('fmKzP1')}
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('fmKzP2')}
              </p>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3 text-yellow-400 mb-4">
                <ShieldAlert size={24} />
                <h3 className="font-bold tracking-widest uppercase">{t('fmRulesTitle')}</h3>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-4 items-start">
                <span className="text-yellow-500 font-bold font-mono text-lg">01</span>
                <div>
                  <h4 className="text-gray-200 font-semibold mb-1">{t('fmRule1Title')}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{t('fmRule1Desc')}</p>
                </div>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-4 items-start">
                <span className="text-yellow-500 font-bold font-mono text-lg">02</span>
                <div>
                  <h4 className="text-gray-200 font-semibold mb-1">{t('fmRule2Title')}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{t('fmRule2Desc')}</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-4 items-start">
                <span className="text-yellow-500 font-bold font-mono text-lg">03</span>
                <div>
                  <h4 className="text-gray-200 font-semibold mb-1">{t('fmRule3Title')}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{t('fmRule3Desc')}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FieldManualModal;
