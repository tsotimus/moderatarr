import axios from 'axios';
import { env } from '@/env';
import { z } from 'zod';

// Generic axios instance for Overseerr API with API Key Authentication
export const overseerrApi = axios.create({
  baseURL: env.OVERSEERR_BASE_URL + "/api/v1",
  headers: {
    'X-Api-Key': env.OVERSEERR_API_TOKEN,
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Optional: Add request/response interceptors for logging or error handling
overseerrApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Overseerr API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


