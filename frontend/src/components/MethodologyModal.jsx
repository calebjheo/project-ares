import React from 'react';
import { X, BookOpen, Layers, BarChart, Activity } from 'lucide-react';

const MethodologyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0a0f1c]/95 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] backdrop-blur-xl p-8 animate-[fadeIn_0.2s_ease-out]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <BookOpen className="text-blue-500" size={24} />
          <h2 className="text-white font-sans font-bold tracking-widest uppercase">System Methodology & Mechanism</h2>
        </div>
        
        <div className="space-y-8 text-gray-300 font-sans text-sm leading-relaxed">
          <p className="text-gray-400 italic">
            Project ARES utilizes an advanced machine-learning pipeline to synthesize disparate, high-signal market data streams into actionable quantitative risk profiles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/5">
              <BarChart className="text-blue-400 mb-4" size={28} />
              <h3 className="font-semibold text-gray-200 mb-2">1. Institutional Flows</h3>
              <p className="text-xs text-gray-400">Tracks Spot ETF inflows and outflows to gauge raw institutional demand and macroeconomic positioning.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/5">
              <Layers className="text-red-400 mb-4" size={28} />
              <h3 className="font-semibold text-gray-200 mb-2">2. Liquidation Clusters</h3>
              <p className="text-xs text-gray-400">Ingests Coinglass Heatmap data to identify overleveraged zones where forced liquidations act as magnetic price targets.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/5">
              <Activity className="text-yellow-400 mb-4" size={28} />
              <h3 className="font-semibold text-gray-200 mb-2">3. Retail Sentiment</h3>
              <p className="text-xs text-gray-400">Monitors Fear & Greed indices and broader social sentiment to determine when the retail market is acting as exit liquidity.</p>
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl">
            <h4 className="font-semibold text-blue-400 mb-2 tracking-wider uppercase text-xs">The Synthesis Engine</h4>
            <p className="text-gray-300">
              The AI ingests these 3 pillars to calculate the definitive <strong>Market Posture</strong> (ranging from Aggressive to Danger) and pinpoint exact <strong>Kill Zone targets</strong>. Trade the math, not the emotion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodologyModal;
