const mongoose = require('mongoose');
const User = mongoose.model('User');

const SingleOrderItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
},
});

const OrderSchema = mongoose.Schema(
{
    tax: {
        type: Number,
        required: true,
    },
    shippingFee: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
        type: String,
        enum: ['Paid', 'Delivered', 'Cancelled'],
        default: 'Paid',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    clientSecret: {
        type: String,
        // required: true,
    },
    paymentIntentId: {
        type: String,
    },
    address: {
        type: String
    }
}, { timestamps: true });
OrderSchema.pre('save', async function (next) {
    try {
        // Populate the 'user' field with the referenced user document
        const user = await User.findById(this.user).select('address');

        if (user) {
            this.address = user.address;
        } else {
            throw new Error('User not found');
        }
    } catch (err) {
        return next(err);
    }
    
    next();
});

module.exports = mongoose.model('Order', OrderSchema);