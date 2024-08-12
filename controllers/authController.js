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
import {
  selectUserById,
  checkIfUserExist,
  insertUser,
  updateConfirmToken,
  deleteAccount,
} from "../models/userModel.js"
import passport from "passport";
import { insertMenu , insertDesign } from "../models/menuModel.js";
import  { insertSubscriptionPlan } from "../models/subscriptionModel.js";
import { Strategy } from "passport-local";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const saltRounds = 10;

export const register = async (req, res) => {
  const { campanyName, email, password } = req.body;
  const clientIpAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const clientUserAgent = req.headers['user-agent'];
  const eventSourceUrl = req.headers['referer'];


  if (!campanyName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill all fields.' });
  }

  const lowerCaseEmail = email.toLowerCase();
  const checkIfExist = await checkIfUserExist(lowerCaseEmail);
  if (checkIfExist) {
    return res.status(409).json({ success: false, message: 'This email address already exists.' });
  } else {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong, please try again.' });
      } else {
        const result = await insertUser(campanyName, lowerCaseEmail, hash);
        const result_2 = await insertMenu(result.rows[0].user_id, campanyName);
        const result_3 = await insertDesign(result_2.rows[0].menu_id);
        const result_4 = await insertSubscriptionPlan('free_trial', result.rows[0].user_id, 0, 30);
        const result_user = result.rows[0];
        const token = await generateResetToken();
        const _5 = await updateConfirmToken(result_user.user_id, token);
        let confirmTemplate = fs.readFileSync(path.join(__dirname, '../public/pages/confirm-template.html'), 'utf8');
        const parameters = req.body.parameters;
        let link = 'https://easymenus.eu/confirm-email/' + token + '?'
        if (parameters){
          link = link + parameters;
        }
        confirmTemplate = confirmTemplate.replace('%link%', link);
        await sendEmail(email, 'Confirm your email address', confirmTemplate);

        const daley = 1000 * 60 * 1; // 2 hours
        setTimeout( async () => {
          const account = await selectUserById(result_user.user_id);
          if (account && account.rows &&account.rows.length > 0) {
            const user = account.rows[0];
            if (!user.email_verified) {
              await deleteAccount(result_user.user_id);
            }
          }
        }, daley);

        req.login(result_user, async (err) => {
          if (err) {
            console.log("error is: ",err);
            return res.status(500).json({ success: false, message: 'Login failed, please try again.' });
          } else {
            return res.status(200).json({ success: true, message: 'Registration successful.', userId: result_user.user_id,});
          }
        });
      }
    });
  }
};

export const login = async (req, res) => { 
  res.redirect('/management/menu/' + req.user.user_id);
};

export const logout =  async (req, res) =>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
};

passport.use(
  new Strategy (async function verify(username, password, cb) {
    try {
      const result = await selectUserByEmail(username.toLowerCase());
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const hashPassword = user.password;
        bcrypt.compare(password, hashPassword, (err, res) => {
          if (err) {
            console.log(err);
            return cb(err);
          } else {
            if (res) {
              return cb(null, user);
            } else {
              cb(null, false);
            }
          }
        }); 
      } else {
        return cb(null, false);
      }
    } catch (error) {
      cb(error);
    }
}));

passport.serializeUser(function(user, cb) {
  // remove the password from the user object
  delete user.password;
  cb(null, user);
});


passport.deserializeUser(function(user, cb) {
    cb(null, user);
});


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


export const chnagePassword = async (req, res) => {
  const { currentPassword, newPassword, userId } = req.body;

  try {
    const result = await selectUserById(parseInt(userId));
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const hashPassword = user.password;
      
      const isMatch = await bcrypt.compare(currentPassword, hashPassword);
      
      if (isMatch) {
        const hash = await bcrypt.hash(newPassword, saltRounds);
        const updateResult = await updatePassword(userId, hash);

        if (updateResult) {
          return res.json({ success: true });
        } else {
          return res.json({ success: false, message: 'Something went wrong, please try again.' });
        }
      } else {
        return res.json({ success: false, message: 'Current password is incorrect.' });
      }
    } else {
      return res.json({ success: false, message: 'User not found.' });
    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Something went wrong, please try again.' });
  }
};