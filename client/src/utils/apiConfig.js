// Configuration for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api';

// Default headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Helper function to make API requests
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - The response data
 */
const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${API_PREFIX}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `${response.status} ${response.statusText}`,
    }));
    throw new Error(error.message || `${response.status} ${response.statusText}`);
  }

  // For 204 No Content responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export default fetchApi;
