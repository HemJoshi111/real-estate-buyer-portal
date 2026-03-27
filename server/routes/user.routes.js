import express from 'express';
import { registerUser, loginUser } from '../controllers/user.controller.js';
import protect from '../middleware/auth.middleware.js';
import { getUserProfile } from '../controllers/user.controller.js';

const router = express.Router();

// Public routes for authentication
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected profile route
router.get('/profile', protect, getUserProfile);


export default router;