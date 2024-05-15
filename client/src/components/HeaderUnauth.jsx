// client/src/components/HeaderUnauth.jsx
import React ,{ useState} from "react";
import { Link, NavLink } from "react-router-dom"
import { MdMenu } from "react-icons/md";
import { IconContext } from "react-icons";

function HeaderUnauth(props) {
    const [showNavbar, setShowNavbar] = useState(false)

    function handleShowNavbar() {
        setShowNavbar(!showNavbar)
    }

    return (
            <div className="container">
                <Link to="/" className="site-title">
                    {props.brand}
                </Link>
                <div className="menu-icon" onClick={handleShowNavbar}>
                    <IconContext.Provider value={{size: 30}}>
                        <MdMenu />
                    </IconContext.Provider>
                </div>
                <div className={`nav-elements ${showNavbar ? 'active' : ''}`}>            
                    <ul>
                        <NavLink 
                            to="/"
                            className={({ isActive, isPending, isTransitioning }) =>
                                [
                                isPending ? "pending" : "",
                                isActive ? "active" : "",
                                isTransitioning ? "transitioning" : "",
                                ].join(" ")
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink 
                            to="/Login"
                            className={({ isActive, isPending, isTransitioning }) =>
                                [
                                isPending ? "pending" : "",
                                isActive ? "active" : "",
                                isTransitioning ? "transitioning" : "",
                                ].join(" ")
                            }
                        >
                            Login
                        </NavLink>
                        <NavLink 
                            to="/Register"
                            className={({ isActive, isPending, isTransitioning }) =>
                                [
                                isPending ? "pending" : "",
                                isActive ? "active" : "",
                                isTransitioning ? "transitioning" : "",
                                ].join(" ")
                            }
                        >
                            Register
                        </NavLink>
                    </ul>
                </div>
            </div>
    )
}

export default HeaderUnauth;