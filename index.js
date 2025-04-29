const express = require("express");
require('dotenv').config();
const cors = require("cors");

const {connectDB} = require("./db");
const urlRoute = require("./routes/url.js")
const Url = require("./models/Url.js")

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({origin:"*"}));
// app.use(cors({
//   origin: "http://localhost:5173" // or use "*" to allow all origins
// }));

connectDB(process.env.MONGO_URL)
    .then(() => console.log('Mongodb connected'))
    .catch(err=>console.log("mongo error",err))


app.use(express.json());
app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await Url.findOneAndUpdate({
        shortId, 

    }, {
        $push: {
            visitHistory: {
                timestemp: Date.now(),
            }
        }
    }
    );
        res.redirect(entry?.redirectURL);

    
})

app.listen(PORT, () => console.log(`Server start by Port : ${PORT}`));

