import { Router } from 'express';
import { createPdfMenu } from '../controllers/pdfController.js';

const router = Router();

router.get('/generate-pdf/:menuId', createPdfMenu);

export default router;