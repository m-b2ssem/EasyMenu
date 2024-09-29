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
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM categories WHERE menu_id = $1 ORDER BY priority DESC",
            [menu_id]);
        if (result.rows.length > 0) {
            return result.rows;
        }   
        return null;
    } catch (error) {
        throw error;
    } finally {
        db.release();
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
            return result.rows[0];
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    } finally {
        db.release();
    }
}


export const getCategoriesWithItemsAndAllTranslations = async (menu_id) => {
    const db = await pool.connect();
    const query = `
      SELECT 
        c.category_id,
        c.category_name,
        c.priority AS category_priority,
        i.item_id,
        i.item_name,
        i.description,
        i.price,
        encode(i.image, 'base64') AS image_base64,
        i.priority AS item_priority,
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object(
            'language_code', ct.language_code,
            'translated_name', ct.translated_name
          )) FILTER (WHERE ct.translation_id IS NOT NULL), '[]'
        ) AS category_translations,
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object(
            'language_code', it.language_code,
            'translated_name', it.translated_name,
            'translated_description', it.translated_description
          )) FILTER (WHERE it.translation_id IS NOT NULL), '[]'
        ) AS item_translations
      FROM 
        categories c
      INNER JOIN 
        items i ON c.category_id = i.category_id
      LEFT JOIN 
        category_translations ct ON c.category_id = ct.category_id
      LEFT JOIN 
        item_translations it ON i.item_id = it.item_id
      WHERE 
        c.menu_id = $1
        AND c.category_status = TRUE
        AND i.item_status = TRUE
      GROUP BY
        c.category_id,
        c.category_name,
        c.priority,
        i.item_id,
        i.item_name,
        i.description,
        i.price,
        i.image,
        i.priority
      ORDER BY 
        c.priority DESC,
        i.priority DESC;
    `;
    try {
      const { rows } = await db.query(query, [menu_id]);
      if (rows.length === 0) {
        return null;
      }
      // Process the results to create a nested structure
      const menu = {};
      rows.forEach(row => {
        const categoryId = row.category_id;
  
        // Initialize the category if it hasn't been added yet
        if (!menu[categoryId]) {
          menu[categoryId] = {
            category_id: row.category_id,
            category_name: row.category_name,
            category_priority: row.category_priority,
            translations: row.category_translations, // Add category translations
            items: [],
          };
        }
  
        // Add the item to the category's items array
        menu[categoryId].items.push({
          item_id: row.item_id,
          item_name: row.item_name,
          description: row.description,
          price: row.price,
          item_priority: row.item_priority,
          translations: row.item_translations, // Add item translations
          image: row.image_base64,
        });
      });
  
      // Convert the menu object into an array and sort categories by priority (descending)
      const menuArray = Object.values(menu).sort(
        (a, b) => b.category_priority - a.category_priority
      );
  
      // Sort items within each category by item priority (descending)
      menuArray.forEach(category => {
        category.items.sort((a, b) => b.item_priority - a.item_priority);
      });
  
      return menuArray;
    } catch (err) {
      console.error('Error executing query', err.stack);
      throw err;
    } finally {
      db.release();
    }
  };
  
  