import express from 'express';  // import express from 'express';
import path from 'path';  // import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import Stripe from 'stripe';
import pg from 'pg';
import session from 'express-session';
import { 
  selectUserByEmail,
  getUserIdByMenuId,
  checkIfUserExist,
  insertUser,
  insertMenu,
  insertDesign,
  deleteItem,
  findHeighestPriority,
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
  getMenuByUserId,
  getMenuByMenuId,
  getItemByItemId,
  updateItem,
  getCategoryByCategoryId,
  updateItemStatus,
  updateCategoryName,
  selectSubscrptionPlanByUserId,
  insertSubscription,
  selectSubscrptionByUserId,
  updateSubscription,
  deleteAccount,
  updateResetPassword,
  selectUserByToken,
  updatePassword,
} from './querys.js';
import {createLangaugeList, convertArrayBufferToBase64, cehckSizeandConvertTOBytea, formatDate} from './helperFunctions.js';
import {sendEmail, generateResetToken, sendEmailJana} from './sendEmail.js';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import multer from 'multer';
import  fs  from 'fs';


let stripe_key = process.env.STRIPE_KEY;
const stripe = new Stripe(stripe_key);
config();
export const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 60000 * 60 * 24 * 30  // 1 manoth
   }
}));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

db.connect((err) => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to the database');
  }
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
const PORT = process.env.PORT;  // const PORT = 3000;
const saltRounds = 10;


