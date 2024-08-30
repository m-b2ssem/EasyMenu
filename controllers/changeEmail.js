import { selectUserByEmail, selectUserById, updateEmail } from '../models/userModel.js';
import { sendEmail } from '../services/sendEmail.js';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { updateConfirmToken } from '../models/userModel.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const  sendVerificationCode = async (req, res) => 
{
    try{
        const  {email, userId}  = req.body;
        if (!email || !userId) {
            return res.status(400).json({ success: false, message: 'Invalid request. Please try again.' });
        }
        const lowerCaseEmail = email.toLowerCase();
        const response = await selectUserByEmail(lowerCaseEmail);
        if (response.rowCount > 0) {
            return res.status(404).json({ success: false, message: 'This email address exist already, please choose another Email Address.' });
        }
        let verificationCode = Math.floor(100000 + Math.random() * 900000);
        verificationCode = verificationCode.toString().substring(0, 6);
        await updateConfirmToken(userId, verificationCode);
        const subject = 'Email Verification Code';
        let confirmTemplate = fs.readFileSync(path.join(__dirname, '../public/pages/email-code.html'), 'utf8');
        confirmTemplate = confirmTemplate.replace('[VERIFICATION_CODE]', verificationCode);
        await sendEmail(lowerCaseEmail, subject, confirmTemplate);
        res.status(200).json({ success: true, message: 'Verification code sent successfully.' });
    }catch(err){
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
}

export const verifyEmailCode = async (req, res) => {
    try {
        const { email, code, userId } = req.body;
        if (!email || !code || !userId) {
            return res.status(400).json({ success: false, message: 'Invalid request. Please try again.' });
        }
        const lowerCaseEmail = email.toLowerCase();
        const response = await selectUserByEmail(lowerCaseEmail);
        if (response.rowCount !== 0) {
            return res.status(404).json({ success: false, message: 'This email address does exist. Please try again.' });
        }
        const response2 = await selectUserById(userId);
        if (response2.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Invalid request. Please try again.' });
        }
        const user = response2.rows[0];
        const user_code = parseInt(user.verification_token);
        if (user.verification_token === code) {
            await updateEmail(userId, lowerCaseEmail);
            return res.status(200).json({ success: true, message: 'Email verified successfully.' });
        }
        return res.status(404).json({ success: false, message: 'Invalid verification code. Please try again.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
}