import { create } from 'zustand';
import { login as apiLogin, register as apiRegister } from '../utils/api';

const useAuthStore = create((set, get) => ({
  // =============================================================================
  // STATE
  // =============================================================================
  token: localStorage.getItem('token') || null,
  user: (() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  })(),
  loading: false,
  error: null,
  
  // =============================================================================
  // ACTIONS
  // =============================================================================
  
  /**
   * Login user with email and password
   */
  login: async (email, password) => {
    console.log('🔐 AuthStore: Starting login process');
    set({ loading: true, error: null });
    
    try {
      // Clear any existing auth data first
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const result = await apiLogin(email, password);
      console.log('✅ AuthStore: Login API result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      const { token, user } = result.data;
      
      if (!token || !user) {
        throw new Error('Invalid response: missing token or user data');
      }
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      set({ 
        token, 
        user, 
        loading: false, 
        error: null 
      });
      
      console.log('✅ AuthStore: Login successful');
      return true;
      
    } catch (error) {
      console.error('❌ AuthStore: Login failed:', error);
      
      let errorMessage = 'Login failed';
      if (error.code === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.error) {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        loading: false, 
        error: errorMessage,
        token: null,
        user: null
      });
      
      return false;
    }
  },
  
  /**
   * Register new user
   */
  register: async (email, password, name = '') => {
    console.log('📝 AuthStore: Starting registration process');
    set({ loading: true, error: null });
    
    try {
      // Clear any existing auth data first
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const result = await apiRegister(email, password, name);
      console.log('✅ AuthStore: Registration API result:', result);
      console.log('🔍 AuthStore: Result type:', typeof result);
      console.log('🔍 AuthStore: Result properties:', Object.keys(result || {}));
      
      if (!result) {
        throw new Error('No response received from server');
      }
      
      if (!result.success) {
        console.error('❌ AuthStore: API returned success=false');
        throw new Error(result.error || 'Registration failed');
      }
      
      const { token, user } = result.data;
      
      if (!token || !user) {
        throw new Error('Invalid response: missing token or user data');
      }
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      set({ 
        token, 
        user, 
        loading: false, 
        error: null 
      });
      
      console.log('✅ AuthStore: Registration successful');
      return true;
      
    } catch (error) {
      console.error('❌ AuthStore: Registration failed:', error);
      
      let errorMessage = 'Registration failed';
      if (error.code === 409) {
        errorMessage = 'Email already registered. Please use a different email or try logging in.';
      } else if (error.code === 400) {
        errorMessage = 'Please check your input and try again';
      } else if (error.error) {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        loading: false, 
        error: errorMessage,
        token: null,
        user: null
      });
      
      return false;
    }
  },
  
  /**
   * Logout user
   */
  logout: () => {
    console.log('🚪 AuthStore: Logging out user');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear state
    set({ 
      token: null, 
      user: null, 
      error: null 
    });
  },
  
  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const state = get();
    const hasToken = !!state.token;
    const hasStoredToken = !!localStorage.getItem('token');
    
    console.log('🔍 AuthStore: Authentication check:', {
      hasToken,
      hasStoredToken,
      authenticated: hasToken && hasStoredToken
    });
    
    return hasToken && hasStoredToken;
  },
  
  /**
   * Initialize auth state from localStorage
   */
  initialize: () => {
    console.log('🚀 AuthStore: Initializing from localStorage');
    
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        set({ token, user });
        console.log('✅ AuthStore: Initialized with existing auth data');
      } else {
        console.log('ℹ️ AuthStore: No existing auth data found');
      }
    } catch (error) {
      console.error('❌ AuthStore: Error initializing from localStorage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ token: null, user: null });
    }
  }
}));

export default useAuthStore; 