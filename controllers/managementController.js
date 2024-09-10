import { getMenuByUserId, getDesignByMenuId } from "../models/menuModel.js";
import { selectUserById } from "../models/userModel.js";
import {
  convertArrayBufferToBase64,
  createLangaugeList,
  createCurrencyList,
} from "../utils/helperFunctions.js";
import { getCategoriesByUserId } from "../models/categoryModel.js";
import { getItemsByuserId } from "../models/itemModel.js";
import {
  selectSubscrptionPlanByUserId,
  selectSubscrptionByUserId,
} from "../models/subscriptionModel.js";
import stripe from "../config/config.js";

export const manageMenuPage = async (req, res) => {
  const userId = parseInt(req.params.userid);
  if (userId === req.user.user_id) {
    const menus = await getMenuByUserId(userId);
    if (menus.length === 0) {
      return res.redirect("/login");
    }
    const account = await selectUserById(userId);
    if (account.rows.length > 0) {
      if (account.rows[0].email_verified === false) {
        return res.render("convermation.ejs", {
          user: account.rows[0],
        });
      }
    }
    const menu = menus[0];
    if (!menu) {
      return res.redirect("/login");
    }
    if (!menu.menu_name) {
      return res.redirect("/login");
    }
    let name_of_menu = menu.menu_name.replace(/\s+/g, "");
    name_of_menu = name_of_menu.toLowerCase();

    const menu_name = "https://www.easymenus.eu/menu/" + menu.menu_id + "/" + name_of_menu;
    const menu_embed = "https://www.easymenus.eu/embed/" + menu.menu_id + "/" + name_of_menu;
    const langauges = await createLangaugeList(menu.menu_language);
    const currencies = await createCurrencyList(menu.menu_currency);
    const menuDesign = await getDesignByMenuId(menu.menu_id);
    res.render("menu", {
      menu_embed: menu_embed,
      user: req.user,
      year: new Date().getFullYear(),
      langauges: langauges,
      currencies: currencies,
      menu_name: menu_name,
      background_color: menuDesign.background_color,
      menu_id: menu.menu_id,
    });
  } else {
    res.redirect("/login");
  }
};

export const manageCategoryPage = async (req, res) => {
  const userId = parseInt(req.params.userid);
  const user = req.user;

    if (userId === req.user.user_id) {
        const categories = await getCategoriesByUserId(userId);
        const menus = await getMenuByUserId(userId);
        res.render("categories", {
            user: user,
            categories: categories,
            year: new Date().getFullYear(),
            menus: menus,
        });
  } else {
        res.redirect("/login");
    }
};

// tp render the info inside the ejs items page
export const manageItemPage = async (req, res) => {
  const userId = parseInt(req.params.userid);
  if (userId === req.user.user_id) {
    const categories = await getCategoriesByUserId(req.user.user_id);
    const items = await getItemsByuserId(req.user.user_id);
    res.render("items", {
      user: req.user,
      year: new Date().getFullYear(),
      categories: categories,
      items: items,
    });
  } else {
    res.redirect("/login");
  }
};

export const manageProfilePage = async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  const result = await selectUserById(user_id);
  if (result.rows.length > 0) {
    let subscription_plan = await selectSubscrptionPlanByUserId(user_id);
    const subscription = await selectSubscrptionByUserId(user_id);
    let isPlanValid = "";
    if (subscription && subscription.stripe_customer_id) {
      const end_date = new Date(subscription.end_date);
      const today = new Date();
      isPlanValid = end_date > today;
      if (isPlanValid) {
        subscription_plan.status = "active";
      } else {
        subscription_plan.status = "expired";
      }
    }else {
      const createdAt = new Date(subscription_plan.created_at);
      const expirationDate = new Date(createdAt);
      expirationDate.setDate(
        expirationDate.getDate() + subscription_plan.duration_days
      );
      const today = new Date();
      isPlanValid = expirationDate > today;
      if (isPlanValid) {
        subscription_plan.status = "active";
      } else {
        subscription_plan.status = "expired";
      }
    }
    if (subscription_plan.plan_name === "free_trial") {
      subscription_plan.plan_name = "free trial";
    }

    const user = result.rows[0];
    res.render("profile.ejs", {
      user: user,
      subscription_plan: subscription_plan,
      year: new Date().getFullYear(),
    });
  } else {
    res.redirect("/login");
  }
};

export const manageBillingPage = async (req, res) => {
  const userId = parseInt(req.params.userid);
  if (userId === req.user.user_id) {
    res.render("billing", { user: req.user, invoices: null });
  } else {
    res.redirect("/login");
  }
};
