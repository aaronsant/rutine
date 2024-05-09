import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import cors from "cors";
import Pool from './config/config.js';
import cron from 'node-cron';
import bcrypt from 'bcrypt';
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2" 

env.config()
const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))
const saltRounds = 10;

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

//Add progress entries automatically ----> cron schedule format 'min hr dayOfMonth month dayOfWeek '
cron.schedule('0 0 * * *', async () => {
    insertHabitsOnTime('Daily');
})

cron.schedule('0 0 * * Sunday', async () => {
    insertHabitsOnTime('Weekly');
})

cron.schedule('0 0 1 * *', async () => {
    insertHabitsOnTime('Monthly');
})

async function insertHabitsOnTime(group) {
    try {
        //Grab active habits
        const result = await Pool.query("SELECT habit_id FROM habit_details WHERE habit_group = $1 AND active = true",
        [group]); 
        // format habit_ids as an array
        const activeHabits = result.rows.map((habit) => {
            return [habit.habit_id, habit.habit_name]
        });
        //format database query to insert row for each active habit, defaults fill rest
        const query = {
            text: "INSERT INTO habit_progress (habit_id, habit_name) VALUES $1",
            values: [activeHabits],
        }; 
        Pool.query(query)
    } catch (error) {
        console.log(`Error inserting ${group} progress data`)
    }
}

app.get("/test", async(req, res) => {
    const user_id = 1;
    const group = 'Daily'
    const result = await Pool.query("SELECT habit_id FROM habit_details WHERE habit_group = $1 AND active = true AND user_id = $2",
    [group, user_id])
    console.log(result.rows[0]['habit_id'])
    res.json({message: "Message from server"})
})

app.get("/habits", async (req,res) => {
    let userID = 1;
    try {
        const result = await Pool.query("SELECT * FROM habit_details WHERE user_id = $1;", [userID]);
        const data = result.rows;
        res.json(data);
    } catch (error) {
        console.log("Error retrieving habit data from database")
    }
})

app.post("/fillHabits", async (req, res) => {
    const today = new Date();
    let lastDate = "";
    try {
        const result = await Pool.query("SELECT date FROM habit_progress ORDER BY date DESC LIMIT 1");
        lastDate = result.rows[0].date
        res.status(200).json({message: "Success filling habits"})
    } catch (err) {
        console.log("Error filling habits")
    }
    
    let activeHabits = [];
    try {
        const result2 = await Pool.query("SELECT habit_id, habit_group, habit_name FROM habit_details WHERE active=true")
        //console.log(result2.rows)
        activeHabits = result2.rows  
    } catch (error) {
        console.log("Error getting active habits")
    }
    let currDate = new Date(lastDate);
    currDate.setDate(currDate.getDate() + 1)
    while (currDate <= today) {
        console.log(currDate)
        for (const habit of activeHabits) {
            if (habit['habit_group'] == 'Daily') {
                await Pool.query("INSERT INTO habit_progress (habit_id, habit_name, date) VALUES ($1, $2, $3)", 
                [habit['habit_id'], habit['habit_name'], currDate])
            } else if (habit['habit_group'] == 'Weekly' && currDate.getDay() == 1){
                await Pool.query("INSERT INTO habit_progress (habit_id, habit_name, date) VALUES ($1, $2, $3)", 
                [habit['habit_id'], habit['habit_name'], currDate])
            } else if (habit['habit_group'] == 'Monthly' && currDate.getDate() == 1) {
                await Pool.query("INSERT INTO habit_progress (habit_id, habit_name, date) VALUES ($1, $2, $3)", 
                [habit['habit_id'], habit['habit_name'], currDate])
            }
        }
        currDate.setDate(currDate.getDate() + 1)
    }

})

