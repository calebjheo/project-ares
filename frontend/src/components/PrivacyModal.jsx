import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 sm:p-8 flex-grow overflow-y-auto no-scrollbar relative z-10">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 text-blue-400 mb-6">
            <ShieldAlert size={24} />
            <h2 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-wide">
              {t('privacyPolicy')}
            </h2>
          </div>

          <div className="space-y-6 text-gray-300 font-sans text-sm leading-relaxed">
            <p>
              <strong>{t('privP1Title')}</strong> {t('privP1Desc')}
            </p>
            <p>
              <strong>{t('privP2Title')}</strong> {t('privP2Desc')}
            </p>
            <p>
              <strong>{t('privP3Title')}</strong> {t('privP3Desc')}
            </p>
            <p>
              <strong>{t('privP4Title')}</strong> {t('privP4Desc')}
            </p>
            <p>
              <strong>{t('privP5Title')}</strong> {t('privP5Desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
