import passport from "passport";
import bcrypt from 'bcrypt';
import Pool from "../config/config.js";

const saltRounds = 10;
const clientURL = (process.env.NODE_ENV === "production" ? "https://rutine-238283dd5db6.herokuapp.com":"http://localhost:3000")

// Controller for handling local login
export const login = async (req, res, next) => {
    console.log('login reached')
    passport.authenticate("local", {
        successRedirect: `/`,
    })(req, res, next); //Whenever using passport.authenticate NEED to have (req,res,next)
}

// Controller for handling local login success
export const loginSuccess = async (req, res, next) => {
    if (req.user) {
        console.log('login success')
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
}

// Controller for handling local login failure
export const loginFailed = async (req, res, next) => {
    console.log('login failed')
    res.status(401).json({
        success: false,
        message: "Failed to authenticate user"
    })
}

// Controller for handling local registration
export const register = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    try {
        //Check if username has been used already
        const checkResult = await Pool.query("SELECT * FROM users WHERE email = $1",
        [email]);

        if (checkResult.rows.length > 0) {
            //Username found, redirect to login screen with message
            res.status(409).json({
                success: false,
                message: "Email already in use",
            })
        } else {
            //Username NOT found, proceed with registration
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
}

// Controller for handling login with Google Auth
export const loginWithGoogle = async (req, res, next) => {
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })(req,res,next);
}

// Controller for handling callback for Google auth strategy
export const googleAuthCallback = async (req, res, next) => {
    passport.authenticate("google", {
        successRedirect: `${clientURL}/progress`,
        failureRedirect: `${clientURL}/login`,
    })(req,res,next);
}

export const logout = async(req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/')
    });
}