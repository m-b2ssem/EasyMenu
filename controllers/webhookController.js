import { STRIPE_WEBHOOK_SECRET, stripe } from "../config/config.js";
import {
    selectSubscrptionByUserId,
    updateSubscription,
    updateSubscriptionPlan,
} from '../models/subscriptionModel.js';




export const stripeWebhook =  async (request, response) => {
  console.log("webhook");
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, STRIPE_WEBHOOK_SECRET);
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
        const userId = parseInt(customerSubscriptionDeleted.metadata.userId, 10);
        if (userId){
          const user_subscription = await selectSubscrptionByUserId(userId);
          if (user_subscription) {
            const result = await updateSubscription(userId, null, null, null, null, 'canceled', false, null);
            const result_2 = await updateSubscriptionPlan('none', userId, 0, 0);
          }
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
  };