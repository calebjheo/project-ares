import React, { useState, useEffect } from 'react';
import PostureShield from './PostureShield';
import ActionableIntel from './ActionableIntel';
import KillZoneTarget from './KillZoneTarget';
import FieldManualModal from './FieldManualModal';
import MethodologyModal from './MethodologyModal';
import UpgradeModal from './UpgradeModal';
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';
import AresLogo from './AresLogo';
import { Info, BookText, Target, Lock, ShieldAlert } from 'lucide-react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';

const AltcoinSlot = ({ id, isProUser }) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle'); // idle, input, loading, complete
  const [ticker, setTicker] = useState('');
  const [targetData, setTargetData] = useState({ killZone: '', threatLevel: '' });
  const [inputValue, setInputValue] = useState('');

  const submit = async (val) => {
    if (!val.trim()) {
      setStatus('idle');
      return;
    }
    const cleanTicker = val.trim().toUpperCase();
    setTicker(cleanTicker);
    setStatus('loading');
    
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/altcoin?ticker=${cleanTicker}`);
      if (!response.ok) throw new Error('Fetch failed');
      const json = await response.json();
      setTargetData({
        killZone: json.Kill_Zone || t('notFound'),
        threatLevel: json.Threat_Level || ''
      });
      setStatus('complete');
    } catch (err) {
      console.error(err);
      setTargetData({ killZone: t('error'), threatLevel: '' });
      setStatus('complete');
    }
  };

  const getThreatColor = (level) => {
    if (level === 'HIGH') return 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]';
    if (level === 'ELEVATED') return 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]';
    if (level === 'STABLE') return 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]';
    return 'text-white shadow-purple-500/20 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]';
  };

  const threatStyle = status === 'complete' && targetData.threatLevel ? getThreatColor(targetData.threatLevel) : 'text-white';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submit(inputValue);
    } else if (e.key === 'Escape') {
      setStatus('idle');
      setInputValue('');
    }
  };

  const getLocalizedThreatRisk = (level) => {
    if (level === 'HIGH') return t('threatHighRisk');
    if (level === 'ELEVATED') return t('threatElevatedRisk');
    if (level === 'STABLE') return t('threatStableRisk');
    return `${level} RISK`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 border border-white/5 rounded-xl bg-white/5 min-h-[6rem] h-full relative group">
      <div className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-widest mb-2 flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 whitespace-nowrap">
        <span>{t('slot')} {id}</span>
        {ticker && status === 'complete' && (
          <div className="flex items-center justify-center">
            <span className="mx-1">-</span>
            <span className={`font-bold flex items-center gap-1 ${threatStyle}`}>
              {targetData.threatLevel && <ShieldAlert size={10} strokeWidth={2.5} />}
              {ticker}
            </span>
          </div>
        )}
      </div>
      
      {!isProUser ? (
        <div className="font-mono text-xl font-bold text-white tracking-tight">---</div>
      ) : status === 'idle' ? (
        <div 
          onClick={() => setStatus('input')}
          className="font-sans text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
          {t('selectAsset')}
        </div>
      ) : status === 'input' ? (
        <input 
          autoFocus
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t('tickerPlaceholder')}
          className="bg-slate-800 text-white font-sans text-sm text-center border border-blue-500/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded px-2 py-1 outline-none w-full max-w-[100px] placeholder-gray-600 transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]"
          onBlur={() => submit(inputValue)}
          onKeyDown={handleKeyDown}
        />
      ) : status === 'loading' ? (
        <div className="font-mono text-[10px] text-blue-400 animate-pulse tracking-widest">
          {t('scanning')}
        </div>
      ) : (
        <div 
          onClick={() => { setStatus('input'); setInputValue(''); }}
          className="flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity w-full mt-auto"
        >
          {targetData.threatLevel && (
            <div className="flex items-center justify-center whitespace-nowrap">
              <div className={`text-[8px] sm:text-[9px] uppercase tracking-[0.15em] mb-1 font-bold ${threatStyle} opacity-80`}>
                {getLocalizedThreatRisk(targetData.threatLevel)}
              </div>
            </div>
          )}
          <div className={`font-mono font-bold tracking-tight text-center px-1 overflow-hidden text-ellipsis ${targetData.killZone.length > 20 ? 'text-[10px] leading-tight line-clamp-3 whitespace-normal text-white' : `text-xl sm:text-2xl whitespace-nowrap ${threatStyle}`}`}>
            {targetData.killZone}
          </div>
        </div>
      )}
    </div>
  );
};

const LiveMetricsHUD = ({ fearGreed, etfFlow, t }) => (
  <div className="flex flex-row gap-4 w-full">
    <div className="flex-1 bg-slate-900/60 border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col justify-center items-center backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="text-[9px] md:text-[10px] text-gray-500 tracking-widest uppercase mb-2 font-bold z-10">{t('fearGreedTitle')}</div>
      <div className="font-mono text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] z-10">{fearGreed || '--'}</div>
    </div>
    <div className="flex-1 bg-slate-900/60 border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col justify-center items-center backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="text-[9px] md:text-[10px] text-gray-500 tracking-widest uppercase mb-2 font-bold z-10">{t('netEtfFlowTitle')}</div>
      <div className="font-mono text-2xl md:text-3xl font-bold text-blue-400 tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.4)] z-10">{etfFlow || '--'}</div>
    </div>
  </div>
);

const DashboardContent = () => {
  const { language, setLanguage, t } = useLanguage();
  const [agreedToTos, setAgreedToTos] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isProUser, setIsProUser] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ares_pro_status') === 'active';
    }
    return false;
  });
  const [lastSweep, setLastSweep] = useState('');

  useEffect(() => {
    // MVP Auth Logic: Check URL for success parameter from Stripe
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      localStorage.setItem('ares_pro_status', 'active');
      setIsProUser(true);
      // Clean URL silently
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    // Set initial last sweep time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setLastSweep(`${formattedDate} | ${formattedTime}`);

    const fetchRiskData = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${baseUrl}/api/risk?lang=${language}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col relative pb-20 md:pb-24">

      {/* Header Wrapper */}
      <header className="w-full max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-6">
          
          {/* Left Side: Logo Lockup & Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
            {/* Logo Lockup */}
            <div className="flex items-start md:items-center gap-4">
              {/* Logo Integration */}
              <div className="w-8 h-8 md:w-10 md:h-10 text-blue-500 flex-shrink-0 mt-1 md:mt-0">
                <AresLogo animated={false} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-4xl font-sans font-bold tracking-tight text-white flex items-center mb-1">
                  PROJECT <span className="text-blue-500 ml-2">ARES</span>
                </h1>
                <p className="font-sans text-[10px] md:text-xs text-gray-500 tracking-[0.2em] uppercase font-semibold">
                  Quantitative Risk Engine
                </p>
              </div>
            </div>

            {/* Documentation Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setIsMethodologyOpen(true)}
                className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors text-[10px] md:text-xs font-sans tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              >
                <BookText size={12} className="md:w-3.5 md:h-3.5" />
                {t('methodology')}
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors text-[10px] md:text-xs font-sans tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              >
                <BookText size={12} className="md:w-3.5 md:h-3.5" />
                {t('fieldManual')}
              </button>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 rounded-md px-2 py-1 text-xs outline-none focus:border-blue-500 ml-2 font-sans tracking-widest uppercase cursor-pointer"
              >
                <option value="EN" className="bg-slate-900">EN</option>
                <option value="KO" className="bg-slate-900">KO</option>
                <option value="ES" className="bg-slate-900">ES</option>
                <option value="JP" className="bg-slate-900">JP</option>
              </select>
            </div>
          </div>
          
          {/* Right Side: Radar Status */}
          <div className="md:ml-auto w-full md:w-auto flex flex-col items-start md:items-end gap-2">
            {/* Radar Status and Description */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/5 shadow-inner w-max">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
              <span className="text-gray-300 font-mono text-[9px] md:text-[10px] uppercase tracking-widest">
                {t('lastSweep')}: {lastSweep || '--:--'}
              </span>
            </div>
            <p className="font-sans text-[11px] md:text-sm text-gray-400 whitespace-normal md:whitespace-nowrap overflow-hidden">
              {t('radarStatus')}
            </p>
          </div>

        </div>
      </header>

      {/* Main Dashboard Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pb-8 md:pb-12 flex flex-col xl:flex-row gap-4 xl:gap-8">
        
        {/* Info Panel */}
        <aside className="w-full xl:w-64 flex-shrink-0 order-last xl:order-first">
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 md:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-md h-full">
            <div className="flex items-center gap-2 mb-6 text-blue-400">
              <Info size={18} />
              <h3 className="font-sans font-semibold text-xs tracking-[0.2em] uppercase">{t('systemProtocol')}</h3>
            </div>
            <div className="space-y-6 text-sm text-gray-400 font-sans leading-relaxed">
              <div>
                <strong className="text-gray-200 block mb-1">{t('postureTitle')}</strong>
                {t('protocolPostureDesc')}
              </div>
              <div>
                <strong className="text-gray-200 block mb-1">{t('killzoneTitle')}</strong>
                {t('protocolKillzoneDesc')}
              </div>
            </div>
          </div>
        </aside>

        {/* Dashboard Grid */}
        <div className="flex-grow order-first xl:order-last">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[500px] rounded-2xl border border-blue-500/20 bg-blue-900/10 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent"></div>
              
              {/* Custom Loading Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 text-blue-400 mb-8 relative z-10">
                <AresLogo animated={true} />
              </div>
              
              <div className="font-mono text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-blue-400 animate-pulse relative z-10 text-center px-4">
                ESTABLISHING NEURAL LINK...
              </div>
              <div className="font-sans text-[10px] md:text-xs text-gray-500 mt-2 tracking-widest uppercase relative z-10">
                Synthesizing Market Data
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[500px] rounded-2xl border border-red-500/30 bg-red-500/5 backdrop-blur-md p-8 text-center">
              <div className="font-mono text-lg text-red-400 mb-2">SYSTEM ERROR</div>
              <div className="font-sans text-sm text-gray-400">{error}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-6 h-auto items-stretch">
              {/* Posture Shield */}
              <div className="lg:col-span-5 flex">
                <PostureShield posture={data?.Market_Posture} />
              </div>

              {/* Stacked Intel and Kill Zone */}
              <div className="lg:col-span-7 flex flex-col gap-4 xl:gap-6">
                <LiveMetricsHUD fearGreed={data?.Fear_Greed_Score} etfFlow={data?.Net_ETF_Flow} t={t} />
                <ActionableIntel intel={data?.Actionable_Intel} />
                <KillZoneTarget 
                  btcTarget={data?.BTC_Kill_Zone} 
                  ethTarget={data?.ETH_Kill_Zone} 
                  solTarget={data?.SOL_Kill_Zone}
                  isProUser={isProUser}
                  onUpgradeClick={() => setIsUpgradeModalOpen(true)}
                />



                {/* Custom Altcoin Radar Teaser */}
                <div className="relative rounded-2xl border border-white/10 bg-slate-900/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-md p-6 overflow-hidden">
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3 text-purple-400">
                      <Target size={20} strokeWidth={1.5} />
                      <h2 className="font-sans font-semibold text-xs tracking-[0.2em] uppercase">{t('radarTitle')}</h2>
                    </div>
                  </div>
                  
                  <div className={`flex flex-col gap-4 transition-all duration-300 ${!isProUser ? 'blur-md select-none opacity-50' : ''}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                      {[1, 2, 3].map(i => (
                        <AltcoinSlot key={i} id={i} isProUser={isProUser} />
                      ))}
                    </div>
                    {/* Consolidated Threat Level Key (Compact Bottom Bar) */}
                    <div className="w-full flex flex-wrap items-center justify-center gap-x-4 gap-y-2 p-2 bg-slate-800/30 rounded-lg border border-white/5">
                      <div className="flex items-center gap-1.5">
                         <ShieldAlert size={12} className="text-red-500 shrink-0" />
                         <div className="text-[8px] md:text-[9px] text-gray-400 leading-none whitespace-nowrap"><span className="text-red-500 font-bold">{t('threatHighLabel')}:</span> {t('threatHighDesc')}</div>
                      </div>
                      <div className="hidden sm:block w-px h-3 bg-white/10"></div>
                      <div className="flex items-center gap-1.5">
                         <ShieldAlert size={12} className="text-amber-500 shrink-0" />
                         <div className="text-[8px] md:text-[9px] text-gray-400 leading-none whitespace-nowrap"><span className="text-amber-500 font-bold">{t('threatElevatedLabel')}:</span> {t('threatElevatedDesc')}</div>
                      </div>
                      <div className="hidden sm:block w-px h-3 bg-white/10"></div>
                      <div className="flex items-center gap-1.5">
                         <ShieldAlert size={12} className="text-green-500 shrink-0" />
                         <div className="text-[8px] md:text-[9px] text-gray-400 leading-none whitespace-nowrap"><span className="text-green-500 font-bold">{t('threatStableLabel')}:</span> {t('threatStableDesc')}</div>
                      </div>
                    </div>
                  </div>

                  {!isProUser && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                      <div className="bg-purple-500/20 border border-purple-500/50 px-4 py-1.5 rounded-full backdrop-blur-md">
                        <span className="text-purple-300 font-sans font-bold text-[10px] tracking-widest uppercase flex items-center gap-2">
                          <Lock size={12} /> {t('proFeature')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Whale Watch Ticker */}
      <div className="fixed bottom-[68px] md:bottom-[76px] left-0 w-full bg-[#060b14]/95 border-y border-white/10 py-2.5 z-40 overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 relative flex items-center">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-[#060b14] px-2 border-r border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-blue-400 font-sans font-bold text-[9px] md:text-[10px] tracking-widest uppercase whitespace-nowrap">{t('whaleWatch')}</span>
          </div>

          <div className={`relative pl-32 whitespace-nowrap overflow-hidden flex items-center h-5 transition-all duration-300 ${!isProUser ? 'blur-sm select-none opacity-40' : ''}`}>
            <div className="animate-marquee flex gap-8 min-w-max">
              <span className="text-gray-300 font-mono text-xs"><span className="text-red-400 mr-2">🚨</span> 500 BTC transferred to Coinbase</span>
              <span className="text-gray-300 font-mono text-xs"><span className="text-green-400 mr-2">🟢</span> BlackRock ETF inflows hit $120M</span>
              <span className="text-gray-300 font-mono text-xs"><span className="text-red-400 mr-2">🚨</span> $50M ETH Longs Liquidated</span>
              {/* Duplicate for infinite loop */}
              <span className="text-gray-300 font-mono text-xs"><span className="text-red-400 mr-2">🚨</span> 500 BTC transferred to Coinbase</span>
              <span className="text-gray-300 font-mono text-xs"><span className="text-green-400 mr-2">🟢</span> BlackRock ETF inflows hit $120M</span>
              <span className="text-gray-300 font-mono text-xs"><span className="text-red-400 mr-2">🚨</span> $50M ETH Longs Liquidated</span>
            </div>
          </div>

          {!isProUser && (
            <div className="absolute inset-0 flex items-center justify-center z-30 ml-28">
              <div className="bg-blue-500/20 border border-blue-500/50 px-3 py-0.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <span className="text-blue-300 font-sans font-bold text-[9px] tracking-widest uppercase flex items-center gap-1.5">
                  <Lock size={10} /> Pro Feature
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legal Armor Footer */}
      <footer className="fixed bottom-0 w-full border-t border-white/5 bg-[#0a0f1c]/90 backdrop-blur-md py-4 px-6 z-50 text-center">
        <p className="font-sans text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase tracking-wider max-w-5xl mx-auto">
          {t('disclaimer')}
        </p>
        <p className="font-sans text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mt-2 max-w-5xl mx-auto">
          {t('rightsReserved')} | <button onClick={() => setIsTermsOpen(true)} className="hover:text-gray-300 transition-colors">{t('termsOfService')}</button> | <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-gray-300 transition-colors">{t('privacyPolicy')}</button>
        </p>
      </footer>

      {/* Modal Overlays */}
      <FieldManualModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <MethodologyModal isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} onTermsClick={() => { setIsUpgradeModalOpen(false); setIsTermsOpen(true); }} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
};

const Dashboard = () => (
  <LanguageProvider>
    <DashboardContent />
  </LanguageProvider>
);

export default Dashboard;
