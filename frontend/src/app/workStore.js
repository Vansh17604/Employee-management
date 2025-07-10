import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';
import { config } from '@/utils/axiosConfig';

const base_url = import.meta.env.VITE_BASE_URL;

const useWorkStore = create((set) => ({
  works: [],
  loading: false,
  error: null,

  createWork: async (work_place_name) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/creatework`, { work_place_name }, config);
      const { message, work } = res.data;

      set((state) => ({
        works: [work, ...state.works],
        loading: false,
        error: null
      }));

      toast.success('Workplace created successfully');
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Work creation failed';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  editWork: async (id, work_place_name) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${base_url}/editwork/${id}`, { work_place_name }, config);
      const { work } = res.data;

      set((state) => ({
        works: state.works.map(w =>
          w._id === id ? work : w
        ),
        loading: false,
        error: null
      }));

      toast.success('Workplace updated successfully');
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error editing work';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchWorks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/getwork`, config);
      const { works } = res.data;

      set({
        works,
        loading: false,
        error: null
      });

    
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching works';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  deleteWork: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`${base_url}/delwork/${id}`, config);
      const { message } = res.data;

      set((state) => ({
        works: state.works.filter(work => work._id !== id),
        loading: false,
        error: null
      }));

      toast.success('Workplace deleted successfully');
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error deleting work';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearWorks: () => {
    set({
      works: [],
      error: null,
      loading: false
    });
  }
}));

export default useWorkStore;
