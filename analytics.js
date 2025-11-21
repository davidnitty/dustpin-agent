// analytics.js (PHASE 2 VERSION)

// Helper to make big numbers readable
const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

// NEW: Risk Tier Logic
const calculateRiskTier = (coverage, growth) => {
    if (coverage > 0.80 && growth > 0.05) return "🟢 LOW RISK (Proven & Growing)";
    if (coverage < 0.50) return "🔴 HIGH RISK (Low Verification)";
    return "🟡 MEDIUM RISK (Watch Carefully)";
};

const calculateTrustScore = (p) => {
    const scoreCoverage = p.proofCoverage * 40;
    const scoreUptime = p.avgUptime * 30;
    const scoreGrowth = Math.min(p.monthlyGrowth * 1000, 20);
    const scoreDevices = Math.min(p.deviceCount / 10000, 10);

    const totalScore = scoreCoverage + scoreUptime + scoreGrowth + scoreDevices;
    
    let summary = "";
    if (totalScore > 80) summary = "Institutional Grade. High verification coverage meets consistent uptime.";
    else if (totalScore > 50) summary = "Developing Protocol. Promising tech but needs more scale.";
    else summary = "Early Stage. High risk, proceed with caution.";

    return {
        total: totalScore.toFixed(1),
        risk: calculateRiskTier(p.proofCoverage, p.monthlyGrowth),
        summary: summary,
        breakdown: { coverage: scoreCoverage, uptime: scoreUptime, growth: scoreGrowth, devices: scoreDevices }
    };
};

// Updated Export function
const analyzeProtocol = (data) => {
    const trust = calculateTrustScore(data);

    return `📊 *DustPIN Live Analysis: ${data.name}*
    
🛡️ Score: ${trust.total}/100
⚠️ Risk: ${trust.risk}
📡 Devices: ${formatNumber(data.deviceCount)} (Active)

📝 *DustPIN's Take:*
"${trust.summary}"

-- Metrics --
Proofs: ${trust.breakdown.coverage.toFixed(1)}/40
Growth: ${trust.breakdown.growth.toFixed(1)}/20`;
};

module.exports = { analyzeProtocol };