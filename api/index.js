// Vercel Serverless Function entrypoint
module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({
        status: "online",
        system: "NEXORA AI Cognitive Core",
        version: "4.8",
        uptime: "99.998%",
        timestamp: new Date().toISOString()
    }));
};
