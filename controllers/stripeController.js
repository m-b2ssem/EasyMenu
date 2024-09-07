import { stripe } from '../config/config.js';
import {
    selectSubscrptionByUserId,
    selectSubscrptionPlanByUserId,
    insertSubscription,
    updateSubscription,
    updateSubscriptionPlan
} from '../models/subscriptionModel.js';
import { selectUserById } from '../models/userModel.js'
import { STRIPE_MONTHLY_PRICE_ID, STRIPE_YEARLY_PRICE_ID } from '../config/config.js'
import { formatDate } from '../utils/helperFunctions.js'


// stripe subscription

export const createCheckoutSession =  async (req, res) => {
    const { subscription, userId, billing_period } = req.body;
    try {
      const  stringUserId = userId.toString();
      let sessionStripe = null;
      if (billing_period === 'monthly'){
        sessionStripe = await stripe.checkout.sessions.create({
          success_url: "https://easymenus.eu/success/" + userId + "/" + billing_period,
          cancel_url: "https://easymenus.eu/management/profile/"+ userId,
          line_items: [
          {
              price: process.env.STRIPE_MONTHLY_PRICE_ID,
              quantity: 1,
          },
          ],
          mode: "subscription",
          allow_promotion_codes: true,
      });
      } else if (billing_period === 'yearly') {
        //success_url: "http://localhost:8080/success/" + userId + "/" + subscription,
        //success_url: "https://easymenus.eu/success/" + userId + "/" + subscription,
        sessionStripe = await stripe.checkout.sessions.create({
          success_url: "https://easymenus.eu/success/" + userId + "/" + billing_period,
          cancel_url: "https://easymenus.eu/management/profile/"+ userId,
          line_items: [
          {
              price: process.env.STRIPE_YEARLY_PRICE_ID,
              quantity: 1,
          },
          ],
          mode: "subscription",
          allow_promotion_codes: true,
      });
      }
      const plan = await selectSubscrptionPlanByUserId(userId);
      const response_1 = await selectSubscrptionByUserId(userId);
      if (response_1){
          await updateSubscription(userId, null, sessionStripe.id,null,null,null, false, null);
      }
      else{
          const result = await insertSubscription(plan.plan_id, userId, sessionStripe.id);
      }
      return res.json({ url: sessionStripe.url });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
};
  
  
  
export const successSubscription = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const period = req.params.period;
  
    const response = await selectSubscrptionByUserId(userId);
    const user = await selectUserById(userId);
  
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
          const stripe_subscripation_id = session.subscription;
          const subscription = await stripe.subscriptions.retrieve(stripe_subscripation_id);
          const price = subscription.plan.amount;
          const product_id = subscription.plan.product;
          const product = await stripe.products.retrieve(product_id);
          console.log(product);
          const subscription_name = product.name;
          // today date
          const today = new Date();
          const start_date = await formatDate(today);
          // expire date
          const stripeExpireDate = new Date(subscription.current_period_end * 1000); // Convert to milliseconds
          stripeExpireDate.setDate(stripeExpireDate.getDate()); // Add 3 days
          const end_date = await formatDate(stripeExpireDate);
          const paid = true;
          const respone_2 = await updateSubscription(userId, customer_id, session.id, start_date, end_date, 'activ', paid, stripe_subscripation_id);
          let period_days = 0;
          if ( period === 'yearly'){
            period_days = 365;
          } else if (period === 'monthly'){
            period_days = 30;
          }
          const respone_3 = await updateSubscriptionPlan(subscription_name, userId, price, period_days);
          res.redirect('/management/profile/' + userId);
        }
      } catch (error) {
        res.render('message', {message: 'Something went wrong, please try again.', link: '/management/profile/' + userId, name: 'profile'});
        console.log(error);
      }
    }
};
  
export const cancelSubscription =  async (req, res) => {
    const { userId } = req.body;
    const subscription = await selectSubscrptionByUserId(userId);
    if (subscription && !subscription.stripe_subscription_id) {
      return res.json({ success: false, message: 'You have no subscription to cancle.'});
    }else if (!subscription){
      return res.json({ success: false, message: 'You have no subscription to cancle.'});
    } else if (subscription && subscription.stripe_subscription_id) {
      try {
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: true,
          metadata: { userId: userId.toString() }
        });
      } catch (error) {
        res.json({ success: false, message: 'Something went wrong, please try again.'});
        console.log(error);
      }
    }
    res.json({ success: true, message: 'Subscription has been canceled. you still could use the Menu until the end of the period.'});
};


export const getInvoice =  async (req, res) => {
    const userId = req.body.userId;
    const searchDateString = req.body.searchDate;
    const searchDate = new Date(searchDateString);
  
    if (isNaN(searchDate.getTime())) {
      return res.json({ success: false, message: 'Invalid date format' });
    }
  
    const year = searchDate.getUTCFullYear();
    const month = searchDate.getUTCMonth() + 1; // 0-indexed, so January is 0, February is 1, etc.
    if (month === 13)
    {
      month = 12;
    }
    // Get the start and end of the month in UTC
    const startOfMonth = new Date(Date.UTC(year, month, 1));
    const endOfMonth = new Date(Date.UTC(year, month + 1, 1));
    const subscription = await selectSubscrptionByUserId(userId);
    if (subscription && subscription.stripe_customer_id) {
      const customer = await stripe.customers.retrieve(subscription.stripe_customer_id);
      const invoices = await stripe.invoices.list({
        customer: customer.id,
        created: {
          gte: Math.floor(startOfMonth.getTime() / 1000),
          lt: Math.floor(endOfMonth.getTime() / 1000)
        }
      });
  
      let invoiceList = [];
      if (invoices.data.length === 0) {
        return res.json({ success: false, message: 'There is no invoice found' });
      } else if (invoices.data.length === 1) {
        const invoice = invoices.data[0];
        const invoiceRecreate = {
          number: invoice.number,
          date: invoice.created,
          amount_: invoice.amount_due,
          pdf: invoice.invoice_pdf
        };
        invoiceList.push(invoiceRecreate);
        return res.json({ success: true, invoices: invoiceList });
      } else {
        for (let i = 0; i < invoices.data.length; i++) {
          if (invoices.data[i].invoice_pdf) {
            const invoice = {
              number: invoices.data[i].number,
              date: invoices.data[i].created,
              amount: invoices.data[i].amount_due,
              pdf: invoices.data[i].invoice_pdf
            };
            invoiceList.push(invoice);
          }
        }
        return res.json({ success: true, invoices: invoiceList });
      }
    }
  
    res.json({ success: false, message: 'There is no invoice found for the chosen date.' });
};
  
  