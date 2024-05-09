import express from 'express';
import { 
    updatePassword, 
    updateUserInfo 
} from '../controllers/profileController.js';

const profileRouter = express.Router()

profileRouter.patch('/update/userinfo', updateUserInfo);

profileRouter.patch('/update/password', updatePassword);

export default profileRouter;