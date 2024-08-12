import pool from '../config/db.js';

export const selectUserByEmail = async (email)  => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1",
            [email]);
        return result;
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const selectUserById = async (id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM users WHERE user_id = $1",
            [id]);
        return result;
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const updateResetPassword = async (email, token, resetPasswordExpires) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3",
            [token, resetPasswordExpires, email]);
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

export const selectUserByPassToken = async (token) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM users WHERE reset_password_token = $1",
            [token]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const updatePassword = async (user_id, hash) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE users SET password = $1 WHERE user_id = $2",
            [hash, user_id]);
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

export const getUserByEmail = async (email) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1",
            [email]);
        return result;
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const updateEmail = async (user_id, email) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE users SET email = $1 WHERE user_id = $2",
            [email, user_id]);
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

export const selectUserByConfirmToken = async (token) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM users WHERE verification_token = $1",
            [token]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const updateConfirmToken = async (user_id, token) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE users SET verification_token = $1 WHERE user_id = $2",
            [token, user_id]);
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

export const updateEmailVerified = async (user_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE users SET email_verified = true WHERE user_id = $1",
            [user_id]);
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

export const checkIfUserExist = async (email) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT email FROM users WHERE email = $1",
            [email]);
        if (result.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const insertUser = async (campanyName, email, hash) => {
    const db = await pool.connect();
    try {
        const result = await db.query("INSERT INTO users (company_name, email, password) VALUES($1, $2, $3) RETURNING *",
            [campanyName, email, hash]);
        return result;
        } catch (error) {
            console.error('error inserting the user', error);
            throw error;
        } finally {
            db.release();
        }
}


export const deleteAccount = async (user_id)  =>{
    const db = await pool.connect();
    try {
        const result = await db.query("DELETE FROM users WHERE user_id = $1",
            [user_id]);
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