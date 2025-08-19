// Configuration for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api';
const API_TIMEOUT = 10000; // 10 seconds

// Default headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Helper function to make API requests with timeout and better error handling
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - The response data
 */
const fetchApi = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  const url = `${API_BASE_URL}${API_PREFIX}${endpoint}`;
  const method = options.method || 'GET';
  
  // Log request
  console.log(`[API] ${method} ${url}`, {
    body: options.body,
    headers: options.headers,
  });

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: 'include',
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    // Log response
    console.log(`[API] ${method} ${url} -> ${response.status}`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    // Handle error responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('[API] Error response:', errorData);
      } catch (e) {
        errorData = { message: `${response.status} ${response.statusText}` };
      }
      
      const error = new Error(errorData.message || 'API request failed');
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    // Parse and return JSON response
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      console.error('[API] Failed to parse JSON response:', e);
      throw new Error('Failed to parse server response');
    }
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error(`[API] Request timed out after ${API_TIMEOUT}ms: ${method} ${url}`);
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    
    console.error(`[API] Request failed: ${method} ${url}`, error);
    
    // Handle network errors
    if (!navigator.onLine) {
      throw new Error('You are offline. Please check your internet connection.');
    }
    
    // Re-throw with a more user-friendly message
    if (error.message) {
      throw error;
    } else {
      throw new Error('Network request failed. Please try again later.');
    }
  }
};

export default fetchApi;
