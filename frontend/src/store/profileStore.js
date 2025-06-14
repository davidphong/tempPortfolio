import { create } from 'zustand';
import { getProfile, updateProfile } from '../utils/api';

const useProfileStore = create((set, get) => ({
  // =============================================================================
  // STATE
  // =============================================================================
  profile: null,
  loading: false,
  error: null,
  
  // =============================================================================
  // ACTIONS
  // =============================================================================
  
  /**
   * Fetch user profile
   */
  fetchProfile: async () => {
    console.log('👤 ProfileStore: Fetching user profile');
    set({ loading: true, error: null });
    
    try {
      const result = await getProfile();
      console.log('✅ ProfileStore: Profile fetch result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch profile');
      }
      
      // Handle both new format (result.data) and legacy format (direct data)
      const profileData = result.data || result;
      
      set({ 
        profile: profileData, 
        loading: false, 
        error: null 
      });
      
      console.log('✅ ProfileStore: Profile loaded successfully');
      return true;
      
    } catch (error) {
      console.error('❌ ProfileStore: Profile fetch failed:', error);
      
      let errorMessage = 'Failed to load profile';
      if (error.code === 401) {
        errorMessage = 'Please log in to view your profile';
      } else if (error.error) {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        loading: false, 
        error: errorMessage,
        profile: null
      });
      
      return false;
    }
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    console.log('💾 ProfileStore: Updating user profile');
    set({ loading: true, error: null });
    
    try {
      const result = await updateProfile(profileData);
      console.log('✅ ProfileStore: Profile update result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }
      
      // Handle both new format (result.data) and legacy format (direct data)
      const updatedProfile = result.data || result;
      
      set({ 
        profile: updatedProfile, 
        loading: false, 
        error: null 
      });
      
      console.log('✅ ProfileStore: Profile updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ ProfileStore: Profile update failed:', error);
      
      let errorMessage = 'Failed to update profile';
      if (error.code === 401) {
        errorMessage = 'Please log in to update your profile';
      } else if (error.code === 413) {
        errorMessage = 'File too large. Please choose a smaller image.';
      } else if (error.error) {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        loading: false, 
        error: errorMessage
      });
      
      return false;
    }
  },
  
  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
  
  /**
   * Reset profile state
   */
  resetProfile: () => {
    console.log('🔄 ProfileStore: Resetting profile state');
    set({ 
      profile: null, 
      loading: false, 
      error: null 
    });
  }
}));

export default useProfileStore; 