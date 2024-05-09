import React, {useState, useReducer, useEffect} from "react";
import ChecklistItem from "./ChecklistItem";
import AddIcon from '@mui/icons-material/Add';
import LinearProgress from "@mui/material/LinearProgress";
//import * as $ from 'jquery'


function Checklist(props){
    const [newTask, setNewTask] = useState("")
    const [progressValue, setProgressValue] = useState(0)

    useEffect(()=> {
        setProgressValue(countProgress())
    })

    function countProgress() {
        if (props.checklistItems.length > 0) {
            return (props.checklistItems.filter(item => item.completed == true).length)/(props.checklistItems.length)
        } else {
            return 0
        }
    }

    function handleChange(event) {
        const value = event.target.value;
        setNewTask(value)
    }

    function handleAdd(event) {
        props.addNewHabit(props.title, newTask)
        event.preventDefault();
        setNewTask("");
    }
    /*
    function handleEdit(habitID, updatedTask, progressID){
        props.editHabit(habitID, updatedTask, progressID)
    }

    function handleDelete(habitID, progressID){
        props.deleteHabit(habitID, progressID)
    }

    function handleChecked(progressID, isCompleted){
        props.updateProgress(progressID, isCompleted)
    }
    */

    
    return(
        <div className="checklist">
            <h2 className="checklist-title">{props.title}</h2>
            <ul className="list-of-items">
            {props.checklistItems.map(habit => {
                return (
                    <ChecklistItem 
                        key={habit.progress_id}
                        id={habit.progress_id}
                        habitID={habit.habit_id}
                        isChecked={habit.completed}
                        content={habit.habit_name}
                        editTask={props.editHabit}
                        deleteTask={props.deleteHabit}
                        updateProgress={props.updateProgress}
                    />
                )
            })}
            </ul>
            <form className="add-checklist-item">
                    <textarea 
                        name="content"
                        onChange={handleChange}
                        value={newTask}
                        placeholder="Add new task..."
                        rows={1}
                    />
                    <button 
                        type="submit" 
                        onClick={handleAdd} 
                        style={(newTask.length > 0)? null : {display: "none"}}
                    >
                        <AddIcon />
                    </button>    
            </form>
            <div className="progress-bar">
                <LinearProgress variant="determinate" color="primary" value={100*progressValue}/>
            </div>
        </div>
    )
}

export default Checklist;