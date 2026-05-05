import React from 'react';
import { X, Scale } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const TermsModal = ({ isOpen, onClose }) => {
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
            <Scale size={24} />
            <h2 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-wide">
              {t('termsOfService')}
            </h2>
          </div>

          <div className="space-y-6 text-gray-300 font-sans text-sm leading-relaxed">
            <p>
              <strong>1. Educational Purpose Only:</strong> The Project ARES dashboard and all provided quantitative data are strictly for educational and research purposes. Project ARES is NOT a registered financial advisor, broker, or investment entity.
            </p>
            <p>
              <strong>2. No Financial Advice:</strong> None of the data, alerts, "Kill Zones", "Market Posture" states, or synthetic intelligence outputs constitute financial advice, investment recommendations, or an offer to buy/sell any asset.
            </p>
            <p>
              <strong>3. Assumption of Risk:</strong> Cryptocurrency trading is highly speculative and carries a severe risk of total capital loss. By using this tool, you acknowledge that you are trading at your own risk and that you will not hold the developers, creators, or affiliates of Project ARES liable for any financial losses.
            </p>
            <p>
              <strong>4. Data Accuracy:</strong> While Project ARES synthesizes real-time data from various APIs (including Coinglass and Farside), we do not guarantee the accuracy, timeliness, or completeness of the data. 
            </p>
            <p>
              <strong>5. Pro Subscription:</strong> The Pro tier is billed monthly at $29/mo via Stripe. You may cancel at any time. Due to the digital nature of the data, all sales are final and non-refundable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
