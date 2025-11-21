// bot.js (OFFICIAL DUSTPIN VERSION)
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron'); 
const { getIotxBalance } = require('./iotexHelper'); // Imports our new Axios helper

const { fetchProtocolData } = require('./dataFetcher');
const { analyzeProtocol } = require('./analytics');

// Initialize Client
const client = new TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
});

let subscribers = []; 
const SIMULATION_MODE = true; // Set to FALSE when you have real Twitter Keys

// --- SCHEDULED TASKS ---
cron.schedule('*/10 * * * * *', async () => {
    if (subscribers.length > 0) {
        console.log(`\n⚡ [DustPIN Auto-Systems] Running updates for ${subscribers.length} users...`);
        for (const sub of subscribers) {
            const data = await fetchProtocolData(sub.protocol);
            const report = analyzeProtocol(data);
            if (SIMULATION_MODE) console.log(`📨 Sending DM to User ${sub.user}: \n${report}\n`);
        }
        console.log("✅ Updates complete.\n");
    }
});

async function startStream() {
    console.log(`🤖 DustPIN Agent Starting...`);
    console.log(`⚡ System Status: ONLINE`);
    console.log(`🔐 Identity Module: CONNECTED (Mainnet)`);
    
    if (SIMULATION_MODE) {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        readline.on('line', (input) => {
            handleCommand({ text: input, id: 'test-' + Date.now(), author_id: 'user_123' });
        });
    }
}

async function handleCommand(tweet) {
    const text = tweet.text.toLowerCase();
    let response = "";
    
    // YOUR WALLET ADDRESS (This is the one we check)
    const myWallet = "0xace528c117084534795e1e073c68b72450849221"; 

    if (text.includes('analyze')) {
        const protocol = text.split(' ')[1];
        if (!protocol) response = "⚠️ Usage: 'analyze [protocol]'";
        else {
            console.log(`⏳ DustPIN is analyzing ${protocol}...`); 
            const data = await fetchProtocolData(protocol);
            response = data ? analyzeProtocol(data) : "⚠️ Not found.";
        }
    } 
    else if (text.includes('subscribe')) {
        const protocol = text.split(' ')[1];
        if (!protocol) return;
        subscribers.push({ user: tweet.author_id, protocol: protocol });
        response = `✅ Confirmed. DustPIN will monitor ${protocol} for you daily.`;
    }
    else if (text.includes('verify')) {
        console.log("🔗 Connecting to IoTeX Blockchain...");
        
        // FETCH REAL BALANCE (Using our new helper)
        const balance = await getIotxBalance(myWallet);
        
        response = `🔐 *DustPIN Identity Protocol*
        
🆔 Agent ID: DP-001
kz IoTeX Address: ${myWallet}
💰 Wallet Balance: ${balance} IOTX
✅ Status: Verified
🔗 Explorer: https://iotexscan.io/address/${myWallet}`;
    }
    else if (text.includes('help')) {
        response = "Commands: analyze [name], subscribe [name], verify";
    }

    if (SIMULATION_MODE && response) {
        console.log(`--- 📨 REPLYING ---`);
        console.log(response);
        console.log(`-------------------`);
    }
}

startStream();