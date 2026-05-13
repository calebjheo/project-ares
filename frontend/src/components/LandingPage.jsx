import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Activity, Target } from 'lucide-react';
import AresLogo from './AresLogo';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Navigation Bar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <AresLogo />
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-sm font-bold tracking-widest text-gray-300 hover:text-white transition-colors"
        >
          LOGIN
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32 flex flex-col items-center text-center px-4">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block px-3 py-1 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
            <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] text-blue-400 uppercase">
              V3.7 Radar Online
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
            Retail sees price.<br/>
            <span className="text-white">Institutions see the radar.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Institutional-grade risk synthesis for retail crypto traders. Track live algorithmic Kill Zones and ETF divergence. <strong className="text-gray-200">Stop being exit liquidity.</strong>
          </p>

          <button 
            onClick={() => navigate('/dashboard?auth=true')}
            className="group relative px-8 py-4 bg-white text-slate-950 font-bold text-lg md:text-xl rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              Start 7-Day Free Trial
            </span>
          </button>
        </div>

        {/* Dashboard Placeholder */}
        <div className="relative z-10 w-full max-w-6xl mx-auto mt-24">
          <div className="aspect-[16/9] w-full rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center justify-center group relative">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
             
             {/* Replace this div with an actual <img> tag when screenshots are ready */}
             <div className="flex flex-col items-center text-gray-600 gap-4 opacity-50 group-hover:opacity-100 transition-opacity z-0">
               <Target size={48} strokeWidth={1} />
               <p className="font-mono tracking-widest text-sm uppercase">Dashboard Screenshot Container</p>
             </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 bg-slate-950 py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent hover:bg-white/[0.07] transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">The Divergence Matrix</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Tracks real-time Spot ETF inflows against retail broker health. ARES alerts you when Smart Money is distributing to euphoric retail traders.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent hover:bg-white/[0.07] transition-colors">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Algorithmic Kill Zones</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Maps massive liquidity clusters where over-leveraged traders get hunted. Catch flash crashes with precision Limit Buy orders.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent hover:bg-white/[0.07] transition-colors">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-6 text-red-400">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Custom Altcoin Radar</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Deploy the ARES scraper to sweep Tier-1 and Tier-2 altcoins. Receive instant threat levels and liquidation heatmaps for assets you track.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-xs font-mono tracking-widest uppercase">
        © {new Date().getFullYear()} Project ARES. Not Financial Advice.
      </footer>
    </div>
  );
};

export default LandingPage;
