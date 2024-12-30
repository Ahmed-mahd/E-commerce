// linking/categoryLink.js

import { getAuthToken, handleResponse } from './apiUtils.js';

/**
 * Fetch all categories.
 */
export async function getAllCategories() {
  const token = getAuthToken();
  const response = await fetch(`/api/categories`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}
