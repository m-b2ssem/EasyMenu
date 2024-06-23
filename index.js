import express from 'express';  // import express from 'express';
import path from 'path';  // import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import Stripe from 'stripe';
import pg from 'pg';
import session from 'express-session';
import { selectEmailColumn , checkIfUserExist} from './querys.js';



let stripe_key = process.env.STRIPE_KEY;



const categories = [
  {
    id: 1,
    name: 'Appetizers',
    items: [
      { name: 'Spring Rolls', price: '5.99', description: 'Crispy vegetarian rolls.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' },
      { name: 'Garlic Bread', price: '3.99', description: 'Fresh garlic bread.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' }
    ]
  },
  {
    id: 2,
    name: 'Main Course',
    items: [
      { name: 'Grilled Chicken', price: '12.99', description: 'Served with vegetables.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' },
      { name: 'Pasta Carbonara', price: '10.99', description: 'Classic Italian pasta.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' }
    ]
  },
  {
    id: 3,
    name: 'Main Course',
    items: [
      { name: 'Grilled Chicken', price: '12.99', description: 'Served with vegetables.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' },
      { name: 'Pasta Carbonara', price: '10.99', description: 'Classic Italian pasta.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' }
    ]
  },
  {
    id: 4,
    name: 'Main Course',
    items: [
      { name: 'Grilled Chicken', price: '12.99', description: 'Served with vegetables.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' },
      { name: 'Pasta Carbonara', price: '10.99', description: 'Classic Italian pasta.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' }
    ]
  },
  {
    id: 5,
    name: 'Main Course',
    items: [
      { name: 'Grilled Chicken', price: '12.99', description: 'Served with vegetables.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' },
      { name: 'Pasta Carbonara', price: '10.99', description: 'Classic Italian pasta.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' }
    ]
  },
  {
    id: 6,
    name: 'Main Course',
    items: [
      { name: 'Grilled Chicken', price: '12.99', description: 'Served with vegetables.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' },
      { name: 'Pasta Carbonara', price: '10.99', description: 'Classic Italian pasta.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' }
    ]
  },
  {
    id: 7,
    name: 'Main Course',
    items: [
      { name: 'Grilled Chicken', price: '12.99', description: 'Served with vegetables.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' },
      { name: 'Pasta Carbonara', price: '10.99', description: 'Classic Italian pasta.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' }
    ]
  },
  {
    id: 8,
    name: 'Main Course',
    items: [
      { name: 'Grilled Chicken', price: '12.99', description: 'Served with vegetables.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' },
      { name: 'Pasta Carbonara', price: '10.99', description: 'Classic Italian pasta.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' }
    ]
  },
  {
    id: 9,
    name: 'Main Course',
    items: [
      { name: 'Grilled Chicken', price: '12.99', description: 'Served with vegetables.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' },
      { name: 'Pasta Carbonara', price: '10.99', description: 'Classic Italian pasta.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' }
    ]
  },
  {
    id: 10,
    name: 'Main Course',
    items: [
      { name: 'Grilled Chicken', price: '12.99', description: 'Served with vegetables.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' },
      { name: 'Pasta Carbonara', price: '10.99', description: 'Classic Italian pasta.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' }
    ]
  },
  {
    id: 11,
    name: 'Desserts',
    items: [
      { name: 'Chocolate Cake', price: '6.99', description: 'Rich chocolate cake.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' },
      { name: 'Ice Cream', price: '4.99', description: 'Vanilla ice cream.', image_path: 'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg' }
    ]
  }
];



const stripe = new Stripe(stripe_key);
config();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "easymenu",
  password: "1234",
  port: 5432,
});

//db.connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const app = express();  // const app = express();
const PORT = 5000;  // const PORT = 3000;

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure: true if using HTTPS
}));

app.listen(PORT, () => {
  console.log('Server is running on http://localhost: ' + PORT);
})



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