app.get("/allhabits", async (req, res) => {
    try {
        const userID = req.user.user_id;
        try {
            const result = await Pool.query("SELECT habit_progress.progress_id, habit_progress.date, habit_details.habit_id, habit_details.habit_group, habit_progress.habit_name, habit_progress.completed, habit_details.display_order FROM habit_progress INNER JOIN habit_details ON habit_progress.habit_id=habit_details.habit_id WHERE habit_details.user_id = $1;",
            [userID]);
            const data = result.rows;
            res.json(data);
        } catch (error) {
            console.log("Error retrieving habit data from database")
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENITCATED")
    }

})

app.post("/addhabit", async (req, res) => {
    const { habitName, habitGroup} = req.body
    console.log(`name: ${habitName}, group: ${habitGroup}`)
    try {
        const userID = req.user.user_id
        try {
            //GET THE DISPLAY ORDER NUMBERS OF PREVIOUS HABIT, SET NEXT DISPLAY NUMBER
            const displayOrderArr = await Pool.query("SELECT (display_order) FROM habit_details WHERE habit_group=$1 AND user_id=$2",
            [habitGroup, userID])
            const nextDisplayOrder = Math.max(...[ 0,...displayOrderArr.rows.map((habit) => habit.display_order)]) + 1
            console.log(nextDisplayOrder)
            //INSERT NEW HABIT WITH DISPLAY NUMBER INTO HABIT_DETAILS
            const result = await Pool.query("INSERT INTO habit_details (user_id, habit_group, habit_name, display_order) VALUES ($1, $2, $3, $4) RETURNING *", 
            [userID, habitGroup, habitName, nextDisplayOrder]);
            //INSERT NEW HABIT INTO HABIT_PROGRESS
            const progressID = await Pool.query('INSERT INTO habit_progress (habit_id, habit_name) VALUES ($1, $2) RETURNING (progress_id)', 
            [result.rows[0].habit_id, result.rows[0].habit_name])
            var addedItem = result.rows[0];
            addedItem.progress_id = progressID.rows[0].progress_id;
            //console.log(addedItem)
            res.json(addedItem)
        } catch (error) {
            console.log("Error adding habit to database")
            res.status(400).json({
                message: "Error adding habit to database",
            })
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENTICATED")
    }

})

app.patch("/deactivate", async (req,res) => {
    const { habitID , progressID } = req.body
    try {
        const userID = req.user.user_id
        try {
            const result = await Pool.query("UPDATE habit_details SET active = false WHERE habit_id = $1 RETURNING *", 
            [habitID])
            const progressResult = await Pool.query("DELETE FROM habit_progress WHERE progress_id = $1",
            [progressID])
            console.log("Success deactivating habit: server")
            res.json(result.rows[0])
        } catch (error) {
            console.log("Error deactivating habit: server")
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENTICATED")
    }

})

app.patch("/edithabit", async (req,res) => {
    const { habitID , updatedTask, progressID} = req.body;
    try {
        const userID = req.user.user_id
        try {
            const result = await Pool.query("UPDATE habit_details SET habit_name = $1 WHERE habit_id = $2 RETURNING *", 
            [updatedTask, habitID]);
            const progressResult = await Pool.query("UPDATE habit_progress SET habit_name = $1 WHERE progress_id = $2 RETURNING *",
            [updatedTask, progressID])
            console.log("Success updating habit name: server");
            res.json(result.rows[0])
        } catch (error) {
            console.log("Error updating habit: server")
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENTICATED")
    }

})

app.patch("/checkbox", async (req, res) => {
    const { progressID, isCompleted } = req.body;
    try {
        const userID = req.user.user_id
        try {
            const result = await Pool.query("UPDATE habit_progress SET completed = $1 WHERE progress_id = $2 RETURNING *", 
            [isCompleted, progressID]);
            console.log(`Success updating habit progress ${progressID}: server`)
            res.json(result.rows[0])
        } catch (error) {
            console.log("Error updating habit progress: server")
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENTICATED")
    }
})

app.patch("/reorder", async (req, res) => {
    //console.log(req.body)
    const { dataToReorder } = req.body 
    //console.log(dataToReorder)
    try {
        const userID = req.user.user_id
        try {
            for (const update of dataToReorder) {  
                console.log(`Habit ID: ${update.habitID} AND new order: ${update.newDisplayOrder}`)        
                const result = await Pool.query("UPDATE habit_details SET display_order = $1 WHERE habit_id = $2 RETURNING *",
                [update.newDisplayOrder, update.habitID])
                console.log(`SUCCESS REORDERING ${update.habitID} to order: ${update.newDisplayOrder} `)
            }
            res.status(200)
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENTICATED")
    }
})

app.post("/register", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    try {
        //Check if username has been used already
        const checkResult = await Pool.query("SELECT * FROM users WHERE email = $1",
        [email]);

        if (checkResult.rows.length > 0) {
            //USERNAME FOUND, REDIRECT TO LOGIN SCREEN WITH MESSAGE------> find out how to redirect react frontend from express server
            res.status(409).json({
                success: false,
                message: "Email already in use",
            })
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.log("Error hashing password:", err);
                } else {
                    const result = await Pool.query("INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *",
                    [email, hash, name]);
                    const user = result.rows[0];
                    req.login(user, (err) => {
                        console.log("NEW USER LOGGED IN")
                        //User registered and logged in, redirect to progress page -------> find out how to redirect from server
                        res.status(200).json({
                            success: true,
                            message: "new user authenticated successfully",
                            user: req.user,
                        })
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
})

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
})
);

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000/progress",
    failureRedirect: "http://localhost:3000/login",
}))

app.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "Authenticated user successfully",
            user: req.user,
        })
    } else {
        res.status(200).json({
            success: false,
            message: "No User Authenticated"
        })
    }
})

