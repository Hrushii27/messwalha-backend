const express = require('express');
const router = express.Router();
const messController = require('../controllers/messController');
const authMiddleware = require('../middleware/auth');

// 🔥 PUBLIC ROUTE (needed for homepage)
router.get('/', messController.getAllMesses);

// Protected routes
router.post('/', authMiddleware, messController.createListing);
router.get('/my-listings', authMiddleware, messController.getMyListings);
router.put('/:id', authMiddleware, messController.updateListing);
router.delete('/:id', authMiddleware, messController.deleteListing);

module.exports = router;
