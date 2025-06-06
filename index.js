const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const {connectToMongoDb} = require('./connection');
const {restrictToLoggedInUserOnly , checkAuth} = require('./middleware/auth');

const URL = require('./models/url');


const urlRoute = require('./routes/url');

const staticRouter = require('./routes/staticRouter'); 

const userRoute = require('./routes/user');



const app = express();
const PORT = 8001 ;

connectToMongoDb('mongodb://localhost:27017/short-url')
.then(() => console.log('MongoDb connected'));

app.set("view engine" , 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


app.use("/url", restrictToLoggedInUserOnly , urlRoute);
app.use('/user', userRoute);
app.use("/", checkAuth , staticRouter);



app.get('/url/:shortId' ,async (req , res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },
    {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    }
    );
    res.redirect(entry.redirectUrl);
})

app.listen(PORT , ()=> console.log(`Server started at Port: ${PORT}`));