import express from 'express';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { upload, deleteFromCloudinary, getPublicIdFromUrl } from '../utils/cloudinaryUpload.js';

const router = express.Router();

// Utility: Convert string values to numbers safely (FormData sends all values as strings)
const safeNumber = (val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const num = Number(val);
    return isNaN(num) ? val : num;
};

router.get('/', asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    const filter = { isActive: true };

    if (req.query.category) {
        filter.category = req.query.category;
    }

    if (req.query.gender) {
        const requestedGender = req.query.gender;
        if (requestedGender === 'Male' || requestedGender === 'Female') {
            filter.gender = { $in: [requestedGender, 'Unisex'] };
        } else {
            filter.gender = requestedGender;
        }
    }

    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.minRating) {
        filter.rating = { $gte: Number(req.query.minRating) };
    }

    if (req.query.keyword) {
        filter.$text = { $search: req.query.keyword };
    }

    if (req.query.featured === 'true') {
        filter.isFeatured = true;
    }

    if (req.query.trending === 'true') {
        filter.isTrending = true;
    }

    if (req.query.future === 'true') {
        filter.isFuture = true;
    } else {
        filter.isFuture = { $ne: true };
    }

    if (req.query.inStock === 'true') {
        filter.stock = { $gt: 0 };
    }

    let sort = {};
    if (req.query.sortBy) {
        switch (req.query.sortBy) {
            case 'price-asc':
                sort = { price: 1 };
                break;
            case 'price-desc':
                sort = { price: -1 };
                break;
            case 'rating':
                sort = { rating: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }
    } else {
        sort = { createdAt: -1 };
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .populate('category', 'name slug')
        .sort(sort)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        products,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
    });
}));

router.get('/:id', asyncHandler(async (req, res) => {
    let product;

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(req.params.id).populate('category', 'name slug');
    } else {
        product = await Product.findOne({ slug: req.params.id }).populate('category', 'name slug');
    }

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

router.post('/', protect, admin, upload.array('images', 20), asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        compareAtPrice,
        category,
        subcategory,
        stock,
        isFeatured,
        isFuture,
        specifications,
        tags,
        gender,
    } = req.body;

    const images = req.files ? req.files.map(file => file.path) : [];

    const parsedSpecifications = typeof specifications === 'string'
        ? JSON.parse(specifications)
        : specifications;

    const parsedTags = typeof tags === 'string'
        ? JSON.parse(tags)
        : tags;

    const product = await Product.create({
        name,
        description,
        price: safeNumber(price),
        compareAtPrice: safeNumber(compareAtPrice),
        images,
        category,
        subcategory,
        stock: safeNumber(stock),
        isFeatured: isFeatured === 'true' || isFeatured === true,
        isTrending: req.body.isTrending === 'true' || req.body.isTrending === true,
        isFuture: isFuture === 'true' || isFuture === true,
        specifications: parsedSpecifications,
        tags: parsedTags,
        gender,
    });

    res.status(201).json(product);
}));

const uploadImages = (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    const hasFiles = contentType.includes('multipart/form-data');
    if (!hasFiles) {
        return next();
    }
    upload.array('images', 20)(req, res, (err) => {
        if (err) {
            console.error('Upload Error:', err);
            try {
                const logMsg = `\n--- ERROR ${new Date().toISOString()} ---\nMessage: Upload Failed: ${err.message}\nStack: ${err.stack}\n--------------------------\n`;
                fs.appendFileSync('backend_errors.log', logMsg);
            } catch (e) { }
            return next(err);
        }
        next();
    });
};

