import pool from "../config/db.js";
import { getUserIdByGategoryId } from "./categoryModel.js";

export const getItemsByuserId = async (user_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM items WHERE user_id = $1",
            [user_id]);
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const updateItemPriority = async (item_id, priority) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE items SET priority = $1 WHERE item_id = $2",
            [priority, item_id]);
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

export const deleteItem = async (id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("DELETE FROM items WHERE item_id = $1",
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

export const getItemByItemId = async (id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM items WHERE item_id = $1",
            [id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const getItemsByCategory = async (category_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query(
            "SELECT * FROM items WHERE category_id = $1 ORDER BY priority DESC",
            [category_id]
        );
        return result.rows;
    }catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const insertItem = async (category_id, item_name, description, price, image, foodType, allergies) => {
    const db = await pool.connect();
    try {
        const user_id = await getUserIdByGategoryId(category_id);
        const result = await db.query(
            "INSERT INTO items (user_id, category_id, item_name, description, price, image, food_type, allergies) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [user_id, category_id, item_name, description, price, image, foodType, allergies]);
        if (result.rows.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('error inserting the item', error);
        throw error;
    } finally {
        db.release();
    }
}

export const updateItem = async (category_id, item_name, description, price, image, item_id, foodType, capitalisedAllergies) => {
    const db = await pool.connect();
    try {
        if (image === null) {
            const result = await db.query("UPDATE items SET item_name = $1, description = $2, price = $3, category_id = $4, food_type = $5, allergies = $6 WHERE item_id = $7",
                [item_name, description, price, category_id, foodType, capitalisedAllergies, item_id]);
            if (result.rowCount > 0) {
                return true;
            }
            return false;
        }
        const result = await db.query("UPDATE items SET item_name = $1, description = $2, price = $3, image = $4, category_id = $5, food_type = $6, allergies= $7 WHERE item_id = $8",
            [item_name, description, price, image, category_id, foodType, capitalisedAllergies, item_id]);
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

export const updateItemStatus = async (item_id, status) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE items SET item_status = $1 WHERE item_id = $2",
            [status, item_id]);
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

export const deleteItemImageDb = async (item_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE items SET image = null WHERE item_id = $1",
            [item_id]);
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