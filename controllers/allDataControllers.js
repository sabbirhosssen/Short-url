const Url = require("../models/Url.js"); 

const handleGetAnalyticsAllLikes= async (req, res)=> {
   
    try {
        const getData = await Url.find();
        
        
        res.status(200).send({ Success: true, message: 'get All data', data: getData });
    } catch (err) {
        console.error("Error in /alldata:", err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    handleGetAnalyticsAllLikes,
}