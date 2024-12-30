// linking/orderLink.js

import { getAuthToken, handleResponse } from './apiUtils.js';

/**
 * Create a new order.
 */
export async function createOrder(orderData) {
  const token = getAuthToken();
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return handleResponse(response);
}

/**
 * Get orders by user ID (from token).
 */
export async function getOrdersByUserId(userId) {
  const token = getAuthToken();
  const response = await fetch(`/api/orders/${userId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

/**
 * Get details of a specific order.
 */
export async function getOrderDetails(orderId) {
  const token = getAuthToken();
  const response = await fetch(`/api/orders/details/${orderId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

/**
 * Update order status.
 */
export async function updateOrderStatus(orderId, status) {
  const token = getAuthToken();
  const response = await fetch(`/api/orders/${orderId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  return handleResponse(response);
}

/**
 * Delete an order.
 */
export async function deleteOrder(orderId) {
  const token = getAuthToken();
  const response = await fetch(`/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

/**
 * Add an item to an existing order.
 */
export async function addItemToOrder(orderId, itemData) {
  const token = getAuthToken();
  const response = await fetch(`/api/orders/addItem/${orderId}`, {
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
 * Delete an item from an order (by orderItemID).
 */
export async function deleteOrderItem(orderId, orderItemId) {
  const token = getAuthToken();
  const response = await fetch(`/api/orders/deleteItem/${orderId}/${orderItemId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}
