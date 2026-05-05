import React, { useState } from 'react';
import { X, CheckCircle2, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const UpgradeModal = ({ isOpen, onClose, onTermsClick }) => {
  const { t } = useLanguage();
  const [agreedToTos, setAgreedToTos] = useState(false);

  if (!isOpen) return null;

  const features = [
    "Unrestricted access to BTC, ETH, and SOL Kill Zone Targets.",
    "Divergence SMS Alerts: Get instant text messages when retail euphoria contradicts institutional selling.",
    "Custom Altcoin Radar: Unlock liquidation heatmaps for 3 custom altcoins of your choice.",
    "Live Whale Watch Feed: Real-time ticker of ETF inflows and massive liquidation events."
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-slate-900/80 border border-yellow-500/30 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.15)] backdrop-blur-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-yellow-500/10 blur-[50px] pointer-events-none"></div>

        <div className="p-6 sm:p-8 flex-grow overflow-y-auto no-scrollbar relative z-10">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 mb-6 mx-auto">
            <Zap size={24} />
          </div>

          <h2 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-wide text-center mb-2">
            UNLOCK INSTITUTIONAL RADAR
          </h2>
          <div className="text-center mb-8">
            <span className="text-3xl font-mono font-bold text-yellow-500">$29</span>
            <span className="text-gray-400 font-sans text-sm tracking-widest uppercase ml-1">/mo</span>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="text-yellow-500 mt-0.5 flex-shrink-0" size={18} />
                <p className="text-gray-300 font-sans text-sm leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4 justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreedToTos} 
                onChange={(e) => setAgreedToTos(e.target.checked)}
                className="w-4 h-4 rounded border-yellow-500/50 bg-slate-900 text-yellow-500 focus:ring-yellow-500/50 cursor-pointer"
              />
              <span className="text-gray-400 text-xs font-sans uppercase tracking-widest select-none">
                I agree to the <button onClick={(e) => { e.preventDefault(); onTermsClick?.(); }} className="text-yellow-500 hover:underline">{t('termsOfService')}</button>
              </span>
            </label>
          </div>

          <a 
            href={agreedToTos ? "https://buy.stripe.com/6oU6oI2zzfdX6eTao67ok01" : "#"}
            onClick={(e) => {
              if (!agreedToTos) {
                e.preventDefault();
                alert("You must agree to the Terms of Service to upgrade.");
              }
            }}
            className={`w-full font-bold uppercase tracking-widest text-sm py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${agreedToTos ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)] cursor-pointer' : 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700'}`}>
            {t('upgradeToPro')}
          </a>
          <p className="text-center text-gray-500 text-[10px] uppercase tracking-widest mt-4">
            Cancel anytime. 100% secure payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
