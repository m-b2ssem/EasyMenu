import { Router } from 'express';
import multer from 'multer';
import {
  reorderItems,
  getItemStatus,
  updateItemStatusController,
  deleteItemController,
  addItem,
  updateItemController,
  getItems,
  getItem,
  deleteItemImage
} from '../controllers/itemController.js';

const storage = multer();
const router = Router();

router.post('/reorder-items', reorderItems);
router.get('/get-item-status', getItemStatus);
router.post('/update-item-status', updateItemStatusController);
router.post('/deleteitem', deleteItemController);
router.post('/additem', storage.single('image'), addItem);
router.post('/update-item', storage.single('image'), updateItemController);
router.get('/get-items', getItems);
router.get('/get-item', getItem);
router.post('/delete-item-image', deleteItemImage);

export default router;
