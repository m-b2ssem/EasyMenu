import { Router } from 'express';
import multer from 'multer';
import {
  uploadLogoImage,
  updateColor,
  updateLanguage,
  updateTheCurrency,
  getMenu,
} from '../controllers/menuController.js';

const storage = multer();
const router = Router();

router.get('/menu/:menuid/:res', getMenu);

router.post('/uplaod-logo-image', storage.single('image'), uploadLogoImage);
router.post('/updateColor', updateColor);
router.post('/updateLangauge', updateLanguage);
router.post('/updateCurrency', updateTheCurrency);

export default router;