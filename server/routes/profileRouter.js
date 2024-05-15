// server/routes/profileRouter.js
import express from 'express';
import { 
    updatePassword, 
    updateUserInfo 
} from '../controllers/profileController.js';

const profileRouter = express.Router()

// Router for user updating email or name
profileRouter.patch('/update/userinfo', updateUserInfo);

// Router for user updating password
profileRouter.patch('/update/password', updatePassword);

export default profileRouter;