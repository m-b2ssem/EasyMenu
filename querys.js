import QRCode from 'qrcode';
import { convertArrayBufferToBase64 } from './helperFunctions.js';

export async function checkIfUserExist(db, email) {
     const result = await db.query("SELECT email FROM users WHERE email = $1",
        [email]);
    if (result.rows.length > 0) {
        return true;
    } else {
        return false;
    }
}

export async function insertUser(db, campanyName, email, hash) {
    const result = await db.query("INSERT INTO users (company_name, email, password) VALUES($1, $2, $3) RETURNING *",
        [campanyName, email, hash]);
    return result;
}


export async function selectUserByEmail(db, email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1",
        [email]);
    return result;
}

export async function selectUserById(db, id) {
    const result = await db.query("SELECT * FROM users WHERE user_id = $1",
        [id]);
    return result;
}

export async function insertMenu(db, user_id, campanyName) {
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
    }
}


export async function insertDesign(db, menu_id) {
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
    }
}


export async function getMenuByUserId(db, id) {
    const result = await db.query("SELECT * FROM menus WHERE user_id = $1",
        [id]);
    if (result.rows.length > 0) {
        return result.rows;
    } else {
        return false;
    }
}

export async function getMenuByMenuId(db, id) {
    const result = await db.query("SELECT * FROM menus WHERE menu_id = $1",
        [id]);
    if (result.rows.length > 0) {
        return result.rows;
    } else {
        return false;
    }
}


