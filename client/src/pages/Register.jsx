// client/src/pages/Register.jsx
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register(props) {
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [serverError, setServerError] = useState("")
    const [passwordMatchError, setPasswordMatchError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const navigate = useNavigate();

    useEffect(()=>{
        if (password != confirmPassword && confirmPassword.length > 0) {
            setPasswordMatchError("Passwords Do Not Match")
        } else {
            setPasswordMatchError("")
        }
    }, [password, confirmPassword])

    useEffect(() =>{
        if (serverError === "Email is already in use. Please try signing in.") {
            setServerError("")
        }
    }, [email])

    function validateEmail(em) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(em)) {
            setEmailError("")
            return (true)
        } else {
            setEmailError("Invalid Email Address")
            return (false)
        }
    }

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

    async function handleSubmit(e) {
        e.preventDefault()
        const validForm = validateEmail(email) & validatePassword(password) & passwordMatchError === ""
        if (validForm) {
            try {
                await axios.post(`${props.API_URL}/auth/register`, {name, email, password})
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setServerError("");
                window.location.reload()
            } catch (error) {
                console.log(error)
                if (error.response.status === 409) {
                    setServerError("Email is already in use. Please try signing in.")
                } else {
                    setServerError("Server Error: Please Try Again Later")
                }
            }
        } else {
            console.log("Invalid registration")
        }
    }  

    function  handleShowSignUp(){
        setShowRegistrationForm(true)
    }

    async function googleAuth() {
        try {
            window.open(`${props.API_URL}/auth/google`, '_self')
        } catch (error) {
            console.log(error)
            setServerError("Error Signing in with Google. Please try again later.")
        }
    }

    return (
        <div className="register-page">
            <div className="register-form">
                <h2>Welcome!</h2>
                <h4>Let's create your account</h4>
                <button onClick={googleAuth} className="auth-button">
                    <img
                        src="./google.svg"
                        width={16}
                        height={16}
                    />
                    Sign In with Google
                </button>
                <h4>OR</h4>
                {showRegistrationForm ?
                <>
                {serverError === "" ? null : <p className="login-error">{serverError}</p>}
                {emailError === "" ? null : <p className="login-error">{emailError}</p>}
                {passwordError === "" ? null : <p className="login-error">{passwordError}</p>}
                {passwordMatchError === "" ? null : <p className="login-error">{passwordMatchError}</p>}
                <form onSubmit={handleSubmit}>
                    
                    <div className="input-box">
                        <input 
                            type="text"
                            id="name"
                            autoComplete="off"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        /> 
                        <i>Name</i>
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            id="email"
                            autoComplete="off"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required                            
                        /> 
                        <i>Email</i>
                    </div>
                    <div className="input-box">
                        <input 
                            type="password"
                            id="password" 
                            autoComplete="off"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        /> 
                        <i>Password</i>
                    </div>
                    <div className="input-box">
                        <input 
                            type="password" 
                            id="confirmPassword"
                            autoComplete="off"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        /> 
                        <i>Confirm Password</i>
                    </div>
                    <button className="create-account" type="submit">
                        Create Account
                    </button>
                </form>
                </>
                :
                <button className="create-account" onClick={handleShowSignUp}>
                    Create New Account
                </button>
                }
                <small> 
                    Already have an account? <span className="redirect-link"><a  onClick={() => navigate('/login')}>Sign In</a></span>
                </small>
            </div>
        </div>
    );
}

export default Register;