// linking/cartLink.js

import { getAuthToken, handleResponse } from './apiUtils.js';

/**
 * Create a new cart for a user. (Usually done at registration)
 * @param {number} userId
 */
export async function createCart(userId) {
  const token = getAuthToken();
  const response = await fetch(`/api/cart/cart`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userId) // or { userId } if needed by your backend
  });
  return handleResponse(response);
}

/**
 * Get cart details by user ID.
 * @param {number} userId
 */
export async function getCartByUserId(userId) {
  const token = getAuthToken();
  const response = await fetch(`/api/cart/${userId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

/**
 * Update an existing cart.
 */
export async function updateCart(userId, updateData) {
  const token = getAuthToken();
  const response = await fetch(`/api/cart/${userId}`, {
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
 * Delete a user's cart entirely.
 */
export async function deleteCart(userId) {
  const token = getAuthToken();
  const response = await fetch(`/api/cart/${userId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

/**
 * Add an item to the cart.
 */
export async function addItemToCart(userId, itemData) {
  const token = getAuthToken();
  const response = await fetch(`/api/cart/add-item/${userId}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(itemData)
  });
  return handleResponse(response);
}

/**
 * Get items for a specific user.
 */
export async function getUserSpecificItems(userId) {
  const token = getAuthToken();
  const response = await fetch(`/api/cart/items/${userId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

/**
 * Update a single cart item.
 */
export async function updateCartItem(userId, quantityData) {
  const token = getAuthToken();
  const response = await fetch(`/api/cart/update-item/${userId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(quantityData)
  });
  return handleResponse(response);
}

/**
 * Delete a specific item from the cart.
 */
export async function deleteCartItem(cartId, cartItemID) {
  const token = getAuthToken();
  const response = await fetch(`/api/cart/delete-item/${cartId}/${cartItemID}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

/**
 * Clear all items from a user's cart.
 */
export async function clearUserCart(userId) {
  const token = getAuthToken();
  const response = await fetch(`/api/cart/clear-cart/${userId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}