app.get('/tt', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/cookies.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/index.html'));
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

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const lowerCaseEmail = email.toLowerCase();

  try {
    const user = await selectUserByEmail(db, lowerCaseEmail);

    if (!user) {
      return res.render('message.ejs', { message: 'something went wrong, please try again',
        link: '/forgot-password',
        name: 'forgot password'
       });
    }

    const token = await generateResetToken();
    const resetPasswordExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await updateResetPassword(db, lowerCaseEmail, token, resetPasswordExpires);
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
  const user = await selectUserByToken(db, token);
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
  const user = await selectUserByToken(db, token);
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
        const result = await updatePassword(db, user.user_id, hash);
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

app.get('/menu/:menuid/:res', async (req, res) => {
  const menuid = req.params.menuid;

  const result = await getMenuByMenuId(db, menuid);
  if (!result) {
    return res.render('message.ejs', { message: 'There is no menu found, please login to see the menu URL.', link: '/login', name: 'login' });
  }
  const menu = result[0];
  if (!menu) {
    return res.render('message.ejs', { message: 'There is no menu found, please login to see the menu URL.', link: '/login', name: 'login' });
  }

  const response = await selectSubscrptionPlanByUserId(db, menu.user_id);
  const createdAt = new Date(response.created_at);
  const expirationDate = new Date(createdAt);
  expirationDate.setDate(expirationDate.getDate() + response.duration_days);
  const today = new Date();
  const isPlanValid = expirationDate > today;

//implament it later to display just when the plan is valid
  if (isPlanValid){
    let user = await selectUserById(db, menu.user_id);
    user = user.rows[0];
    const menu_design = await getDesignByMenuId(db, menuid);
    const language = await createLangaugeList(menu.menu_language);
    let categories = await getCategoriesWithItems(db, menuid);
    let logo = await getLogoImage(db, menuid);
    if (!logo) {
      logo ='https://easymenus.eu/img/mainlogo.jpg';
    }
    else{
      logo = 'data:image/png;base64,' + await convertArrayBufferToBase64(logo);
    }
    if (!categories) {
      categories = [];
    }
    const currency = '€';
    const bachground_color = menu_design.background_color;
    res.render('horizontal_menu.ejs', {
      'categories': categories,
      'backgroundImage': logo,
      'currency': currency,
      'language': language,
      'background_color': bachground_color,
      'user': user
    });
  }else {
    return res.render('message.ejs', { message: 'Your subscription is expaired, please go to your profile to renew it.', link: '/login', name: 'login' });
  }
});




app.get('/management/menu/:userid', async (req, res) => {
  const urlid = parseInt(req.params.userid);
  if (req.isAuthenticated()) {
    if (urlid === req.user.user_id) {
      const menus = await getMenuByUserId(db ,urlid);
      const menu = menus[0];
      let name_of_menu =  menu.menu_name.replace(/\s+/g, '');
      name_of_menu = name_of_menu.toLowerCase();

      const menu_name = 'https://www.easymenus.eu/menu/' + menu.menu_id +'/' + name_of_menu;
      const langauges = await createLangaugeList(menu.menu_language);
      const image = await 'data:image/png;base64,' + await convertArrayBufferToBase64(menu.qr_code);
      const menuDesign = await getDesignByMenuId(db, menu.menu_id);
      res.render('menu', {
        'user': req.user ,
        'year': new Date().getFullYear(),
        'langauges': langauges,
        'menu_name': menu_name,
        'image': image,
        'background_color': menuDesign.background_color,
        'menu_id': menu.menu_id
      });
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
});



const storage = multer();
app.post('/uplaod-logo-image', storage.single('image'), async (req, res) => {
  const file = req.file;
  const menu_id = req.body.menu_id;
  const buffer = await cehckSizeandConvertTOBytea(file);
  if (!buffer) {
    return res.json({ success: false, message: 'Image is too large.'});
  }
  const result = await updateLogoImage(db, menu_id, buffer);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({ success: true });
});

app.post('/updateColor', async (req, res) => {
  let {designId, color }= req.body;
  designId = parseInt(designId);
  
  const  result = await updateColoInDesign(db, designId, color);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({ success: true });
});

app.post('/updateLangauge', async (req, res) => {
  let {langauge, menuId }= req.body;
  menuId = parseInt(menuId);

  const  result = await updateLangauge(db, langauge, menuId);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({ success: true });
});





app.get('/management/category/:userid', async (req, res) => {
  const urlid = parseInt(req.params.userid);
  const user = req.user;

  if (req.isAuthenticated()) {
    if (urlid === req.user.user_id) {
      const categories = await getCategoriesByUserId(db, req.user.user_id);
      const menus = await getMenuByUserId(db ,urlid);
      res.render('categories', {'user': user, 'categories': categories, 'year': new Date().getFullYear(), 'menus': menus});
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
});

app.post('/add-category', async (req, res) => {
  const {categoryName, menuId} = req.body;
  const menu_id = parseInt(menuId);
  const userId = req.user.user_id
  const result = await insertCategory(db, menu_id, categoryName, userId);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.redirect('/management/category/' + userId);
});

app.post('/deletecategory', async (req, res) => {
  const categoryId = req.body.categoryId;
  const result = await deleteCategory(db, categoryId);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.redirect('/management/category/' + req.user.user_id);
});

app.post('/update-category', async (req, res) => {
  const {categoryId, newCategoryName} = req.body;

  const result = await updateCategoryName(db, categoryId, newCategoryName);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({ success: true });
});


// get all categories from the database by menu id and return them as JSON
app.get('/get-categories', async (req, res) => {
  const menuId = req.query.menuId; // Access query parameter
  let categories = await getCategoriesByMenuId(db, menuId);
  if (!categories) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }

  categories = await categories.sort((a, b) => b.priority - a.priority);
  res.json({categories});
});


app.get('/get-category-status', async (req, res) => {
  const categoryId = parseInt(req.query.categoryId);
  const category = await getCategoryByCategoryId(db, categoryId);
  if (!category) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({category});
});

app.post('/reorder-categories', async(req, res) => {
  const order = req.body.order;

  let priority = 1;


  const reversedCategoriesIds = order.slice().reverse();
  try {
    for (const id of reversedCategoriesIds) {
      // update the priority of the category
      await updateCategoryPriority(db ,id, priority);
      priority++;
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
});


// update the order in the database
app.post('/reorder-items', async(req, res) => {
  const order = req.body.order;

  let priority = 1;


  const reversedItemsIds = order.slice().reverse();
  try {
    for (const id of reversedItemsIds) {
      // update the priority of the category
      await updateItemPriority(db ,id, priority);
      priority++;
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
});


app.get('/get-item-status', async (req, res) => {
  const itemId = parseInt(req.query.itemId);
  const item = await getItemByItemId(db, itemId);
  if (!item) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({item});
});

app.post('/update-item-status', async(req, res) => {
  const itemId = parseInt(req.body.itemId);
  const status = req.body.status;
  const result = await updateItemStatus(db, itemId, status);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({ success: true });
});







// to do. I need to delete the chosse item from the database
app.post('/deleteitem', async(req, res) => {
  const itemId = parseInt(req.body.itemId);
  const result = await deleteItem(db, itemId);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.redirect('/management/items/' + req.user.user_id);
});




// to do. I need to add  item to the database

const upload = multer();
app.post('/additem', upload.single('image'), async (req, res) => {
  let { itemName, price, description, categoryId, allergies, foodType } = req.body;
  const file = req.file;
  let buffer = null;
  let capitalisedAllergies = null;

  if (allergies){
    capitalisedAllergies = allergies.toUpperCase();
  }
  if (!itemName || !price || !description || !categoryId) {
    return res.json({ success: false, message: 'Please fill all fields.'});
  }
  if (file) {
    buffer = await cehckSizeandConvertTOBytea(file);
    if (!buffer) {
      return res.json({ success: false, message: 'Image is too large.'});
    }
  }
  categoryId = parseInt(categoryId);
  const intPrice = parseFloat(price);
  if (isNaN(intPrice)  || intPrice === undefined){
    return res.json({ success: false, message: 'Please enter a valid number in the Prise filed'});
  }
  const inserted = await insertItem(db, categoryId, itemName, description, intPrice, buffer, foodType, capitalisedAllergies);
  if (!inserted) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({ success: true });
  });



  const update_item = multer();
app.post('/update-item', update_item.single('image'), async (req, res) => {
  let { itemName, price, description, categoryId, itemId, foodType, allergies } = req.body;
  const file = req.file;
  let capitalisedAllergies = null;
  if (!itemName || !price || !description || !categoryId) {
    return res.json({ success: false, message: 'Please fill all fields.'});
  }
  if (allergies){
    capitalisedAllergies =  allergies.toUpperCase();
  }
  if (file) {
    const buffer = await cehckSizeandConvertTOBytea(file);
    if (!buffer) {
      return res.json({ success: false, message: 'Image is too large.'});
    }
    categoryId = parseInt(categoryId);
    const intPrice = parseFloat(price);
    if (isNaN(intPrice)  || intPrice === undefined){
      return res.json({ success: false, message: 'Please enter a valid number in the Prise filed'});
    }
    const update = await updateItem(db, categoryId, itemName, description, intPrice, buffer, itemId,foodType, capitalisedAllergies);
    if (!update) {
      return res.json({ success: false, message: 'Something went wrong, please try again.'});
    }
  }
  else
  {
    categoryId = parseInt(categoryId);
    const intPrice = parseFloat(price);
    if (isNaN(intPrice)  || intPrice === undefined){
      return res.json({ success: false, message: 'Please enter a valid number in the Prise filed'});
    }
    const update = await updateItem(db, categoryId, itemName, description, intPrice, null, itemId, foodType, capitalisedAllergies);
    if (!update) {
      return res.json({ success: false, message: 'Something went wrong, please try again.'});
    }
  }
  res.json({ success: true });
  });


app.get('/get-items', async (req, res) => {
  const category_id = req.query.categoryId; // Access query parameter
  const items = await getItemsByCategory(db, category_id);
  res.json({items});
});

app.get('/get-item', async (req, res) => {
  const itemId = parseInt(req.query.itemId);
  const item = await getItemByItemId(db, itemId);
  if (!item) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({item});
});

app.get('/get-category-name', async (req, res) => {
  const categoryId = parseInt(req.query.categoryId);
  const category = await getCategoryByCategoryId(db, categoryId);
  if (!category) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({category});
});


// tp render the info inside the ejs items page
app.get('/management/items/:userid', async(req, res) => {
  const urlid = parseInt(req.params.userid);
  if (req.isAuthenticated()) {
    if (urlid === req.user.user_id) {
      const categories = await getCategoriesByUserId(db, req.user.user_id);
      const items = await getItemsByuserId(db, req.user.user_id);
      res.render('items', {'user': req.user, 'year': new Date().getFullYear(), 'categories': categories, 'items': items});
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
});

app.get('/management/profile/:user_id', async (req, res) => {
  if (req.isAuthenticated()) {
    const user_id = parseInt(req.params.user_id);
    const result = await selectUserById(db, user_id);
    if (result.rows.length > 0) {
      let subscription_plan = await selectSubscrptionPlanByUserId(db, user_id);
      const subscription = await selectSubscrptionByUserId(db, user_id);

      const customer = await stripe.customers.retrieve('cus_QPxE4HfPfrvgOg');
      const inc = await stripe.invoices.list({customer: 'cus_QPxE4HfPfrvgOg'});
      console.log(Date(inc.data[0].period_end));
      console.log(customer);
      const createdAt = new Date(subscription_plan.created_at);
      const expirationDate = new Date(createdAt);
      expirationDate.setDate(expirationDate.getDate() + subscription_plan.duration_days);
      const today = new Date();
      const isPlanValid = expirationDate > today;
      if (isPlanValid) {
        subscription_plan.status = 'active';
      }
      else {
        subscription_plan.status = 'expired';
      }
      if (subscription_plan.plan_name === 'free_trial') {
        subscription_plan.plan_name = 'free trial';
      }

      const user = result.rows[0];
      res.render('profile.ejs', {
        'user': user,
        'subscription_plan': subscription_plan,
        'year': new Date().getFullYear()});
    }    
    else
    {
      res.redirect('/login');
    }
  }
  else
  {
    res.redirect('/login');
  }
});




app.post('/change-pass', async (req, res) => {
  const { currentPassword, newPassword, userId } = req.body;

  try {
    const result = await selectUserById(db, parseInt(userId));
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const hashPassword = user.password;
      
      const isMatch = await bcrypt.compare(currentPassword, hashPassword);
      
      if (isMatch) {
        const hash = await bcrypt.hash(newPassword, saltRounds);
        const updateResult = await updatePassword(db, userId, hash);

        if (updateResult) {
          return res.json({ success: true });
        } else {
          return res.json({ success: false, message: 'Something went wrong, please try again.' });
        }
      } else {
        return res.json({ success: false, message: 'Current password is incorrect.' });
      }
    } else {
      return res.json({ success: false, message: 'User not found.' });
    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Something went wrong, please try again.' });
  }
});




// stripe subscription

app.post('/create-checkout-session', async (req, res) => {
  const { subscription, userId } = req.body;
  if (req.isAuthenticated()){
    console.log('subscription: ', subscription, userId);
    try {
      const  stringUserId = userId.toString();
      const sessionStripe = await stripe.checkout.sessions.create({
        success_url: "http://easymenu.eu/success/" + userId + "/" + subscription,
        cancel_url: "http://easymenu.eu/management/profile/"+ userId,
        line_items: [
          {
            price: process.env.PRICE_ID,
            quantity: 1,
          },
        ],
        mode: "subscription",
      });
      const plan = await selectSubscrptionPlanByUserId(db, userId);
      const response_1 = await selectSubscrptionByUserId(db, userId);
      if (response_1){
        await updateSubscription(db, userId, null, sessionStripe.id,null,null,null, false);
      }
      else{
        const result = await insertSubscription(db, plan.plan_id, userId, sessionStripe.id);
      }
  

  
      return res.json({ url: sessionStripe.url });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
});


app.get('/success/:userId/:subscription', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const subscription = req.params.subscription;

  const response = await selectSubscrptionByUserId(db, userId);
  const user = await selectUserById(db, userId);

  if (!response.stripe_session_id) {
    return res.render('profile.ejs', {
      'user': user.rows[0],
      'subscription_plan': 'none',
      'year': new Date().getFullYear(),
      'message': 'Something went wrong, please try again.'
    });
  }else{
    try {
      const session = await stripe.checkout.sessions.retrieve(response.stripe_session_id);
      if (session.payment_status === 'paid' && session.status === 'complete'){
        const customer_id = session.customer;
        const today = new Date();
        let futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 35); // Add 35 days
        const start_date = await formatDate(today);
        const end_date = await formatDate(futureDate);
        const paid = true;
        const respone_2 = await updateSubscription(db, userId, customer_id, session.id, start_date, end_date, 'activ', paid);
      }
    } catch (error) {
      console.log(error);
    }
  }
});


app.post('/delete-account', async (req, res) => {
  const { userId } = req.body;
  console.log(userId);


  const subscription = await selectSubscrptionByUserId(db, userId);
  if (subscription.stripe_customer_id) {
    try {
      await stripe.customers.del(subscription.stripe_customer_id);
    } catch (error) {
      console.log(error);
    }
  }
  const result = await deleteAccount(db, userId);
  if (!result) {
    return res.json({ success: false });
  }
  res.json({ success: true });
});



app.post('/register', async (req, res) => {
  const { campanyName, email, password } = req.body;

  if (!campanyName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill all fields.' });
  }

  const lowerCaseEmail = email.toLowerCase();
  const checkIfExist = await checkIfUserExist(db, lowerCaseEmail);
  if (checkIfExist) {
    return res.status(409).json({ success: false, message: 'This email address already exists.' });
  } else {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong, please try again.' });
      } else {
        const result = await insertUser(db, campanyName, lowerCaseEmail, hash);
        const result_2 = await insertMenu(db, result.rows[0].user_id, campanyName);
        const result_3 = await insertDesign(db, result_2.rows[0].menu_id);
        const result_4 = await insertSubscriptionPlan(db, 'free_trial', result.rows[0].user_id, 0, 30);
        let registerTemplate = fs.readFileSync(path.join(__dirname, '/public/pages/register-template.html'), 'utf8');

        await sendEmail(lowerCaseEmail, 'Welcome to Easy Menu – Your Registration is Complete!', registerTemplate);
        const result_user = result.rows[0];

        req.login(result_user, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Login failed, please try again.' });
          } else {
            return res.status(200).json({ success: true, message: 'Registration successful.', userId: result_user.user_id });
          }
        });
      }
    });
  }
});

app.get('/zz', async (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/forgot-password-template.html'));

});


app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login/failed' }),
  function(req, res) {
    res.redirect('/management/menu/' + req.user.user_id);
  });

  app.get('/logout', function(req, res){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });

passport.use(
  new Strategy (async function verify(username, password, cb) {
    try {
      const result = await selectUserByEmail(db, username.toLowerCase());
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const hashPassword = user.password;
        bcrypt.compare(password, hashPassword, (err, res) => {
          if (err) {
            console.log(err);
            return cb(err);
          } else {
            if (res) {
              return cb(null, user);
            } else {
              cb(null, false);
            }
          }
        }); 
      } else {
        return cb(null, false);
      }
    } catch (error) {
      cb(error);
    }
  }));

passport.serializeUser(function(user, cb) {
  // remove the password from the user object
  delete user.password;
    cb(null, user);
});


passport.deserializeUser(function(user, cb) {
    cb(null, user);
});



// jana section

app.get('/jana', (req, res) =>{
  res.sendFile(path.join(__dirname, '/public/jana/jana.html'));
});

const storage_jana = multer();
app.post('/jana', storage_jana.single('manuscript_file'), async (req, res) => {
  const file = req.file;
  const body = req.body;

  if (body.service === '4' && !body.ISBN){
    return res.json({success: false, message: 'Prosím, vyplňte pole s ISBN.'})
  }
  console.log(file);
  if (!file.originalname.includes('.docx')){
    return res.json({success: false, message: 'Prosím, dokument nahrávajte iba vo formáte MS Word.'})
  }

  const bodyString = JSON.stringify(body, null, 2);

  await sendEmailJana(bodyString, file);
  res.json({ success: true,  message: 'Váš formulár bol úspešne vyplnený.' });
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost: ' + PORT);
});

