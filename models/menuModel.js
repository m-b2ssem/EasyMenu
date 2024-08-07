import  pool  from '../config/db.js';
import { convertArrayBufferToBase64 } from '../utils/helperFunctions.js';


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

export const getCategoriesByMenuId = async (menu_id) => {
    const db = await pool.connect();
    try {
        const result = await db.query("SELECT * FROM categories WHERE menu_id = $1 ORDER BY priority DESC",
            [menu_id]);
        console.log(result);
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