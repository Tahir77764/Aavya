import express from 'express';
import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', protect, asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price stock isActive');

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
}));

router.post('/', protect, asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
        res.status(400);
        throw new Error('Invalid product or quantity');
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.stock < quantity) {
        res.status(400);
        throw new Error('Insufficient stock');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;

        if (product.stock < newQuantity) {
            res.status(400);
            throw new Error('Insufficient stock');
        }

        cart.items[existingItemIndex].quantity = newQuantity;
        cart.items[existingItemIndex].price = product.price;
    } else {
        cart.items.push({
            product: productId,
            quantity,
            price: product.price,
        });
    }

    await cart.save();

    cart = await Cart.findById(cart._id).populate('items.product', 'name images price stock isActive');
    res.json(cart);
}));

router.put('/:itemId', protect, asyncHandler(async (req, res) => {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        res.status(400);
        throw new Error('Invalid quantity');
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
        item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
        res.status(404);
        throw new Error('Item not found in cart');
    }

    const product = await Product.findById(cart.items[itemIndex].product);

    if (!product || !product.isActive) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.stock < quantity) {
        res.status(400);
        throw new Error('Insufficient stock');
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name images price stock isActive');
    res.json(updatedCart);
}));

router.delete('/:itemId', protect, asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(
        item => item._id.toString() !== req.params.itemId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name images price stock isActive');
    res.json(updatedCart);
}));

router.delete('/', protect, asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully', cart });
}));

router.get('/all', protect, admin, asyncHandler(async (req, res) => {
    const carts = await Cart.find({})
        .populate('user', 'name email')
        .populate('items.product', 'name images price');
    res.json(carts);
}));

router.get('/user/:userId', protect, admin, asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.params.userId })
        .populate('items.product', 'name images price');
    if (!cart) {
        return res.json({ items: [] });
    }
    res.json(cart);
}));

router.delete('/user/:userId', protect, admin, asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found for this user');
    }
    cart.items = [];
    await cart.save();
    res.json({ message: 'User cart cleared successfully' });
}));

export default router;
