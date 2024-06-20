import express from 'express';  // import express from 'express';
import path from 'path';  // import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import Stripe from 'stripe';
import pg from 'pg';
import session from 'express-session';
import { selectUser , checkIfUserExist, insertUser, insertMenu, insertDesign
  ,getMenuById
} from './querys.js';
import {createLangaugeList} from './helperFunctions.js';
import { updatePriorities } from './updatePriorities.js';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { categories, user, backgroundImage, currency } from './test.js';
import { get } from 'http';
import { create } from 'domain';



let stripe_key = process.env.STRIPE_KEY;
const stripe = new Stripe(stripe_key);
config();
const app = express();

app.use(session({
  secret: 'ROPQWJFJ',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 60000 * 60 * 24 * 7  // 1 week
   } 
}));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "easymenu",
  password: "1234",
  port: 5432,
});

db.connect();  // const app = express();
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









/*
app.get('/:userid/:resturantname', (req, res) => {
  const logo = data.client.logo;
  const resturantName = 'bassem';
  const backgroundColor = data.client.backgroundColor;
  const items = data.categories[0].items;
  const categories = data.categories;
  res.render('index', {'categories': categories, 'items': items, 'logo': logo, resturantName: resturantName});
});
*/



app.get('/d', (req, res) => {
  res.render('horizontal_menu.ejs', {'categories': categories, 'backgroundImage': backgroundImage, 'currency': currency});
})



app.get('/management/menu/:userid', async (req, res) => {
  const urlid = parseInt(req.params.userid);
  if (req.isAuthenticated()) {
    if (urlid === req.user.user_id) {
      const menu = await getMenuById(db ,req.user.user_id);
      const menu_name = 'http://www.easymenu.systems/menu/' + req.user.user_id +'/'+ menu.menu_name.replace(/\s+/g, '');;
      const langauges = await createLangaugeList(menu.menu_langauge);
      console.log(menu);
      res.render('menu', {'user': user, 'year': new Date().getFullYear(), 'langauges': langauges, 'menu_name': menu_name});
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
});

app.get('/management/category/:userid', (req, res) => {
  const urlid = parseInt(req.params.userid);
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    if (urlid === req.user.user_id) {
      res.render('categories', {'user': user, 'year': new Date().getFullYear()});
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
});

app.get('/management/items/:userid', (req, res) => {
  const urlid = parseInt(req.params.userid);
  if (req.isAuthenticated()) {
    if (urlid === req.user.user_id) {
      res.render('menu', {'user': user, 'year': new Date().getFullYear()});
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
});

app.get('/c', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/categry.html'));
});


// get all categories from the database by menu id and return them as JSON
app.get('/get-categories', (req, res) => {
  const menuId = req.query.menuId; // Access query parameter
  console.log('Menu ID:', menuId);

  res.json({categories});
});


// update the order in the database
app.post('/update-order', (req, res) => {
  const order = req.body.order;
  //console.log('Updated Order:', order);

  // Update the order in your data store
  // Assuming success for this example
  updatePriorities(order);
  res.json({ success: true });
});


/*app.get('/:name/:id', (req, res) => {
  const logo = data.client.logo;
  const resturantName = req.params.name;
  const categoryId = parseInt(req.params.id);
  const selectedCategory = data.categories.find(category => category.id === categoryId);
  if (!selectedCategory) {
    return res.status(404).send('Category not found');
  }
  const items = selectedCategory.items;
  const categories = data.categories;
  res.render('index', {'categories': categories, 'items': items, logo: logo, resturantName: resturantName});
});*/


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/index.html'));
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/login_page.html'));
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/register_page.html'));
})




app.post('/register', async (req, res) => {
  const {campanyName, email, password} = req.body;



    if (!campanyName || !email || !password) {
        return res.json({ success: false, message: 'Please fill all fields.'});
    }

    // in need to pass the email lower case
    const checkIfExist = await checkIfUserExist(db, email);
    if (checkIfExist) {
        return res.json({ success: false, message: 'This email address already exists.'});
    }else{
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          return res.json({ success: false, message: 'Something went wrong, please try again.'});
        }else {
          const result = await insertUser(db, campanyName, email, hash);
          const result_2 = await insertMenu(db, result.rows[0].user_id, campanyName);
          const result_3 = await insertDesign(db, result_2.rows[0].menu_id);
              const user = result.rows[0];
              
          
              req.login(user, (err) => {
                if (err) {
                  console.log(err);
                  return res.redirect('/login');
              }else{
                return res.redirect('/management/menu/' + user.user_id);
              }
              });
          }
      });
    }
});


app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/management/menu/' + req.user.user_id);
  });


app.post("/checkout", async (req, res) => {
  const { id, amount } = req.body;

  try {
    const sessionStripe = await stripe.checkout.sessions.create({
      success_url: "http://localhost:8080/success",
      cancel_url: "http://localhost:8080",
      line_items: [
        {
          price: process.env.PRICE_ID,
          quantity: 12,
        },
      ],
      mode: "subscription",
    });

    console.log("session: ", sessionStripe.id, sessionStripe.url, sessionStripe);


    // save the info in the database
    const sessionId = sessionStripe.id;
    const url = sessionStripe.url;
    const subscription = sessionStripe.subscription;

    return res.json({ url: sessionStripe.url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});


app.get("/stripe-session", async (req, res) => {
  console.log("req.body: ", req.body);
  const { userId } = req.body;
  console.log("userId: ", userId);

  const db = req.app.get('db');

  // get user from you database
  const user = {
    stripe_session_id: "asdfpouhwf;ljnqwfpqo",
    paid_sub: false
  }

  if(!user.stripe_session_id || user.paid_sub === true) 
  return res.send("fail");

  try {
      // check session
      const session = await stripe.checkout.sessions.retrieve(user.stripe_session_id);
      console.log("session: ", session);

      // const sessionResult = {
      //   id: 'cs_test_a1lpAti8opdtSIDZQIh9NZ6YhqMMwC0H5wrlwkUEYJc6GXokj2g5WyHkv4',
      //   …
      //   customer: 'cus_PD6t4AmeZrJ8zq',
      //   …
      //   status: 'complete',
      //   …
      //   subscription: 'sub_1OOgfhAikiJrlpwD7EQ5TLea',
      //  …
      // }
      
    
      // update the user
      if (session && session.status === "complete") {
        let updatedUser = await db.update_user_stripe(
          userId,
          true
        );
        updatedUser = updatedUser[0];
        console.log(updatedUser);
    
        return res.send("success");
      } else {
        return res.send("fail");
      }
  } catch (error) {
      // handle the error
      console.error("An error occurred while retrieving the Stripe session:", error);
      return res.send("fail");
  }
});



passport.use(
  new Strategy (async function verify(username, password, cb) {
    try {
      const result = await selectUser(db, username);
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
        return cb("User not found.");
      }
    } catch (error) {
      cb(error);
    }
  }));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(user, cb) {
    cb(null, user);
});



app.listen(PORT, () => {
  console.log('Server is running on http://localhost: ' + PORT);
})

