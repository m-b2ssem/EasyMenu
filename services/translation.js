import {languages_code , translator, languages_code_db} from '../config/config.js'
import { addCategoryTranslation } from '../models/categoryModel.js';
import {addItemTranslation} from '../models/itemModel.js';

export const createTranslationForItems = async (item) =>
{
  for (let index = 0; index < languages_code.length; index++) {
    const language_code = languages_code[index];
    const lang_code_db = languages_code_db[index];
    const trans_item_name = await translator.translateText(item.item_name, null, language_code);
    const trans_item_des = await translator.translateText(item.description, null, language_code);
    const res = await addItemTranslation(item.item_id, lang_code_db, trans_item_name.text, trans_item_des.text);
  }
}


export const createTranslationForCategories = async (category) =>
  {
    for (let index = 0; index < languages_code.length; index++) {
      const language_code = languages_code[index];
      const lang_code_db = languages_code_db[index];
      const trans_cateogry_name = await translator.translateText(category.category_name, null, language_code);
      const res = await addCategoryTranslation(category.category_id, lang_code_db, trans_cateogry_name.text);
    }
  }



