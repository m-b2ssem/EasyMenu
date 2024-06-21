import express from 'express';  // import express from 'express';
import path from 'path';  // import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import Stripe from 'stripe';
import pg from 'pg';
import session from 'express-session';
import { selectUser ,
  checkIfUserExist,
  insertUser,
  insertMenu,
  insertDesign,
  getMenuById,
  deleteItem,
  findHeighestPriority,
  insertItem,
  getItemsByCategory,
  getDesignByMenuId,
  updateColoInDesign,
  updateLangauge
} from './querys.js';
import {createLangaugeList, convertArrayBufferToBase64, cehckSizeandConvertTOBytea} from './helperFunctions.js';
import { updatePriorities } from './updatePriorities.js';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { categories, user, backgroundImage, currency } from './test.js';
import multer from 'multer';




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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/index.html'));
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/login_page.html'));
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/register_page.html'));
})

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
      const image = 'data:image/png;base64,' + convertArrayBufferToBase64(menu.qrcode);
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





app.get('/management/category/:userid', (req, res) => {
  const urlid = parseInt(req.params.userid);
  console.log(req.isAuthenticated());
  console.log(urlid);
  console.log(req.user.user_id);
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





// to do. I need to delete the chosse item from the database
app.post('/deleteitem', async(req, res) => {
  const itemId = req.body.itemId;
  const result = await deleteItem(db, itemId);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({ success: true });
});

// to do. I need to add  item to the database

const upload = multer();
app.post('/additem', upload.single('image'), async (req, res) => {
  const { itemName, price, description, categoryId } = req.body;
  const file = req.file;
  const buffer = await cehckSizeandConvertTOBytea(file);
  if (!buffer) {
    return res.json({ success: false, message: 'Image is too large.'});
  }
  const priority = await findHeighestPriority(db, categoryId);
  const intPrice = parseFloat(price);
  const inserted = await insertItem(db, categoryId, itemName, description, intPrice, buffer, priority);
  if (!inserted) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  
  res.json({ success: true });
  });


app.get('/get-items', async (req, res) => {
  const category_id = req.query.categoryId; // Access query parameter
  const items = await getItemsByCategory(db, category_id);
  res.json({items});
});

// tp render the info inside the ejs items page
app.get('/management/items/:userid', (req, res) => {
  const urlid = parseInt(req.params.userid);
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    if (urlid === req.user.user_id) {
      const itmms = categories[0].items;
      res.render('menu', {'user': user, 'year': new Date().getFullYear(), 'categories': categories, 'items': itmms});
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
});


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
  // remove the password from the user object
  delete user.password;
    cb(null, user);
});

passport.deserializeUser(function(user, cb) {
    cb(null, user);
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost: ' + PORT);
})