app.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "Failed to authenticate user"
    })
})

app.get("/logout", (req,res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/')
    });
})

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/login/success",
        failureRedirect: "/login/failed",
    }
))

passport.use("local",
    new Strategy(
        {usernameField: 'email' }, 
        async function verify(email, password, cb) {
            try {
                const result = await Pool.query("SELECT * FROM users WHERE email = $1",
                [email]);

                if (result.rows.length > 0) {
                    const user = result.rows[0];
                    const storedHashedPassword = user.password_hash;
                    if (storedHashedPassword === "GOOGLE") {
                        console.log("google user")
                        return cb(null, false, {message: "GOOGLE USER: SIGN IN WITH GOOGLE"})
                    } else {
                        bcrypt.compare(password, storedHashedPassword, (err, result) =>{
                            if (err) {
                                //ERROR COMPARING PASSWORDS
                                return cb(err)
                            } else {
                                if (result) { //PASSWORD CORRECT
                                    console.log("USER AUTHENTICATED SUCCESSFULLY")
                                    return cb(null, user)
                                } else { //PASSWORD INCORRECT
                                    console.log("USER COULD NOT BE AUTHENITCATED")
                                    return cb(null, false, {message: 'INCORRECT USERNAME OR PASSWORD'})
                                }                        
                            }
                        })
                    }
                } else {
                    //EMAIL COULD NOT BE FOUND IN DATABASE
                    return cb(null, false, {message: "User not found"})
                }
            } catch (error) {
                //COULD NOT CONNECT TO DATABASE
                return cb(err)
            }
}))

passport.use(
    "google", 
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_ClIENT_SECRET,
        callbackURL: "/auth/google/callback", // google callback URI, this is set as localhost:5000/auth/google/callback NOT 3000
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    }, async (accessToken, refreshToken, profile, cb) => {
        console.log(profile)
        try {
            //Check database for existing user
            const result = await Pool.query("SELECT * FROM users WHERE email = $1",
            [profile.email])
            if (result.rows.length === 0) { //No user found, insert new user into database
                const newUser = await Pool.query("INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *",
                [profile.email, "GOOGLE", profile.displayName]);
                console.log("NEW USER")
                console.log(newUser.rows[0])
                return cb(null, newUser.rows[0]);
            } else { //user found, authenticate user from database
                console.log("FOUND USER")
                console.log(result.rows[0])
                return cb(null, result.rows[0])
            }
        } catch (error) {
            return cb(error)
        }
    }
))

passport.serializeUser((user, cb) => {
    cb(null, user);
  })
  
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  })


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
