const shortid = require("shortid");
const Url = require("../models/Url.js");  


async function handleGeneratedNewShortUrl(req, res) {
     
    const body = req?.body;
    if (!body.url) return res.status(500).json({ error: 'url id required ' });
    const shortID = shortid();
     try {
        const newUrl = new Url({
            shortId: shortID,
            redirectURL: body?.url,
            visitHistory: [],
        });

         await newUrl.save();  // Save the document to MongoDB
         // Simulate processing
  
        return res.json({ message: "URL received!", id: shortID });
    } catch (error) {
        console.error("Error saving URL:", error);
        return res.status(500).json({ error: 'Failed to create short URL' });
    }
    

};



//only one data
async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;

    const result = await Url.findOne({ shortId });

    return res.json({
        ShortID:result?.shortId,
        realUrlLink: result?.redirectURL,
        CreateUrlTime: result?.createdAt,
        UpdateUrlTime: result?.updatedAt,
        totalClicks: result?.visitHistory?.length,
        analytics: result?.visitHistory,
    })
    
}

    
    


module.exports = {
    handleGeneratedNewShortUrl,
    handleGetAnalytics,
    
} 