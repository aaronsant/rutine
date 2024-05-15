// client/src/components/ChecklistSection.jsx
import React from "react";
import Checklist from "../components/Checklist";

function ChecklistSection(props){

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