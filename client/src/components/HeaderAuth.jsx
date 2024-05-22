// client/src/components/HeaderAuth.jsx
import React ,{ useState} from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import axios from "axios";

function HeaderAuth(props) {
    const [showNavbar, setShowNavbar] = useState(false)
    const navigate = useNavigate()

    function handleShowNavbar() {
        setShowNavbar(!showNavbar)
    }

    async function logout() {
        try {
            await axios.get(`${props.API_URL}/auth/logout`)
            navigate('/')
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
        setShowNavbar(false)
    }

    return (
            <div className="container">
                <Link to="/" className="site-title">
                    {props.brand}
                </Link>
                <div className="menu-icon" onClick={handleShowNavbar}>
                    <IconButton>
                        <MenuIcon />
                    </IconButton>    
                </div>
                <div className={`nav-elements ${showNavbar ? 'active' : ''}`}>            
                    <ul>
                        <NavLink
                            onClick={()=> {setShowNavbar(false)}}
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
                            onClick={()=> {setShowNavbar(false)}}
                            to="/progress"
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
                            onClick={()=> {setShowNavbar(false)}}
                            to="/profile"
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
                        <Link onClick={logout}>
                            Logout
                        </Link>
                    </ul>
                </div>
            </div>
    )
}

export default HeaderAuth;