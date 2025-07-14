import { create } from 'zustand';
import { toast } from "sonner";
import axios from 'axios';
import { config } from '@/utils/axiosConfig';

const base_url = import.meta.env.VITE_BASE_URL;

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/login`, { email, password }, config);
      const { id, role, token } = res.data;

      set({
        user: { id, role },
        token,
        loading: false,
        error: null
      });
toast.success("Login successful",{dismissible: true});
     
      return true;
       
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      set({
        error: errorMessage,
        loading: false
      });
      toast.error(errorMessage);
      return false;
    }
  },

  validateToken: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/validatetoken`, {}, config);
      const { id, role } = res.data;

      set({
        user: { id, role },
        loading: false,
        error: null
      });

    
      return true;
    } catch (err) {
      set({
        user: null,
        token: null,
        loading: false
      });

   
      return false;
    }
  },

   getUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/getuser/${id}`, config);
      
      set({
        loading: false,
        error: null
      });
      return res.data.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching user';
      set({
        error: errorMessage,
        loading: false
      });
      toast.error(errorMessage);
      return null;
    }
  },

  
  updateUserProfile: async (id, name, email) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${base_url}/updateprofile/${id}`, { name, email }, config);
      
      // Update user in store if it's the current user
      const currentUser = get().user;
      if (currentUser && currentUser.id === id) {
        set({
          user: { ...currentUser, name, email },
          loading: false,
          error: null
        });
      } else {
        set({
          loading: false,
          error: null
        });
      }
      
      toast.success("Profile updated successfully");
      return res.data.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error updating profile';
      set({
        error: errorMessage,
        loading: false
      });
      toast.error(errorMessage);
      return null;
    }
  },


  changePassword: async (id, oldPassword, newPassword) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/changepassword/${id}`, { oldPassword, newPassword }, config);
      
      set({
        loading: false,
        error: null
      });
      toast.success("Password changed successfully");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error changing password';
      set({
        error: errorMessage,
        loading: false
      });
      toast.error(errorMessage);
      return false;
    }
  },

  // Logout
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${base_url}/logout`, {}, config);
      
      set({
        user: null,
        token: null,
        error: null,
        loading: false
      });
      toast.success("Logged out successfully");
      return true;
    } catch (err) {
      
      set({
        user: null,
        token: null,
        error: null,
        loading: false
      });
      toast.success("Logged out successfully");
      return true;
    }
  },

 
  clearError: () => set({ error: null }),

 
  clearLoading: () => set({ loading: false })
}));
export default useAuthStore;
