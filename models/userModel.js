import pool from '../config/db.js';

export const selectUserByEmail = async (email)  => {
    try {
        await pool.connect();
        const result = await pool.query("SELECT * FROM users WHERE email = $1",
            [email]);
        return result;
    } catch (error) {
        throw error;
    }
}

export const updateResetPassword = async (email, token, resetPasswordExpires) => {
    try {
        await pool.connect();
        const result = await pool.query("UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3",
            [token, resetPasswordExpires, email]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
}

export const selectUserByPassToken = async (token) => {
    try {
        await pool.connect();
        const result = await pool.query("SELECT * FROM users WHERE reset_password_token = $1",
            [token]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const updatePassword = async (user_id, hash) => {
    try {
        await pool.connect();
        const result = await pool.query("UPDATE users SET password = $1 WHERE user_id = $2",
            [hash, user_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
}