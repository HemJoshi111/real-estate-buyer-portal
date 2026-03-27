import Favorite from '../models/favorite.model.js';
import Property from '../models/property.model.js';

// @desc    Toggle favorite (Add if not exists, Remove if exists)
// @route   POST /api/favorites/toggle
// @access  Private
export const toggleFavorite = async (req, res) => {
    const { propertyId } = req.body;

    if (!propertyId) {
        return res.status(400).json({ message: 'Property ID is required' });
    }

    try {
        // 1. Check if the property exists in the master catalog
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // 2. Check if the user has already favorited this property
        const existingFavorite = await Favorite.findOne({
            user: req.user._id,
            property: propertyId,
        });

        if (existingFavorite) {
            // Remove from favorites
            await existingFavorite.deleteOne();
            return res.status(200).json({
                message: 'Removed from favorites',
                isFavorited: false
            });
        } else {
            // Add to favorites
            const newFavorite = await Favorite.create({
                user: req.user._id,
                property: propertyId,
            });
            return res.status(201).json({
                message: 'Added to favorites',
                isFavorited: true,
                favorite: newFavorite
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's favorites
// @route   GET /api/favorites/my
// @access  Private
export const getMyFavorites = async (req, res) => {
    try {
        // We use .populate('property') so that the frontend gets the full house details 
        // (title, price, image) instantly, allowing the "View Details" click to work.
        const favorites = await Favorite.find({ user: req.user._id })
            .populate('property');

        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};