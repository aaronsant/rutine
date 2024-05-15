// client/src/components/CalendarHeader.jsx
import React from 'react';
import { format } from 'date-fns';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

function CalendarHeader(props){

    return(
        <div className="calendar-header">
            <div className="header-date" onClick={() => props.setShowCal(prev => !prev)}>
                {format(props.date, "PPP")}
            </div>
            {props.showCal ?
            //show calendar
            <div className="calendar-nav">
                <div className="col col-start">
                    <div className="icon" onClick={() => props.handleChangeWeek("prev")}>
                        <WestIcon fontSize='large'/>
                    </div>
                </div>
                <div>Week {props.week}</div>
                <div className="col col-end" onClick={() => props.handleChangeWeek("next")}>
                    <div className="icon">
                        <EastIcon fontSize='large'/>
                    </div>
                </div>
            </div>
            //Do not show calendar
            : null }
        </div>
    )
}

export default CalendarHeader