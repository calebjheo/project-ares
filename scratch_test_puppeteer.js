const puppeteer = require('puppeteer');

async function testScrape(ticker) {
    console.log(`[+] Initiating scrape for ${ticker}...`);
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    const url = `https://www.coinglass.com/pro/futures/LiquidationHeatMap?symbol=${ticker}`;
    console.log(`[+] Navigating to: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await page.screenshot({ path: 'screenshot.png' });
    console.log(`[+] Screenshot saved to screenshot.png`);
    await browser.close();
}

testScrape('AVAX');
