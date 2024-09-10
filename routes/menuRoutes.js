import { Router } from 'express';
import multer from 'multer';
import {
  uploadLogoImage,
  updateColor,
  updateLanguage,
  updateTheCurrency,
  getMenu,
  MenuEmbed,
} from '../controllers/menuController.js';

const storage = multer({
  limits: { fileSize: 10 * 1024 * 1024 }
});
const router = Router();

router.get('/menu/:menuid/:res', getMenu);
router.get('/embed/:menuid/:res', MenuEmbed);

router.post('/upload-logo-image', storage.single('image'), uploadLogoImage);
router.post('/updateColor', updateColor);
router.post('/updateLangauge', updateLanguage);
router.post('/updateCurrency', updateTheCurrency);

export default router;