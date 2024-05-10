import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        setErrorMsg("")
    }, [email, password])

    async function handleSubmit(e) {
        e.preventDefault()
        console.log("form submitted")
        try {
            const response = await axios.post(`${props.API_URL}/auth/login`, {email, password})
            setEmail("");
            setPassword("");
            console.log(response)
            window.location.reload()
        } catch (error) {
            console.log(error)
            if (error.response.status === 401) {
                setErrorMsg("Invalid Username or Password.")
            } else if(error.response.status === 500){
                setErrorMsg("Server Error. Please try again later.")
            } else {
                setErrorMsg("Unkown Error: Please try again later.")
            }
        }
    }

    async function googleAuth() {
        try {
            window.open(`${props.API_URL}/auth/google`, '_self')
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="register-page">
            <div className="register-form">
                <h2>Welcome Back!</h2>                
                <button onClick={googleAuth} className="auth-button">
                    <img
                        src="./google.svg"
                        width={16}
                        height={16}
                    />
                    Sign In with Google
                </button>
                <h4>OR</h4>
                {errorMsg === "" ? null : <p className="login-error">{errorMsg}</p>}
                <form onSubmit={handleSubmit}>
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
                    <button className="create-account" type="submit">
                        Sign in
                    </button>
                </form>
                <small> 
                    Don't have an account? <span className="redirect-link"><a  onClick={() => navigate('/Register')}>Register</a></span>
                </small>
            </div>
        </div>
    )
}

export default Login;