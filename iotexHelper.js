// iotexHelper.js
const axios = require('axios');

async function getIotxBalance(address) {
    try {
        // We use the Babel API (Standard Web3 Endpoint)
        const url = "https://babel-api.mainnet.iotex.io";
        
        // Convert to 0x address if user forgot (Simple check)
        // Note: This logic assumes you provided the correct 0x address in bot.js
        if (address.startsWith('io1')) {
            console.log("⚠️ Warning: babel-api requires a '0x' address. Please update bot.js!");
            return "Address-Error";
        }

        const response = await axios.post(url, {
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [address, "latest"], // Standard Ethereum format
            id: 1
        });

        if (response.data.result) {
            // The result is in Hexadecimal (e.g., 0x23a...)
            // We convert Hex to Decimal, then divide by 10^18
            const balanceInWei = BigInt(response.data.result);
            const balanceInIotx = Number(balanceInWei) / 1e18;
            return balanceInIotx.toFixed(2);
        } else {
            console.log("API Error:", response.data);
            return "0.00";
        }
    } catch (e) {
        console.error("⚠️ Blockchain Connection Error:", e.message);
        return "Net-Error";
    }
}

module.exports = { getIotxBalance };