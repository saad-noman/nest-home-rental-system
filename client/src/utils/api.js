import fetchApi from './apiConfig';

// Top-rated properties
export const getTopRatedProperties = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  return fetchApi(`/properties/top-rated?${searchParams}`);
};

// Auth API functions
export const login = async (email, password) => {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const createMonthlyPayment = async ({ bookingId, month, year, monthName, amount, totalExpected, paymentMethod = 'credit_card' }) => {
  return fetchApi('/transactions/monthly-pay', {
    method: 'POST',
    body: JSON.stringify({ bookingId, month, year, monthName, amount, totalExpected, paymentMethod })
  });
};

export const deleteTransaction = async (id) => {
  return fetchApi(`/transactions/${id}`, {
    method: 'DELETE',
  });
};

export const getTransactionsByProperty = async (propertyId) => {
  return fetchApi(`/transactions/property/${propertyId}`);
};

export const register = async (userData) => {
  return fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const logout = async () => {
  return fetchApi('/auth/logout', {
    method: 'POST',
  });
};

export const getCurrentUser = async () => {
  return fetchApi('/auth/me');
};

export const updateProfile = async (profileData) => {
  return fetchApi('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

// Property API functions
export const getProperties = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return fetchApi(`/properties?${searchParams}`);
};

export const searchProperties = async (params = {}) => {
  return getProperties(params);
};

export const getProperty = async (id) => {
  return fetchApi(`/properties/${id}`);
};

export const createProperty = async (propertyData) => {
  return fetchApi('/properties', {
    method: 'POST',
    body: JSON.stringify(propertyData),
  });
};

export const updateProperty = async (id, propertyData) => {
  return fetchApi(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(propertyData),
  });
};

export const deleteProperty = async (id) => {
  return fetchApi(`/properties/${id}`, {
    method: 'DELETE',
  });
};

export const getPropertiesByOwner = async (ownerId, params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return fetchApi(`/properties/owner/${ownerId}?${searchParams}`);
};

// Booking API functions
export const createBooking = async (bookingData) => {
  return fetchApi('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
};

export const getMyBookings = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return fetchApi(`/bookings/my?${searchParams}`);
};

export const updateBookingStatus = async (id, status, rejectionReason = '') => {
  return fetchApi(`/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, rejectionReason }),
  });
};

export const cancelBooking = async (id) => {
  return fetchApi(`/bookings/${id}/cancel`, {
    method: 'PUT',
  });
};

// Review API functions
export const createReview = async (reviewData) => {
  return fetchApi('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
};

export const getPropertyReviews = async (propertyId, params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return fetchApi(`/reviews/property/${propertyId}?${searchParams}`);
};

export const getMyReviews = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return fetchApi(`/reviews/my?${searchParams}`);
};

// User API functions
export const getUser = async (id) => {
  return fetchApi(`/users/${id}`);
};

// Favourites API (tenant)
export const getMyFavourites = async () => {
  return fetchApi('/users/me/favourites');
};

export const addFavourite = async ({ itemId, itemType }) => {
  return fetchApi('/users/me/favourites', {
    method: 'POST',
    body: JSON.stringify({ itemId, itemType }),
  });
};

export const removeFavourite = async ({ itemType, itemId }) => {
  return fetchApi(`/users/me/favourites/${itemType}/${itemId}`, {
    method: 'DELETE',
  });
};

export const getUsers = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return fetchApi(`/users?${searchParams}`);
};

// Transaction API functions
export const getMyTransactions = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return fetchApi(`/transactions/my?${searchParams}`);
};

export const processPayment = async (transactionId, paymentMethod = 'credit_card', desiredStatus) => {
  return fetchApi(`/transactions/${transactionId}/pay`, {
    method: 'PUT',
    body: JSON.stringify({ paymentMethod, desiredStatus }),
  });
};

// Auth deletion
export const deleteCurrentUser = async () => {
  return fetchApi('/auth/me', {
    method: 'DELETE',
  });
};

// Notification API functions
export const getMyNotifications = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return fetchApi(`/notifications/my?${searchParams}`);
};

export const markNotificationRead = async (id) => {
  return fetchApi(`/notifications/${id}/read`, {
    method: 'PUT',
  });
};

export const markNotificationUnread = async (id) => {
  return fetchApi(`/notifications/${id}/unread`, {
    method: 'PUT',
  });
};

export const markAllNotificationsRead = async () => {
  return fetchApi('/notifications/read-all', {
    method: 'PUT',
  });
};

export const markAllNotificationsUnread = async () => {
  return fetchApi('/notifications/unread-all', {
    method: 'PUT',
  });
};

// Delete booking
export const deleteBooking = async (id) => {
  return fetchApi(`/bookings/${id}`, {
    method: 'DELETE',
  });
};

// Delete rating
export const deleteRating = async (id) => {
  return fetchApi(`/ratings/${id}`, {
    method: 'DELETE',
  });
};

export const deleteNotification = async (id) => {
  return fetchApi(`/notifications/${id}`, {
    method: 'DELETE',
  });
};

// Rating API functions
export const createUserRating = async ({ rateeId, rating, comment = '', context }) => {
  return fetchApi('/ratings', {
    method: 'POST',
    body: JSON.stringify({ rateeId, rating, comment, context }),
  });
};

export const getUserRatingSummary = async (userId) => {
  return fetchApi(`/ratings/${userId}/summary`);
};

export const listUserRatings = async (userId, params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return fetchApi(`/ratings/${userId}?${searchParams}`);
};

// Eligibility helpers
export const canRateUser = async (rateeId, context) => {
  const searchParams = new URLSearchParams();
  if (rateeId) searchParams.append('rateeId', rateeId);
  if (context) searchParams.append('context', context);
  return fetchApi(`/ratings/can-rate/check?${searchParams}`);
};

export const canReviewProperty = async (propertyId) => {
  const searchParams = new URLSearchParams();
  if (propertyId) searchParams.append('propertyId', propertyId);
  return fetchApi(`/reviews/can-review/check?${searchParams}`);
};

export const canViewTenantContact = async (userId) => {
  return fetchApi(`/users/${userId}/can-view-contact`);
};

// Leave Request API functions
export const createLeaveRequest = async ({ bookingId, message }) => {
  return fetchApi('/leave-requests', {
    method: 'POST',
    body: JSON.stringify({ bookingId, message }),
  });
};

export const listMyLeaveRequests = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return fetchApi(`/leave-requests/my?${searchParams}`);
};

export const decideLeaveRequest = async (id, { decision, condition, note }) => {
  return fetchApi(`/leave-requests/${id}/decision`, {
    method: 'PUT',
    body: JSON.stringify({ decision, condition, note }),
  });
};