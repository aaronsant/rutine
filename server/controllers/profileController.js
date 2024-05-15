// server/controllers/profileController.js
import Pool from "../config/config.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

// Controller for retreiving all user habits from the database
export const updateUserInfo = async(req, res) => {
    try {
        const userID = req.user.user_id;
        const { name, email } = req.body
        try {
            const checkResult = await Pool.query("SELECT * FROM users WHERE email = $1",
            [email]);
    
            if (checkResult.rows.length > 0 && userID !== checkResult.rows[0].user_id) {
                //Email already in use
                res.status(409).json({message: "Email already in use"})
            } else {
                try {
                    const result = await Pool.query("UPDATE users SET name = $1, email = $2 WHERE user_id = $3 RETURNING *", 
                    [name, email, userID]);
                    res.status(200).json(result.rows[0])
                } catch (error) {
                    console.log("Error updating user in database")
                    res.status(500).json({message:"Error accessing DB"})
                }
            }
        } catch (error) {
            console.log("Error accessing DB")
            res.status(500).json({message:"Error accessing DB"})
        }

    } catch (error) {
        console.log("ERROR: USER NOT AUTHENITCATED")
        res.status(400).json({message:"No User found"})
    }
}

//Controller for updating user password. Must first confirm old password.
export const updatePassword = async(req,res) => {
    try {
        const userID = req.user.user_id;
        const { oldPassword, newPassword } = req.body
        try {
            //GET THE HASHED PASSWORD FROM DB
            const dbResult = await Pool.query("SELECT * FROM users WHERE user_id = $1",
            [userID]);
            const storedHashedPassword = dbResult.rows[0].password_hash;
            if (storedHashedPassword === "GOOGLE") { //CHECK IF A GOOGLE USER
                //console.log("google user")
                res.status(400).json({message:"Error: Google User"})
            } else {
                //COMPARE PASSWORDS
                bcrypt.compare( oldPassword, storedHashedPassword, (err, result) => {
                    if (err) {
                        //ERROR COMPARING PASSWORDS
                        res.status(500).json({message:"Error Comparing Passwords"})
                    } else {
                        if (result) { //PASSWORD CORRECT
                            try {
                                //HASH NEW PASSWORD
                                bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
                                    if (err) {
                                        console.log("Error hashing password:", err);
                                    } else {
                                        // UPDATE PASSWORD HASH IN DB
                                        await Pool.query("UPDATE users SET password_hash = $1 WHERE user_id = $2 RETURNING *",
                                        [hash, userID ]);
                                        //console.log(`Success updating password for ${userID}`);
                                        res.status(200).json({message:"Success"})
                                    }
                                })
                            } catch (error) {
                                //ERROR HASHING PASSWORD
                                console.log(error)
                                res.status(500).json({message:"Error Hashing Password"})
                            }
                        } else { //PASSWORD INCORRECT
                            console.log("Incorrect Password")
                            res.status(401).json({message:"Incorrect Password"})
                        }                        
                    }
                })
            }
        } catch (error) {
            //ERROR GETTING PASSWORD HASH FROM DB
            console.log("ERROR: COULD NOT ACCESS DB")
            res.status(500).json({message:"Error accessing DB"})
        }
    } catch (error) {
        //NO USERID - UNAUTHORIZED
        console.log("ERROR: USER NOT AUTHENTICATED")
        res.status(400).json({message:"No User found"})
    }
}