const backgroundImage = "https://st4.depositphotos.com/2160693/40759/v/450/depositphotos_407590112-stock-illustration-food-and-drink-logo-plate.jpg";
const currency = '€';

app.get('/d', (req, res) => {
  res.render('horizontal_menu.ejs', {'categories': categories, 'backgroundImage': backgroundImage, 'currency': currency});
})

const user = {
  id: 1,
  resturantName: 'bassem',
  logo: 'https://st4.depositphotos.com/2160693/40759/v/450/depositphotos_407590112-stock-illustration-food-and-drink-logo-plate.jpg',
  categories: categories,
  menus:[
    {
      id: 1,
      name: 'Menu 1',
    }
  ]
}

app.get('/management/menu/:userid', (req, res) => {
  res.render('menu', {'user': user, 'year': new Date().getFullYear()});
});

app.get('/management/category/:userid', (req, res) => {
  res.render('categories', {'user': user, 'year': new Date().getFullYear()});
});

app.get('/management/items/:userid', (req, res) => {
  res.render('menu', {'user': user, 'year': new Date().getFullYear()});
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
  console.log('Updated Order:', order);

  // Update the order in your data store
  // Assuming success for this example
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




app.post('/register', (req, res) => {
  const {resturantName, email, password_req, sendUpdate} = req.body;

    console.log('name:' + resturantName, email, password_req, sendUpdate);

    if (!resturantName || !email || !password_req) {
        return res.json({ success: false, message: 'Please fill all fields.'});
    }

    if (email === null) {
        return res.json({ success: false, message: 'This email address already exists.'});
    }
    const hold = db.query("INSERT INTO users (company_name, email, password_hash) VALUES($1, $2, $3)",
    [resturantName, email.toLowerCase(), password_req]
    );
    res.json({ success: true, message: 'Registration successful, please login.'});
});


app.post('/login', (req, res) => {
  const { email, password, remember } = req.body;


  if (!email || !password) {
      return res.json({ success: false, message: 'Please fill all fields.' });
  }

  checkIfUserExist(db, email.toLowerCase(), (userExists) => {
      if (userExists) {
          req.session.cookie.signed = true;
          console.log("session: ", req.session.cookie);
          res.json({ success: true , message: 'well done'});
      } else {
        console.log("here");
          res.json({ success: false, message: 'Invalid login credentials.' });
      }
  });
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


app.get('/is_logged_in', (req, res) => {
  if (req.session.user) {
      res.json({ isLoggedIn: true });
  } else {
      res.json({ isLoggedIn: false });
  }
});



/*
creation of the database 

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  company_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 //many to one

CREATE TABLE menus (
  menu_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  menu_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

//many to one

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  menu_id INT REFERENCES menus(menu_id) ON DELETE CASCADE,
  category_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

//many to one

CREATE TABLE items (
  item_id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
  item_name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
	image_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

// many to one

CREATE TABLE subscription_plans (
  plan_id SERIAL PRIMARY KEY,
  plan_name VARCHAR(100) NOT NULL,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  duration_days INT NOT NULL, -- Duration of the subscription in days
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  payment_status VARCHAR(50), -- e.g., 'Paid', 'Pending', 'Failed'
  status VARCHAR(50), -- e.g., 'Active', 'Expired', 'Cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);



CREATE TABLE designs (
  design_id SERIAL PRIMARY KEY,
  menu_id INT REFERENCES menus(menu_id) ON DELETE CASCADE,
  category_orientation VARCHAR(50) NOT NULL CHECK (category_orientation IN ('horizontal', 'vertical')),
  background_color VARCHAR(7) NOT NULL, -- Assuming the color is stored in hex format (e.g., #FFFFFF)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_sessions (
  session_id SERIAL PRIMARY KEY,
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  subscription_id INT REFERENCES subscription_plans(plan_id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL, -- e.g., 'Pending', 'Completed', 'Expired', 'Cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


i need also a culonm for the qrc
also the menu langauge 
*/
