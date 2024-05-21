import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import env from "dotenv";
import cors from "cors";
import session from "express-session";
import "./config/passport.js"
import passport from "passport";
import authRouter from "./routes/authRouter.js";
import habitRouter from "./routes/habitRouter.js";
import profileRouter from "./routes/profileRouter.js";
import {scheduledDailyUpdate, scheduledWeeklyUpdate, scheduledMonthlyUpdate} from "./tasks/scheduledInserts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientURL = (process.env.NODE_ENV === "production" ? "http://www.myrutine.com":"http://localhost:3000")

env.config({
    path: '../.env'
})
const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
    origin: clientURL,
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
}))

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

app.use(passport.initialize())
app.use(passport.session())

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../client/build')))

app.use('/auth', authRouter);
app.use('/api/v1', habitRouter);
app.use('/profile', profileRouter);

app.use((req, res, next) => {
    const host = req.hostname
    const herokuDomain = "rutine-238283dd5db6.herokuapp.com"
    const customDomain = "www.myrutine.com"
    console.log(host)
    console.log(req.url)
    if (host == herokuDomain && !req.url.includes('google')) {
        res.redirect(301, `http://${customDomain}${req.url}`)
    }
    next()
});

// After defining your routes, anything that doesn't match what's above, we want to return index.html from our built React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'))
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    scheduledDailyUpdate();
    scheduledWeeklyUpdate();
    scheduledMonthlyUpdate();
    
})