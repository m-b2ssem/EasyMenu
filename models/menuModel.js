import  pool  from '../config/db.js';
import { convertArrayBufferToBase64 } from '../utils/helperFunctions.js';
import QRCode from 'qrcode';

export const getMenuByUserId = async (id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM menus WHERE user_id = $1",
            [id]);
        if (result.rows.length > 0) {
            return result.rows;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const getDesignByMenuId = async (menu_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM designs WHERE menu_id = $1",
            [menu_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}


export const getItemsByCategory = async (category_id)  =>{
    const db = await pool.connect();
    try {
        const result = await db.query(
            "SELECT * FROM items WHERE category_id = $1 ORDER BY priority DESC",
            [category_id]
        );
        return result.rows;
    }catch (error) {
        console.log(error);
        throw error;
    } finally {
        db.release();
    }
}

export const insertMenu = async (user_id, campanyName) => {
    const db = await pool.connect();
    const menuLangauhe = 'English';
    try {
        // Insert the data into the database
        const result = await db.query(
          "INSERT INTO menus (user_id, menu_name, menu_language) VALUES($1, $2, $3) RETURNING *",
          [user_id, campanyName, menuLangauhe]
        );
        if (result.rows.length > 0) {
            const menu_id = result.rows[0].menu_id;
            const toQrcode = 'https://www.easymenus.eu/menu/' + menu_id + '/' + campanyName.replace(/\s+/g, '');
            const qrCodeDataUrl = await QRCode.toDataURL(toQrcode);
            const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
            const qrCodeBuffer = Buffer.from(base64Data, 'base64');
            const qrCodeResult = await db.query(
                "UPDATE menus SET qr_code = $1 WHERE menu_id = $2",
                [qrCodeBuffer, menu_id]
              );

            return result;
        }
        return false;
    } catch (err) {
        console.error('Error generating or inserting QR code:', err);
        throw err;
    } finally {
        db.release();
    }
}

export async function insertDesign(menu_id) {
    const db = await pool.connect();
    const background_color = '#8e3c02c7';
    const category_orientation = 'horizontal';
    try {
        const result = await db.query(
            "INSERT INTO designs (menu_id, category_orientation, background_color) VALUES($1, $2, $3) RETURNING *",
            [menu_id, category_orientation, background_color]
          );
    } catch (error) {
        console.error('error inserting the design', error);
        throw error;
    } finally {
        db.release();
    }
}

export const getCategoriesByMenuId = async (menu_id) => {
    try {
        pool.connect();
        const result = await pool.query("SELECT * FROM categories WHERE menu_id = $1 ORDER BY priority DESC",
            [menu_id]);
        if (result.rows.length > 0) {
            return result.rows;
        }   
        return null;
    } catch (error) {
        throw error;
    }
}


export const getCategoriesWithItems = async (menu_id) => {
    try {
        let categories = await getCategoriesByMenuId(menu_id);
        if (categories === null) {
            return null;
        }
    
        const result = [];
    
        for (const category of categories) {
            const items = await getItemsByCategory(category.category_id);
            
            if (items.length > 0 ) {
    
                const activeItems = items.filter(item => item.item_status !== false);
                const items_list = await Promise.all(activeItems.map(async item => {
                let image = null;
                let allergiesList = null;
                if (item.allergies){
                    item.allergies = item.allergies.split(',');
                    allergiesList = item.allergies.map(allergy => {
                        return allergy.trim();
                    });
                }
                if (item.image){
                    image =  'data:image/png;base64,' + await convertArrayBufferToBase64(item.image);
                }
    
                return {
                    item_name: item.item_name,
                    description: item.description,
                    price: item.price,
                    image: image,
                    priority: item.priority,
                    item_id: item.item_id,
                    food_type: item.food_type,
                    allergies: item.allergies
                };
                }));
                if (items_list.length > 0 && category.category_status !== false)
                {
                    result.push({
                        category_name: category.category_name,
                        priority: category.priority,
                        category_id: category.category_id,
                        items: items_list
                    });
                }
            }
        }
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateLogoImage = async (menu_id, image) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE menus SET menu_logo = $1 WHERE menu_id = $2",
            [image, menu_id]);
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

export const updateColoInDesign = async (menu_id, color) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE designs SET background_color = $1 WHERE menu_id = $2",
            [color, menu_id]);
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

export const updateLangauge = async (langauge, menu_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE menus SET menu_language = $1 WHERE menu_id = $2",
            [langauge, menu_id]);
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

export const updateCurrency = async (menu_id, currency) => {
    const db = await pool.connect();
    try {
        const result = await db.query("UPDATE menus SET menu_currency = $1 WHERE menu_id = $2",
            [currency, menu_id]);
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

export const getLogoImage = async (menu_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT menu_logo FROM menus WHERE menu_id = $1",
            [menu_id]);
        return result.rows[0].menu_logo;
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}

export const getMenuByMenuId = async (id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM menus WHERE menu_id = $1",
            [id]);
        if (result.rows.length > 0) {
            return result.rows;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}