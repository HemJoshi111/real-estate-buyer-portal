import express from 'express';
import { toggleFavorite, getMyFavorites } from '../controllers/favorite.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes here require being logged in
router.use(protect);

router.post('/toggle', toggleFavorite); // One endpoint for both Like/Unlike
router.get('/my', getMyFavorites);

export default router;