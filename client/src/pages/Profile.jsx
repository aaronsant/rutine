import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile(props) {

    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("");
    const [newConfirmPassword, setNewConfirmPassword] = useState("");
    const [infoServerError, setInfoServerError] = useState("")
    const [passwordServerError, setPasswordServerError] = useState("")
    const [passwordMatchError, setPasswordMatchError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [infoSuccessMessage, setInfoSuccessMessage] = useState("")
    const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("")
    const [resetPassword, setResetPassword] = useState(false)
    const [numHabits, setNumHabits] = useState(0)

    useEffect(()=>{
        setNewName(props.user.name || '')
        setNewEmail(props.user.email || '')
        countHabits()
    },[])

    useEffect(()=>{
        if (newPassword != newConfirmPassword && newConfirmPassword.length > 0) {
            setPasswordMatchError("Passwords Do Not Match")
        } else {
            setPasswordMatchError("")
        }
    }, [newPassword, newConfirmPassword])

    useEffect(() =>{
        if (infoServerError === "Email already in use. Please try another email or try logging in.") {
            setInfoServerError("")
        }
    }, [newEmail])

    function validatePassword(pw) {
        const valid = ( /[A-Z]/       .test(pw) &&
                        /[a-z]/       .test(pw) &&
                        /[0-9]/       .test(pw) &&
                        /[^A-Za-z0-9]/.test(pw) &&
                        pw.length > 8);
        if (valid) {
            setPasswordError("")
        } else {
            setPasswordError("Invalid Password: Password must be at least 8 characters long and contain at least one of each: uppercase letter, lowercase letter, digit, special character")
        }
        return valid
    }

    function validateEmail(em) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(em)) {
            setEmailError("")
            return (true)
        } else {
            setEmailError("Invalid Email Address")
            return (false)
        }
    }

    async function infoSubmit(e) {
        e.preventDefault()
        const validForm = validateEmail(newEmail)
        console.log(validForm)
        if (validForm) {
            try {             
                await axios.patch("profile/update/userinfo", {name: newName, email: newEmail}) 
                setInfoSuccessMessage("Success Updating User Info")
                props.setUser(prev => {
                    return {
                    ...prev,   
                    name: newName,
                    email: newEmail,
                    }
                })
                setTimeout(()=> {window.location.reload()}, 2000)
            } catch (error) {
                console.log("Could not update user in server")
                if (error.response.status === 500){
                    setInfoServerError("Server Error: Please try again later");
                } else if(error.response.status === 409){
                    setInfoServerError("Email already in use. Please try another email or try logging in.")
                } else {
                    setInfoServerError("Unknown Server Error. Please try again later.")
                }
            }
        } else {
            console.log("error: form not valid")
        }
    }

    async function passwordSubmit(e) {
        e.preventDefault()
        const validForm = validatePassword(newPassword)  & passwordMatchError === ""
        if (validForm) {
            console.log("isValid")
            try {
                await axios.patch("profile/update/password", {oldPassword: oldPassword, newPassword: newPassword})
                console.log("here")
                setPasswordSuccessMessage("Success Updating Password")
                setTimeout(()=> {window.location.reload()}, 2000)
            } catch (error) {
                if (error.response.status === 400) {
                    setPasswordServerError("Error: Unable to update passwords for users logged in with Google.")
                } else if(error.response.status === 500){
                    setPasswordServerError("Error: Server error. Please try again later.")
                } else if(error.response.status === 401){
                    setPasswordServerError("Error: Incorrect Password for user. Unable to verify user to update password.")
                } else (
                    setPasswordServerError("Error: Unknown server error. Please try again later.")
                )
            }
        } else {
            console.log("error: passwords not valid")
        }
    }

    async function countHabits() {
        try {
            const result = await axios.get("api/v1/count")
            setNumHabits(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {infoSuccessMessage === "" ? null : <p className="success-message">{infoSuccessMessage}</p>}
                {passwordSuccessMessage === "" ? null : <p className="success-message">{passwordSuccessMessage}</p>}
                <div className="profile-card radial-gradient">
                    <h2>{props.user.name}</h2>
                    <h4>Active Habits: {numHabits}</h4>
                    <h4>Member Since: {new Date(props.user.date_created).toLocaleDateString()}</h4>
                </div>
                <div className="profile-form">
                {infoServerError === "" ? null : <p className="login-error">{infoServerError}</p>}
                {emailError === "" ? null : <p className="login-error">{emailError}</p>}
                <form onSubmit={infoSubmit}>
                    <div className="input-box">
                        <input 
                            type="text"
                            id="newName"
                            autoComplete="off"
                            name="newName"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            required
                        /> 
                        <i>Name</i>
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            id="newEmail"
                            autoComplete="off"
                            name="newEmail"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required                            
                        /> 
                        <i>Email</i>
                    </div>
                    <button className="profile-update" type="submit">
                        Update Profile
                    </button>
                </form>
                </div>
                {resetPassword ? 
                <div className="profile-form">
                {passwordServerError === "" ? null : <p className="login-error">{passwordServerError}</p>}
                {passwordError === "" ? null : <p className="login-error">{passwordError}</p>}
                {passwordMatchError === "" ? null : <p className="login-error">{passwordMatchError}</p>}
                <form onSubmit={passwordSubmit}>
                    <div className="input-box">
                        <input 
                            type="password"
                            id="oldPassword" 
                            autoComplete="off"
                            name="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required 
                        /> 
                        <i>Old Password</i>
                    </div>
                    <div className="input-box">
                        <input 
                            type="password"
                            id="newPassword" 
                            autoComplete="off"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required 
                        /> 
                        <i>New Password</i>
                    </div>
                    <div className="input-box">
                        <input 
                            type="password" 
                            id="newConfirmPassword"
                            autoComplete="off"
                            name="newConfirmPassword"
                            value={newConfirmPassword}
                            onChange={(e) => setNewConfirmPassword(e.target.value)}
                            required
                        /> 
                        <i>Confirm New Password</i>
                    </div>
                    <button className="profile-update" type="submit">
                        Reset Password
                    </button>
                </form>
                </div>
                :
                <button className="profile-update" style={{"background-color": "firebrick" , "color":"white"}} onClick={() => setResetPassword(true)}>
                        Reset Password
                </button>
                }
            </div>
        </div>
    );
}

export default Profile;