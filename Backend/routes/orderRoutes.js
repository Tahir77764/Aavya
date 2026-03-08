import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

router.post('/whatsapp', protect, asyncHandler(async (req, res) => {
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error('Cart is empty');
    }

    const orderItems = cart.items.map(cartItem => ({
        product: cartItem.product._id,
        name: cartItem.product?.name || 'Product',
        image: cartItem.product?.images?.[0] || '',
        quantity: cartItem.quantity,
        price: cartItem.price,
    }));

    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress: {
            fullName: req.user.name || 'To be confirmed',
            phone: 'Via WhatsApp',
            addressLine1: 'To be confirmed via WhatsApp',
            city: 'To be confirmed',
            state: 'To be confirmed',
            pincode: '000000',
            country: 'India',
        },
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        itemsPrice: itemsPrice || cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        taxPrice: taxPrice || 0,
        shippingPrice: shippingPrice || 0,
        totalPrice: totalPrice || cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        orderStatus: 'Pending',
        statusHistory: [{
            status: 'Pending',
            timestamp: new Date(),
            note: 'Order placed via WhatsApp',
        }],
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
}));

router.post('/', protect, asyncHandler(async (req, res) => {
    const {
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error('Cart is empty');
    }

    const orderItems = [];

    for (const cartItem of cart.items) {
        const product = await Product.findById(cartItem.product._id);

        if (!product || !product.isActive) {
            res.status(400);
            throw new Error(`Product ${cartItem.product.name} is no longer available`);
        }

        if (product.stock < cartItem.quantity) {
            res.status(400);
            throw new Error(`Insufficient stock for ${product.name}`);
        }

        product.stock -= cartItem.quantity;
        await product.save();

        orderItems.push({
            product: product._id,
            name: product.name,
            image: product.images[0] || '',
            quantity: cartItem.quantity,
            price: cartItem.price,
        });
    }

    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        statusHistory: [{
            status: 'Pending',
            timestamp: new Date(),
            note: 'Order placed',
        }],
    });

    cart.items = [];
    await cart.save();

    const message = `
        <h1>Order Confirmation</h1>
        <p>Dear ${req.user.name},</p>
        <p>Thank you for your order!</p>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalPrice.toFixed(2)}</p>
        <p>We will notify you when your order ships.</p>
        <br/>
        <p>Best regards,</p>
        <p>Avaya Jewellery Team</p>
    `;

    try {
        await sendEmail({
            email: req.user.email,
            subject: `Order Confirmation - ${order.orderNumber}`,
            message,
        });
    } catch (error) {
        console.error('Failed to send order confirmation email:', error);
    }

    res.status(201).json(order);
}));

router.get('/myorders', protect, asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
}));

router.get('/user/:userId', protect, admin, asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.params.userId })
        .sort({ createdAt: -1 });
    res.json(orders);
}));

router.get('/:id', protect, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('items.product', 'name');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Allow access if user is admin OR if the order belongs to the requesting user
    if (req.user.isAdmin) {
        return res.json(order);
    }

    const orderUserId = order.user?._id?.toString();
    if (orderUserId && orderUserId === req.user._id.toString()) {
        return res.json(order);
    }

    res.status(403);
    throw new Error('Not authorized to view this order');
}));

router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    order.paymentStatus = 'Paid';
    order.paidAt = Date.now();
    order.paymentDetails = req.body.paymentDetails || {};

    order.statusHistory.push({
        status: 'Paid',
        timestamp: new Date(),
        note: 'Payment received',
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);
}));

router.put('/:id/cancel', protect, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to cancel this order');
    }

    const nonCancellable = ['Shipped', 'Delivered', 'Cancelled'];
    if (nonCancellable.includes(order.orderStatus)) {
        res.status(400);
        throw new Error(`Order cannot be cancelled — it is already ${order.orderStatus}`);
    }

    const ONE_HOUR_MS = 60 * 60 * 1000;
    const elapsed = Date.now() - new Date(order.createdAt).getTime();
    if (elapsed > ONE_HOUR_MS) {
        res.status(400);
        throw new Error('Cancellation window has expired. Orders can only be cancelled within 1 hour of placing.');
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
        status: 'Cancelled',
        timestamp: new Date(),
        note: req.body?.reason || 'Cancelled by customer',
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);
}));

router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;

    const filter = {};

    if (req.query.status) {
        filter.orderStatus = req.query.status;
    }

    if (req.query.paymentStatus) {
        filter.paymentStatus = req.query.paymentStatus;
    }

    const count = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        orders,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
    });
}));

router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
    const { status, note } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.orderStatus = status;

    order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Order status updated to ${status}`,
    });

    if (status === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save({ validateBeforeSave: false });

    // Only send email if user still exists in the database
    if (order.user && order.user.email) {
        const message = `
            <h1>Order Status Update</h1>
            <p>Dear ${order.user.name},</p>
            <p>Your order <strong>${order.orderNumber}</strong> status has been updated.</p>
            <p><strong>New Status:</strong> ${status}</p>
            ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
            <br/>
            <p>Best regards,</p>
            <p>Avaya Jewellery Team</p>
        `;

        try {
            await sendEmail({
                email: order.user.email,
                subject: `Order Update - ${order.orderNumber}`,
                message,
            });
        } catch (error) {
            console.error('Failed to send order status email:', error);
        }
    }

    res.json(updatedOrder);
}));

router.put('/:id/payment', protect, admin, asyncHandler(async (req, res) => {
    const { paymentStatus } = req.body;

    const validStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];
    if (!validStatuses.includes(paymentStatus)) {
        res.status(400);
        throw new Error('Invalid payment status');
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.paymentStatus = paymentStatus;

    if (paymentStatus === 'Paid' && !order.paidAt) {
        order.paidAt = Date.now();
    }

    order.statusHistory.push({
        status: `Payment ${paymentStatus}`,
        timestamp: new Date(),
        note: `Payment status updated to ${paymentStatus} by admin`,
    });

    // Auto-confirm order when payment is marked as Paid
    const nonAutoConfirmStatuses = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (paymentStatus === 'Paid' && !nonAutoConfirmStatuses.includes(order.orderStatus)) {
        order.orderStatus = 'Confirmed';
        order.statusHistory.push({
            status: 'Confirmed',
            timestamp: new Date(),
            note: 'Order automatically confirmed upon payment',
        });
    }

    const updatedOrder = await order.save({ validateBeforeSave: false });
    res.json(updatedOrder);
}));

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order removed' });
}));

export default router;
