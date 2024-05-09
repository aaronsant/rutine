import express from 'express';
import { 
    googleAuthCallback, 
    login, 
    loginFailed, 
    loginSuccess, 
    loginWithGoogle, 
    logout, 
    register 
} from '../controllers/authController.js';

const authRouter = express.Router();

// Router for user login with LOCAL strategy
authRouter.post('/login', login);
authRouter.get('/login/success', loginSuccess);
authRouter.get('/login/failed', loginFailed);

// Router for user registration with LOCAL
authRouter.post('/register', register);

// Router for user login with GOOGLE strategy
authRouter.get('/google', loginWithGoogle);
authRouter.get('/google/callback', googleAuthCallback);
//google callback routes (success and failure)????

// Router for user logout (both GOOGLE and LOCAL)
authRouter.get('/logout', logout);

export default authRouter;