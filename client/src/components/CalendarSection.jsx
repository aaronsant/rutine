// client/src/components/CalendarSection.jsx
import React, { useState } from "react";
import {
    format,
    startOfWeek,
    addDays,
    isSameDay,
    lastDayOfWeek,
    getWeek,
    addWeeks,
    subWeeks,
  } from "date-fns";
import CalendarHeader from "./CalendarHeader";

function CalendarSection(props){
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));
    const [showCal, setShowCal] = useState(false)
    
    const changeWeekHandle = (btnType) => {
        if (btnType === "prev") {
          setCurrentMonth(subWeeks(currentMonth, 1));
          setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
        }
        if (btnType === "next") {
          setCurrentMonth(addWeeks(currentMonth, 1));
          setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
        }
    };

    function onDateClick(day){
        props.setDate(day);
    };

    function days(){
        const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
        const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
        let days = [];
        let day = startDate;
        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
               days.push(day)
               day = addDays(day, 1);
            }
          }
        return days;
    }

    function isLastOrFirstDay(day){
        let test = new Date(day.getTime())
        test.setDate(test.getDate()+1)
        return (test.getDate() == 1) || day.getDate() == 1
    }

    return (
        <div className="calendar-zone">
            <CalendarHeader
                handleChangeWeek={changeWeekHandle}
                week={currentWeek}
                date={props.selectedDate}
                showCal={showCal}
                setShowCal={setShowCal}
                
            />
            {showCal ? ( 
                days()[0].getDate() > days()[6].getDate() ? 
                //if calendar showing 2 diff months
                <div className="calendar-row">
                    {days().map(day =>
                        <div className="calendar-cell-container" key={day.getTime()}>
                            {isLastOrFirstDay(day) ? <span className="month-label container-label">{day.toLocaleString('default', { month: 'short' })}</span> : <br/>}
                            <CalendarDay 
                                key={day.getTime()}
                                date={day}
                                onDateClick={onDateClick}
                                selectedDate={props.selectedDate}
                            />
                        </div>
                    )}
                </div>
                :
                //if calendar showing only 1 month
                <div>
                    <span className="month-label">{days()[0].toLocaleString('default', { month: 'short' })}</span>
                    <div className="calendar-row">
                        {days().map(day =>
                            <div className="calendar-cell-container" key={day.getTime()}>
                                <CalendarDay 
                                    key={day.getTime()}
                                    date={day}
                                    onDateClick={onDateClick}
                                    selectedDate={props.selectedDate}
                                />
                            </div>
                        )}
                    </div>
                </div>
             
            ) : null }
        </div>
    )
}

function CalendarDay(props) {

    function handleDateClick() {
        props.onDateClick(props.date)
    }

    return (
        <div className={`calendar-cell 
            ${isSameDay(new Date(), props.date) ? "today": ""}
            ${isSameDay(props.selectedDate, props.date) ? "selected" : "" }`}  
            onClick={handleDateClick}
        >
            <div className="day">
               {format(props.date, "EEE")} 
            </div>
            <div className="day-number">
               {props.date.getDate()} 
            </div>
        </div>
    )
}

export default CalendarSection;