export async function deleteItem(db, id) {
    const result = await db.query("DELETE FROM items WHERE item_id = $1",
        [id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function getItemByItemId(db, id) {
    const result = await db.query("SELECT * FROM items WHERE item_id = $1",
        [id]);
    return result.rows[0];
}

export async function updateItemStatus(db, item_id, status) {
    const result = await db.query("UPDATE items SET item_status = $1 WHERE item_id = $2",
        [status, item_id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function findHeighestPriority(db, category_id) {
    const result = await db.query("SELECT MAX(priority) FROM items WHERE category_id = $1",
        [category_id]);
    return result.rows[0].max;
}

export async function getUserIdByGategoryId(db, category_id) {
    const result = await db.query("SELECT user_id FROM categories WHERE category_id = $1",
        [category_id]);
    return result.rows[0].user_id;
}

export async function insertItem(db, category_id, item_name, description, price, image, foodType, allergies) {
    try {
        const user_id = await getUserIdByGategoryId(db, category_id);
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
    }
}

export async function getItemsByCategory(db, category_id) {
    const result = await db.query(
        "SELECT * FROM items WHERE category_id = $1 ORDER BY priority DESC",
        [category_id]
    );
    return result.rows;
}


export async function updateColoInDesign(db, menu_id, color) {
    const result = await db.query("UPDATE designs SET background_color = $1 WHERE menu_id = $2",
        [color, menu_id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function updateLangauge(db, langauge, menu_id) {
    const result = await db.query("UPDATE menus SET menu_language = $1 WHERE menu_id = $2",
        [langauge, menu_id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function getItemsByuserId(db, user_id) {
    const result = await db.query("SELECT * FROM items WHERE user_id = $1",
        [user_id]);
    return result.rows;
}


export async function getCategoriesByUserId(db, user_id) {
    const result = await db.query("SELECT * FROM categories WHERE user_id = $1",
        [user_id]);
    return result.rows;
}

export async function getCategoryByCategoryId(db, category_id) {
    const result = await db.query("SELECT * FROM categories WHERE category_id = $1",
        [category_id]);
    return result.rows[0];
}

export async function findHeighestPriorityInCategory(db, menu_id) {
    const result = await db.query("SELECT MAX(priority) FROM categories WHERE menu_id = $1",
        [menu_id]);
    return result.rows[0].max;
}

export async function insertCategory(db, menu_id, category_name, user_id) {
    const result = await db.query(
        "INSERT INTO categories (menu_id, category_name, user_id) VALUES($1, $2, $3) RETURNING *",
        [menu_id, category_name, user_id]);
    if (result.rows.length > 0) {
        return true;
    } 
    return null;
}

export async function getCategoriesByMenuId(db, menu_id) {
    const result = await db.query("SELECT * FROM categories WHERE menu_id = $1 ORDER BY priority DESC",
        [menu_id]);
    if (result.rows.length > 0) {
        return result.rows;
    }   
    return null;
}

export async function updateCategoryPriority(db, category_id, priority) {
    const result = await db.query("UPDATE categories SET priority = $1 WHERE category_id = $2",
        [priority, category_id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function updateItemPriority(db, item_id, priority) {
    const result = await db.query("UPDATE items SET priority = $1 WHERE item_id = $2",
        [priority, item_id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function updateItem(db, category_id, item_name, description, price, image, item_id, foodType, capitalisedAllergies) {
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
}

export async function updateCategory(db, category_id, category_name) {
    const result = await db.query("UPDATE categories SET category_name = $1 WHERE id = $2",
        [category_name, category_id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function deleteMenu(db, id) {
    const result = await db.query("DELETE FROM menus WHERE user_id = $1",
        [id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function getDesignByMenuId(db, menu_id) {
    const result = await db.query("SELECT * FROM designs WHERE menu_id = $1",
        [menu_id]);
    return result.rows[0];
}

export async function deleteCategory(db, id) {
    const result = await db.query("DELETE FROM categories WHERE category_id = $1",
        [id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function updateCategoryName(db, category_id, category_name) {
    const result = await db.query("UPDATE categories SET category_name = $1 WHERE category_id = $2",
        [category_name, category_id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function getCategoriesWithItems(db, menu_id) {
    let categories = await getCategoriesByMenuId(db, menu_id);
    if (categories === null) {
        return null;
    }

    const result = [];

    for (const category of categories) {
        const items = await getItemsByCategory(db, category.category_id);
        
        if (items.length > 0 ) {

            const activeItems = items.filter(item => item.item_status !== false);
            const items_list = await Promise.all(activeItems.map(async item => {
                const image = null;
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
                    food_type: item.food_type
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
}

export async function updateLogoImage(db, menu_id, image) {
    const result = await db.query("UPDATE menus SET menu_logo = $1 WHERE menu_id = $2",
        [image, menu_id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function getLogoImage(db, menu_id) {
    const result = await db.query("SELECT menu_logo FROM menus WHERE menu_id = $1",
        [menu_id]);
    return result.rows[0].menu_logo;
}


export async function getUserIdByMenuId(db, menu_id) {
    const result = await db.query("SELECT user_id FROM menus WHERE menu_id = $1",
        [menu_id]);
    return result.rows[0];
}

export async function insertSubscriptionPlan(db, plan_name, user_id, price, duration_days) {
    const result = await db.query("INSERT INTO subscription_plans (plan_name, user_id, price, duration_days) VALUES($1, $2, $3, $4) RETURNING *",
        [plan_name, user_id, price, duration_days]);
    return result;
}


export async function selectSubscrptionPlanByUserId(db, user_id) {
    const result = await db.query("SELECT * FROM subscription_plans WHERE user_id = $1",
        [user_id]);
    return result.rows[0];
}

export async function insertSubscription(db, plan_id, user_id, stripe_session_id) {
    const result = await db.query("INSERT INTO subscriptions (plan_id, user_id, stripe_session_id) VALUES($1, $2, $3) RETURNING *",
        [plan_id, user_id, stripe_session_id]);
    return result;
}


export async function selectSubscrptionByUserId(db, user_id) {
    const result = await db.query("SELECT * FROM subscriptions WHERE user_id = $1",
        [user_id]);
    return result.rows[0];
}

export async function updateSubscription(db, user_id, stripe_customer_id,stripe_session_id, start_date, end_date, status, paid) {
    const result = await db.query("UPDATE subscriptions SET stripe_session_id = $1, start_date = $2, end_date = $3, status = $4, paid = $5, stripe_customer_id = $6 WHERE user_id = $7",
        [stripe_session_id, start_date, end_date, status, paid, stripe_customer_id, user_id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function deleteAccount(db, user_id) {
    const result = await db.query("DELETE FROM users WHERE user_id = $1",
        [user_id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function updateResetPassword(db, email, token, resetPasswordExpires) {
    
    const result = await db.query("UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3",
        [token, resetPasswordExpires, email]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}

export async function selectUserByToken(db, token){
    const result = await db.query("SELECT * FROM users WHERE reset_password_token = $1",
        [token]);
    return result.rows[0];
}

export async function updatePassword(db, user_id, hash) {
    const result = await db.query("UPDATE users SET password = $1 WHERE user_id = $2",
        [hash, user_id]);
    if (result.rowCount > 0) {
        return true;
    }
    return false;
}