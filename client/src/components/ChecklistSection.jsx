import React, {useEffect, useState} from "react";
import Checklist from "../components/Checklist";

function ChecklistSection(props){
    
    //const [dailyList, setDailyTasks] = useState(["Daily 1", "Daily 2", "Daily 3", "Daily 4"]);
    //const [weeklyList, setWeeklyTasks] = useState(["Weekly 1", "Weekly 2", "Weekly 3", "Weekly 4"]);
    //const [monthlyList, setMonthlyTasks] = useState(["Monthly 1", "Monthly 2", "Monthly 3", "Monthly 4"]);
    
    /*
    const [dumbdata, setDumbData] = useState([
        {habit_id: 1, habit_group: 'Daily', habit_name: 'Daily1'},
        {habit_id: 2, habit_group: 'Daily', habit_name: 'Daily2'},
        {habit_id: 3, habit_group: 'Daily', habit_name: 'Daily3'},
        {habit_id: 4, habit_group: 'Daily', habit_name: 'Daily4'},
        {habit_id: 5, habit_group: 'Weekly', habit_name: 'Weekly1'},
        {habit_id: 6, habit_group: 'Weekly', habit_name: 'Weekly2'},
        {habit_id: 7, habit_group: 'Weekly', habit_name: 'Weekly3'},
        {habit_id: 8, habit_group: 'Weekly', habit_name: 'Weekly4'},
        {habit_id: 9, habit_group: 'Monthly', habit_name: 'Monthly1'},
        {habit_id: 10, habit_group: 'Monthly', habit_name: 'Monthly2'},
        {habit_id: 11, habit_group: 'Monthly', habit_name: 'Monthly3'},
        {habit_id: 12, habit_group: 'Monthly', habit_name: 'Monthly4'},
    ])
    
    function addNewItem(checklistId, newItem){
        if (checklistId == 1) {
            setDailyTasks((prevItems) => {
                return [...prevItems, newItem]
            })
        } else if (checklistId == 2){
            setWeeklyTasks((prevItems) => {
                return [...prevItems, newItem]
            })
        } else if (checklistId == 3){
            setMonthlyTasks((prevItems) => {
                return [...prevItems, newItem]
            })
        }
    }
    
    function handleDelete(checklistId, taskId){
        if (checklistId == 1) {
            setDailyTasks(dailyList.filter((task, index) => taskId != index))
        } else if (checklistId == 2){
            setWeeklyTasks(weeklyList.filter((task, index) => taskId != index))
        } else if (checklistId == 3){
            setMonthlyTasks(monthlyList.filter((task, index) => taskId != index))
        }
    }

    function handleEdit(checklistId, taskId, updatedTask){
        if (checklistId == 1) {
            setDailyTasks(dailyList.map((task, index) => {
                return (
                index === taskId ?
                updatedTask :
                task )
            }))
        } else if (checklistId == 2){
            setWeeklyTasks(weeklyList.map((task, index) => {
                return (
                index === taskId ?
                updatedTask :
                task )
            }))
        } else if (checklistId == 3){
            setMonthlyTasks(monthlyList.map((task, index) => {
                return (
                index === taskId ?
                updatedTask :
                task )
            }))
        }
    }
    */
    //console.log(props.data.filter(a => a['habit_group'] == 'Daily'))
    //console.log(props.data[0])
    return (
        <div className="checklist-zone">
            {props.groups.map((group, index) => {
                return (
                    <Checklist 
                        key={index}
                        id={index}
                        title={group}
                        selectedDate={props.selectedDate}
                        checklistItems={props.data.filter(a => a.habit_group == group)}
                        addNewHabit={props.addNewHabit}
                        deleteHabit={props.deleteHabit}
                        editHabit={props.editHabit}
                        updateProgress={props.updateProgress}
                        reorderData={props.reorderData}
                    />
                )
            })}
            
        </div>
    )
}

export default ChecklistSection;