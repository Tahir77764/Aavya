import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Category from './models/categoryModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedData = async () => {
    try {
        await Category.deleteMany();
        await Product.deleteMany();

        console.log('Data Destroyed!'.red.inverse);

        let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });

        if (!adminUser) {
            adminUser = await User.create({
                name: 'Admin',
                email: process.env.ADMIN_EMAIL || 'admin@avayajewellery.com',
                password: 'admin123',
                isAdmin: true,
                isVerified: true,
            });
            console.log('Admin user created!'.green.inverse);
        }

        const categories = await Category.insertMany([
            {
                name: 'Necklaces',
                slug: 'necklaces',
                description: 'Elegant necklaces for every occasion',
                displayOrder: 1,
            },
            {
                name: 'Bracelets',
                slug: 'bracelets',
                description: 'Beautiful bracelets to adorn your wrists',
                displayOrder: 2,
            },
            {
                name: 'Earrings',
                slug: 'earrings',
                description: 'Stunning earrings to complement your style',
                displayOrder: 3,
            },
            {
                name: 'Rings',
                slug: 'rings',
                description: 'Exquisite rings for special moments',
                displayOrder: 4,
            },
        ]);

        console.log('Categories seeded!'.green.inverse);

        const products = [
            // Necklaces
            {
                name: 'Gold Diamond Necklace',
                description: 'Elegant 18K gold necklace adorned with brilliant cut diamonds. Perfect for weddings and special occasions.',
                price: 45999,
                compareAtPrice: 52999,
                images: [
                    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=800',
                ],
                category: categories[0]._id,
                stock: 15,
                isFeatured: true,
                specifications: {
                    metal: '18K Gold',
                    stone: 'Diamond',
                    weight: '25g',
                    purity: '18K',
                    occasion: 'Wedding',
                },
                tags: ['diamond', 'gold', 'wedding', 'luxury'],
            },
            {
                name: 'Pearl String Necklace',
                description: 'Classic pearl necklace with lustrous white pearls and gold clasp.',
                price: 12999,
                images: [
                    'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800',
                ],
                category: categories[0]._id,
                stock: 25,
                specifications: {
                    metal: '22K Gold Clasp',
                    stone: 'Natural Pearl',
                    weight: '15g',
                    purity: '22K',
                    occasion: 'Party',
                },
                tags: ['pearl', 'classic', 'elegant'],
            },
            {
                name: 'Ruby Gold Necklace Set',
                description: 'Stunning necklace set with natural rubies set in 22K gold.',
                price: 78999,
                compareAtPrice: 89999,
                images: [
                    'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800',
                ],
                category: categories[0]._id,
                stock: 8,
                isFeatured: true,
                specifications: {
                    metal: '22K Gold',
                    stone: 'Ruby',
                    weight: '35g',
                    purity: '22K',
                    occasion: 'Wedding',
                },
                tags: ['ruby', 'gold', 'bridal', 'luxury'],
            },

            // Bracelets
            {
                name: 'Diamond Tennis Bracelet',
                description: 'Elegant tennis bracelet with premium diamonds in white gold setting.',
                price: 35999,
                images: [
                    'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800',
                ],
                category: categories[1]._id,
                stock: 12,
                isFeatured: true,
                specifications: {
                    metal: '18K White Gold',
                    stone: 'Diamond',
                    weight: '12g',
                    purity: '18K',
                    occasion: 'Party',
                },
                tags: ['diamond', 'tennis', 'elegant'],
            },
            {
                name: 'Gold Bangle Set',
                description: 'Traditional gold bangles set, perfect for daily wear or special occasions.',
                price: 24999,
                images: [
                    'https://images.pexels.com/photos/3673581/pexels-photo-3673581.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=800',
                ],
                category: categories[1]._id,
                stock: 20,
                specifications: {
                    metal: '22K Gold',
                    weight: '28g',
                    purity: '22K',
                    occasion: 'Daily Wear',
                },
                tags: ['gold', 'bangles', 'traditional'],
            },
            {
                name: 'Emerald Link Bracelet',
                description: 'Luxury bracelet featuring emeralds set in yellow gold links.',
                price: 42999,
                compareAtPrice: 48999,
                images: [
                    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=800',
                ],
                category: categories[1]._id,
                stock: 10,
                specifications: {
                    metal: '18K Yellow Gold',
                    stone: 'Emerald',
                    weight: '18g',
                    purity: '18K',
                    occasion: 'Party',
                },
                tags: ['emerald', 'gold', 'luxury'],
            },

            // Earrings
            {
                name: 'Diamond Stud Earrings',
                description: 'Classic diamond stud earrings in platinum setting. Timeless elegance.',
                price: 28999,
                images: [
                    'https://images.pexels.com/photos/1472887/pexels-photo-1472887.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/1458838/pexels-photo-1458838.jpeg?auto=compress&cs=tinysrgb&w=800',
                ],
                category: categories[2]._id,
                stock: 30,
                isFeatured: true,
                specifications: {
                    metal: 'Platinum',
                    stone: 'Diamond',
                    weight: '4g',
                    purity: 'Platinum 950',
                    occasion: 'Daily Wear',
                },
                tags: ['diamond', 'platinum', 'studs'],
            },
            {
                name: 'Gold Jhumka Earrings',
                description: 'Traditional Indian jhumka earrings in 22K gold with intricate design.',
                price: 18999,
                images: [
                    'https://images.pexels.com/photos/3673583/pexels-photo-3673583.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/1472887/pexels-photo-1472887.jpeg?auto=compress&cs=tinysrgb&w=800',
                ],
                category: categories[2]._id,
                stock: 18,
                specifications: {
                    metal: '22K Gold',
                    weight: '12g',
                    purity: '22K',
                    occasion: 'Wedding',
                },
                tags: ['gold', 'traditional', 'jhumka'],
            },
            {
                name: 'Sapphire Drop Earrings',
                description: 'Elegant drop earrings with blue sapphires and diamonds.',
                price: 32999,
                images: [
                    'https://images.pexels.com/photos/1458838/pexels-photo-1458838.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/3673581/pexels-photo-3673581.jpeg?auto=compress&cs=tinysrgb&w=800',
                ],
                category: categories[2]._id,
                stock: 15,
                specifications: {
                    metal: '18K White Gold',
                    stone: 'Sapphire, Diamond',
                    weight: '8g',
                    purity: '18K',
                    occasion: 'Party',
                },
                tags: ['sapphire', 'diamond', 'elegant'],
            },

            // Rings
            {
                name: 'Solitaire Diamond Ring',
                description: 'Classic solitaire engagement ring with brilliant cut diamond.',
                price: 65999,
                compareAtPrice: 72999,
                images: [
                    'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800',
                ],
                category: categories[3]._id,
                stock: 10,
                isFeatured: true,
                specifications: {
                    metal: 'Platinum',
                    stone: 'Diamond',
                    weight: '5g',
                    purity: 'Platinum 950',
                    occasion: 'Engagement',
                },
                tags: ['diamond', 'solitaire', 'engagement'],
            },
            {
                name: 'Gold Band Ring',
                description: 'Simple yet elegant gold band ring, perfect for everyday wear.',
                price: 8999,
                images: [
                    'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
                ],
                category: categories[3]._id,
                stock: 40,
                specifications: {
                    metal: '22K Gold',
                    weight: '3g',
                    purity: '22K',
                    occasion: 'Daily Wear',
                },
                tags: ['gold', 'band', 'simple'],
            },
            {
                name: 'Ruby Cocktail Ring',
                description: 'Statement cocktail ring with center ruby surrounded by diamonds.',
                price: 54999,
                images: [
                    'https://images.pexels.com/photos/3673583/pexels-photo-3673583.jpeg?auto=compress&cs=tinysrgb&w=800',
                    'https://images.pexels.com/photos/1472887/pexels-photo-1472887.jpeg?auto=compress&cs=tinysrgb&w=800',
                ],
                category: categories[3]._id,
                stock: 12,
                specifications: {
                    metal: '18K Yellow Gold',
                    stone: 'Ruby, Diamond',
                    weight: '8g',
                    purity: '18K',
                    occasion: 'Party',
                },
                tags: ['ruby', 'diamond', 'cocktail'],
            },
        ];

        await Product.insertMany(products);
        console.log('Products seeded!'.green.inverse);

        console.log('Database seeded successfully!'.green.inverse.bold);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Category.deleteMany();
        await Product.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    seedData();
}
