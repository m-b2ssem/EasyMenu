import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.get('/cookie-policy', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/cookies.html'));
});
  
router.get('/imprint', (req, res) => {
res.sendFile(path.join(__dirname, '../public/pages/imprint.html'));
});

router.get('/terms', (req, res) => {
res.sendFile(path.join(__dirname, '../public/pages/terms.html'));
});

router.get('/privacy', (req, res) => {
res.sendFile(path.join(__dirname, '../public/pages/privacy-policy.html'));
});



router.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '../public/pages/index.html'));
});

// Optional: create a specific route for the sitemap
router.get('/sitemap.xml', (req, res) => {
res.setHeader('Content-Type', 'application/xml');
res.sendFile(path.join(__dirname, '../public', 'sitemap.xml'));
});

// Serve robots.txt
router.get('/robots.txt', (req, res) => {
res.setHeader('Content-Type', 'text/plain');
res.sendFile(path.join(__dirname, '../public', 'robots.txt'));
});

router.get('/login', (req, res) => {
res.sendFile(path.join(__dirname, '../public/pages/login_page.html'));
});

router.get('/login/failed', (req, res) => {
res.sendFile(path.join(__dirname, '../public/pages/login_page_failed.html'));
});

router.get('/register', (req, res) => {
res.sendFile(path.join(__dirname, '../public/pages/register_page.html'));
});

router.get('/forgot-password', (req, res) => {
res.sendFile(path.join(__dirname, '../public/pages/forgot-password.html'));
});

router.get('/completed-registration', (req, res) => {
const params = req.query;
console.log(params);
res.sendFile(path.join(__dirname, '../public/pages/complete_registration.html'));
});

  
    export default router;