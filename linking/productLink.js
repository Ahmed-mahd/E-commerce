// linking/productLink.js

import { getAuthToken, handleResponse } from './apiUtils.js';

/**
 * Fetch featured products.
 */
export async function getFeaturedProducts() {
  const response = await fetch('/api/products/featured');
  return handleResponse(response);
}

/**
 * Fetch products by category.
 * @param {number} categoryId
 */
export async function getProductsByCategory(categoryId) {
  const response = await fetch(`/api/products/category/${categoryId}`);
  return handleResponse(response);
}

/**
 * Fetch product details by product ID.
 * @param {number} productId
 */
export async function getProductDetails(productId) {
  const response = await fetch(`/api/products/${productId}`);
  return handleResponse(response);
}
