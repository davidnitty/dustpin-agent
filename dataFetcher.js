// dataFetcher.js
const axios = require('axios');

// This is a "Cache" (The Fridge)
// We check here first before ordering new food (calling the API)
let cache = {
    geodnet: null,
    dimo: null,
    nubila: null
};

// SIMULATION MODE: set to true until you get your API Key
const SIMULATION_MODE = true;

async function fetchProtocolData(protocol) {
    const key = protocol.toLowerCase();
    
    // 1. Check the Fridge (Cache)
    if (cache[key] && (Date.now() - cache[key].timestamp < 300000)) { // 5 mins
        console.log(`🧊 Serving ${key} from cache...`);
        return cache[key].data;
    }

    console.log(`📡 Fetching fresh data for ${key}...`);

    let newData;

    if (SIMULATION_MODE) {
        // --- FAKE INTERNET CALL (Simulates waiting 1 second) ---
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return slightly randomized data so you see it change!
        newData = {
            name: key.toUpperCase(),
            // Randomize device count slightly to show "live" movement
            deviceCount: Math.floor(Math.random() * 5000) + 2000, 
            tvl: 1500000,
            monthlyGrowth: 0.15,
            proofCoverage: 0.92,
            avgUptime: 0.98
        };
    } else {
        // --- REAL INTERNET CALL (Uncomment when you have Key) ---
        // const url = `https://api.depinscan.io/protocols/${key}`;
        // const response = await axios.get(url, { headers: { 'Authorization': process.env.DEPIN_KEY } });
        // newData = response.data;
    }

    // 2. Put leftovers in the Fridge (Save to Cache)
    cache[key] = {
        data: newData,
        timestamp: Date.now()
    };

    return newData;
}

module.exports = { fetchProtocolData };