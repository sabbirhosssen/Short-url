const shortid = require("shortid");
const Url = require("../models/Url.js");  


async function handleGeneratedNewShortUrl(req, res) {
    const body = req.body;
    if (!body.url) return res.status(500).json({ error: 'url id required ' });
    const shortID = shortid();
     try {
        const newUrl = new Url({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
        });

        await newUrl.save();  // Save the document to MongoDB
        return res.json({ id: shortID });
    } catch (error) {
        console.error("Error saving URL:", error);
        return res.status(500).json({ error: 'Failed to create short URL' });
    }
    // await URL.create({
    //     shortId: shortID,
    //     redirectURL: body.url,
    //     visitHistory: [],
        
    // })
    // return res.json({id:shortID})

};

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;

    const result = await Url.findOne({ shortId });

    return res.json({totalClicks:result.visitHistory.length, analytics: result.visitHistory,})
    
}

module.exports = {
    handleGeneratedNewShortUrl,
    handleGetAnalytics,
} 