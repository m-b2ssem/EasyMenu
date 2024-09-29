import { cehckSizeandConvertTOBytea } from '../utils/helperFunctions.js';
import {
  updateLogoImage,
  updateColoInDesign,
  updateLangauge,
  updateCurrency,
  getMenuByMenuId,
  getDesignByMenuId,
  getLogoImage,
  getCategoriesWithItems,
  getCategoriesWithItemsAndAllTranslations,
} from '../models/menuModel.js';
import { createLangaugeList } from '../utils/helperFunctions.js';
import { selectUserById } from '../models/userModel.js';
import { selectSubscrptionPlanByUserId } from '../models/subscriptionModel.js';
import { convertArrayBufferToBase64 } from '../utils/helperFunctions.js';


export const getMenu =  async (req, res) => {
    const menuid = req.params.menuid;
  
    const result = await getMenuByMenuId(menuid);
    if (!result) {
      return res.render('message.ejs', { message: 'There is no menu found, please login to see the menu URL.', link: '/login', name: 'login' });
    }
    const menu = result[0];
    if (!menu) {
      return res.render('message.ejs', { message: 'There is no menu found, please login to see the menu URL.', link: '/login', name: 'login' });
    }
  
    const response = await selectSubscrptionPlanByUserId(menu.user_id);
    const createdAt = new Date(response.created_at);
    const expirationDate = new Date(createdAt);
    expirationDate.setDate(expirationDate.getDate() + response.duration_days);
    const today = new Date();
    const isPlanValid = expirationDate > today;
  
   //implament it later to display just when the plan is valid
    if (isPlanValid){
      let user = await selectUserById(menu.user_id);
      user = user.rows[0];
      const menu_design = await getDesignByMenuId(menuid);
      const language = await createLangaugeList(menu.menu_language);
      let categories = await getCategoriesWithItems(menuid);
      let logo = await getLogoImage(menuid);
      if (!logo) {
        logo ='https://easymenus.eu/img/mainlogo.jpg';
      }
      else{
        logo = 'data:image/png;base64,' + await convertArrayBufferToBase64(logo);
      }
      if (!categories) {
        categories = [];
      }
      const bachground_color = menu_design.background_color;
      const currency = menu.menu_currency;
      res.render('horizontal_menu.ejs', {
        'categories': categories,
        'backgroundImage': logo,
        'currency': currency,
        'language': language,
        'background_color': bachground_color,
        'user': user
      });
    }else {
      return res.render('message.ejs', { message: 'Your subscription is expaired, please go to your profile to renew it.', link: '/login', name: 'login' });
    }
};

export const uploadLogoImage = async (req, res) => {
  const file = req.file;
  const menu_id = req.body.menu_id;
  const buffer = await cehckSizeandConvertTOBytea(file);
  if (!buffer) {
    return res.json({ success: false, message: 'Image is too large.'});
  }
  const result = await updateLogoImage(menu_id, buffer);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({ success: true });
};

export const updateColor = async (req, res) => {
  let {designId, color }= req.body;
  designId = parseInt(designId);
  const  result = await updateColoInDesign(designId, color);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({ success: true });
};

export const updateLanguage = async (req, res) => {
  let {langauge, menuId }= req.body;
  menuId = parseInt(menuId);

  const  result = await updateLangauge(langauge, menuId);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({ success: true });
};

export const updateTheCurrency = async (req, res) => {
  let {currency, menuId }= req.body;
  menuId = parseInt(menuId);

  const  result = await updateCurrency(menuId, currency);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.'});
  }
  res.json({ success: true });
};

export const MenuEmbed =  async (req, res) => {
  const menuid = req.params.menuid;
  
  const result = await getMenuByMenuId(menuid);
  if (!result) {
    return res.render('message.ejs', { message: 'There is no menu found, please login to see the menu URL.', link: '/login', name: 'login' });
  }
  const menu = result[0];
  if (!menu) {
    return res.render('message.ejs', { message: 'There is no menu found, please login to see the menu URL.', link: '/login', name: 'login' });
  }

  const response = await selectSubscrptionPlanByUserId(menu.user_id);
  const createdAt = new Date(response.created_at);
  const expirationDate = new Date(createdAt);
  expirationDate.setDate(expirationDate.getDate() + response.duration_days);
  const today = new Date();
  const isPlanValid = expirationDate > today;

 //implament it later to display just when the plan is valid
  if (isPlanValid){
    let user = await selectUserById(menu.user_id);
    user = user.rows[0];
    const menu_design = await getDesignByMenuId(menuid);
    const language = await createLangaugeList(menu.menu_language);
    let categories = await getCategoriesWithItems(menuid);
    if (!categories) {
      categories = [];
    }
    const bachground_color = menu_design.background_color;
    const currency = menu.menu_currency;

    res.render('horizontal_menu_embed.ejs', {
      'categories': categories,
      'currency': currency,
      'language': language,
      'background_color': bachground_color,
      'user': user
    });
  }else {
    return res.render('message.ejs', { message: 'Your subscription is expaired, please go to your profile to renew it.', link: '/login', name: 'login' });
  }
};

export const fetchMenu = async (req, res) =>
{
  const menuId = parseInt(req.params.menuId);
  if (menuId === NaN || menuId < 0 || menuId !== 52)
  {
    return res.json(null);
  }
  const menu = await getMenuByMenuId(menuId);
  if (!menu)
  {
    return res.json(null);
  }
  const categories = await getCategoriesWithItemsAndAllTranslations(menuId);
  const menu_image = menu.menu_logo
  ? 'data:image/png;base64,' + await convertArrayBufferToBase64(menu.menu_logo)
  : 'https://easymenus.eu/img/mainlogo.jpg';
  const finalResult = {
    menu_name: menu.menu_name,
    menu_language: menu.menu_language,
    menu_currency: menu.menu_currency,
    logo: menu_image, // Assuming 'logo' is a property of the menu
    categories: categories,
  };
  res.json(finalResult);
}