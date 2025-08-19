import fetchApi from './apiConfig';

/**
 * Creates URLSearchParams from an object, filtering out undefined and empty values
 */
const createSearchParams = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      searchParams.append(key, value);
    }
  });
  return searchParams;
};

/**
 * Handles API response and extracts data or throws an error
 */
const handleResponse = async (response) => {
  if (!response) {
    throw new Error('No response from server');
  }
  return response;
};

// Top-rated properties
export const getTopRatedProperties = async (params = {}) => {
  const searchParams = createSearchParams(params);
  const response = await fetchApi(`/properties/top-rated?${searchParams}`);
  return handleResponse(response);
};

// Auth API functions
export const login = async (email, password) => {
  const response = await fetchApi('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const createMonthlyPayment = async ({ bookingId, month, year, monthName, amount, totalExpected, paymentMethod = 'credit_card' }) => {
  const response = await fetchApi('/transactions/monthly-pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookingId, month, year, monthName, amount, totalExpected, paymentMethod })
  });
  return handleResponse(response);
};

export const deleteTransaction = async (id) => {
  const response = await fetchApi(`/transactions/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const getTransactionsByProperty = async (propertyId) => {
  const response = await fetchApi(`/transactions/property/${propertyId}`);
  return handleResponse(response);
};

export const register = async (userData) => {
  const response = await fetchApi('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const logout = async () => {
  const response = await fetchApi('/auth/logout', {
    method: 'POST',
  });
  return handleResponse(response);
};

export const getCurrentUser = async () => {
  const response = await fetchApi('/auth/me');
  return handleResponse(response);
};

export const updateProfile = async (profileData) => {
  const response = await fetchApi('/auth/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
};

// Property API functions
export const getProperties = async (params = {}) => {
  const searchParams = createSearchParams(params);
  const response = await fetchApi(`/properties?${searchParams}`);
  return handleResponse(response);
};

export const searchProperties = async (params = {}) => {
  return getProperties(params);
};

export const getProperty = async (id) => {
  const response = await fetchApi(`/properties/${id}`);
  return handleResponse(response);
};

export const createProperty = async (propertyData) => {
  const response = await fetchApi('/properties', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(propertyData),
  });
  return handleResponse(response);
};

export const updateProperty = async (id, propertyData) => {
  const response = await fetchApi(`/properties/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(propertyData),
  });
  return handleResponse(response);
};

export const deleteProperty = async (id) => {
  const response = await fetchApi(`/properties/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const getPropertiesByOwner = async (ownerId, params = {}) => {
  const searchParams = createSearchParams(params);
  const response = await fetchApi(`/properties/owner/${ownerId}?${searchParams}`);
  return handleResponse(response);
};

// Booking API functions
export const createBooking = async (bookingData) => {
  const response = await fetchApi('/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });
  return handleResponse(response);
};

export const getMyBookings = async (params = {}) => {
  const searchParams = createSearchParams(params);
  const response = await fetchApi(`/bookings/me?${searchParams}`);
  return handleResponse(response);
};

export const updateBookingStatus = async (id, status, rejectionReason = '') => {
  const response = await fetchApi(`/bookings/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, rejectionReason }),
  });
  return handleResponse(response);
};

export const cancelBooking = async (id) => {
  const response = await fetchApi(`/bookings/${id}/cancel`, {
    method: 'POST',
  });
  return handleResponse(response);
};

// Review API functions
export const createReview = async (reviewData) => {
  const response = await fetchApi('/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  return handleResponse(response);
};

export const getPropertyReviews = async (propertyId, params = {}) => {
  const searchParams = createSearchParams(params);
  const response = await fetchApi(`/reviews/property/${propertyId}?${searchParams}`);
  return handleResponse(response);
};

export const getMyReviews = async (params = {}) => {
  const searchParams = createSearchParams(params);
  const response = await fetchApi(`/reviews/me?${searchParams}`);
  return handleResponse(response);
};

// User API functions
export const getUser = async (id) => {
  const response = await fetchApi(`/users/${id}`);
  return handleResponse(response);
};

// Favourites API (tenant)
export const getMyFavourites = async () => {
  const response = await fetchApi('/users/me/favourites');
  return handleResponse(response);
};

export const addFavourite = async ({ itemId, itemType }) => {
  const response = await fetchApi('/users/me/favourites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ itemId, itemType }),
  });
  return handleResponse(response);
};

