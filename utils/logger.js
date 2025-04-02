import chalk from 'chalk';
import CliTable3 from 'cli-table3';
import gradient from 'gradient-string';

// Configure table styling
const tableConfig = {
    chars: {
        top: '═',
        'top-mid': '╤',
        'top-left': '╔',
        'top-right': '╗',
        bottom: '═',
        'bottom-mid': '╧',
        'bottom-left': '╚',
        'bottom-right': '╝',
        left: '║',
        'left-mid': '╟',
        mid: '─',
        'mid-mid': '┼',
        right: '║',
        'right-mid': '╢',
        middle: '│'
    },
    style: {
        head: ['blueBright'],
        border: ['gray']
    }
};

// Theme configuration
const theme = {
    success: chalk.greenBright.bold,
    warning: chalk.yellowBright,
    error: chalk.redBright.bold,
    info: chalk.cyan,
    highlight: gradient('#00B4D8', '#0077B6'),
    timestamp: chalk.gray
};

// State management
let currentAccount = null;
let isAccountCompleted = false;
let processedAccounts = 0;
let totalAccounts = 0;
let currentStatus = 'Initializing...';
const accountLogs = [];

const createTable = () => new CliTable3(tableConfig);

export const log = (accountName = '', message, type = 'info') => {
    const timestamp = theme.timestamp(`${new Date().toLocaleTimeString()}`);
    const formattedAccount = theme.highlight(accountName.padEnd(10));

    const messageStyles = {
        success: `✅ ${theme.success(message)}`,
        warning: `⚠️  ${theme.warning(message)}`,
        error: `❌ ${theme.error(message)}`,
        info: `ℹ️  ${theme.info(message)}`
    };

    const logEntry = [timestamp, formattedAccount, messageStyles[type] || message];

    // Account transition logic
    if (currentAccount !== accountName) {
        if (currentAccount && !isAccountCompleted) {
            logError(currentAccount, 'Account interrupted by new request', 'error');
        }
        currentAccount = accountName;
        isAccountCompleted = false;
        accountLogs.length = 0;
    }

    // Track completion state
    if (type === 'success' && message.includes('completed')) {
        isAccountCompleted = true;
        processedAccounts++;
    }

    accountLogs.push(logEntry);
    renderInterface();
};

const renderInterface = () => {
    const table = createTable();
    accountLogs.slice(-10).forEach((entry) => table.push(entry));

    console.clear();

    // Render header
    console.log(theme.highlight('\n╔══════════════════════════════════════════════════╗'));
    console.log(theme.highlight(' 🔥 HOT WALLET CLAIMER v1.0 - MADE BY SEVEN BUILDER  '));
    console.log(theme.highlight('╚══════════════════════════════════════════════════╝'));

    // Render main content
    console.log(table.toString());

    // Render footer
    console.log(theme.info(`\n🔄 Current Status: ${currentStatus}`));
    console.log(
        theme.highlight(
            `📊 Progress: ${Math.min(
                processedAccounts,
                totalAccounts
            )}/${totalAccounts} accounts processed`
        )
    );
    console.log(theme.timestamp(`Last update: ${new Date().toLocaleTimeString()}\n`));
};

// Additional logging methods
export const logSuccess = (account, message) => log(account, message, 'success');
export const logWarning = (account, message) => log(account, message, 'warning');
export const logError = (account, message) => log(account, message, 'error');

// Progress management
export const updateProgress = (current, total) => {
    processedAccounts = current;
    totalAccounts = total;
};

// Status management
export const updateStatus = (newStatus) => {
    currentStatus = newStatus;
    renderInterface();
};
