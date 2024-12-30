// linking/reviewLink.js

import { getAuthToken, handleResponse } from './apiUtils.js';

/**
 * Add a new review (Requires JWT).
 * @param {Object} reviewData - { scarfId, rating, comment }
 */
export async function addReview(reviewData) {
  const token = getAuthToken();
  const response = await fetch('/api/reviews/add', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reviewData)
  });
  return handleResponse(response);
}

/**
 * Get reviews by scarf ID (Requires JWT).
 * @param {number} scarfId
 */
export async function getReviewsByScarfId(scarfId) {
  const token = getAuthToken();
  const response = await fetch(`/api/reviews/${scarfId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

/**
 * Update an existing review (Requires JWT).
 * @param {number} reviewID
 * @param {Object} updateData - { rating, comment }
 */
export async function updateReview(reviewID, updateData) {
  const token = getAuthToken();
  const response = await fetch(`/api/reviews/${reviewID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
  return handleResponse(response);
}

/**
 * Delete a review (Requires JWT).
 * @param {number} reviewID
 */
export async function deleteReview(reviewID) {
  const token = getAuthToken();
  const response = await fetch(`/api/reviews/${reviewID}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}
