const Owner = require('../models/owner');
const Subscription = require('../models/subscription');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

const authController = {
    register: async (req, res) => {
        const { name, email, phone, password } = req.body;
        try {
            const existingOwner = await Owner.findByEmail(email);
            if (existingOwner) {
                return res.status(400).json({ message: 'Owner already exists' });
            }

            const passwordHash = await hashPassword(password);
            const owner = await Owner.create(name, email, phone, passwordHash);

            // Automatically assign 60-day trial
            const subscription = await Subscription.createTrial(owner.id);

            const token = generateToken(owner.id);
            res.status(201).json({
                message: 'Owner registered successfully. 60-day trial started.',
                token,
                owner,
                subscription
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error during registration' });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const owner = await Owner.findByEmail(email);
            if (!owner) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await comparePassword(password, owner.password_hash);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = generateToken(owner.id);
            const subscription = await Subscription.findByOwnerId(owner.id);

            res.status(200).json({
                token,
                owner: {
                    id: owner.id,
                    name: owner.name,
                    email: owner.email,
                    phone: owner.phone
                },
                subscription
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error during login' });
        }
    },

    getProfile: async (req, res) => {
        try {
            const subscription = await Subscription.findByOwnerId(req.owner.id);
            res.status(200).json({
                owner: req.owner,
                subscription
            });
        } catch (err) {
            res.status(500).json({ message: 'Server error fetching profile' });
        }
    }
};

module.exports = authController;
