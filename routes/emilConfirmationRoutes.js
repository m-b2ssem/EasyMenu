import { Router } from 'express';
import {
    changeEmail,
    confirmEmail,
    resendConfirmationEmail
} from '../controllers/emilConfirmationController.js';

const router = Router();

router.post('/change-email', changeEmail);
router.post('/resend-confirmation-email', resendConfirmationEmail);
router.get('/confirm-email/:token', confirmEmail);

export default router;