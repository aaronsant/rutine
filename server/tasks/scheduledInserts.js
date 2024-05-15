import cron from "node-cron";
import axios from "axios";
import env from "dotenv";

env.config({
    path:'../.env'
})
const port = process.env.PORT || 5000;
const serverURL = `http://localhost:${port}`

async function insertActiveHabits(group) {
    try {
        await axios.post(`${serverURL}/api/v1/insert/active`, { group })
    } catch (error) {
        console.log(error)
    }
}

//cron schedule format 'min hr dayOfMonth month dayOfWeek '
export const scheduledDailyUpdate = () => {
    cron.schedule('0 0 * * *', () => {insertActiveHabits('Daily')});
}

export const scheduledWeeklyUpdate = () => {
    cron.schedule('0 0 * * Sunday', () => {insertActiveHabits('Weekly')});
}

export const scheduledMonthlyUpdate = () => {
    cron.schedule('0 0 1 * *', () => {insertActiveHabits('Monthly')});
} 

