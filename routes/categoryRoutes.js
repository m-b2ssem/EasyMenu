import { Router } from 'express';
import { 
    addCategoryApi,
    deleteCategoryApi,
    getCategoryStatusApi,
    getCategoriesApi,
    reorderCategoriesApi,
    updateCategoryAip,
    updatecategoryStatusApi,
    getCategoryNameApi,
} from '../controllers/categoryController.js';
import { isAuthenticated } from '../middlewares/authLoggrdin.js';

const router = Router();

router.post('/add-category', isAuthenticated ,addCategoryApi);
router.post('/deletecategory', isAuthenticated ,deleteCategoryApi);
router.post('/update-category', isAuthenticated ,updateCategoryAip);
router.post('/update-category-status', isAuthenticated ,updatecategoryStatusApi);
router.post('/reorder-categories', isAuthenticated ,reorderCategoriesApi);
router.get('/get-category-name', getCategoryNameApi);
router.get('/get-categories', getCategoriesApi);
router.get('/get-category-status', getCategoryStatusApi);


export default router;
  