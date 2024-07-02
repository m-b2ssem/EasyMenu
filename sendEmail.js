import axios from 'axios';
import { config } from 'dotenv';

config();

export async function sendEmail(name, email, subject, message) {
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
  
  }

