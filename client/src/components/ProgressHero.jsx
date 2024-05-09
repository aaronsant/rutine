import React from "react";
import { CircularProgress } from "@mui/material";

function ProgressHero(props) {

    return (
        <div className="progress-hero">
            <div>
                <h1>Welcome USERNAME!</h1>
            </div>
            <div>
                <CircularProgress  variant="determinate" value={80} size={80}/>
                <CircularProgress  variant="determinate" value={80} size={80}/>
                <CircularProgress  variant="determinate" value={80} size={80}/>
            </div>

        </div>        
    )
    
}

export default ProgressHero;