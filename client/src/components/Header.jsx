// client/src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom"
import HeaderAuth from "./HeaderAuth";
import HeaderUnauth from "./HeaderUnauth";


function Header(props) {

    const brand = "RUTINE"; 
    
    //Sets the content in the header
    function headerContent() {
        if(props.user) {
            return (
                <HeaderAuth brand={brand} API_URL={props.API_URL}/>
            )
        }else if(props.user === false){
            return (
                <HeaderUnauth brand={brand}/> 
            )
        } else {
            return (
                <div className="container">
                    <Link to="/" className="site-title">
                        {brand}
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