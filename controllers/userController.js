import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { deleteAccount } from '../models/userModel.js';
import { selectSubscrptionByUserId } from '../models/subscriptionModel.js';


export const deleteAccountApi =  async (req, res) => {
    const { userId } = req.body;
  
  
    const subscription = await selectSubscrptionByUserId(userId);
    if (subscription && subscription.stripe_customer_id) {
      try {
        await stripe.customers.del(subscription.stripe_customer_id);
      } catch (error) {
        console.log(error);
      }
    }
    const result = await deleteAccount(userId);
    if (!result) {
      return res.json({ success: false });
    }
    res.json({ success: true });
};
