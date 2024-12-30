// linking/authLink.js

import { getAuthToken, handleResponse } from './apiUtils.js';

/**
 * Register a new user.
 * @param {Object} userData - { userName, email, password, role? }
 */
export async function registerUser(userData) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
}

/**
 * Log in an existing user.
 * @param {Object} credentials - { email, password }
 */
export async function loginUser(credentials) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
}

/**
 * Fetch user details by ID (Requires JWT).
 * @param {string|number} userId
 */
export async function getUserById(userId) {
  const token = getAuthToken();
  const response = await fetch(`/api/auth/users/${userId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}
