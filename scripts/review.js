// scripts/review.js

import { addReview, getReviewsByScarfId, updateReview, deleteReview as deleteReviewAPI } from '../linking/reviewLink.js';

document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authToken = localStorage.getItem('authToken');
    
    const reviewSection = document.getElementById('review-section');
    const reviewForm = document.getElementById('review-form');
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        console.error('No product ID found for reviews.');
        return;
    }
    
    try {
        const reviews = await getReviewsByScarfId(productId);
        renderReviews(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
    
    if (currentUser && !currentUser.isGuest) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const rating = parseInt(document.getElementById('rating').value);
            const comment = document.getElementById('comment').value;
            
            try {
                await addReview({ scarfID: productId, rating, comment });
                alert('Review added successfully!');
                // Re-fetch and render reviews
                const updatedReviews = await getReviewsByScarfId(productId);
                renderReviews(updatedReviews);
                reviewForm.reset();
            } catch (error) {
                console.error('Error adding review:', error);
                alert('Failed to add review.');
            }
        });
    } else {
        // Hide review form if not logged in
        reviewForm.style.display = 'none';
    }
});

// Function to render reviews on the page
function renderReviews(reviews) {
    const reviewSection = document.getElementById('review-section');
    if (reviews.length === 0) {
        reviewSection.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
        return;
    }
    
    reviewSection.innerHTML = reviews.map(review => `
        <div class="review">
            <h4>${review.userName}</h4>
            <p>Rating: ${'⭐'.repeat(review.rating)}</p>
            <p>${review.comment}</p>
            <small>${new Date(review.createdAt).toLocaleString()}</small>
            ${canEditReview(review) ? `
                <button onclick="editReview(${review.reviewID})">Edit</button>
                <button onclick="deleteReviewHandler(${review.reviewID})">Delete</button>
            ` : ''}
        </div>
    `).join('');
}

// Function to determine if the current user can edit/delete a review
function canEditReview(review) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser && currentUser.userID === review.userID;
}

// Function to handle editing a review
async function editReview(reviewID) {
    const newRating = prompt('Enter new rating (1-5):');
    const newComment = prompt('Enter new comment:');
    
    if (!newRating || !newComment) {
        alert('Rating and comment are required.');
        return;
    }
    
    try {
        await updateReview(reviewID, { rating: parseInt(newRating), comment: newComment });
        alert('Review updated successfully!');
        // Re-fetch and render reviews
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const updatedReviews = await getReviewsByScarfId(productId);
        renderReviews(updatedReviews);
    } catch (error) {
        console.error('Error updating review:', error);
        alert('Failed to update review.');
    }
}

// Function to handle deleting a review
async function deleteReviewHandler(reviewID) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
        await deleteReviewAPI(reviewID);
        alert('Review deleted successfully!');
        // Re-fetch and render reviews
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const updatedReviews = await getReviewsByScarfId(productId);
        renderReviews(updatedReviews);
    } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review.');
    }
}

// Expose functions globally
window.editReview = editReview;
window.deleteReviewHandler = deleteReviewHandler;
