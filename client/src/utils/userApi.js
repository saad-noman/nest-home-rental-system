import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
);

// User API functions
export const getUsers = async (params = {}) => {
  return api.get('/users', { params });
};

export const getUser = async (id) => {
  return api.get(`/users/${id}`);
};

export const searchUsers = async (query) => {
  return api.get('/users/search', { params: { q: query } });
};

export const updateUserStatus = async (id, isActive) => {
  return api.put(`/users/${id}/status`, { isActive });
};