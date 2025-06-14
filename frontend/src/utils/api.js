import axios from 'axios';

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost/api';

console.log('=== API Configuration ===');
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout - increased for debugging
  headers: {
    'Content-Type': 'application/json'
  },
  // Ensure JSON parsing
  responseType: 'json'
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    // Auth endpoints that don't need token
    const authEndpoints = ['/user/signup', '/user/login', '/user/forgot-password', '/user/reset-password'];
    const isAuthEndpoint = authEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    // Add authorization header for protected endpoints
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('🔐 Added auth token to request');
      }
    } else {
      console.log('🔓 Auth endpoint - no token needed');
    }
    
    // Log request data for debugging
    if (config.data && !(config.data instanceof FormData)) {
      console.log('📤 Request data:', config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('📥 Raw response data:', response.data);
    console.log('📥 Response headers:', response.headers);
    console.log('📥 Response type:', typeof response.data);
    console.log('📥 Response content-type:', response.headers['content-type']);
    
    // Validate response data
    if (!response.data) {
      console.warn('⚠️ Response has no data');
    }
    
    // Validate response is JSON
    const contentType = response.headers['content-type'];
    if (contentType && !contentType.includes('application/json')) {
      console.warn('⚠️ Response is not JSON:', contentType);
    }
    
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    console.error('❌ Full error object:', error);
    
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response headers:', error.response.headers);
      console.error('Error response status:', error.response.status);
      
      // Handle 401 - Unauthorized
      if (error.response.status === 401) {
        console.log('🚪 Unauthorized - clearing auth and redirecting');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Don't redirect if we're already on auth pages
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('🌐 Network error - no response received:', error.request);
      console.error('🌐 Request status:', error.request.status);
      console.error('🌐 Request ready state:', error.request.readyState);
    } else {
      console.error('⚙️ Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API responses consistently
const handleResponse = (response) => {
  const data = response.data;
  
  console.log('🔍 Parsing API response:', data);
  
  // Handle new standardized response format
  if (data && typeof data === 'object' && data.success !== undefined) {
    console.log('📋 Using standardized response format');
    if (data.success) {
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } else {
      throw new Error(data.error || 'API request failed');
    }
  }
  
  // Handle legacy response format (direct data)
  console.log('📋 Using legacy response format');
  return {
    success: true,
    data: data,
    message: 'Success'
  };
};

// Helper function to handle API errors consistently
const handleError = (error) => {
  let errorMessage = 'An unexpected error occurred';
  let errorCode = null;
  
  console.error('🔍 Error analysis:', {
    hasResponse: !!error.response,
    hasRequest: !!error.request,
    message: error.message,
    code: error.code,
    status: error.response?.status
  });
  
  if (error.response) {
    // Server responded with error status
    errorCode = error.response.status;
    const errorData = error.response.data;
    
    console.log('📥 Error response data:', errorData);
    
    if (errorData && errorData.error) {
      errorMessage = errorData.error;
    } else if (errorData && errorData.message) {
      errorMessage = errorData.message;
    } else if (typeof errorData === 'string') {
      errorMessage = errorData;
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error('🌐 Request made but no response:', error.request);
    console.error('🌐 Request status:', error.request.status);
    console.error('🌐 Request response text:', error.request.responseText);
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // This might be a parsing error or CORS issue
      errorMessage = 'Response received but could not be processed. Please try again.';
    }
  } else if (error.message) {
    // Error in setting up request
    errorMessage = error.message;
  }
  
  return {
    success: false,
    error: errorMessage,
    code: errorCode
  };
};

// =============================================================================
// AUTH API FUNCTIONS
// =============================================================================

export const login = async (email, password) => {
  try {
    console.log('🔐 Attempting login...');
    const response = await api.post('/user/login', { email, password });
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const register = async (email, password, name = '') => {
  try {
    console.log('📝 API: Attempting registration...');
    console.log('📝 API: Registration data:', { email, name: name || '', hasPassword: !!password });
    
    const response = await api.post('/user/signup', { 
      email, 
      password, 
      name: name || '' 
    });
    
    console.log('✅ API: Registration response received');
    console.log('✅ API: Response status:', response.status);
    console.log('✅ API: Response data:', response.data);
    
    const result = handleResponse(response);
    console.log('✅ API: Processed result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ API: Registration error occurred:', error);
    console.error('❌ API: Error type:', error.constructor.name);
    console.error('❌ API: Error message:', error.message);
    
    const handledError = handleError(error);
    console.error('❌ API: Handled error:', handledError);
    
    throw handledError;
  }
};

export const forgotPassword = async (email) => {
  try {
    console.log('🔄 Requesting password reset...');
    const response = await api.post('/user/forgot-password', { email });
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const resetPassword = async (token, password) => {
  try {
    console.log('🔑 Resetting password...');
    const response = await api.post('/user/reset-password', { token, password });
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

// =============================================================================
// PROFILE API FUNCTIONS
// =============================================================================

export const getProfile = async () => {
  try {
    console.log('👤 Fetching user profile...');
    const response = await api.get('/user/profile');
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const updateProfile = async (profileData) => {
  try {
    console.log('💾 Updating user profile...');
    
    // Handle FormData vs JSON
    const isFormData = profileData instanceof FormData;
    const config = isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    
    const response = await api.put('/user/profile', profileData, config);
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

// =============================================================================
// PROJECTS API FUNCTIONS
// =============================================================================

export const getProjects = async () => {
  try {
    console.log('📁 Fetching user projects...');
    const response = await api.get('/user/projects');
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const addProject = async (projectData) => {
  try {
    console.log('➕ Adding new project...');
    
    const isFormData = projectData instanceof FormData;
    const config = isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    
    const response = await api.post('/user/projects', projectData, config);
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    console.log(`✏️ Updating project ${projectId}...`);
    
    const isFormData = projectData instanceof FormData;
    const config = isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    
    const response = await api.put(`/user/projects/${projectId}`, projectData, config);
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteProject = async (projectId) => {
  try {
    console.log(`🗑️ Deleting project ${projectId}...`);
    const response = await api.delete(`/user/projects/${projectId}`);
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

// =============================================================================
// PORTFOLIO API FUNCTIONS
// =============================================================================

export const getPortfolio = async (userId) => {
  try {
    console.log(`🎨 Fetching portfolio for user ${userId}...`);
    const response = await api.get(`/portfolio/${userId}`);
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const sendContactMessage = async (userId, messageData) => {
  try {
    console.log(`📧 Sending contact message to user ${userId}...`);
    const response = await api.post('/contact', { 
      user_id: userId, 
      ...messageData 
    });
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export default api; 