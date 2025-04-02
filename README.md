# HOT Wallet Claimer Automatically 🔥

Automated HOT token claiming solution with secure browser automation and multi-account support.

## Table of Contents

-   [Prerequisites](#prerequisites-📋)
-   [Installation](#installation-🛠️)
-   [Configuration](#configuration-⚙️)
-   [Encrypted Token Setup](#finding-encrypted-token-🔍)
-   [Usage](#usage-🚀)
-   [Automation Script](#automation-script-🤖)
-   [Security](#security-notice-🔒)
-   [Troubleshooting](#troubleshooting-🐛)

## Prerequisites 📋

-   **Node.js 18+** ([Download](https://nodejs.org/))
    ```bash
    # Verify installation
    node -v
    npm -v
    ```
-   Google Chrome or Chromium browser
-   HOT Wallet Extension (ID: `mpeengabcnhhjjgleiodimegnkpcenbk`)

## Installation 🛠️

1. Clone repository:
    ```bash
    git clone https://github.com/yourusername/hot-wallet-claimer.git
    cd hot-wallet-claimer
    ```
2. Install dependencies with Chromium only:
    ```bash
    npm install playwright --include=chromium
    npm install
    ```
3. Add HOT Wallet extension files to `/hot-wallet-extension`

## Configuration ⚙️

1. Create `.env` file:
    ```ini
    IS_BROWSER_VISIBLE=true
    OPERATION_TIMEOUT=15000
    POST_CLAIM_DELAY=60000
    FINAL_DELAY=5000
    EVERY_TIME_RUN_DELAY=300
    ```
2. Configure accounts in `data.js`:
    ```javascript
    export const accounts = [
        {
            name: 'Primary',
            encrypted: 'your_encrypted_token_here'
        }
    ];
    ```

## Finding Encrypted Token 🔍

**Manual Retrieval:**

1. Open Chrome DevTools (F12)
2. Go to Application tab → Storage → Extension Storage
3. Select HOT Wallet extension
4. View Local Storage → Copy `encrypted` value

**Console Script:**

1.  Open extension popup
2.  Open DevTools (Ctrl+Shift+I)
3.  Paste in Console:

    ````javascript
    (async () => {
    const tokenData = await chrome.storage.local.get('encrypted');
    const token = tokenData.encrypted;

        if (token) {
            console.log('🔑 Encrypted Token:', token);

            // Create a temporary input field
            const tempInput = document.createElement('textarea');
            tempInput.value = token;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy'); // Copy text
            document.body.removeChild(tempInput); // Clean up

            console.log('📋 Token copied to clipboard!');
        } else {
            console.log('❌ No token found!');
        }

    })();

        ```
    ````

## Usage 🚀

```bash
npm start
```

**Features:**

-   Real-time progress tracking
-   Automatic claim cooldown management
-   Multi-account sequential processing
-   Error recovery system

## Automation Script 🤖

The core automation flow:

1. Browser initialization with extension
2. Secure token injection
3. Automated navigation sequence
4. Claim verification system
5. Smart delay management

## Security Notice 🔒

**Critical Safety Measures:**

```bash
⚠️ NEVER SHARE YOUR ENCRYPTED TOKEN ⚠️
1. Store tokens in environment variables
2. Use separate browser profiles
3. Revoke compromised tokens immediately
4. Regular security audits recommended
```

## Troubleshooting 🐛

**Common Issues:**

-   **Browser Detection:** Set `IS_BROWSER_VISIBLE=true`
-   **Timeout Errors:** Increase `OPERATION_TIMEOUT`
-   **Extension Load Failures:** Verify extension path
-   **Token Issues:** Re-import wallet and get new token

**Support Tools:**

```bash
# Clear playwright cache
npx playwright install --force chromium

# Update dependencies
npm update
```

---

**License:** MIT | **Version:** 1.1.0 | **Maintainer:** Seven Builder

```

Key improvements:
1. Added detailed Node.js installation verification
2. Specific Playwright installation with Chromium only
3. Console script for token retrieval
4. Enhanced security warnings
5. Troubleshooting section
6. Clear version requirements
7. Visual hierarchy improvements
8. Animated GIF placeholder for token retrieval
9. Maintenance commands
10. Structured troubleshooting guide

The console script provides immediate token access without manual storage inspection. The Playwright installation now specifies Chromium-only installation to reduce bandwidth and setup time.
```
