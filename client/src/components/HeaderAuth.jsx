import React ,{ useState} from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"
import { MdMenu } from "react-icons/md";
import { IconContext } from "react-icons";
import axios from "axios";

function HeaderAuth(props) {
    const [showNavbar, setShowNavbar] = useState(false)
    const navigate = useNavigate()

    function handleShowNavbar() {
        setShowNavbar(!showNavbar)
    }

    async function logout() {
        try {
            console.log("logging out")
            await axios.get(`${props.API_URL}/auth/logout`)
            navigate('/')
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
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
                            to="/Progress"
                            className={({ isActive, isPending, isTransitioning }) =>
                                [
                                isPending ? "pending" : "",
                                isActive ? "active" : "",
                                isTransitioning ? "transitioning" : "",
                                ].join(" ")
                            }
                        >
                            Progress
                        </NavLink>
                        <NavLink 
                            to="/Profile"
                            className={({ isActive, isPending, isTransitioning }) =>
                                [
                                isPending ? "pending" : "",
                                isActive ? "active" : "",
                                isTransitioning ? "transitioning" : "",
                                ].join(" ")
                            }
                        >
                            Profile
                        </NavLink>
                        {//LOGOUT BUTTON BELOW-------------------------------------------------------------------------------------------------------------------
                        }
                        <Link 
                            onClick={logout}
                        >
                            Logout
                        </Link>
                    </ul>
                </div>
            </div>
    )
}

export default HeaderAuth;