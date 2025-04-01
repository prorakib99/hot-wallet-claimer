import { chromium, devices } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { accounts } from './data.js';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Fix for __dirname in ESM

const isHeadless = !process.env.IS_BROWSER_VISIBLE.includes('true'); // Flag to toggle headless mode

(async () => {
    const pathToExtension = path.join(__dirname, 'hot-wallet-extension');
    const iPhone = devices['iPhone 15'];

    // Loop through the accounts
    for (const account of accounts) {
        console.log(`Processing: ${account.name}`);

        const context = await chromium.launchPersistentContext('', {
            headless: isHeadless,
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
                '--disable-gpu',
                '--no-sandbox'
            ],
            viewport: { width: iPhone.viewport.width, height: iPhone.viewport.height },
            slowMo: isHeadless ? 0 : 3000
        });

        // Open the extension page
        const extensionUrl = 'chrome-extension://mpeengabcnhhjjgleiodimegnkpcenbk/index.html';
        const page = await context.newPage();

        await page.setViewportSize({
            width: iPhone.viewport.width,
            height: iPhone.viewport.height
        });
        await page.goto(extensionUrl, { waitUntil: 'load' });

        // Close all pages that are NOT the extension URL
        for (const p of context.pages()) {
            if (p.url() !== extensionUrl) {
                await p.close();
            }
        }

        // Hide the video element
        await page.locator('video').evaluate((video) => {
            video.style.zIndex = '-9999'; // Set z-index using inline CSS
        });

        // Set encrypted token in chrome.storage.local for the current account
        await page.evaluate((encryptedToken) => {
            chrome.storage.local.set({ encrypted: encryptedToken });
        }, account.encrypted);

        await page.reload();

        // Click on "Storage"
        await page.locator('h4:has-text("Storage")').click();

        const checkNewsButton = await page.locator('button:has-text("Check NEWS")');
        const isCheckNewsButtonVisible = await checkNewsButton.isVisible();
        const isCheckNewsButtonDisabled = await checkNewsButton.isDisabled();

        if (isCheckNewsButtonVisible && !isCheckNewsButtonDisabled) {
            await checkNewsButton.click();
            console.log('Clicked: Check NEWS');
            const extensionUrl = 'chrome-extension://mpeengabcnhhjjgleiodimegnkpcenbk/hot';
            for (const p of context.pages()) {
                if (p.url() !== extensionUrl) {
                    await p.close();
                }
            }
        }

        const claimHotButton = await page.locator('button:has-text("Claim HOT")');
        const isClaimHotButtonVisible = await claimHotButton.isVisible();
        const isClaimHotButtonDisabled = await claimHotButton.isDisabled();

        if (isClaimHotButtonVisible && !isClaimHotButtonDisabled) {
            await claimHotButton.click();
            console.log('Clicked: Claim HOT');
            await page.waitForTimeout(60000);
        }

        // Close context after each account is processed
        await context.close();
    }
})();
