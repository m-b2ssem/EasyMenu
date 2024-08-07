import { generateResetToken } from "../utils/helperFunctions.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "../services/sendEmail.js";
import {
    selectUserByEmail,
    updateResetPassword,
    selectUserByPassToken,
    updatePassword,
} from "../models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const saltRounds = 10;

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const lowerCaseEmail = email.toLowerCase();

  try {
    const user = await selectUserByEmail(lowerCaseEmail);

    if (!user.rows[0]) {
      return res.render("message.ejs", {
        message: "something went wrong, please try again",
        link: "/forgot-password",
        name: "forgot password",
      });
    }

    const token = await generateResetToken();
    const resetPasswordExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await updateResetPassword(lowerCaseEmail, token, resetPasswordExpires);
    const resetLink = `http://easymenus.eu/reset-password?token=${token}`;
    let registerTemplate = fs.readFileSync(
      path.join(__dirname, "../public/pages/forgot-password-template.html"),
      "utf8"
    );
    registerTemplate = registerTemplate.replace("%link%", resetLink);

    await sendEmail(lowerCaseEmail, "Reset your password", registerTemplate);
    return res.render("message.ejs", {
      message:
        "Email was sent to reset your password. Please check your email.",
      link: "/login",
      name: "login",
    });
  } catch (error) {
    console.error(error);
    return res.render("message.ejs", {
      message: "something went wrong, please try again",
      link: "/forgot-password",
      name: "forgot password",
    });
  }
};

export const renderResetPasswordPage = async (req, res) => {
  const token = req.query.token;
  const user = await selectUserByPassToken(token);
  const now = new Date(Date.now());
  const expire = user.reset_password_expires < now;

  if (!user || expire) {
    return res.render("reset-password.ejs", { token, expire });
  }

  res.render("reset-password.ejs", { token, expire });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const now = new Date(Date.now());
  const user = await selectUserByPassToken(token);
  const expire = user.reset_password_expires < now;

  if (!user || expire) {
    return res.render("message.ejs", {
      message: "The time to reset the password has expired. Please try again.",
      link: "/forgot-password",
      name: "forgot password",
    });
  }

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      return res.render("message.ejs", {
        message:
          "The time to reset the password has expired. Please try again.",
        link: "/forgot-password",
        name: "forgot password",
      });
    } else {
      try {
        const result = await updatePassword(user.user_id, hash);
        if (!result) {
          return res.render("message.ejs", {
            message: "Password has not been reset. Please try again.",
            link: "/forgot-password",
            name: "forgot password",
          });
        }
        return res.render("message.ejs", {
          message: "Password has been reset. Please login.",
          link: "/login",
          name: "login",
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
};
