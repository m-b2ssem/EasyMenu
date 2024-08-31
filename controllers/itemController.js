import multer from 'multer';
import {
  updateItemPriority,
  getItemByItemId,
  updateItemStatus,
  deleteItem,
  insertItem,
  updateItem,
  getItemsByCategory,
  deleteItemImageDb
} from '../models/itemModel.js';
import { cehckSizeandConvertTOBytea, parsePrice } from '../utils/helperFunctions.js';

const upload = multer();

export const reorderItems = async (req, res) => {
  const order = req.body.order;

  let priority = 1;
  const reversedItemsIds = order.slice().reverse();
  try {
    for (const id of reversedItemsIds) {
      await updateItemPriority(id, priority);
      priority++;
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Something went wrong, please try again.' });
  }
};

export const getItemStatus = async (req, res) => {
  const itemId = parseInt(req.query.itemId);
  const item = await getItemByItemId(itemId);
  if (!item) {
    return res.json({ success: false, message: 'Something went wrong, please try again.' });
  }
  res.json({ item });
};

export const updateItemStatusController = async (req, res) => {
  const itemId = parseInt(req.body.itemId);
  const status = req.body.status;
  const result = await updateItemStatus(itemId, status);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.' });
  }
  res.json({ success: true });
};

export const deleteItemController = async (req, res) => {
  const itemId = parseInt(req.body.itemId);
  const result = await deleteItem(itemId);
  if (!result) {
    return res.json({ success: false, message: 'Something went wrong, please try again.' });
  }
  res.redirect('/management/items/' + req.user.user_id);
};

export const addItem =  async (req, res) => {
  let { itemName, price, description, categoryId, allergies, foodType } = req.body;
  const file = req.file;
  let buffer = null;
  let capitalisedAllergies = null;
  const intPrice = await parsePrice(price);
  if (isNaN(intPrice)) {
    return res.json({ success: false, message: 'Please enter a valid number in the Prise filed' });
  }

  if (allergies) {
    capitalisedAllergies = allergies.toUpperCase();
  }
  if (!itemName || !price || !description || !categoryId) {
    return res.json({ success: false, message: 'Please fill all fields.' });
  }
  if (file) {
    buffer = await cehckSizeandConvertTOBytea(file);
    if (!buffer) {
      return res.json({ success: false, message: 'Image is too large.' });
    }
  }
  categoryId = parseInt(categoryId);
  const inserted = await insertItem(categoryId, itemName, description, intPrice, buffer, foodType, capitalisedAllergies);
  if (!inserted) {
    return res.json({ success: false, message: 'Something went wrong, please try again.' });
  }
  res.json({ success: true });
};

export const updateItemController =  async (req, res) => {
  let { itemName, price, description, categoryId, itemId, foodType, allergies } = req.body;
  const file = req.file;

  const intPrice = await parsePrice(price);
  if (isNaN(intPrice)) {
    return res.json({ success: false, message: 'Please enter a valid number in the Prise filed' });
  }

  let capitalisedAllergies = null;
  if (!itemName || !price || !description || !categoryId) {
    return res.json({ success: false, message: 'Please fill all fields.' });
  }
  if (allergies) {
    capitalisedAllergies = allergies.toUpperCase();
  }
  if (file) {
    const buffer = await cehckSizeandConvertTOBytea(file);
    if (!buffer) {
      return res.json({ success: false, message: 'Image is too large.' });
    }
    categoryId = parseInt(categoryId);
    const update = await updateItem(categoryId, itemName, description, intPrice, buffer, itemId, foodType, capitalisedAllergies);
    if (!update) {
      return res.json({ success: false, message: 'Something went wrong, please try again.' });
    }
  } else {
    categoryId = parseInt(categoryId);
    const update = await updateItem(categoryId, itemName, description, intPrice, null, itemId, foodType, capitalisedAllergies);
    if (!update) {
      return res.json({ success: false, message: 'Something went wrong, please try again.' });
    }
  }
  res.json({ success: true });
};

export const getItems = async (req, res) => {
  const category_id = req.query.categoryId;
  const items = await getItemsByCategory(category_id);
  res.json({ items });
};

export const getItem = async (req, res) => {
  const itemId = parseInt(req.query.itemId);
  const item = await getItemByItemId(itemId);
  if (!item) {
    return res.json({ success: false, message: 'Something went wrong, please try again.' });
  }
  res.json({ item });
};


export const deleteItemImage = async (req, res) => {
  const itemId = parseInt(req.body.itemId);
  const result = await deleteItemImageDb(itemId);
  if (!result) {
    return res.json({ success: false, message: 'Item doen not exist.' });
  }
  res.json({ success: true });
};