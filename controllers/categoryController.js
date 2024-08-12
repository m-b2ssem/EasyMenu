import {
  insertCategory,
  deleteCategory,
  updateCategoryName,
  getCategoryByCategoryId,
  updatecategoryStatus,
  updateCategoryPriority,
} from "../models/categoryModel.js";
import { getCategoriesByMenuId } from "../models/menuModel.js";

export const addCategoryApi = async (req, res) => {
  const { categoryName, menuId } = req.body;
  const menu_id = parseInt(menuId);
  const userId = req.user.user_id;
  const result = await insertCategory(menu_id, categoryName, userId);
  if (!result) {
    return res.json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
  res.json({ success: true });
};

export const deleteCategoryApi = async (req, res) => {
  const categoryId = req.body.categoryId;
  console.log(categoryId);
  const result = await deleteCategory(categoryId);
  if (!result) {
    return res.json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
  res.redirect("/management/category/" + req.user.user_id);
};

export const updateCategoryAip = async (req, res) => {
  console.log(req.body);
  const { categoryId, newCategoryName } = req.body;

  const result = await updateCategoryName(categoryId, newCategoryName);
  if (!result) {
    return res.json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
  res.json({ success: true });
};

// get all categories from the database by menu id and return them as JSON
export const getCategoriesApi = async (req, res) => {
  const menuId = req.query.menuId; // Access query parameter
  let categories = await getCategoriesByMenuId(menuId);
  if (!categories) {
    return res.json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }

  categories = categories.sort((a, b) => b.priority - a.priority);
  res.json({ success: true, categories });
};

export const getCategoryStatusApi = async (req, res) => {
  const categoryId = parseInt(req.query.categoryId);
  const category = await getCategoryByCategoryId(categoryId);
  if (!category) {
    return res.json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
  res.json({ category });
};

export const updatecategoryStatusApi = async (req, res) => {
  const categoryId = parseInt(req.body.categoryId);
  const status = req.body.status;
  const result = await updatecategoryStatus(categoryId, status);
  if (!result) {
    return res.json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
  res.json({ success: true });
};

export const reorderCategoriesApi = async (req, res) => {
  const order = req.body.order;

  let priority = 1;

  const reversedCategoriesIds = order.slice().reverse();
  try {
    for (const id of reversedCategoriesIds) {
      // update the priority of the category
      await updateCategoryPriority(id, priority);
      priority++;
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
};

export const getCategoryNameApi = async (req, res) => {
  const categoryId = parseInt(req.query.categoryId);
  const category = await getCategoryByCategoryId(categoryId);
  if (!category) {
    return res.json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
  res.json({ category });
};
