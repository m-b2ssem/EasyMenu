import { config } from 'dotenv';
import Stripe from 'stripe';
import * as deepl from 'deepl-node';
config();

export const PORT = process.env.PORT;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const STRIPE_KEY = process.env.STRIPE_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const STRIPE_MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID;
export const STRIPE_YEARLY_PRICE_ID = process.env.STRIPE_YEARLY_PRICE_ID;
export const stripe = new Stripe(STRIPE_KEY);
export const EASY_MENU_APIKEY = process.env.EASY_MENU_APIKEY;

export const languages_code = ["en-GB", "de", "es", "ar", "tr", "it", "fr", "ja", "el", "cs", "zh-hans", "pt-pt", "ko", "pl"];
export const languages_code_db = ["en", "de", "es", "ar", "tr", "it", "fr", "ja", "el", "cs", "zh", "pt", "ko", "pl"];
const DEPPL_API_KEY = process.env.DEPPL_API_KEY;
export const translator = new deepl.Translator(DEPPL_API_KEY);

export default stripe;