export const removeFavourite = async ({ itemType, itemId }) => {
  const response = await fetchApi(`/users/me/favourites/${itemType}/${itemId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const getUsers = async (params = {}) => {
  const searchParams = createSearchParams(params);
  const response = await fetchApi(`/users?${searchParams}`);
  return handleResponse(response);
};

// Transaction API functions
export const getMyTransactions = async (params = {}) => {
  const searchParams = createSearchParams(params);
  const response = await fetchApi(`/transactions/my?${searchParams}`);
  return handleResponse(response);
};

export const processPayment = async (transactionId, paymentMethod = 'credit_card', desiredStatus) => {
  const response = await fetchApi(`/transactions/${transactionId}/pay`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentMethod, desiredStatus }),
  });
  return handleResponse(response);
};

// Auth deletion
export const deleteCurrentUser = async () => {
  const response = await fetchApi('/auth/me', {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Notification API functions
export const getMyNotifications = async (params = {}) => {
  const searchParams = createSearchParams(params);
  const response = await fetchApi(`/notifications/my?${searchParams}`);
  return handleResponse(response);
};

export const markNotificationRead = async (id) => {
  const response = await fetchApi(`/notifications/${id}/read`, {
    method: 'PUT',
  });
  return handleResponse(response);
};

export const markNotificationUnread = async (id) => {
  const response = await fetchApi(`/notifications/${id}/unread`, {
    method: 'PUT',
  });
  return handleResponse(response);
};

export const markAllNotificationsRead = async () => {
  const response = await fetchApi('/notifications/read-all', {
    method: 'PUT',
  });
  return handleResponse(response);
};

export const markAllNotificationsUnread = async () => {
  const response = await fetchApi('/notifications/unread-all', {
    method: 'PUT',
  });
  return handleResponse(response);
};

// Delete booking
export const deleteBooking = async (id) => {
  const response = await fetchApi(`/bookings/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Delete rating
export const deleteRating = async (id) => {
  const response = await fetchApi(`/ratings/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const deleteNotification = async (id) => {
  const response = await fetchApi(`/notifications/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Rating API functions
export const createUserRating = async ({ rateeId, rating, comment = '', context }) => {
  const response = await fetchApi('/ratings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rateeId, rating, comment, context }),
  });
  return handleResponse(response);
};

export const getUserRatingSummary = async (userId) => {
  const response = await fetchApi(`/ratings/summary/${userId}`);
  return handleResponse(response);
};

export const listUserRatings = async (userId, params = {}) => {
  const searchParams = createSearchParams(params);
  const response = await fetchApi(`/ratings/user/${userId}?${searchParams}`);
  return handleResponse(response);
};

// Eligibility helpers
export const canRateUser = async (rateeId, context) => {
  const response = await fetchApi(`/ratings/can-rate/${rateeId}?context=${context}`);
  return handleResponse(response);
};

export const canReviewProperty = async (propertyId) => {
  const response = await fetchApi(`/reviews/can-review/${propertyId}`);
  return handleResponse(response);
};

export const canViewTenantContact = async (userId) => {
  const response = await fetchApi(`/users/${userId}/can-view-contact`);
  return handleResponse(response);
};

// Leave Request API functions
export const createLeaveRequest = async ({ bookingId, message }) => {
  const response = await fetchApi('/leave-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookingId, message }),
  });
  return handleResponse(response);
};

export const listMyLeaveRequests = async (params = {}) => {
  const searchParams = createSearchParams(params);
  const response = await fetchApi(`/leave-requests/me?${searchParams}`);
  return handleResponse(response);
};

export const decideLeaveRequest = async (id, { decision, condition, note }) => {
  const response = await fetchApi(`/leave-requests/${id}/decide`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ decision, condition, note }),
  });
  return handleResponse(response);
};