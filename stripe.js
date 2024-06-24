/*app.post("/checkout", async (req, res) => {
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
  });*/
  