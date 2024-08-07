import express from 'express';  // import express from 'express';
import path from 'path';  // import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import Stripe from 'stripe';
import session from 'express-session';
import { 
  selectUserByEmail,
  getUserIdByMenuId,
  checkIfUserExist,
  insertUser,
  insertMenu,
  insertDesign,
  deleteItem,
  selectUserByConfirmToken,
  insertItem,
  insertSubscriptionPlan,
  getItemsByCategory,
  getDesignByMenuId,
  updateColoInDesign,
  updateLangauge,
  getItemsByuserId,
  getCategoriesByUserId,
  insertCategory,
  getCategoriesByMenuId,
  updateCategoryPriority,
  deleteCategory,
  getCategoriesWithItems,
  updateLogoImage,
  getLogoImage,
  updateItemPriority,
  selectUserById,
  getUserByEmail,
  updateEmail,
  getMenuByUserId,
  getMenuByMenuId,
  getItemByItemId,
  updateItem,
  updateConfirmToken,
  updateEmailVerified,
  getCategoryByCategoryId,
  updateItemStatus,
  updateCategoryName,
  selectSubscrptionPlanByUserId,
  insertSubscription,
  selectSubscrptionByUserId,
  updateSubscription,
  updateSubscriptionPlan,
  deleteAccount,
  updateResetPassword,
  selectUserByPassToken,
  updatePassword,
  updatecategoryStatus,
  updateCurrency,
} from './querys.js';
import {createLangaugeList, createCurrencyList,convertArrayBufferToBase64, cehckSizeandConvertTOBytea, formatDate, parsePrice, generateNumericEventId} from './helperFunctions.js';
import {sendEmail, generateResetToken, sendEmailJana} from './sendEmail.js';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import multer from 'multer';
import  fs  from 'fs';
import { sendMetaConversionEvent, hashData } from './conversions.js';
import { generatePdf } from './services/generatePdf.js';
import { v4 as uuidv4 } from 'uuid';
import pdfRoutes from './routes/pdfRoutes.js';
import staticRoutes from './routes/staticRoutes.js';
import { render } from 'ejs';
import axios from 'axios';


let stripe_key = process.env.STRIPE_KEY;
const stripe = new Stripe(stripe_key);
config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 60000 * 60 * 24 * 30  // 1 manoth
   }
}));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


app.use(pdfRoutes);
app.use(staticRoutes);


const PORT = process.env.PORT;  // const PORT = 3000;
const saltRounds = 10;

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      const customerSubscriptionCreated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.created
      console.log('customer.subscription.created');
      break;
    case 'customer.subscription.deleted':
      const customerSubscriptionDeleted = event.data.object;
      const userId = parseInt(subscription.metadata.userId, 10);
      const user_subscription = await selectSubscrptionByUserId(userId);
      if (user_subscription) {
        const result = await updateSubscription(userId, null, null, null, null, 'canceled', false, null);
        const result_2 = await updateSubscriptionPlan('none', userId, 0, 0);
      }
      console.log('customer.subscription.deleted');
      break;
    case 'customer.subscription.updated':
      const customerSubscriptionUpdated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.updated
      console.log('customer.subscription.updated');
      break;
    case 'subscription_schedule.aborted':
      const subscriptionScheduleAborted = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.aborted
      console.log('subscription_schedule.aborted');
      break;
    case 'subscription_schedule.canceled':
      const subscriptionScheduleCanceled = event.data.object;
      console.log('subscription_schedule.canceled');
      break;
    case 'subscription_schedule.completed':
      const subscriptionScheduleCompleted = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.completed
      console.log('subscription_schedule.completed');
      break;
    case 'subscription_schedule.created':
      const subscriptionScheduleCreated = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.created
      console.log('subscription_schedule.created');
      break;
    case 'subscription_schedule.updated':
      const subscriptionScheduleUpdated = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.updated
      console.log('subscription_schedule.updated');
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.use(express.json());


app.get('/cookie-policy', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/cookies.html'));
});

app.get('/imprint', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/imprint.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/terms.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/privacy-policy.html'));
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/index.html'));
});

// Optional: create a specific route for the sitemap
app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/login_page.html'));
});

