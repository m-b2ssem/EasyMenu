import QRCode from 'qrcode';
import { convertArrayBufferToBase64 } from './helperFunctions.js';
import pg  from 'pg';
import { config } from 'dotenv';

config();

async function createDbClient() {
    return new pg.Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: 5432,
    });
  }

export async function checkIfUserExist(email) {
    const db = await createDbClient();
    try {
        await db.connect();
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
        await db.end();
    }
}

export async function insertUser(campanyName, email, hash) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("INSERT INTO users (company_name, email, password) VALUES($1, $2, $3) RETURNING *",
            [campanyName, email, hash]);
        return result;
        } catch (error) {
            console.error('error inserting the user', error);
            throw error;
        } finally {
            await db.end();
        }
}


export async function selectUserByEmail(email) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT * FROM users WHERE email = $1",
            [email]);
        return result;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function selectUserById(id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT * FROM users WHERE user_id = $1",
            [id]);
        return result;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function insertMenu(user_id, campanyName) {
    const db = await createDbClient();
    const menuLangauhe = 'English';
    try {
        await db.connect();
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
        await db.end();
    }
}


export async function insertDesign(menu_id) {
    const db = await createDbClient();
    const background_color = '#8e3c02c7';
    const category_orientation = 'horizontal';
    try {
        await db.connect();
        const result = await db.query(
            "INSERT INTO designs (menu_id, category_orientation, background_color) VALUES($1, $2, $3) RETURNING *",
            [menu_id, category_orientation, background_color]
          );
    } catch (error) {
        console.error('error inserting the design', error);
        throw error;
    } finally {
        await db.end();
    }
}


export async function getMenuByUserId(id) {
    const db = await createDbClient();
    try {
        await db.connect();
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
        await db.end();
    }
}

export async function getMenuByMenuId(id) {
    const db = await createDbClient();
    try {
        await db.connect();
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
        await db.end();
    }
}


