import { Router } from 'express';
import { sendVerificationCode, verifyEmailCode } from '../controllers/changeEmail.js';

const router = Router();

router.post('/sendVerificationCode', sendVerificationCode);
router.post('/verifyEmailCode', verifyEmailCode);

export default router;