app.get('/login/failed', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/login_page_failed.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/register_page.html'));
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/forgot-password.html'));
});

app.get('/completed-registration', (req, res) => {
  const params = req.query;
  console.log(params);
  res.sendFile(path.join(__dirname, '/public/pages/complete_registration.html'));
});


// This is your Stripe CLI webhook secret for testing your endpoint locally.
/const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      const customerSubscriptionCreated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.created
      console.log('customer.subscription.created');
      break;
    case 'customer.subscription.deleted':
      const customerSubscriptionDeleted = event.data.object;
      const userId = parseInt(subscription.metadata.userId, 10);
      const user_subscription = await selectSubscrptionByUserId(userId);
      if (user_subscription) {
        const result = await updateSubscription(userId, null, null, null, null, 'canceled', false, null);
        const result_2 = await updateSubscriptionPlan('none', userId, 0, 0);
      }
      console.log('customer.subscription.deleted');
      break;
    case 'customer.subscription.updated':
      const customerSubscriptionUpdated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.updated
      console.log('customer.subscription.updated');
      break;
    case 'subscription_schedule.aborted':
      const subscriptionScheduleAborted = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.aborted
      console.log('subscription_schedule.aborted');
      break;
    case 'subscription_schedule.canceled':
      const subscriptionScheduleCanceled = event.data.object;
      console.log('subscription_schedule.canceled');
      break;
    case 'subscription_schedule.completed':
      const subscriptionScheduleCompleted = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.completed
      console.log('subscription_schedule.completed');
      break;
    case 'subscription_schedule.created':
      const subscriptionScheduleCreated = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.created
      console.log('subscription_schedule.created');
      break;
    case 'subscription_schedule.updated':
      const subscriptionScheduleUpdated = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.updated
      console.log('subscription_schedule.updated');
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const lowerCaseEmail = email.toLowerCase();

  try {
    const user = await selectUserByEmail(lowerCaseEmail);

    if (!user.rows[0]) {
      return res.render('message.ejs', { message: 'something went wrong, please try again',
        link: '/forgot-password',
        name: 'forgot password'
       });
    }

    const token = await generateResetToken();
    const resetPasswordExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await updateResetPassword(lowerCaseEmail, token, resetPasswordExpires);
    const resetLink = `http://easymenus.eu/reset-password?token=${token}`;
    let registerTemplate = fs.readFileSync(path.join(__dirname, '/public/pages/forgot-password-template.html'), 'utf8');
    registerTemplate = registerTemplate.replace('%link%', resetLink);

  
    await sendEmail(lowerCaseEmail, 'Reset your password', registerTemplate);
    return res.render('message.ejs', { message: 'Email was sent to reset your password. Please check your email.',
      link: '/login',
      name: 'login'
     });
  } catch (error) {
    console.error(error);
    return res.render('message.ejs', { message: 'something went wrong, please try again',
      link: '/forgot-password',
      name: 'forgot password'
     });
  }
});

app.get('/reset-password', async (req, res) => {
  const token = req.query.token;
  const user = await selectUserByPassToken(token);
  const now = new Date(Date.now());
  const expire = user.reset_password_expires < now;

  if (!user || expire) {
    return res.render('reset-password.ejs', { token, expire} );
  }

  res.render('reset-password.ejs', { token, expire} );
});


app.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const now = new Date(Date.now());
  const user = await selectUserByPassToken(token);
  const expire = user.reset_password_expires < now;
  

  if (!user || expire) {
    return res.render('message.ejs', { message: 'The time to reset the password has expired. Please try again.',
      link: '/forgot-password',
      name: 'forgot password'
     });
  }

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      return res.render('message.ejs', { message: 'The time to reset the password has expired. Please try again.',
        link: '/forgot-password',
        name: 'forgot password'
       });
    } else {
      try {
        const result = await updatePassword(user.user_id, hash);
      if (!result) {
        return res.render('message.ejs', { message: 'Password has not been reset. Please try again.',
          link: '/forgot-password',
          name: 'forgot password'
         });
      }
      return res.render('message.ejs', { message: 'Password has been reset. Please login.',
        link: '/login',
        name: 'login'
       });
      } catch (error) {
        console.error(error);
      }
    }
  });
});