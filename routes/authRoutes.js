import { Router } from 'express';
import {
    forgotPassword,
    resetPassword,
    renderResetPasswordPage,
    chnagePassword,
    register,
    login,
    logout,
} from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authLoggrdin.js';
import { deleteAccountApi } from '../controllers/userController.js';
import passport from 'passport';

const router = Router();

router.post('/register', register);
router.post('/login', passport.authenticate('local', { failureRedirect: '/login/failed' }), login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/reset-password', renderResetPasswordPage);
router.post('/change-pass', chnagePassword);
router.post('/delete-account', isAuthenticated, deleteAccountApi);


export default router;