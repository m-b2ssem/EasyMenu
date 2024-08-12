
import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

config();

/*export async function sendEmail(name, email, subject, message) {
    const data = JSON.stringify({
      "Messages": [{
        "From": {"Email": "basemmahdi1997@gmail.com", "Name": "Easy Menu"},
        "To": [{"Email": email, "Name": name}],
        "Subject": subject,
        "TextPart": message
      }]
    });
  
    const config = {
      method: 'post',
      url: 'https://api.mailjet.com/v3.1/send',
      data: data,
      headers: {'Content-Type': 'application/json'},
      auth: {username: process.env.MAILJET_API_KEY, password: process.env.MAILJET_API_SECRET_KEY},
    };
  
    return axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log('erroei is ', error);
      });
  
  }*/ 

      // Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youreasymenus@gmail.com',
    pass: 'jlss bbuv ycyp zlrr'
  }
});

export async function sendEmail(email, subject, template) {
  const mailOptions = {
    from: 'youreasymenus@gmail.com',
    to: email,
    subject: subject,
    html: template,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    }
  });
}

export async function sendEmailJana(body, file) {
  const mailOptions = {
    from: 'youreasymenus@gmail.com',
    to: 'jana.rajnicova@gmail.com',
    subject: 'new email',
    text: `Hello Jana, you have a new message \n ${body}`,
    attachments: [
          {
            filename: file.originalname,
            content: file.buffer
          }
    ]
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    }
  });
}





export async function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}