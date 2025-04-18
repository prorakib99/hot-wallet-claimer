import { chromium, devices } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { accounts } from './data.js';
import chalk from 'chalk';
import { getClaimTime, updateClaimTime } from './utils/activity.js';
import {
    log,
    logError,
    logSuccess,
    logWarning,
    updateProgress,
    updateStatus
} from './utils/logger.js';

// Configure environment variables
dotenv.config();

// Constants
const EXTENSION_ID = 'mpeengabcnhhjjgleiodimegnkpcenbk';
const EXTENSION_PATH = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'hot-wallet-extension'
);
const DEVICE_PROFILE = devices['iPhone 15'];
const EXTENSION_URL = `chrome-extension://${EXTENSION_ID}/index.html`;
const OPERATION_TIMEOUT = parseInt(process.env.OPERATION_TIMEOUT) || 15000;
const POST_CLAIM_DELAY = parseInt(process.env.POST_CLAIM_DELAY) || 30000;
const FINAL_DELAY = parseInt(process.env.FINAL_DELAY) || 5000;
const EVERY_TIME_RUN_DELAY = parseInt(process.env.EVERY_TIME_RUN_DELAY) || 300;

// Browser configuration
const browserConfig = {
    headless: process.env.IS_BROWSER_VISIBLE !== 'true',
    executablePath: chromium.executablePath(),
    args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
        '--disable-gpu',
        '--no-sandbox'
    ],
    viewport: DEVICE_PROFILE.viewport,
    slowMo: 3000
};

// Selectors
const SELECTORS = {
    STORAGE_SECTION: 'h4:has-text("Storage")',
    CHECK_NEWS_BUTTON: 'button:has-text("Check NEWS")',
    CLAIM_HOT_BUTTON: 'button:has-text("Claim HOT")',
    CONTINUE_BUTTON: 'button:has-text("Continue with HOT")',
    TIMER_TEXT: 'p:has-text("to fill")'
};

async function initializeBrowserContext() {
    return await chromium.launchPersistentContext('', browserConfig);
}

async function handleExtensionSetup(page, account) {
    try {
        await page.goto(EXTENSION_URL, { waitUntil: 'load' });
        logSuccess(account.name, 'Extension loaded successfully!');

        // Close any non-extension pages
        for (const p of page.context().pages()) {
            if (p.url() !== EXTENSION_URL) await p.close();
        }

        // Hide video element if present
        await page.locator('video').evaluate((video) => {
            video.style.zIndex = '-9999';
        });

        return true;
    } catch (error) {
        logError(account.name, `Extension setup failed: ${error.message}`);
        return false;
    }
}

async function processAccount(account, index) {
    updateProgress(index + 1, accounts.length);
    updateStatus('Starting operations');

    const claimTime = getClaimTime(account.name);
    if (claimTime && new Date() < new Date(claimTime)) {
        logWarning(account.name, 'Skipping account - claim time not reached');
        return;
    }

    const context = await initializeBrowserContext();
    const page = await context.newPage();

    try {
        if (!(await handleExtensionSetup(page, account))) return;

        // Store encrypted token
        await page.evaluate((encryptedToken) => {
            chrome.storage.local.set({ encrypted: encryptedToken });
        }, account.encrypted);
        log(account.name, '🔐 Token stored successfully');

        await page.reload();
        log(account.name, 'Reloaded after setting token');

        await page.locator('button:has-text("Missions")').click();
        const claimFiveHotButton = page.locator('button:has-text("Claim")');

        await page.waitForSelector('button:has-text("Claim")', { timeout: 30000 });

        if ((await claimFiveHotButton.isVisible()) && !(await claimFiveHotButton.isDisabled())) {
            await claimFiveHotButton.click();
            await page.waitForTimeout(POST_CLAIM_DELAY);
            await page.locator('button:has-text("Continue")').click();
        }

        await page.goto(EXTENSION_URL, { waitUntil: 'load' });

        // Access Storage section
        await page.waitForSelector(SELECTORS.STORAGE_SECTION, { timeout: OPERATION_TIMEOUT });
        await page.locator(SELECTORS.STORAGE_SECTION).click();
        log(account.name, '📂 Accessed Storage section');

        // Check NEWS functionality
        await handleButtonInteraction(page, account, SELECTORS.CHECK_NEWS_BUTTON, 'Check NEWS');

        // Claim HOT functionality
        await handleClaimProcess(page, account);

        // Update claim time
        const timeElement = await page.locator(SELECTORS.TIMER_TEXT).textContent();
        const extractedTime = timeElement.match(/(\d+h \d+m)/)?.[0];
        updateClaimTime(account.name, extractedTime);
    } catch (error) {
        logError(account.name, `Processing failed: ${error.message}`);
    } finally {
        await page.waitForTimeout(FINAL_DELAY);
        await context.close();
    }
}

async function handleButtonInteraction(page, account, selector, actionName) {
    const button = page.locator(selector);
    const isVisible = await button.isVisible();
    const isDisabled = await button.isDisabled();

    if (isVisible && !isDisabled) {
        await button.click();
        logSuccess(account.name, `Clicked: ${actionName}!`);

        if (actionName === 'Check NEWS') {
            await page.waitForTimeout(2000);
            // Close any non-extension pages
            const EXTENSION_URL = `chrome-extension://${EXTENSION_ID}/hot`;
            for (const p of page.context().pages()) {
                if (p.url() !== EXTENSION_URL) await p.close();
            }
        }
        return true;
    }

    logWarning(account.name, `${actionName} button unavailable`);
    return false;
}

async function handleClaimProcess(page, account) {
    if (await handleButtonInteraction(page, account, SELECTORS.CLAIM_HOT_BUTTON, 'Claim HOT')) {
        const continueButton = page.locator(SELECTORS.CONTINUE_BUTTON);
        if ((await continueButton.isVisible()) && !(await continueButton.isDisabled())) {
            await continueButton.click();
        }
        logSuccess(account.name, '🔥 Claim process completed');
        await page.waitForTimeout(POST_CLAIM_DELAY);
    }
}

async function main() {
    while (true) {
        try {
            for (const [index, account] of accounts.entries()) {
                await processAccount(account, index);
            }
            updateStatus('Completed');
            console.log(
                chalk.green('\n----------🎉 All accounts processed successfully! 🎉----------')
            );
        } catch (error) {
            logError('Global', `Fatal error: ${error.message}`);
        }
        console.log('\n');
        for (let i = EVERY_TIME_RUN_DELAY; i > 0; i--) {
            process.stdout.write(
                chalk.green(`\rNext run in: ⏳ ${chalk.red.bold(i)}s remaining... `)
            ); // Keep the label intact
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        console.log('\nStarting next run...\n'); // Move to a new line after countdown
    }
}

main();
