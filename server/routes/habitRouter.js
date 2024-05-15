// server/routes/habitRouter.js
import express from "express";
import { 
    addHabit, 
    autoInsert, 
    checkHabit, 
    deactivateHabit, 
    editHabit, 
    getAllHabits, 
    getHabitCount, 
    reorderHabits
} from "../controllers/habitController.js";

const habitRouter = express.Router()

// Router for obtaining all user habits
habitRouter.get('/get/all', getAllHabits);

// Router for counting how many habits a user has
habitRouter.get('/count', getHabitCount)

// Router for adding a new habit
habitRouter.post('/add', addHabit);

// Router for automatically inserting habits at start of day/week/month
habitRouter.post('/insert/active', autoInsert)

// Router for deactivating(i.e. deleting from user view) a habit
habitRouter.patch('/deactivate', deactivateHabit);

// Router for editing the name of a habit
habitRouter.patch('/edit', editHabit);

// Router for checking off a habit
habitRouter.patch('/checkbox', checkHabit);

// Router for reordering habits
habitRouter.patch('/reorder', reorderHabits);

export default habitRouter;