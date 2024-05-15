// client/src/App.jsx
import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import axios from "axios";

function App() {
    const [user, setUser] = useState(null)
    const API_URL = (process.env.NODE_ENV === "production" ? "https://rutine-238283dd5db6.herokuapp.com": "http://localhost:5000")

    useEffect(() => {
        getUser()
    }, [])

const getUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/login/success`)
        if (response.data.user) {
            setUser(response.data.user)
        } else {
            setUser(false)
        }
    } catch (error) {
        setUser(false)
        console.log(error)
    }
}   
    if (user === null) {
        return null
    }

    return (
        <Router>
            <Header user={user} API_URL={API_URL}/>
            <Routes>
                <Route exact path="/" element={<Home API_URL={API_URL}/>} />
                <Route 
                    path="/progress" 
                    element={user ? <Progress API_URL={API_URL}/> : <Navigate to={"/login"}/>} 
                />
                <Route 
                    path="/profile" 
                    element={user ? <Profile user={user} setUser={setUser} API_URL={API_URL}/> : <Navigate to={"/login"}/>}
                />
                <Route 
                    path="/login"
                    element={user ? <Navigate to={"/progress"}/> : <Login API_URL={API_URL}/>}
                />
                <Route 
                    path="/register" 
                    element={user ? <Navigate to={"/progress"}/> : <Register API_URL={API_URL}/>}
                />
            </Routes>
            
            <Footer />
        </Router>
    );
}

export default App;