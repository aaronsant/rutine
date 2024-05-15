// client/src/components/Checklist.jsx
import React, {useEffect, useState} from "react";
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';


function ChecklistItem(props){

    const [anchorEl, setAnchorEl] = useState(null);
    const [toUpdate, setToUpdate] = useState(false);
    const [updatedTask, setUpdatedTask] = useState("");
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
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
        props.updateProgress(props.id, props.isChecked)
    }

    useEffect(()=>{
        setUpdatedTask(props.content)
    },[])

    function handleChange(event) {
        const value = event.target.value;
        setUpdatedTask(value)
    }

    function handleConfirmEdit(event) {
        props.editTask(props.habitID, updatedTask, props.id);
        event.preventDefault();
        closeEditMode();
    }

    function handleCancel(event) {
        setUpdatedTask(props.content);
        event.preventDefault();
        closeEditMode();
    }

    return (
         toUpdate ? 
        <div
            ref={setNodeRef}
            style={style}
        >
            <form className="edit-checklist-item" onSubmit={handleConfirmEdit}>
                <textarea 
                    name="content"
                    onChange={handleChange}
                    value={updatedTask}
                    rows={1}
                    placeholder={(updatedTask.length > 0)? null : "Click to update"}
                />
                <IconButton 
                    type="submit" 
                    style={(updatedTask.trim().length > 0)? {color: "lightseagreen"} : {display: "none"}}
                >
                    <CheckIcon />
                </IconButton>
                <IconButton
                    type="button" 
                    onClick={handleCancel}
                    style={{color: "red"}}
                >
                    <CloseIcon />
                </IconButton>
                <IconButton {...listeners} {...attributes} className='drag-button' disableRipple>
                    <UnfoldMoreIcon />
                </IconButton>
            </form>
        </div>
        :
        <div 
            ref={setNodeRef}
            style={style}
            className="checklist-item"
        >
            <input type="checkbox" onChange={handleChecked} checked={props.isChecked ? true : false}/>
            <span className="habit-text">{props.content}</span>
            <IconButton
                aria-label="more"
                id="more-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                className="more-menu"
                disableRipple
            >
                <MoreVertIcon className="options"/>
            </IconButton>
            <IconButton {...listeners} {...attributes} className='drag-button' disableRipple>
                <UnfoldMoreIcon />
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
        </div>
    )
}

export default ChecklistItem;