const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount, currency = 'INR') => {
    const options = {
        amount: amount * 100, // amount in the smallest currency unit
        currency,
        receipt: `receipt_${Date.now()}`,
    };
    return await razorpay.orders.create(options);
};

const verifySignature = (orderId, paymentId, signature) => {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
};

module.exports = { createOrder, verifySignature, razorpay };
