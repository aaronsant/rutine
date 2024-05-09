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

    useEffect(() => {
        getUser()
    }, [])

const getUser = async () => {
    try {
        const response = await axios.get("auth/login/success")
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
            <Header user={user} />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route 
                    path="/progress" 
                    element={user ? <Progress /> : <Navigate to={"/login"}/>} 
                />
                <Route 
                    path="/profile" 
                    element={user ? <Profile user={user} setUser={setUser}/> : <Navigate to={"/login"}/>}
                />
                <Route 
                    path="/login"
                    element={user ? <Navigate to={"/progress"}/> : <Login />}
                />
                <Route 
                    path="/register" 
                    element={user ? <Navigate to={"/progress"}/> : <Register/>}
                />
            </Routes>
            
            <Footer />
        </Router>
    );
}

export default App;