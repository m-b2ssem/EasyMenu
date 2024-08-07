import pool from "../config/db.js";

export const selectSubscrptionByUserId = async (user_id) => {
    try {
        await pool.connect();
        const result = await db.query("SELECT * FROM subscriptions WHERE user_id = $1",
            [user_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        await db.release();
    }
}


export const updateSubscriptionPlan = async (plan_name, user_id,price, duration_days) => {
    try {
        await pool.connect();
        const result = await db.query("UPDATE subscription_plans SET plan_name = $1, price = $2, duration_days = $3 WHERE user_id = $4",
            [plan_name, price, duration_days, user_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.release();
    }
}

export const updateSubscription = async (user_id, stripe_customer_id,stripe_session_id, start_date, end_date, status, paid, stripe_subscription_id) => {
    try {
        await pool.connect();
        const result = await db.query("UPDATE subscriptions SET stripe_session_id = $1, start_date = $2, end_date = $3, status = $4, paid = $5, stripe_customer_id = $6, stripe_subscription_id = $7 WHERE user_id = $8",
            [stripe_session_id, start_date, end_date, status, paid, stripe_customer_id, stripe_subscription_id,user_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.release();
    }
}