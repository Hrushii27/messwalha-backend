const { createOrder, verifySignature } = require('../utils/razorpay');
const Subscription = require('../models/subscription');
const db = require('../config/db');

const paymentController = {
    createOrder: async (req, res) => {
        try {
            const order = await createOrder(599); // Fixed price 599 INR
            res.status(200).json(order);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error creating Razorpay order' });
        }
    },

    verifyPayment: async (req, res) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        try {
            const subscription = await Subscription.findByOwnerId(req.owner.id);
            const nextBillingDate = new Date();
            nextBillingDate.setDate(nextBillingDate.getDate() + 30);

            const updatedSub = await Subscription.updateStatus(
                subscription.id,
                'active',
                'basic_599',
                nextBillingDate
            );

            res.status(200).json({ message: 'Payment verified and subscription activated', subscription: updatedSub });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error updating subscription after payment' });
        }
    },

    handleWebhook: async (req, res) => {
        // In production, verify the webhook signature from Razorpay headers
        // For now, minimal implementation as requested
        const event = req.body.event;
        if (event === 'payment.captured') {
            // Find user by email or custom field and update subscription
        }
        res.json({ status: 'ok' });
    }
};

module.exports = paymentController;
