Here's a comprehensive README.md for your GitHub repository:

```markdown
# HOT Wallet Claimer Automator 🔥

![Project Banner](https://i.imgur.com/rymWRp8.png)

A Node.js automation tool for claiming HOT tokens using Playwright. Manages multiple accounts with configurable delays and browser interactions.

## Features ✨
- Multi-account management with individual encrypted tokens
- Automated HOT claiming process
- NEWS checking functionality
- Configurable timeouts and delays
- Progress tracking and status logging
- Browser extension integration
- Responsive UI with colored console outputs

## Prerequisites 📋
- Node.js v18+
- npm/yarn
- Google Chrome
- HOT Wallet Chrome Extension

## Installation 🛠️
1. Clone the repository:
```bash
git clone https://github.com/yourusername/hot-wallet-claimer.git
```
2. Install dependencies:
```bash
npm install
```
3. Place the HOT Wallet extension files in `/hot-wallet-extension`

## Configuration ⚙️

### 1. Environment Setup
Create `.env` file with these configurations:
```ini
IS_BROWSER_VISIBLE = true
OPERATION_TIMEOUT = 15000 
POST_CLAIM_DELAY = 60000 
FINAL_DELAY = 5000 
EVERY_TIME_RUN_DELAY = 300
```

### 2. Account Setup
Edit `data.js` with your accounts:
```javascript
export const accounts = [
    {
        name: 'Main Account',
        encrypted: 'your_encrypted_token_here'
    },
    // Add more accounts...
];
```

## Finding Encrypted Token 🔍
Follow these steps to obtain your encrypted token:

1. Install HOT Wallet Extension
   - Visit Chrome Web Store
   - Install "HOT Wallet" (ID: `mpeengabcnhhjjgleiodimegnkpcenbk`)

2. Import Wallet
   - Open extension popup
   - Go through wallet import/creation process

3. Access DevTools
   - Right-click extension icon ➔ "Inspect popup"
   - Go to Application tab ➔ Local Storage

4. Retrieve Token
   - Look for `encrypted` key in storage
   - Copy its value into `data.js`

![DevTools Example](https://i.imgur.com/vVnQqJp.png)

## Usage 🚀
```bash
npm start
```

Key controls:
- Real-time progress tracking
- Colored status updates
- Automatic delay between runs
- Error handling with retries

## Workflow Overview 🔄
1. Browser initialization with extension
2. Token injection into local storage
3. Storage section navigation
4. NEWS checking automation
5. HOT claiming process
6. Cooldown timer management
7. Automatic restart sequence

## Environment Variables 🌐
| Variable | Default | Description |
|----------|---------|-------------|
| `IS_BROWSER_VISIBLE` | true | Show/hide browser window |
| `OPERATION_TIMEOUT` | 15000 | Maximum wait time for operations (ms) |
| `POST_CLAIM_DELAY` | 60000 | Cooldown after successful claim (ms) |
| `FINAL_DELAY` | 5000 | Cleanup delay before browser close (ms) |
| `EVERY_TIME_RUN_DELAY` | 300 | Delay between complete runs (seconds) |

## Dependencies 📦
- Playwright - Browser automation
- Chalk - Colored console output
- Dotenv - Environment management
- Moment - Time calculations

## Security Notice 🔒
⚠️ **Important Security Recommendations:**
- Never commit actual encrypted tokens
- Use separate accounts for automation
- Store sensitive data in environment variables
- Regularly rotate access credentials

## License 📄
MIT License - Free for educational and personal use. Commercial use prohibited.
```

This README includes:
1. Clear visual hierarchy with emojis
2. Step-by-step setup instructions
3. Detailed encrypted token acquisition guide
4. Configuration reference
5. Security best practices
6. Visual example for DevTools inspection
7. Environment variable explanations
8. Usage instructions

The encrypted token section provides specific instructions with Chrome DevTools guidance, helping users safely obtain their credentials without compromising security.
