import { chromium, devices } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { accounts } from './data.js';
import chalk from 'chalk';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Fix for __dirname in ESM
const isHeadless = process.env.IS_BROWSER_VISIBLE !== 'true'; // Toggle headless mode
const executablePath = chromium.executablePath();

const log = (accountName = '', message) => {
    const timestamp = chalk.gray(`[${new Date().toLocaleTimeString()}]`);
    console.log(`${timestamp} [${chalk.green(accountName)}] ${chalk.gray(message)}`);
};

(async () => {
    console.log('🔥 Starting Hot Wallet Claimer...');

    const pathToExtension = path.join(__dirname, 'hot-wallet-extension');
    const iPhone = devices['iPhone 15'];

    const width = iPhone.viewport.width;
    const height = iPhone.viewport.height;

    for (const account of accounts) {
        console.log(
            chalk.green(
                `\n--------------------[Account: ${chalk.green.bold(
                    account.name
                )}]--------------------`
            )
        );

        log(account.name, `🔄 Processing account...`);

        const context = await chromium.launchPersistentContext('', {
            headless: isHeadless,
            executablePath,
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
                '--disable-gpu',
                '--no-sandbox'
            ],
            viewport: { width, height },
            slowMo: 3000
        });

        const extensionUrl = 'chrome-extension://mpeengabcnhhjjgleiodimegnkpcenbk/index.html';
        const page = await context.newPage();

        log(account.name, `🌍 Navigating to extension page...`);
        try {
            await page.goto(extensionUrl, { waitUntil: 'load' });
            log(account.name, `✅ Extension loaded successfully!`);
        } catch (error) {
            log(account.name, `❌ Failed to load extension: ${error.message}`);
            await context.close();
            continue; // Move to the next account
        }

        // Close all other pages except the extension
        for (const p of context.pages()) {
            if (p.url() !== extensionUrl) {
                await p.close();
            }
        }

        // Hide the video element (if present)
        await page.locator('video').evaluate((video) => {
            video.style.zIndex = '-9999';
        });

        // Store encrypted token
        await page.evaluate((encryptedToken) => {
            chrome.storage.local.set({ encrypted: encryptedToken });
        }, account.encrypted);
        log(account.name, `🔐 Token stored successfully`);

        await page.reload();
        log(account.name, '🔄 Page reloaded after setting token.');

        // Click "Storage"
        await page.waitForSelector('h4:has-text("Storage")', { timeout: 15000 });
        await page.locator('h4:has-text("Storage")').click();
        log(account.name, `📂 Accessing Storage section`);

        // Check and click "Check NEWS"
        await page.waitForSelector('button:has-text("Check NEWS")', { timeout: 15000 });
        const checkNewsButton = await page.locator('button:has-text("Check NEWS")');
        const isCheckNewsButtonVisible = await checkNewsButton.isVisible();
        const isCheckNewsButtonDisabled = await checkNewsButton.isDisabled();

        if (isCheckNewsButtonVisible && !isCheckNewsButtonDisabled) {
            await checkNewsButton.click();
            log(account.name, '📢 Clicked: Check NEWS!');
        } else {
            log(account.name, '⚠ "Check NEWS" button is unavailable.');
        }

        // Check and click "Claim HOT"
        await page.waitForSelector('button:has-text("Claim HOT")', { timeout: 15000 });
        const claimHotButton = await page.locator('button:has-text("Claim HOT")');
        const isClaimHotButtonVisible = await claimHotButton.isVisible();
        const isClaimHotButtonDisabled = await claimHotButton.isDisabled();

        if (isClaimHotButtonVisible && !isClaimHotButtonDisabled) {
            await claimHotButton.click();
            log(account.name, '🔥 HOT Token claimed successfully!');
            await page.waitForTimeout(60000);
        } else {
            log(account.name, '⚠ "Claim HOT" button is not active.');
        }

        // Close browser context for this account
        await context.close();
        log(account.name, `✅ Account processing complete!`);
    }

    console.log(chalk.green('\n----------🎉 All accounts processed successfully! 🎉----------'));
})();
