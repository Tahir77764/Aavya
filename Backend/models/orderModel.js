import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: String,
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            default: 'India',
        },
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['COD', 'Online', 'UPI'],
        default: 'COD',
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending',
    },
    paymentDetails: {
        type: Object,
        default: {},
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    statusHistory: [{
        status: String,
        timestamp: {
            type: Date,
            default: Date.now,
        },
        note: String,
    }],
    paidAt: Date,
    deliveredAt: Date,
}, {
    timestamps: true,
});

orderSchema.pre('save', async function () {
    if (!this.orderNumber) {
        try {
            const year = new Date().getFullYear();
            const count = await mongoose.model('Order').countDocuments();
            this.orderNumber = `ORD-${year}-${String(count + 1).padStart(5, '0')}`;
        } catch (err) {
            throw err;
        }
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
