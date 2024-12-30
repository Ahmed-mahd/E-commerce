const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authmiddleware'); // Ensure correct path

const router = express.Router();

// Use authMiddleware for routes that need authentication
router.post('/add', authMiddleware, reviewController.addReview);
router.put('/:reviewID', authMiddleware, reviewController.updateReview);
router.delete('/:reviewID', authMiddleware, reviewController.deleteReview);
router.get('/:scarfId', authMiddleware, reviewController.getReviewsByScarfId);

module.exports = router;
