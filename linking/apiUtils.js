// linking/apiUtils.js

/**
 * Retrieve the JWT token from localStorage.
 */
export function getAuthToken() {
    return localStorage.getItem('authToken') || null;
}

/**
 * Handle the fetch API response.
 * Throws an error if response not OK.
 */
export async function handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }
    return data;
}
