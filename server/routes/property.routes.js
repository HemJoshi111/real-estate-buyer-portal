import express from 'express';
import { getProperties, getPropertyById } from '../controllers/property.controller.js';

const router = express.Router();

// Public routes for the property catalog
router.get('/', getProperties);
router.get('/:id', getPropertyById);

export default router;