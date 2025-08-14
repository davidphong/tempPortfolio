// Configuration utilities for the application

/**
 * Get the API base URL for the current environment
 * @returns {string} The API base URL
 */
export const getApiBaseUrl = () => {
  // Check for environment variable first (for build-time configuration)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback to current origin (for runtime configuration)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side rendering fallback
  return '/api';
};

/**
 * Get the full URL for an uploaded file
 * @param {string} filename - The filename of the uploaded file
 * @returns {string} The full URL to the uploaded file
 */
export const getUploadUrl = (filename) => {
  if (!filename) return null;
  
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}/uploads/${filename}`;
};

/**
 * Environment configuration
 */
export const config = {
  apiBaseUrl: getApiBaseUrl(),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

export default config;