export async function deleteItem(id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("DELETE FROM items WHERE item_id = $1",
            [id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function getItemByItemId(id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT * FROM items WHERE item_id = $1",
            [id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function updateItemStatus(item_id, status) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE items SET item_status = $1 WHERE item_id = $2",
            [status, item_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function findHeighestPriority(category_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT MAX(priority) FROM items WHERE category_id = $1",
            [category_id]);
        return result.rows[0].max;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function getUserIdByGategoryId(category_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT user_id FROM categories WHERE category_id = $1",
            [category_id]);
        return result.rows[0].user_id;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function insertItem(category_id, item_name, description, price, image, foodType, allergies) {
    const db = await createDbClient();
    try {
        await db.connect();
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
        await db.end();
    }
}

export async function getItemsByCategory(category_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query(
            "SELECT * FROM items WHERE category_id = $1 ORDER BY priority DESC",
            [category_id]
        );
        return result.rows;
    }catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}


export async function updateColoInDesign(menu_id, color) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE designs SET background_color = $1 WHERE menu_id = $2",
            [color, menu_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function updateLangauge(langauge, menu_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE menus SET menu_language = $1 WHERE menu_id = $2",
            [langauge, menu_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function getItemsByuserId(user_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT * FROM items WHERE user_id = $1",
            [user_id]);
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}


export async function getCategoriesByUserId(user_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT * FROM categories WHERE user_id = $1",
            [user_id]);
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function getCategoryByCategoryId(category_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT * FROM categories WHERE category_id = $1",
            [category_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function findHeighestPriorityInCategory(menu_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT MAX(priority) FROM categories WHERE menu_id = $1",
        [menu_id]);
    return result.rows[0].max;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function insertCategory(menu_id, category_name, user_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query(
            "INSERT INTO categories (menu_id, category_name, user_id) VALUES($1, $2, $3) RETURNING *",
            [menu_id, category_name, user_id]);
        if (result.rows.length > 0) {
            return true;
        } 
        return null;
    } catch (error) {
        console.error('error inserting the category', error);
        throw error;
    } finally {
        await db.end();
    }
}

export async function getCategoriesByMenuId(menu_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT * FROM categories WHERE menu_id = $1 ORDER BY priority DESC",
            [menu_id]);
        if (result.rows.length > 0) {
            return result.rows;
        }   
        return null;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function updateCategoryPriority(category_id, priority) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE categories SET priority = $1 WHERE category_id = $2",
            [priority, category_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function updateItemPriority(item_id, priority) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE items SET priority = $1 WHERE item_id = $2",
            [priority, item_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function updateItem(category_id, item_name, description, price, image, item_id, foodType, capitalisedAllergies) {
    const db = await createDbClient();
    try {
        await db.connect();
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
        await db.end();
    }
}

export async function updateCategory(category_id, category_name) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE categories SET category_name = $1 WHERE id = $2",
            [category_name, category_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function deleteMenu(id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("DELETE FROM menus WHERE user_id = $1",
            [id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function getDesignByMenuId(menu_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT * FROM designs WHERE menu_id = $1",
            [menu_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function deleteCategory(id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("DELETE FROM categories WHERE category_id = $1",
            [id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function updateCategoryName(category_id, category_name) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE categories SET category_name = $1 WHERE category_id = $2",
            [category_name, category_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function getCategoriesWithItems(menu_id) {
    const db = await createDbClient();
    try {
        await db.connect();
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
        throw error;
    } finally {
        await db.end();
    }
}

export async function updateLogoImage(menu_id, image) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE menus SET menu_logo = $1 WHERE menu_id = $2",
            [image, menu_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function getLogoImage(menu_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT menu_logo FROM menus WHERE menu_id = $1",
            [menu_id]);
        return result.rows[0].menu_logo;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}


export async function getUserIdByMenuId(menu_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT user_id FROM menus WHERE menu_id = $1",
            [menu_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function insertSubscriptionPlan(plan_name, user_id, price, duration_days) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("INSERT INTO subscription_plans (plan_name, user_id, price, duration_days) VALUES($1, $2, $3, $4) RETURNING *",
        [plan_name, user_id, price, duration_days]);
        return result;
    } catch (error) {
        console.error('error inserting the subscription plan', error);
        throw error;
    } finally {
        await db.end();
    }
}


export async function selectSubscrptionPlanByUserId(user_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT * FROM subscription_plans WHERE user_id = $1",
            [user_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function insertSubscription(plan_id, user_id, stripe_session_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("INSERT INTO subscriptions (plan_id, user_id, stripe_session_id) VALUES($1, $2, $3) RETURNING *",
        [plan_id, user_id, stripe_session_id]);
    return result;
    } catch (error) {
        console.error('error inserting the subscription', error);
        throw error;
    } finally {
        await db.end();
    }
}


export async function selectSubscrptionByUserId(user_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT * FROM subscriptions WHERE user_id = $1",
            [user_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function updateSubscriptionPlan(plan_name, user_id,price, duration_days) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE subscription_plans SET plan_name = $1, price = $2, duration_days = $3 WHERE user_id = $4",
            [plan_name, price, duration_days, user_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function updateSubscription(user_id, stripe_customer_id,stripe_session_id, start_date, end_date, status, paid, stripe_subscription_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE subscriptions SET stripe_session_id = $1, start_date = $2, end_date = $3, status = $4, paid = $5, stripe_customer_id = $6, stripe_subscription_id = $7 WHERE user_id = $8",
            [stripe_session_id, start_date, end_date, status, paid, stripe_customer_id, stripe_subscription_id,user_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function deleteAccount(user_id) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("DELETE FROM users WHERE user_id = $1",
            [user_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function updateResetPassword(email, token, resetPasswordExpires) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3",
            [token, resetPasswordExpires, email]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function selectUserByToken(token){
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("SELECT * FROM users WHERE reset_password_token = $1",
            [token]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}

export async function updatePassword(user_id, hash) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE users SET password = $1 WHERE user_id = $2",
            [hash, user_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}


export async function updatecategoryStatus(category_id, status) {
    const db = await createDbClient();
    try {
        await db.connect();
        const result = await db.query("UPDATE categories SET category_status = $1 WHERE category_id = $2",
            [status, category_id]);
        if (result.rowCount > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        await db.end();
    }
}


/*export async function setQRcode (db) {
    const toQrcode = 'https://www.easymenus.eu/menu/3/rafidain';
    const qrCodeDataUrl = await QRCode.toDataURL(toQrcode);
    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
    const qrCodeBuffer = Buffer.from(base64Data, 'base64');
    const qrCodeResult = await db.query(
        "UPDATE menus SET qr_code = $1 WHERE menu_id = 3",
        [qrCodeBuffer]
    );
  }*/