import express from 'express';  // import express from 'express';
import path from 'path';  // import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import pdfRoutes from './routes/pdfRoutes.js';
import staticRoutes from './routes/staticRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import managementRoutes from './routes/managementRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import emilConfirmationRoutes from './routes/emilConfirmationRoutes.js';
import facebookRoutes from './routes/facebookRoutes.js';
import janaRoutes from './routes/janaRoutes.js';





config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 60000 * 60 * 24 * 30  // 1 manoth
   }
}));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({limit: '10mb',extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use(webhookRoutes);

app.use(express.json({ limit: '10mb' }));

app.use(pdfRoutes);
app.use(staticRoutes);
app.use(authRoutes);
app.use(managementRoutes);
app.use(menuRoutes);
app.use(categoryRoutes);
app.use(itemRoutes);
app.use(stripeRoutes);
app.use(emilConfirmationRoutes);
app.use(facebookRoutes);
app.use(janaRoutes);




// Catch-all route to handle 404 errors
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '/public/pages/404.html'));
});


const PORT = process.env.PORT || 8080;  // const PORT = 3000;

app.listen(PORT, () => {
  console.log('Server is running on http://localhost: ' + PORT);
});

