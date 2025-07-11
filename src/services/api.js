// src/services/api.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL,
});

// Otomatik Token Ekleme
API.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const method = config.method || '';

    const isAdminRequest =
      url.includes('/coupons/create') ||
      (url.includes('/coupons/') && method === 'delete') ||
      url.includes('/categories');

    const isSellerRequest =
      url.includes('/coupons/use-coupon') ||
      url.includes('/coupons/used-by-seller') ||
      url.includes('/auth/seller');

    const token = isSellerRequest
      ? localStorage.getItem('sellerToken')
      : isAdminRequest
      ? localStorage.getItem('adminToken')
      : localStorage.getItem('customerToken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;