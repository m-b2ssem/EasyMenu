/*
creation of the database 

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  company_name VARCHAR(50) NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE menus (
  menu_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  menu_name VARCHAR(100) NOT NULL,
  menu_language VARCHAR(50) NOT NULL,
  qr_code BYTEA,
  menu_logo BYTEA,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE designs (
  design_id SERIAL PRIMARY KEY,
  menu_id INT REFERENCES menus(menu_id) ON DELETE CASCADE,
  category_orientation VARCHAR(50) NOT NULL CHECK (category_orientation IN ('horizontal', 'vertical')),
  background_color VARCHAR(100) NOT NULL, -- Assuming the color is stored in hex format (e.g., #FFFFFF)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  menu_id INT REFERENCES menus(menu_id) ON DELETE CASCADE,
  category_name VARCHAR(100) NOT NULL,
  priority INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE items (
  item_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
  item_name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image BYTEA,
  priority INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_menus_user_id ON menus(user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_items_user_id ON items(user_id);


// many to one

CREATE TABLE subscription_plans (
  plan_id SERIAL PRIMARY KEY,
  plan_name VARCHAR(100) NOT NULL,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  subscription_id VARCHAR(50) UNIQUE NOT NULL,
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

/*

app.get('/payment', async (req, res) => {
  const user = await selectUserById(61);
  let retrieve = null;
  if (user) {
    retrieve = await stripe.accounts.retrieve(user.rows[0].stripe_account_id);
  }
  console.log("retrive", retrieve);
  let identity = null;
  if (retrieve && (
    retrieve.requirements.currently_due.includes('individual.verification.document') || 
    retrieve.requirements.past_due.includes('individual.verification.document') || 
    retrieve.requirements.eventually_due.includes('individual.verification.document'))) {

  const newLink = await stripe.accountLinks.create({
    account: user.rows[0].stripe_account_id,
    refresh_url: 'https://e784-83-64-176-124.ngrok-free.app/reauth',
    return_url: 'https://e784-83-64-176-124.ngrok-free.app/payment?account_id=' + user.rows[0].stripe_account_id,
    type: 'account_onboarding',
    collect: 'eventually_due',
  });

  return res.redirect(newLink.url);
}
  res.render('payment.ejs',{ 
    user: user.rows[0],
    identity: null,
  });
});





app.post('/create-stripe-account-link', async (req, res) => {
  const userId = req.body.userId;
  const account = await stripe.accounts.create({
    type: 'standard',
  });
  console.log("this is the account info ", account);
  const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://e784-83-64-176-124.ngrok-free.app/reauth',
      return_url: 'https://e784-83-64-176-124.ngrok-free.app/payment?account_id=' + account.id,
      type: 'account_onboarding',
  });
  console.log("this is the account info ", accountLink);
  res.json({ url: accountLink.url });
});

app.get('/return', async (req, res) => {
  res.render('message.ejs', { message: 'Your account has been created successfully.', link: '/login', name: 'login' });
});

app.get('/checkout', async (req, res) => {
  res.render('checkout.ejs',{
    stripeId: 'acct_1PkT5S4FIrOn9nTr',
  });
});


app.post('/create-payment-intent', async (req, res) => {
  const { amount, stripeId } = req.body;
  const session = await stripe.accounts.retrieve('acct_1PkT5S4FIrOn9nTr');
  const payment = await stripe.paymentIntents.create({
    amount: 25.000,
    currency: 'eur',
    payment_method_types: ['card'],
    application_fee_amount: 123,
    transfer_data: {
      destination: stripeId,
    },
  });
  console.log("this is the payment", payment); 
  const session = await stripe.checkout.sessions.create(
  {
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'bananas',
            },
            unit_amount: 12,
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `https://e784-83-64-176-124.ngrok-free.app/?session_id=` + stripeId,
    },
    {
      stripeAccount: '{{acct_1PkT5S4FIrOn9nTr}}',
    }
  );
  console.log("this is the session", session);
  //res.redirect(session.url);
  res.json({ success: true });
});*/