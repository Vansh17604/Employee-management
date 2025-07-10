import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';
import { config } from '@/utils/axiosConfig';

const base_url = import.meta.env.VITE_BASE_URL;

const useBankStore = create((set) => ({
  banks: [],
  loading: false,
  error: null,

  createBank: async (bank_name) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/createbank`, { bank_name }, config);
      const { message, work } = res.data;

      set((state) => ({
        banks: [work, ...state.banks],
        loading: false,
        error: null
      }));

      toast.success("Bank created successfully");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Bank creation failed';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  updateBank: async (id, bank_name) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${base_url}/updatebank/${id}`, { bank_name }, config);
      const { bank } = res.data;

      set((state) => ({
        banks: state.banks.map(b =>
          b._id === id ? bank : b
        ),
        loading: false,
        error: null
      }));

      toast.success("Bank updated successfully");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error updating bank';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchBanks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/getallbanks`, config);
      const banks = res.data;

      set({
        banks,
        loading: false,
        error: null
      });

      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching banks';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  deleteBank: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`${base_url}/deletebank/${id}`, config);

      set((state) => ({
        banks: state.banks.filter(bank => bank._id !== id),
        loading: false,
        error: null
      }));

      toast.success("Bank deleted successfully");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error deleting bank';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearBanks: () => {
    set({
      banks: [],
      error: null,
      loading: false
    });
  }
}));

export default useBankStore;
