const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const enTranslations = {
  "lpHeroTitle1": "Retail sees price.",
  "lpHeroTitle2": "Institutions see the radar.",
  "lpHeroDesc": "Institutional-grade risk synthesis for retail crypto traders. Track live algorithmic Kill Zones and ETF divergence.",
  "lpHeroBold": "Stop being exit liquidity.",
  "lpStartTrial": "Start 7-Day Free Trial",
  "lpFeature1Title": "The Divergence Matrix",
  "lpFeature1Desc": "Tracks real-time Spot ETF inflows against retail broker health. ARES alerts you when Smart Money is distributing to euphoric retail traders.",
  "lpFeature2Title": "Algorithmic Kill Zones",
  "lpFeature2Desc": "Maps massive liquidity clusters where over-leveraged traders get hunted. Catch flash crashes with precision Limit Buy orders.",
  "lpFeature3Title": "Custom Altcoin Radar",
  "lpFeature3Desc": "Deploy the ARES scraper to sweep Tier-1 and Tier-2 altcoins. Receive instant threat levels and liquidation heatmaps for assets you track.",
  "lpLogin": "LOGIN",
  "lpDashboard": "DASHBOARD",
  "lpEnterDashboard": "Enter Dashboard",
  "upgradeToPro": "START 7-DAY FREE TRIAL",
  "manageSubscription": "Manage Subscription",
  "systemProtocol": "System Protocol",
  "unlockInstitutional": "Unlock Institutional Flow Data & Custom Altcoin Radar",
  "iAgree": "I agree to the Terms of Service & understand this is 'As-Is' educational data.",
  "methodology": "Methodology",
  "fieldManual": "Field Manual",
  "lastSweep": "Last Sweep",
  "radarStatus": "Institutional data synthesis. Do not be exit liquidity. Trade the math.",
  "postureTitle": "Market Posture",
  "whatItIs": "What it is:",
  "howToUse": "How to use:",
  "postureWhatDesc": "The AI's calculation of the macro environment based on institutional flows.",
  "postureHowDesc": "Green = Safe to increase position sizing. Yellow = Reduce sizing. Red = Move to heavy cash reserves and prepare for crashes.",
  "intelTitle": "Actionable Intel",
  "intelWhatDesc": "Real-time synthesis of Wall Street ETF flows vs. retail sentiment.",
  "intelHowDesc": "Read this before placing any trade to ensure you are trading alongside institutions, not against them.",
  "intelAwaiting": "Awaiting quantitative synthesis...",
  "killzoneTitle": "Kill Zone Targets",
  "killzoneWhatDesc": "Algorithmic liquidation clusters where market makers hunt over-leveraged traders.",
  "killzoneHowDesc": "NEVER market-buy. Place Limit Buy orders exactly at these prices to catch flash crashes at a massive discount.",
  "btcCluster": "BTC Cluster",
  "ethCluster": "ETH Cluster",
  "solCluster": "SOL Cluster",
  "encryptedData": "Encrypted Data",
  "encryptedDesc": "Precision liquidity targets are restricted.",
  "unlockProAccess": "Unlock Pro Access:",
  "feature1": "Live BTC, ETH, & SOL Kill Zones",
  "feature2": "Institutional Divergence Alerts",
  "feature3": "Custom Altcoin Radar",
  "radarTitle": "Custom Altcoin Radar",
  "proFeature": "Pro Feature",
  "whaleWatch": "Whale Watch",
  "disclaimer": "DISCLAIMER: Project ARES is a data synthesis tool, not financial advice. Cryptocurrency trading carries a high risk of total loss. The developers are not liable for any trading decisions made based on this data.",
  "rightsReserved": "© 2026 Project ARES. All rights reserved.",
  "termsOfService": "Terms of Service",
  "privacyPolicy": "Privacy Policy",
  "protocolPostureDesc": "Synthesizes broad market sentiment, institutional flows, and price action to determine the current macro stance.",
  "protocolKillzoneDesc": "High-probability liquidation clusters and critical technical zones where major price reactions are expected for BTC, ETH, and SOL.",
  "slot": "Slot",
  "selectAsset": "Select Asset +",
  "tickerPlaceholder": "TICKER",
  "scanning": "SCANNING...",
  "notFound": "NOT FOUND",
  "error": "ERROR",
  "upgradeModalTitle": "UNLOCK INSTITUTIONAL RADAR",
  "subscribeStripe": "Subscribe via Stripe",
  "cancelAnytime": "Cancel anytime. 100% secure payment.",
  "upFeature1": "Unrestricted access to BTC, ETH, and SOL Kill Zone Targets.",
  "upFeature2": "Divergence SMS Alerts: Get instant text messages when retail euphoria contradicts institutional selling.",
  "upFeature3": "Custom Altcoin Radar: Unlock liquidation heatmaps for 3 custom altcoins of your choice.",
  "upFeature4": "Live Whale Watch Feed: Real-time ticker of ETF inflows and massive liquidation events.",
  "termsP1Title": "1. Educational Purpose Only: ",
  "termsP1Desc": "The Project ARES dashboard and all provided quantitative data are strictly for educational and research purposes. Project ARES is NOT a registered financial advisor, broker, or investment entity.",
  "termsP2Title": "2. No Financial Advice: ",
  "termsP2Desc": "None of the data, alerts, \"Kill Zones\", \"Market Posture\" states, or synthetic intelligence outputs constitute financial advice, investment recommendations, or an offer to buy/sell any asset.",
  "termsP3Title": "3. Assumption of Risk: ",
  "termsP3Desc": "Cryptocurrency trading is highly speculative and carries a severe risk of total capital loss. By using this tool, you acknowledge that you are trading at your own risk and that you will not hold the developers, creators, or affiliates of Project ARES liable for any financial losses.",
  "termsP4Title": "4. Data Accuracy: ",
  "termsP4Desc": "While Project ARES synthesizes real-time data from various APIs (including Coinglass and Farside), we do not guarantee the accuracy, timeliness, or completeness of the data.",
  "termsP5Title": "5. Pro Subscription: ",
  "termsP5Desc": "The Pro tier is billed monthly at $29/mo via Stripe. You may cancel at any time. Due to the digital nature of the data, all sales are final and non-refundable.",
  "privP1Title": "1. Data Collection: ",
  "privP1Desc": "Project ARES collects minimal data necessary to operate the application. For Pro users, payment processing is handled securely by Stripe; Project ARES does not store or process your credit card information on our servers.",
  "privP2Title": "2. Usage Data: ",
  "privP2Desc": "We may collect anonymized, non-personally identifiable usage data (such as feature interaction rates) to improve the algorithmic synthesis and the user interface.",
  "privP3Title": "3. Local Storage: ",
  "privP3Desc": "The application uses your browser's Local Storage to maintain your session state (such as your Pro status token) and your preferred language settings.",
  "privP4Title": "4. Third-Party Sharing: ",
  "privP4Desc": "We do not sell, rent, or trade your personal information to third parties.",
  "privP5Title": "5. Security: ",
  "privP5Desc": "All API requests are routed through a secured, encrypted backend architecture to protect our AI models and prevent unauthorized data scraping.",
  "methodTitle": "System Methodology",
  "methodIntro": "Project ARES utilizes an advanced machine-learning pipeline to synthesize disparate, high-signal market data streams into actionable quantitative risk profiles.",
  "methodPillar1Title": "1. Institutional Flows",
  "methodPillar1Desc": "Tracks Spot ETF inflows and outflows to gauge raw institutional demand and macroeconomic positioning.",
  "methodPillar2Title": "2. Liquidation Clusters",
  "methodPillar2Desc": "Ingests Coinglass Heatmap data to identify overleveraged zones where forced liquidations act as magnetic price targets.",
  "methodPillar3Title": "3. Retail Sentiment",
  "methodPillar3Desc": "Monitors Fear & Greed indices and broader social sentiment to determine when the retail market is acting as exit liquidity.",
  "methodSynthesisTitle": "The Synthesis Engine",
  "methodSynthesisDesc": "The AI ingests these 3 pillars to calculate the definitive Market Posture (ranging from Aggressive to Danger) and pinpoint exact Kill Zone targets. Trade the math, not the emotion.",
  "fmTabEngine": "The Engine",
  "fmTabKillzone": "The Kill Zone",
  "fmTabRules": "Rules of Engagement",
  "fmRule1Title": "1. Never Trade Unarmed",
  "fmRule1Desc": "Do not enter a position without consulting the Market Posture. If posture is DANGER, capital preservation is priority #1.",
  "fmRule2Title": "2. Use Limit Orders",
  "fmRule2Desc": "Kill Zones are highly volatile. Market buying inside a Kill Zone subjects you to slippage. Pre-place limit orders at the exact targets.",
  "fmRule3Title": "3. Fade the Retail Masses",
  "fmRule3Desc": "If the Divergence Matrix shows 'Retail Euphoria' combined with 'Institutional Selling', you must exit long positions. Do not become exit liquidity.",
  "fmEngineDesc": "The proprietary Project ARES backend scrapes massive institutional data feeds (like Farside Investors and alternative.me) and Coinglass liquidation data. The Gemini 1.5 Pro engine synthesizes these disparate metrics every 45 seconds to generate the dynamic dashboard readouts.",
  "threatHighLabel": "HIGH",
  "threatHighDesc": "Flash crash imminent.",
  "threatElevatedLabel": "ELEVATED",
  "threatElevatedDesc": "Chop probable.",
  "threatStableLabel": "STABLE",
  "threatStableDesc": "Safe to accumulate.",
  "retailBrokerHealth": "Retail Broker Health",
  "fearGreedTitle": "Fear & Greed Index",
  "netEtfFlowTitle": "Net Spot ETF Flow"
};

