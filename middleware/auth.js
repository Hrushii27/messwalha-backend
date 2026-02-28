const { verifyToken } = require('../utils/jwt');
const Owner = require('../models/owner');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        const owner = await Owner.findById(decoded.id);
        if (!owner) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.owner = owner;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
