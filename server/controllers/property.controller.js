import Property from '../models/property.model.js';
import Favorite from '../models/favorite.model.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
    try {
        const properties = await Property.find({});
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single property details
// @route   GET /api/properties/:id
// @access  Public/Private
export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if the current user has favorited this property (if they are logged in)
        let isFavorited = false;

        // We check for the token and decode it to get the user ID, then check if a favorite exists for this user and property.
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                const favorite = await Favorite.findOne({
                    user: decoded.id,
                    property: req.params.id
                });

                if (favorite) isFavorited = true;
            } catch (err) {
                // If token is invalid, we just treat them as a guest (isFavorited stays false)
            }
        }

        // Return the property details with the favorite status
        res.json({
            ...property._doc,
            isFavorited
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};