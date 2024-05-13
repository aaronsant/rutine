import React, {useState, useEffect} from "react";
import ChecklistSection from "../components/ChecklistSection";
import ChartSection from "../components/ChartSection";
import CalendarSection from "../components/CalendarSection";
import axios from "axios";
import { isSameDay, isSameWeek, isSameMonth} from "date-fns"
//import ProgressHero from "../components/ProgressHero";

function Progress(props) {
    const [habitData, setHabitData] = useState([]);
    const [habitGroups, setHabitGroups] = useState(["Daily", "Weekly", "Monthly"]);
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
         getHabits()
    }, [])

    useEffect(() => {
        //setHabitGroups([...new Set(habitData.map(habit => habit.habit_group))])
        setHabitGroups(["Daily", "Weekly", "Monthly"]);
    }, [habitData])    

    // data has the properties: 
    //progress_id, date, habit_id, habit_group, habit_name, completed
    async function getHabits() {
        try {
            const response = await axios.get(`${props.API_URL}/api/v1/get/all`)
            //console.log(response.data)
            setHabitData(response.data)
        } catch (error) {
            console.log("error")
        }  
    }



    async function addNewItem(group, newItem) {
        try {
            const response = await axios.post(`${props.API_URL}/api/v1/add`, { habitName: newItem, habitGroup: group})
            setHabitData(prevData => [...prevData, {
                completed: false,
                date: response.data.date_created,
                habit_group: response.data.habit_group,
                habit_id: response.data.habit_id,
                habit_name: response.data.habit_name,
                progress_id: response.data.progress_id
            }])
            console.log(response.data)
            console.log("Success adding habit")
        } catch (error) {
            console.log('Error making post request')
            if (error.response.status === 400) {
                setErrorMsg("Error adding new habit. Please ensure new habits are not too long and try again later.")
            }
        }
    }

    async function deleteHabit(habitID, progressID) {
        try {
            setHabitData(prev => prev.filter(habit => habit.progress_id !== progressID))
            await axios.patch(`${props.API_URL}/api/v1/deactivate`, {habitID: habitID, progressID: progressID});
            console.log("Success deactivating habit: client")
        } catch (error) {
            console.log("Error deactivating habit: client")
        }
    }

    async function editHabit(habitID, updatedTask, progressID) {
        try {
            const updatedHabitData = habitData.map((habit) => {
                if (habit.progress_id == progressID) {
                    return {
                        ...habit,
                        habit_name : updatedTask
                    }
                } else {
                    return habit
                }
            })
            //console.log(`${habitID} changed to ${updatedTask} which is ${progressID}`)
            setHabitData(updatedHabitData)
            await axios.patch(`${props.API_URL}/api/v1/edit`, {habitID: habitID, updatedTask: updatedTask, progressID: progressID});
            console.log("Success updating habit name: client");
        } catch (error) {
            console.log("Error updating habit: client")
        }
    }

    async function updateHabitProgress(progressID, prevChecked) {
        try {
            const updatedHabitData = habitData.map((habit) => {
                if (habit.progress_id == progressID) {
                    return {
                        ...habit,
                        completed: !prevChecked
                    }
                } else {
                    return habit   
                }
            })
            setHabitData(updatedHabitData);
            await axios.patch(`${props.API_URL}/api/v1/checkbox`, {progressID: progressID, isCompleted: !prevChecked})
            console.log("Success updating habit progress: client")
        } catch (error) {
            console.log("Error updating habit progress: client")
        }
    }

    async function reorderData(dataToReorder) {
        try {
            const updatedHabitData = habitData.map((habit) => {
                let isUpdated = false
                let updatedHabit = {}
                dataToReorder.forEach(update => {
                    if (habit.habit_id == update.habitID) {
                        isUpdated = true
                        updatedHabit = {
                            ...habit,
                            display_order: update.newDisplayOrder
                        }
                    }
                });
                if (isUpdated) {
                    return updatedHabit
                } else {
                    return habit
                }
            })
            setHabitData(updatedHabitData);
            console.log(updatedHabitData)
            await axios.patch(`${props.API_URL}/api/v1/reorder`, {dataToReorder: dataToReorder})
            console.log("Data Reordered Succesfully")
        } catch (error) {
            console.log("Error")
            console.log(error)
        }
    }

    function getCurrentData(allData, date) {
        console.log(date)
        const filteredData = allData.filter(entry => {
            let entryDate = new Date(entry.date);
            if (entry.habit_group == 'Daily') {
                console.log(`entry date ${entryDate} for ${entry.date}`)
                return (isSameDay(date, entryDate))
            } else if (entry.habit_group == 'Weekly') {
                return (isSameWeek(date, entryDate, {weekStartsOn: 1}))
            } else if (entry.habit_group == 'Monthly') {
                return (isSameMonth(date, entryDate))
            }
        })
        //return the filtered AND sorted data
        return filteredData.sort((a,b) => a.display_order - b.display_order)
    }

    /*
    async function fillHabits() {
        try {
            await axios.post("/fillHabits")
            console.log("habits filled")
            window.location.reload()
        } catch (error) {
            console.log("error filling habits")
        }
    }
    */

    return (
        <div>
            {errorMsg === "" ? null : <div className="prog-page-error" onClick={() => setErrorMsg("")}>{errorMsg}</div>}
            <CalendarSection
                selectedDate={selectedDate}
                setDate={setSelectedDate}
            />
            <ChecklistSection 
                data={getCurrentData(habitData, selectedDate)}
                selectedDate={selectedDate}
                groups={habitGroups}
                addNewHabit={addNewItem}
                deleteHabit={deleteHabit}
                editHabit={editHabit}
                updateProgress={updateHabitProgress}
                reorderData={reorderData}
            />
            {
                //<button type="button" onClick={fillHabits}>FILL HABITS TO CURRENT DATE</button>
            }
            <ChartSection
                data={habitData}
            /> 
        </div>
    );
}

export default Progress; 