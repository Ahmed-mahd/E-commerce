const Review = require('../models/reviewModel');

exports.addReview = async (req, res) => {
    const { scarfId, rating, comment } = req.body;
    const userId = req.user.id; // Get userId from the decoded JWT

    if (!scarfId || !rating || !comment) {
        return res.status(400).json({ error: 'Scarf ID, rating, and comment are required.' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    try {
        const reviewId = await Review.addReview(scarfId, userId, rating, comment);
        res.status(201).json({ message: 'Review added successfully.', reviewId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add review.', details: err.message });
    }
};

exports.getReviewsByScarfId = async (req, res) => {
    const { scarfId } = req.params; // Extract scarfId from the request parameters

    // Check if scarfId is provided
    if (!scarfId) {
        return res.status(400).json({ error: 'Scarf ID is required.' });
    }

    try {
        console.log('Scarf ID:', scarfId);  // Debug log
        const reviews = await Review.getReviewsByScarfId(scarfId);
        
        if (reviews.length === 0) {
            return res.status(404).json({ error: 'No reviews found for this scarf.' });
        }

        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews.', details: err.message });
    }
};

exports.updateReview = async (req, res) => {
    const { reviewID } = req.params;
    const { rating, comment } = req.body;
    const userID = req.user.id; // Get the user ID from the decoded JWT

    try {
        const affectedRows = await Review.updateReview(reviewID, userID, rating, comment);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Review not found or you do not have permission to update this review.' });
        }

        res.status(200).json({ message: 'Review updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update review.', details: err.message });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    const { reviewID } = req.params;
    const userID = req.user.id; // Get the user ID from the decoded JWT

    try {
        const affectedRows = await Review.deleteReview(reviewID, userID);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Review not found or you do not have permission to delete this review.' });
        }

        res.status(200).json({ message: 'Review deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete review.', details: err.message });
    }
};