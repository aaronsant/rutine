// client/src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    return (
        <div>
            <div className="homepage-hero">
                <h1>Get out of a rut and into a RUTINE</h1>
                <h3>Let us keep track of the boring stuff so you can focus on the important stuff</h3>
                <div className="hero-buttons">
                    <button className="hero-button" onClick={()=> {navigate('/register')}}>
                        Get Started
                    </button>
                    <button className="hero-button" onClick={()=> {navigate('/login')}}>
                        Sign in
                    </button>

                </div>
            </div>
            <div className="about-section">
                <div className="about-box">
                    <h2>RUTINE</h2>
                    <p>Dive into simplicity with our intuitive task management system. Our website boasts a clean and uncluttered design, making it a breeze to stay organized and productive. Track your daily, weekly, and monthly tasks seamlessly while monitoring your progress along the way. </p>
                </div>
            </div>
        </div>
    )
}

export default Home;