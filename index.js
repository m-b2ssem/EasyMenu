import express from 'express';  // import express from 'express';
import path from 'path';  // import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';

import { config } from 'dotenv';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const app = express();  // const app = express();
const PORT = process.env.PORT;  // const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log('Server is running on http://localhost: ' + PORT);
})



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/homePage/index.html'));
})

app.post('/register', (req, res) => {
  const {resturantName, email, password, sendUpdate} = req.body;

    console.log('name:' + resturantName, email, password, sendUpdate);

    if (!resturantName || !email || !password) {
        return res.json({ success: false, message: 'Please fill all fields.'});
    }

    if (email === null) {
        return res.json({ success: false, message: 'This email address already exists.'});
    }

    res.json({ success: true, message: 'Registration successful, please login.'});
});

app.post('/login', (req, res) => {
  const {email, password, remember} = req.body;

    console.log('email:' + email, password, remember);

    if (!email || !password) {
        return res.json({ success: false, message: 'Please fill all fields.'});
    }

    res.json({ success: false, message: 'Invalid login credentials.'});
});



