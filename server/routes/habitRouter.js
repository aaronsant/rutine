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

habitRouter.get('/get/all', getAllHabits);

habitRouter.get('/count', getHabitCount)

habitRouter.post('/add', addHabit);

habitRouter.post('/insert/active', autoInsert)

habitRouter.patch('/deactivate', deactivateHabit);

habitRouter.patch('/edit', editHabit);

habitRouter.patch('/checkbox', checkHabit);

habitRouter.patch('/reorder', reorderHabits);

export default habitRouter;