const targetLanguages = [
  { code: 'ZH', name: 'Mandarin Chinese' },
  { code: 'HI', name: 'Hindi' },
  { code: 'ES', name: 'Spanish' },
  { code: 'FR', name: 'French' },
  { code: 'AR', name: 'Modern Standard Arabic' },
  { code: 'BN', name: 'Bengali' },
  { code: 'RU', name: 'Russian' },
  { code: 'PT', name: 'Portuguese' },
  { code: 'UR', name: 'Urdu' },
  { code: 'VI', name: 'Vietnamese' },
  { code: 'UK', name: 'Ukrainian' },
  { code: 'TL', name: 'Tagalog / Filipino' },
  { code: 'ID', name: 'Indonesian' },
  { code: 'TH', name: 'Thai' },
  { code: 'KO', name: 'Korean' },
  { code: 'JP', name: 'Japanese' },
  { code: 'TR', name: 'Turkish' },
  { code: 'DE', name: 'German' }
];

async function run() {
  const finalOutput = { EN: enTranslations };
  
  const promises = targetLanguages.map(async (lang) => {
    console.log(`Translating to ${lang.name} (${lang.code})...`);
    const prompt = `Translate the following English JSON object into ${lang.name}. 
Ensure trading and crypto terms (like Kill Zones, Spot ETF, Market Maker, Liquidity, Divergence, Exit Liquidity) are translated accurately for native crypto traders in that language. 
Return ONLY a valid JSON object. Do NOT wrap in markdown \`\`\`json blocks.
English JSON:
${JSON.stringify(enTranslations, null, 2)}`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const result = await response.json();
      if (!result.candidates) {
        throw new Error(JSON.stringify(result));
      }
      let text = result.candidates[0].content.parts[0].text.trim();
      if (text.startsWith('\`\`\`json')) text = text.replace(/^\`\`\`json\n?/, '');
      if (text.endsWith('\`\`\`')) text = text.replace(/\n?\`\`\`$/, '');
      
      const parsed = JSON.parse(text);
      finalOutput[lang.code] = parsed;
      console.log(`Success for ${lang.code}!`);
    } catch (error) {
      console.error(`Failed for ${lang.code}:`, error.message || error);
    }
  });

  await Promise.all(promises);
  
  const fileContent = `export const translations = ${JSON.stringify(finalOutput, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, '../frontend/src/contexts/translations.js'), fileContent);
  console.log('Finished writing translations.js');
}

run();
