import pool from "../config/db.js";

export const getCategoriesByUserId = async (user_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM categories WHERE user_id = $1",
            [user_id]);
        return result.rows;
    } catch (error) {
        console.error('error getting the categories', error);
        throw error;
    } finally {
        db.release();
    }
}

export const insertCategory = async (menu_id, category_name, user_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query(
            "INSERT INTO categories (menu_id, category_name, user_id) VALUES($1, $2, $3) RETURNING *",
            [menu_id, category_name, user_id]);
        if (result.rows.length > 0) {
            return result.rows[0];
        } 
        return null;
    } catch (error) {
        console.error('error inserting the category', error);
        throw error;
    } finally {
        db.release();
    }
}

export const deleteCategory = async (id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("DELETE FROM categories WHERE category_id = $1",
            [id]);
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

export const getCategoryByCategoryId = async (category_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM categories WHERE category_id = $1",
            [category_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const updateCategoryName = async (category_id, category_name) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE categories SET category_name = $1 WHERE category_id = $2",
            [category_name, category_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('error updating the category name', error);
        throw error;
    } finally {
        db.release();
    }
}

export const updateCategoryPriority = async (category_id, priority) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE categories SET priority = $1 WHERE category_id = $2",
            [priority, category_id]);
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

export const updatecategoryStatus = async (category_id, status) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE categories SET category_status = $1 WHERE category_id = $2",
            [status, category_id]);
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

export const getUserIdByGategoryId = async (category_id)  =>{
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT user_id FROM categories WHERE category_id = $1",
            [category_id]);
        return result.rows[0].user_id;
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}
