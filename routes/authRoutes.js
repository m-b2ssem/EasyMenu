import { Router } from 'express';
import { forgotPassword, resetPassword, renderResetPasswordPage } from '../controllers/resetPasswordController.js';

const router = Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/reset-password', renderResetPasswordPage);

export default router;