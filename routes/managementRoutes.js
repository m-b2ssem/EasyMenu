import { Router } from 'express';
import { isAuthenticated } from '../middlewares/authLoggrdin.js';
import { 
    manageMenuPage,
    manageCategoryPage,
    manageItemPage,
    manageProfilePage,
    manageBillingPage
} from '../controllers/managementController.js';



const router = Router();

router.get('/management/menu/:userid',isAuthenticated ,manageMenuPage);
router.get('/management/category/:userid',isAuthenticated ,manageCategoryPage);
router.get('/management/items/:userid',isAuthenticated ,manageItemPage);
router.get('/management/profile/:user_id',isAuthenticated ,manageProfilePage);
router.get('/management/billing/:userid',isAuthenticated ,manageBillingPage);


export default router;