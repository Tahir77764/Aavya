import express from 'express';
import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { upload, deleteFromCloudinary, getPublicIdFromUrl } from '../utils/cloudinaryUpload.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    res.json(categories);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    let category;

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        category = await Category.findById(req.params.id);
    } else {
        category = await Category.findOne({ slug: req.params.id });
    }

    if (category) {
        res.json(category);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
}));

router.post('/', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
    const { name, description, displayOrder, isActive } = req.body;

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    const category = await Category.create({
        name,
        description,
        image: req.file ? req.file.path : '',
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(category);
}));

router.put('/:id', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    const { name, description, displayOrder, isActive } = req.body;

    let imageUrl = category.image;

    if (req.file) {
        if (category.image) {
            const publicId = getPublicIdFromUrl(category.image);
            if (publicId) {
                await deleteFromCloudinary(publicId);
            }
        }
        imageUrl = req.file.path;
    }

    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    category.image = imageUrl;
    category.displayOrder = displayOrder !== undefined ? displayOrder : category.displayOrder;
    category.isActive = isActive !== undefined ? isActive : category.isActive;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    if (category.image) {
        const publicId = getPublicIdFromUrl(category.image);
        if (publicId) {
            await deleteFromCloudinary(publicId);
        }
    }

    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
}));

export default router;
