import { Router } from 'express';
import { stripeWebhook } from '../controllers/webhookController.js';
import express from 'express'; 

const router = Router();

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;