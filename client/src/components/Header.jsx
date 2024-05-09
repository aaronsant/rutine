import React from "react";
import { Link } from "react-router-dom"
import HeaderAuth from "./HeaderAuth";
import HeaderUnauth from "./HeaderUnauth";


function Header(props) {
    
    //Sets the content in the header. (Without the last condition and differentiating between null and false, header flashes unautehrized header first )
    function headerContent() {
        if(props.user) {
            return (
                <HeaderAuth/>
            )
        }else if(props.user === false){
            return (
                <HeaderUnauth/> 
            )
        } else {
            return (
                <div className="container">
                    <Link to="/" className="site-title">
                        MY SITE
                    </Link>
                </div>
            )            
        }
    }
    return (
        <nav className="navbar">
            {headerContent()}
        </nav>
    )
}

export default Header;