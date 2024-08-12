import fs from 'fs';
import path from 'path';
import {
    getUserByEmail,
    updateEmail,
    updateConfirmToken,
    selectUserByConfirmToken,
    updateEmailVerified,
} from '../models/userModel.js';
import { generateResetToken } from '../utils/helperFunctions.js';
import { fileURLToPath } from 'url';
import { sendEmail } from '../services/sendEmail.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const changeEmail = async (req, res) => {
    const { newEmail, oldEmail ,userId } = req.body;
    const lowerCaseEmail = newEmail.toLowerCase();
    const result = await getUserByEmail(lowerCaseEmail);
    if (result.rows.length > 0) {
      return res.json({ success: false, message: 'This email address already exists, please choose another one or login with the existing one.'});
    }
    const result2 = await updateEmail(userId, lowerCaseEmail);
    if (!result2) {
      return res.json({ success: false, message: 'Something went wrong, please try again.'});
    }
    const token = await generateResetToken();
    await updateConfirmToken(userId, token);
    let confirmTemplate = fs.readFileSync(path.join(__dirname, '../public/pages/confirm-template.html'), 'utf8');
    confirmTemplate = confirmTemplate.replace('%link%', 'https://easymenus.eu/confirm-email/' + token);
    await sendEmail(lowerCaseEmail, 'Confirm your email address', confirmTemplate);
    res.json({ success: true });
};
  
export const resendConfirmationEmail = async (req, res) => {
    try {
      const { email, userId } = req.body;
      const token = await generateResetToken();
      const result = await updateConfirmToken(userId, token);
      if (!result) {
        return res.json({ success: false, message: 'Something went wrong, please try again.' });
      }
      let confirmTemplate = fs.readFileSync(path.join(__dirname, '../public/pages/confirm-template.html'), 'utf8');
      confirmTemplate = confirmTemplate.replace('%link%', 'https://easymenus.eu/confirm-email/' + token);
      await sendEmail(email, 'Confirm your email address', confirmTemplate);
      res.json({ success: true, message: 'Email has been sent.' });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
};
  
export const confirmEmail = async (req, res) => {
    const token = req.params.token;
    const parameters = req.query;
    const result = await selectUserByConfirmToken(token);
    if (result) {
      const result2 = await updateEmailVerified(result.user_id);
      if (!result2) {
        return res.render('message.ejs', { message: 'Something went wrong, please try again.',
          link: '/login',
          name: 'login'
         });
      }
      let registerTemplate = fs.readFileSync(path.join(__dirname, '../public/pages/register-template.html'), 'utf8');
      await sendEmail(result.email, 'Welcome to Easy Menu – Your Registration is Complete!', registerTemplate);
  
      let link = '/completed-registration';
      let params = new URLSearchParams(parameters).toString();
      if (params) {
        link += `?${params}`;
      }
      return res.redirect(link);
    } else {
      return res.render('message.ejs', { message: 'The link is invalid, please try again.',
        link: '/login',
        name: 'login'
       });
    }
};