router.put('/:id', protect, admin, (req, res, next) => {
    console.log(`Processing PUT request for ${req.params.id}`);
    next();
}, uploadImages, asyncHandler(async (req, res) => {
    console.log(`Product Update Request: ${req.params.id}`);
    if (req.files) console.log(`Files received: ${req.files.length}`);

    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const {
        name,
        description,
        price,
        compareAtPrice,
        category,
        subcategory,
        stock,
        isActive,
        isFeatured,
        isTrending,
        isFuture,
        specifications,
        tags,
        gender,
        existingImages,
        imageLayout,
    } = req.body;

    let finalImages = [];

    if (imageLayout) {
        try {
            const layout = typeof imageLayout === 'string' ? JSON.parse(imageLayout) : imageLayout;
            const uploadedFiles = req.files ? [...req.files] : [];

            if (Array.isArray(layout)) {
                for (const item of layout) {
                    if (item === '__FILE__') {
                        if (uploadedFiles.length > 0) {
                            const file = uploadedFiles.shift();
                            finalImages.push(file.path);
                        }
                    } else if (typeof item === 'string' && item.startsWith('http')) {
                        finalImages.push(item);
                    }
                }
                if (uploadedFiles.length > 0) {
                    uploadedFiles.forEach(f => finalImages.push(f.path));
                }
            }
        } catch (e) {
            console.error("Error parsing imageLayout", e);
            finalImages = product.images;
        }
    } else {
        if (existingImages) {
            try {
                const parsedExistingImages = typeof existingImages === 'string'
                    ? JSON.parse(existingImages)
                    : existingImages;
                finalImages = Array.isArray(parsedExistingImages) ? parsedExistingImages : [parsedExistingImages];
            } catch (e) {
                console.error('Error parsing existingImages:', e);
                if (typeof existingImages === 'string' && existingImages.startsWith('http')) {
                    finalImages = [existingImages];
                }
            }
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            finalImages = [...finalImages, ...newImages];
        }
    }

    // Only update images if new ones were provided or layout changed
    const shouldUpdateImages = imageLayout !== undefined || existingImages !== undefined || (req.files && req.files.length > 0);

    if (shouldUpdateImages && product.images && product.images.length > 0) {
        const removedImages = product.images.filter(img => !finalImages.includes(img));
        for (const imgUrl of removedImages) {
            const publicId = getPublicIdFromUrl(imgUrl);
            if (publicId) {
                await deleteFromCloudinary(publicId);
            }
        }
    }

    let parsedSpecifications = specifications;
    try {
        parsedSpecifications = specifications && typeof specifications === 'string'
            ? JSON.parse(specifications)
            : specifications;
    } catch (e) { console.error('Spec parse error', e); }

    let parsedTags = tags;
    try {
        parsedTags = tags && typeof tags === 'string'
            ? JSON.parse(tags)
            : tags;
    } catch (e) { console.error('Tags parse error', e); }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? safeNumber(price) : product.price;
    product.compareAtPrice = compareAtPrice !== undefined ? safeNumber(compareAtPrice) : product.compareAtPrice;

    if (shouldUpdateImages) {
        product.images = finalImages;
    }

    product.category = category || product.category;
    product.subcategory = subcategory !== undefined ? subcategory : product.subcategory;
    product.stock = stock !== undefined ? safeNumber(stock) : product.stock;
    product.isActive = isActive !== undefined ? isActive : product.isActive;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isTrending = isTrending !== undefined ? isTrending : product.isTrending;
    product.isFuture = isFuture !== undefined ? isFuture : product.isFuture;
    product.specifications = parsedSpecifications || product.specifications;
    product.tags = parsedTags || product.tags;
    product.gender = gender || product.gender;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    console.log('[DELETE PRODUCT] Received request for ID:', req.params.id);
    const product = await Product.findById(req.params.id);

    if (!product) {
        console.log('[DELETE PRODUCT] Not found:', req.params.id);
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.images && product.images.length > 0) {
        for (const imgUrl of product.images) {
            const publicId = getPublicIdFromUrl(imgUrl);
            if (publicId) {
                await deleteFromCloudinary(publicId);
            }
        }
    }

    await product.deleteOne();
    console.log('[DELETE PRODUCT] Successfully removed:', req.params.id);
    res.json({ message: 'Product deleted successfully' });
}));

router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
    }

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
}));

export default router;
