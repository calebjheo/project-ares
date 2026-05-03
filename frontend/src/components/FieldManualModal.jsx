import React, { useState } from 'react';
import { X, BookOpen, Layers, BarChart, Activity, Crosshair, ShieldAlert } from 'lucide-react';

const FieldManualModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('engine'); // 'engine', 'killzone', 'rules'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0a0f1c]/95 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col max-h-[85vh] animate-[fadeIn_0.2s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-500" size={24} />
            <h2 className="text-white font-sans font-bold tracking-widest uppercase">Field Manual</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex px-6 border-b border-white/5 overflow-x-auto no-scrollbar flex-shrink-0">
          <button 
            onClick={() => setActiveTab('engine')}
            className={`px-4 py-4 text-xs font-semibold tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap ${activeTab === 'engine' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            The Engine
          </button>
          <button 
            onClick={() => setActiveTab('killzone')}
            className={`px-4 py-4 text-xs font-semibold tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap ${activeTab === 'killzone' ? 'border-red-500 text-red-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            The Kill Zone
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-4 text-xs font-semibold tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap ${activeTab === 'rules' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Rules of Engagement
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto font-sans no-scrollbar">
          
          {activeTab === 'engine' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <p className="text-gray-400 italic text-sm">
                Project ARES utilizes an advanced machine-learning pipeline to synthesize disparate, high-signal market data streams into actionable quantitative risk profiles.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                  <BarChart className="text-blue-400 mb-3" size={20} />
                  <h3 className="font-semibold text-gray-200 mb-1">Institutional Flows</h3>
                  <p className="text-xs text-gray-400">Tracks Spot ETF inflows and outflows to gauge raw institutional demand and macroeconomic positioning.</p>
                </div>
                <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                  <Activity className="text-yellow-400 mb-3" size={20} />
                  <h3 className="font-semibold text-gray-200 mb-1">Retail Sentiment</h3>
                  <p className="text-xs text-gray-400">Monitors Fear & Greed indices and broader social sentiment to determine when the retail market is acting as exit liquidity.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'killzone' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3 text-red-400">
                <Crosshair size={24} />
                <h3 className="font-bold tracking-widest uppercase">Magnetic Liquidity</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                The <strong className="text-white">Kill Zone</strong> is an algorithmic liquidation cluster derived from highly leveraged derivatives data. 
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                When retail traders over-leverage long or short positions, they leave concentrated pools of liquidity. Market makers and institutional algorithms are magnetically drawn to these prices to source liquidity and fill large orders. ARES mathematically anticipates these flushes before they occur.
              </p>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-3 text-yellow-400 mb-4">
                <ShieldAlert size={24} />
                <h3 className="font-bold tracking-widest uppercase">Tactical Execution</h3>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-4 items-start">
                <span className="text-yellow-500 font-bold font-mono text-lg">01</span>
                <div>
                  <h4 className="text-gray-200 font-semibold mb-1">Do Not Market Buy</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">ARES is designed to front-run volatility. Entering at market prices surrenders your edge to the algorithms.</p>
                </div>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-4 items-start">
                <span className="text-yellow-500 font-bold font-mono text-lg">02</span>
                <div>
                  <h4 className="text-gray-200 font-semibold mb-1">Deploy Limit Orders at the Kill Zone</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">Set your limit orders precisely at or slightly below the calculated Kill Zone Target. Let the market panic flush into your bids.</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-4 items-start">
                <span className="text-yellow-500 font-bold font-mono text-lg">03</span>
                <div>
                  <h4 className="text-gray-200 font-semibold mb-1">Align with the Posture Shield</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">Only execute Aggressive allocations when the Posture Shield is Green. Reduce position sizing dramatically in Neutral or Danger zones.</p>
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
