import { Router } from "express";
import { Stripe } from "stripe"
import { isAuthenticated } from "../middlewares/authLoggrdin.js";
import { cancelSubscription,
    createCheckoutSession,
    successSubscription,
    getInvoice
} from "../controllers/stripeController.js";

const router = Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/cancel-subscription', cancelSubscription);
router.get('/success/:userId/:period', successSubscription);
router.post('/getInvoice', getInvoice);


export default router;