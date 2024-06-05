import express from 'express';  // import express from 'express';
import path from 'path';  // import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const app = express();  // const app = express();
const PORT = 3000;  // const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log('Server is running on http://localhost: ' + PORT);
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/homePage/index.html'));
})





app.post('/login', (req, res) => {
  const {email, password, remember} = req.body;

    console.log('email:' + email, password);

});

