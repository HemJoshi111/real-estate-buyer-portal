import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a property title'],
        trim: true,
    },

    description: {
        type: String,
        required: [true, 'Please add a property description'],
        trim: true,
    },

    price: {
        type: Number,
        required: [true, 'Please add a property price'],
    },
    location: {
        type: String,
        required: [true, 'Please add a property location'],
        trim: true,
    },
    type: {
        type: String,
        enum: ['Apartment', 'House', 'Land'],
        default: 'Apartment',
        required: [true, 'Please add a property type'],
    },

    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/400x300?text=No+Image',
        trim: true,
    },

}, { timestamps: true })

const Property = mongoose.model('Property', propertySchema)
export default Property