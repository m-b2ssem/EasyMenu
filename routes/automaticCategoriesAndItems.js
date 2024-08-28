import { Router } from 'express';
import { automaticCategoriesAndItems } from '../controllers/automaticCategoriesAndItems.js';

const router = Router();

router.post('/create-automatic-categories', automaticCategoriesAndItems);

export default router;