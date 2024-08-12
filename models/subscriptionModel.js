import pool from "../config/db.js";

export const insertSubscriptionPlan = async (plan_name, user_id, price, duration_days) => {
    const db = await pool.connect();
    try {
        const result = await db.query("INSERT INTO subscription_plans (plan_name, user_id, price, duration_days) VALUES($1, $2, $3, $4) RETURNING *",
        [plan_name, user_id, price, duration_days]);
        return result;
    } catch (error) {
        console.error('error inserting the subscription plan', error);
        throw error;
    } finally {
        db.release();
    }
}

export const selectSubscrptionByUserId = async (user_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM subscriptions WHERE user_id = $1",
            [user_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const updateSubscriptionPlan = async (plan_name, user_id,price, duration_days) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE subscription_plans SET plan_name = $1, price = $2, duration_days = $3 WHERE user_id = $4",
            [plan_name, price, duration_days, user_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const updateSubscription = async (user_id, stripe_customer_id,stripe_session_id, start_date, end_date, status, paid, stripe_subscription_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE subscriptions SET stripe_session_id = $1, start_date = $2, end_date = $3, status = $4, paid = $5, stripe_customer_id = $6, stripe_subscription_id = $7 WHERE user_id = $8",
            [stripe_session_id, start_date, end_date, status, paid, stripe_customer_id, stripe_subscription_id,user_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const selectSubscrptionPlanByUserId = async (user_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM subscription_plans WHERE user_id = $1",
            [user_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const insertSubscription = async (plan_id, user_id, stripe_session_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("INSERT INTO subscriptions (plan_id, user_id, stripe_session_id) VALUES($1, $2, $3) RETURNING *",
        [plan_id, user_id, stripe_session_id]);
    return result;
    } catch (error) {
        console.error('error inserting the subscription', error);
        throw error;
    } finally {
        db.release();
    }
}