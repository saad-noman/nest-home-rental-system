import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors consistently
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
);

// Top-rated properties
export const getTopRatedProperties = async (params = {}) => {
  return api.get('/properties/top-rated', { params });
};

// Auth API functions
export const login = async (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const createMonthlyPayment = async ({ bookingId, month, year, monthName, amount, totalExpected, paymentMethod = 'credit_card' }) => {
  return api.post('/transactions/monthly-pay', {
    bookingId, month, year, monthName, amount, totalExpected, paymentMethod
  });
};

export const deleteTransaction = async (id) => {
  return api.delete(`/transactions/${id}`);
};

export const getTransactionsByProperty = async (propertyId) => {
  return api.get(`/transactions/property/${propertyId}`);
};

export const register = async (userData) => {
  return api.post('/auth/register', userData);
};

export const logout = async () => {
  return api.post('/auth/logout');
};

export const getCurrentUser = async () => {
  return api.get('/auth/me');
};

export const updateProfile = async (profileData) => {
  return api.put('/auth/me', profileData);
};

// Property API functions
export const getProperties = async (params = {}) => {
  return api.get('/properties', { params });
};

export const searchProperties = async (params = {}) => {
  return getProperties(params);
};

export const getProperty = async (id) => {
  return api.get(`/properties/${id}`);
};

export const createProperty = async (propertyData) => {
  return api.post('/properties', propertyData);
};

export const updateProperty = async (id, propertyData) => {
  return api.put(`/properties/${id}`, propertyData);
};

export const deleteProperty = async (id) => {
  return api.delete(`/properties/${id}`);
};

export const getPropertiesByOwner = async (ownerId, params = {}) => {
  return api.get(`/properties/owner/${ownerId}`, { params });
};

// Booking API functions
export const createBooking = async (bookingData) => {
  return api.post('/bookings', bookingData);
};

export const getMyBookings = async (params = {}) => {
  return api.get('/bookings/my', { params });
};

export const updateBookingStatus = async (id, status, rejectionReason = '') => {
  return api.put(`/bookings/${id}/status`, { status, rejectionReason });
};

export const cancelBooking = async (id) => {
  return api.put(`/bookings/${id}/cancel`);
};

// Review API functions
export const createReview = async (reviewData) => {
  return api.post('/reviews', reviewData);
};

export const getPropertyReviews = async (propertyId, params = {}) => {
  return api.get(`/reviews/property/${propertyId}`, { params });
};

export const getMyReviews = async (params = {}) => {
  return api.get('/reviews/my', { params });
};

// User API functions
export const getUser = async (id) => {
  return api.get(`/users/${id}`);
};

// Favourites API (tenant)
export const getMyFavourites = async () => {
  return api.get('/users/me/favourites');
};

export const addFavourite = async ({ itemId, itemType }) => {
  return api.post('/users/me/favourites', { itemId, itemType });
};

export const removeFavourite = async ({ itemType, itemId }) => {
  return api.delete(`/users/me/favourites/${itemType}/${itemId}`);
};

export const getUsers = async (params = {}) => {
  return api.get('/users', { params });
};

// Transaction API functions
export const getMyTransactions = async (params = {}) => {
  return api.get('/transactions/my', { params });
};

export const processPayment = async (transactionId, paymentMethod = 'credit_card', desiredStatus) => {
  return api.put(`/transactions/${transactionId}/pay`, { paymentMethod, desiredStatus });
};

// Auth deletion
export const deleteCurrentUser = async () => {
  return api.delete('/auth/me');
};

// Notification API functions
export const getMyNotifications = async (params = {}) => {
  return api.get('/notifications/my', { params });
};

export const markNotificationRead = async (id) => {
  return api.put(`/notifications/${id}/read`);
};

export const markNotificationUnread = async (id) => {
  return api.put(`/notifications/${id}/unread`);
};

export const markAllNotificationsRead = async () => {
  return api.put('/notifications/read-all');
};

export const markAllNotificationsUnread = async () => {
  return api.put('/notifications/unread-all');
};

// Delete booking
export const deleteBooking = async (id) => {
  return api.delete(`/bookings/${id}`);
};

// Delete rating
export const deleteRating = async (id) => {
  return api.delete(`/ratings/${id}`);
};

export const deleteNotification = async (id) => {
  return api.delete(`/notifications/${id}`);
};

// Rating API functions
export const createUserRating = async ({ rateeId, rating, comment = '', context }) => {
  return api.post('/ratings', { rateeId, rating, comment, context });
};

export const getUserRatingSummary = async (userId) => {
  return api.get(`/ratings/${userId}/summary`);
};

export const listUserRatings = async (userId, params = {}) => {
  return api.get(`/ratings/${userId}`, { params });
};

// Eligibility helpers
export const canRateUser = async (rateeId, context) => {
  const params = {};
  if (rateeId) params.rateeId = rateeId;
  if (context) params.context = context;
  return api.get('/ratings/can-rate/check', { params });
};

export const canReviewProperty = async (propertyId) => {
  const params = {};
  if (propertyId) params.propertyId = propertyId;
  return api.get('/reviews/can-review/check', { params });
};

export const canViewTenantContact = async (userId) => {
  return api.get(`/users/${userId}/can-view-contact`);
};

// Leave Request API functions
export const createLeaveRequest = async ({ bookingId, message }) => {
  return api.post('/leave-requests', { bookingId, message });
};

export const listMyLeaveRequests = async (params = {}) => {
  return api.get('/leave-requests/my', { params });
};

export const decideLeaveRequest = async (id, { decision, condition, note }) => {
  return api.put(`/leave-requests/${id}/decision`, { decision, condition, note });
};