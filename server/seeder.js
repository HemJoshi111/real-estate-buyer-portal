import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Property from './models/property.model.js';

dotenv.config();
connectDB();

const properties = [
    // KATHMANDU
    {
        title: 'Modern 3BHK Apartment',
        description: 'Luxury apartment with a city view and modern amenities.',
        price: 18500000,
        location: 'Baneshwor, Kathmandu',
        type: 'Apartment',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Residential Land in Budhanilkantha',
        description: 'Peaceful 5 aana land perfect for your dream home.',
        price: 4500000,
        location: 'Budhanilkantha, Kathmandu',
        type: 'Land',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Affordable Apartment in Gothatar',
        description: 'Perfect for first-time home buyers in a developing area.',
        price: 9500000,
        location: 'Gothatar, Kathmandu',
        type: 'Apartment',
        imageUrl: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Kapan Heights Residence',
        description: 'Modern house with a beautiful view of the valley.',
        price: 28000000,
        location: 'Kapan, Kathmandu',
        type: 'House',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&h=300&auto=format&fit=crop'
    },

    // LALITPUR
    {
        title: 'Traditional Newari House',
        description: 'Beautifully renovated traditional house with modern interior.',
        price: 35000000,
        location: 'Patan, Lalitpur',
        type: 'House',
        imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Studio Apartment in Jamsikhel',
        description: 'Compact and cozy studio in the heart of the restaurant hub.',
        price: 8500000,
        location: 'Jamsikhel, Lalitpur',
        type: 'Apartment',
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Family Bungalow Bhaisepati',
        description: 'Spacious 5 bedroom bungalow with a large garden.',
        price: 55000000,
        location: 'Bhaisepati, Lalitpur',
        type: 'House',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6199f7a096?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Luxury Villa in Hattiban',
        description: 'Exclusive community living with 24/7 security.',
        price: 65000000,
        location: 'Hattiban, Lalitpur',
        type: 'House',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Residential Land Godawari',
        description: 'Land located in a lush green environment, perfect for a villa.',
        price: 3800000,
        location: 'Godawari, Lalitpur',
        type: 'Land',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&h=300&auto=format&fit=crop'
    },

    // BHAKTAPUR
    {
        title: 'Heritage Row House',
        description: 'Classic architecture located near the Durbar Square.',
        price: 22000000,
        location: 'Bhaktapur Durbar Square',
        type: 'House',
        imageUrl: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Agricultural Land Suryabinayak',
        description: 'Highly fertile land suitable for organic farming.',
        price: 3000000,
        location: 'Suryabinayak, Bhaktapur',
        type: 'Land',
        imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Sallaghari Modern Apartment',
        description: 'New apartment complex with high-speed internet and parking.',
        price: 11000000,
        location: 'Sallaghari, Bhaktapur',
        type: 'Apartment',
        imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?q=80&w=400&h=300&auto=format&fit=crop'
    },

    // POKHARA
    {
        title: 'Lakeside Penthouse',
        description: 'Stunning views of Fewa Lake and the Annapurna range.',
        price: 25000000,
        location: 'Lakeside, Pokhara',
        type: 'Apartment',
        imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Mountain View Villa',
        description: 'Modern villa located in a quiet residential area.',
        price: 42000000,
        location: 'Sarangkot Road, Pokhara',
        type: 'House',
        imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Commercial Plot New Road',
        description: 'Strategic location for business development.',
        price: 12000000,
        location: 'New Road, Pokhara',
        type: 'Land',
        imageUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Hemja Eco-home',
        description: 'Sustainable living with solar power and organic garden.',
        price: 19000000,
        location: 'Hemja, Pokhara',
        type: 'House',
        imageUrl: 'https://images.unsplash.com/photo-1449156001935-d2873044b5b1?q=80&w=400&h=300&auto=format&fit=crop'
    },

    // DHANGADHI
    {
        title: 'Terai Region House',
        description: 'Comfortable single-story house with a wide porch.',
        price: 15000000,
        location: 'Dhangadhi Sub-metropolitan',
        type: 'House',
        imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Flat for Office Space',
        description: 'Ideal for small businesses or consultancies.',
        price: 6000000,
        location: 'Main Road, Dhangadhi',
        type: 'Apartment',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'Highway Touch Plot',
        description: 'Great investment opportunity along the East-West Highway.',
        price: 8000000,
        location: 'Attariya, Dhangadhi',
        type: 'Land',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&h=300&auto=format&fit=crop'
    },
    {
        title: 'City Center Residence',
        description: 'Conveniently located near the hospital and market.',
        price: 13500000,
        location: 'Dhangadhi-4, Dhangadhi',
        type: 'House',
        imageUrl: 'https://images.unsplash.com/photo-1472233342354-8d014226a344?q=80&w=400&h=300&auto=format&fit=crop'
    }
];

const importData = async () => {
    try {
        await Property.deleteMany();
        await Property.insertMany(properties);
        console.log(`${properties.length} Properties Imported Successfully!`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();