import { config } from 'dotenv';
import Stripe from 'stripe';
config();

export const PORT = process.env.PORT;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const STRIPE_KEY = process.env.STRIPE_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const STRIPE_MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID;
export const STRIPE_YEARLY_PRICE_ID = process.env.STRIPE_YEARLY_PRICE_ID;
export const stripe = new Stripe(STRIPE_KEY);
export const EASY_MENU_APIKEY = process.env.EASY_MENU_APIKEY;

export default stripe;
