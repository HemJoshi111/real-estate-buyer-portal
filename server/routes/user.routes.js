import express from 'express';
import { registerUser, loginUser, getUserProfile, logoutUser } from '../controllers/user.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes for authentication
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected profile route
router.get('/profile', protect, getUserProfile);
router.post('/logout', protect, logoutUser);


export default router;