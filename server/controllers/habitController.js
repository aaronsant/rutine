// server/controllers/habitController.js
import Pool from "../config/config.js";
import format from "pg-format";

// Controller for retreiving all user habits from the database
export const getAllHabits = async(req, res) => {
    try {
        const userID = req.user.user_id;
        try {
            const result = await Pool.query("SELECT habit_progress.progress_id, habit_progress.date, habit_details.habit_id, habit_details.habit_group, habit_progress.habit_name, habit_progress.completed, habit_details.display_order FROM habit_progress INNER JOIN habit_details ON habit_progress.habit_id=habit_details.habit_id WHERE habit_details.user_id = $1;",
            [userID]);
            const data = result.rows;
            res.json(data);
        } catch (error) {
            console.log("Error retrieving habit data from database")
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENITCATED")
    }
}

// Controller for retreiving number of user habits from the database
export const getHabitCount = async(req, res) => {
    try {
        const userID = req.user.user_id;
        try {
            const result = await Pool.query("SELECT * FROM habit_details WHERE user_id = $1 AND active = true",
            [userID]);
            const count = result.rows.length;
            res.json(count);
        } catch (error) {
            console.log("Error retrieving habit data from database")
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENITCATED")
    }
}

// Controller for retreiving creating a user habit/adding to the database
export const addHabit = async(req, res) => {
    try {
        const userID = req.user.user_id
        const { habitName, habitGroup} = req.body
        //console.log(`name: ${habitName}, group: ${habitGroup}`)
        try {
            //GET THE DISPLAY ORDER NUMBERS OF PREVIOUS HABIT, SET NEXT DISPLAY NUMBER
            const displayOrderArr = await Pool.query("SELECT (display_order) FROM habit_details WHERE habit_group=$1 AND user_id=$2",
            [habitGroup, userID])
            const nextDisplayOrder = Math.max(...[ 0,...displayOrderArr.rows.map((habit) => habit.display_order)]) + 1

            //INSERT NEW HABIT WITH DISPLAY NUMBER INTO HABIT_DETAILS
            const result = await Pool.query("INSERT INTO habit_details (user_id, habit_group, habit_name, display_order) VALUES ($1, $2, $3, $4) RETURNING *", 
            [userID, habitGroup, habitName, nextDisplayOrder]);
            //INSERT NEW HABIT INTO HABIT_PROGRESS
            const progressID = await Pool.query('INSERT INTO habit_progress (habit_id, habit_name) VALUES ($1, $2) RETURNING (progress_id)', 
            [result.rows[0].habit_id, result.rows[0].habit_name])
            var addedItem = result.rows[0];
            addedItem.progress_id = progressID.rows[0].progress_id;
            res.json(addedItem)
        } catch (error) {
            console.log("Error adding habit to database")
            res.status(400).json({
                message: "Error adding habit to database",
            })
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENTICATED")
    }
}

//(USED INTERNALLY IN SERVER ) Controller to add progress entries automatically
export const autoInsert = async(req, res) => {
    const { group } = req.body;
    try {
        //Grab active habits
        const result = await Pool.query("SELECT habit_id, habit_name FROM habit_details WHERE habit_group = $1 AND active = true",
        [group]);
        // format habit_ids as an array
        const activeHabits = result.rows.map((habit) => {
            return [habit.habit_id, habit.habit_name]
        });
        //format database query to insert row for each active habit, defaults fill rest
        const query = format("INSERT INTO habit_progress (habit_id, habit_name) VALUES %L", 
        activeHabits);
        Pool.query(query)
        res.status(200).json({message: "Successful"})
    } catch (error) {
        console.log(`Error inserting ${group} progress data`)
        res.status(500).json({message: "Error updating DB"})
    }
}

// Controller for deactivating user habit in the database (i.e. set active = false)
export const deactivateHabit = async(req, res) => {
    try {
        const userID = req.user.user_id
        const { habitID , progressID } = req.body
        try {
            const result = await Pool.query("UPDATE habit_details SET active = false WHERE habit_id = $1 RETURNING *", 
            [habitID])
            const progressResult = await Pool.query("DELETE FROM habit_progress WHERE progress_id = $1",
            [progressID])
            //console.log("Success deactivating habit: server")
            res.json(result.rows[0])
        } catch (error) {
            console.log("Error deactivating habit: server")
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENTICATED")
    }
}

// Controller for editing a users habit (i.e. the habit name )in the database
export const editHabit = async(req, res) => {
    try {
        const userID = req.user.user_id
        const { habitID , updatedTask, progressID} = req.body;
        try {
            const result = await Pool.query("UPDATE habit_details SET habit_name = $1 WHERE habit_id = $2 RETURNING *", 
            [updatedTask, habitID]);
            const progressResult = await Pool.query("UPDATE habit_progress SET habit_name = $1 WHERE progress_id = $2 RETURNING *",
            [updatedTask, progressID])
            //console.log("Success updating habit name: server");
            res.json(result.rows[0])
        } catch (error) {
            console.log("Error updating habit: server")
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENTICATED")
    }
}

// Controller for updating the status of a user habit (i.e. completed or not) in the database
export const checkHabit = async(req, res) => { 
    try {
        const userID = req.user.user_id
        const { progressID, isCompleted } = req.body;
        try {
            const result = await Pool.query("UPDATE habit_progress SET completed = $1 WHERE progress_id = $2 RETURNING *", 
            [isCompleted, progressID]);
            //console.log(`Success updating habit progress ${progressID}: server`)
            res.json(result.rows[0])
        } catch (error) {
            console.log("Error updating habit progress: server")
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENTICATED")
    }
}

// Controller for updating the display order for user habits in the database
export const reorderHabits = async(req, res) => {
    try {
        const userID = req.user.user_id
        const { dataToReorder } = req.body 
        try {
            for (const update of dataToReorder) {         
                const result = await Pool.query("UPDATE habit_details SET display_order = $1 WHERE habit_id = $2 RETURNING *",
                [update.newDisplayOrder, update.habitID])
            }
            res.status(200)
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log("ERROR: USER NOT AUTHENTICATED")
    }
}

