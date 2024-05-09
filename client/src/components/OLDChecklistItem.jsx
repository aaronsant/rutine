import React, {useState} from "react";
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

function ChecklistItem(props){
    //const [isChecked, setIsChecked] = useState(props.isChecked)
    const [anchorEl, setAnchorEl] = useState(null);
    const [toUpdate, setToUpdate] = useState(false);
    
    function handleClick(event) {
        setAnchorEl(event.currentTarget)
    }

    const open = Boolean(anchorEl)

    function handleClose() {
        setAnchorEl(null);
    }

    function handleEdit() {
        setToUpdate(true)
    }

    function closeEditMode() {
        setToUpdate(false)
        setAnchorEl(null)
    }

    function handleDelete() {
        props.deleteTask(props.habitID, props.id)
    }

    function handleChecked(){
        console.log(`Checkbox ${props.id} clicked and is currently ${props.isChecked}`)
        props.updateProgress(props.id, props.isChecked)
    }


    return (
        toUpdate ? 
        < EditCheckboxItem 
            id={props.id} 
            habitID={props.habitID}
            content={props.content}
            editTask={props.editTask}
            closeEditMode={closeEditMode}
        /> :
        <li className="checklist-item"> 
            <input type="checkbox" onChange={handleChecked} checked={props.isChecked ? true : false}/>
            <span>{props.content}</span>
            <IconButton
                aria-label="more"
                id="more-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                disableRipple
            >
                <MoreVertIcon className="options"/>
            </IconButton>
            <Menu
                id="more-options"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
            
        </li>
    )
}

function EditCheckboxItem(props){

    const [updatedTask, setUpdatedTask] = useState(props.content)

    function handleChange(event) {
        const value = event.target.value;
        setUpdatedTask(value)
    }

    function handleConfirmEdit(event) {
        props.editTask(props.habitID, updatedTask, props.id);
        event.preventDefault();
        props.closeEditMode();
    }

    function handleCancel(event) {
        setUpdatedTask(props.content);
        event.preventDefault();
        props.closeEditMode();
    }

    return (
        <form className="add-checklist-item" onSubmit={handleConfirmEdit}>
            <textarea 
                name="content"
                onChange={handleChange}
                value={updatedTask}
                rows={1}
                placeholder={(updatedTask.length > 0)? null : "Click to update"}
            />
            <button 
                type="submit" 
                style={(updatedTask.trim().length > 0)? null : {display: "none"}}
            >
                <CheckIcon />
            </button>
            <button 
                type="button" 
                onClick={handleCancel}
                style={{color: "red" , border: "1px solid red"}}
            >
                <CloseIcon />
            </button>   
        </form> 
    )
}

export default ChecklistItem;