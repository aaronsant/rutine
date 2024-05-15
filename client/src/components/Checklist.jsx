// client/src/components/Checklist.jsx
import React, {useState, useEffect} from "react";
import ChecklistItem from "./ChecklistItem";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import LinearProgress from "@mui/material/LinearProgress";
import {
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
  } from '@dnd-kit/core';
  import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
  } from '@dnd-kit/sortable';
import {
    restrictToVerticalAxis,
    restrictToWindowEdges,
  } from '@dnd-kit/modifiers'
import { isSameDay, isSameMonth, isSameWeek } from "date-fns";

function Checklist(props){
    const [newTask, setNewTask] = useState("")
    const [progressValue, setProgressValue] = useState(0)
    const [checklistItems, setChecklistItems] = useState([])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(()=> {
        setProgressValue(countProgress())
        setChecklistItems(props.checklistItems)
    }, [props.checklistItems])

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

    function handleDragEnd(event) {
        const {active, over} = event;
        
        if (active.id !== over.id) {
          setChecklistItems((items) => {
            const oldIndex = items.map(i => i.progress_id).indexOf(active.id);
            const newIndex = items.map(i => i.progress_id).indexOf(over.id);
            
            return arrayMove(items, oldIndex, newIndex);
          });

          const oldIndex = checklistItems.findIndex(i => i.progress_id === active.id)
          const newIndex = checklistItems.findIndex(i => i.progress_id === over.id)
          const start = Math.min(oldIndex, newIndex)
          const end = Math.max(oldIndex, newIndex) + 1

          //Split the data to obtain just the data that was shifted
          const shiftedItems = checklistItems.slice(start,end)
          
          //Map the data to obtain an array of the sorted display orders
          const newDisplayOrders = shiftedItems.map(item => item.display_order)
          
          //Reorder the shifted items by pushing the first item to the end of the array or vice versa
          if (oldIndex < newIndex) {
            shiftedItems.push(shiftedItems.shift())
          } else {
            shiftedItems.unshift(shiftedItems.pop())
          }

          //map the items to a new array that contains just the habit_ID and the new display order
          const itemsToReorder = shiftedItems.map((item, index) => ({
            habitID: item.habit_id,
            oldDisplayOrder: item.display_order,
            newDisplayOrder: newDisplayOrders[index]
          }))
          props.reorderData(itemsToReorder)
        }
    }

    function showAddSection(){
        if (props.title === "Daily") {
            if (isSameDay(new Date(), props.selectedDate)) {
                return true
            } else {
                return false
            }
        } else if (props.title === "Weekly") {
            if (isSameWeek(new Date(), props.selectedDate,  { weekStartsOn: 1 })) {
                return true
            } else {
                return false
            }
            
        } else if (props.title === "Monthly") {
            if (isSameMonth(new Date(), props.selectedDate)) {
                return true
            } else {
                return false
            }  
        } 
    }

    return(
        <div className="checklist">
            <h2 className="checklist-title">{props.title}</h2>
            {checklistItems.length === 0 ?
            <h5 style={{textAlign: "center"}}><i>Nothing to show yet...</i></h5>
            :
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext 
                    items={checklistItems.map(item => item.progress_id)}
                    strategy={verticalListSortingStrategy}
                    modifiers={[restrictToWindowEdges]}
                >
                {checklistItems.map((habit) => {
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
                </SortableContext>
            </DndContext> }
            {showAddSection() ?
            <form className="add-checklist-item">
                    <textarea 
                        name="content"
                        onChange={handleChange}
                        value={newTask}
                        placeholder="Add new task..."
                        rows={1}
                    />
                    <IconButton 
                        type="submit" 
                        onClick={handleAdd} 
                        style={(newTask.length > 0)? null : {display: "none"}}
                    >
                        <AddIcon />
                    </IconButton>    
            </form>
            : 
            null }
            <div className="progress-bar">
                <LinearProgress variant="determinate" color="primary" value={100*progressValue}/>
            </div>
        </div>
    )
}

export default Checklist;