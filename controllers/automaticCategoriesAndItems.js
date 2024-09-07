import {insertItem} from '../models/itemModel.js';
import {insertCategory} from '../models/categoryModel.js';
import { getMenuByUserId } from '../models/menuModel.js';
import { EASY_MENU_APIKEY } from '../config/config.js';

export const automaticCategoriesAndItems = async (req, res) =>
{
    const apiKeys = req.headers['api-key'];
    if (apiKeys !== EASY_MENU_APIKEY) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    const categories = req.body.categories;
    const menuId = parseInt(req.body.menuId);
    const userId = parseInt(req.body.userId);
    if(!categories || !menuId || isNaN(menuId) || categories.length === 0 || !userId || isNaN(userId)) {
        return res.status(400).json({message: 'Missing required fields'});
    }
    if (await getMenuByUserId(userId) === false)
    {
        return res.status(400).json({message: 'Menu does not exists'});
    }
    try {
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            const categoryName = category.name;
            const items = category.items;
            const categoryResult = await insertCategory(menuId, categoryName, userId);
            if (categoryResult) {
                for (let j = 0; j < items.length; j++) {
                    const item = items[j];
                    const itemName = item.name;
                    const itemPrice = item.price;
                    const itemDescription = item.description;
                    await insertItem(categoryResult.category_id, itemName,itemDescription, itemPrice, null, "None", null);
                }
            }
        }
        return res.status(200).json({message: 'Categories and items created successfully'});
    } catch (error) {
        console.error('error creating the categories and items', error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}