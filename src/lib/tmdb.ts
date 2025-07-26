import axios from 'axios';
import { env } from '@/env';

// Generic axios instance for TMDB API with Bearer Token Authentication
export const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Authorization': `Bearer ${env.TMDB_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Optional: Add request/response interceptors for logging or error handling
tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('TMDB API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
); 