import { writeFileSync, existsSync, readFileSync } from 'fs';

export function updateClaimTime(accountName, extractedTime) {
    const filePath = 'account-info.json';
    let accounts = [];

    // Read existing data (if file exists)
    if (existsSync(filePath)) {
        const fileData = readFileSync(filePath, 'utf8');
        accounts = JSON.parse(fileData);
    }

    const now = new Date(); // Get current date and time

    let hours = 0,
        minutes = 0;

    // Extract hours and minutes from extractedTime
    if (extractedTime.includes('h')) {
        hours = parseInt(extractedTime.match(/(\d+)h/)?.[1] || '0', 10);
    }
    if (extractedTime.includes('m')) {
        minutes = parseInt(extractedTime.match(/(\d+)m/)?.[1] || '0', 10);
    }

    // Calculate future time
    now.setHours(now.getHours() + hours);
    now.setMinutes(now.getMinutes() + minutes);

    const futureTime = now.toISOString(); // Convert to string

    // Find the account in the JSON data
    const existingAccount = accounts.find((acc) => acc.name === accountName);

    if (existingAccount) {
        // Update claimTime if account exists
        existingAccount.claimTime = futureTime;
        console.log(`🔄 Updated claim time for ${accountName}`);
    } else {
        // Add new account entry
        accounts.push({ name: accountName, claimTime: futureTime });
        console.log(`➕ Added new account: ${accountName}`);
    }

    // Save updated data back to JSON
    writeFileSync(filePath, JSON.stringify(accounts, null, 2));
    console.log('✅ Account info updated successfully!');
}
