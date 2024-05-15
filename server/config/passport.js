// server/config/passport.js
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import bcrypt from "bcrypt"
import env from 'dotenv';
import Pool from "./config.js";

env.config({
    path: '../.env'
})

// LOCAL Strategy configuration
passport.use("local",
    new Strategy(
        {usernameField: 'email' }, 
        async function verify(email, password, cb) {
            try {
                console.log(email)
                console.log(password)
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
                return cb(error)
            }
}))

//GOOGLE strategy configuration
passport.use(
    "google", 
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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

//Passport serialization and deserialization
passport.serializeUser((user, cb) => {
    cb(null, user);
  })
  
  passport.deserializeUser(async (user, cb) => { 
    //This logic ensures when user updates their information, the new info is stored in user object 
    try {
        const { user_id } = user;
        const result = await Pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        const verifiedUser = result.rows[0];
        if (!verifiedUser) cb(null, false);
        cb(null,verifiedUser);
    } catch (error) {
      cb(error);
    }
  })

export default passport;
