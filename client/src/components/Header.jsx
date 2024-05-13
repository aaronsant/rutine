import React from "react";
import { Link } from "react-router-dom"
import HeaderAuth from "./HeaderAuth";
import HeaderUnauth from "./HeaderUnauth";


function Header(props) {

    const brand = "RUTINE"; 
    
    //Sets the content in the header. (Without the last condition and differentiating between null and false, header flashes unautehrized header first )
    function headerContent() {
        if(props.user) {
            return (
                <HeaderAuth brand={brand} API_URL={API_URL}/>
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