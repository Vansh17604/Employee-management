import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';
import { config } from '@/utils/axiosConfig';

const base_url = import.meta.env.VITE_BASE_URL;

const usePanStore = create((set) => ({
  pendingPans: [],
  approvedPans: [],
  rejectedPans: [],
  loading: false,
  error: null,

  createPan: async (panData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      Object.keys(panData).forEach(key => {
        if (panData[key] !== null && panData[key] !== undefined) {
          formData.append(key, panData[key]);
        }
      });

      const res = await axios.post(`${base_url}/createpan?type=pancard`, formData, config);
      const { pan } = res.data;

      set((state) => ({
        pendingPans: [...(state.pendingPans || []), pan],
        loading: false,
        error: null
      }));

      toast.success("PAN submitted for approval");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error creating PAN';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  approvePan: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/approvpan/${id}`, {}, config);
      const { pan } = res.data;

      set((state) => ({
        pendingPans: state.pendingPans.filter(p => p._id !== id),
        approvedPans: [...state.approvedPans, pan],
        loading: false,
        error: null
      }));

      toast.success("PAN approved");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error approving PAN';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  rejectPan: async (id, remarks) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/rejectpan/${id}`, { remarks }, config);
      const { pan } = res.data;

      set((state) => ({
        pendingPans: state.pendingPans
          .map(p => p._id === id ? pan : p)
          .filter(p => p._id !== id),
        rejectedPans: [...state.rejectedPans, pan],
        loading: false,
        error: null
      }));

      toast.success("PAN rejected");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error rejecting PAN';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  editPendingPan: async (id, panData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${base_url}/editpan/${id}?type=updatedpancard`, panData, config);
      const { pan } = res.data;

      set((state) => ({
        pendingPans: state.pendingPans.map(p =>
          p._id === id ? pan : p
        ),
        loading: false,
        error: null
      }));

      toast.success("Pending PAN updated");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error editing pending PAN';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  editApprovedPan: async (id, panData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${base_url}/editapprovepan/${id}?type=updatedapprovedpan`, panData, config);
      const { pan } = res.data;

      set((state) => ({
        pendingPans: [...state.pendingPans, pan],
        loading: false,
        error: null
      }));

      toast.success("Edit request for approved PAN submitted");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error creating pending approval';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },
  fetchpanbyemployeeid: async(employeeId)=>{
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/fetchpanbyemployeeid/${employeeId}`, config);
      const { pan } = res.data;
      set({
        pendingPans: pan,
        loading: false,
        error: null
      });
      return pan;
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error fetching PAN by employee ID';
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
        return false;
  }
},
fetchPanById: async (id) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchbyitsid/${id}`, config);
    const { pan } = res.data;

    set({ loading: false });
    return pan;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching PAN by ID';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},
fetchApprovedPanByEmployeeId: async (employeeId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchapprovpanbyemployeeid/${employeeId}`, config);
    const { pan } = res.data;

    set({
      approvedPans: pan,
      loading: false,
      error: null
    });

    return pan;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching approved PAN by employee ID';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},
fetchPendingPanByUserId: async (userId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchpendingbyuserid/${userId}`, config);
    const { pan } = res.data;

    set({
      pendingPans: pan,
      loading: false,
      error: null
    });

    return pan;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching pending PAN by user ID';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},fetchAllPendingPans: async () => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchallpendingpan`, config); // use `all` or any ID if required
    const { pans } = res.data;

    set({
      pendingPans: pans,
      loading: false,
      error: null
    });

    return pans;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching all pending PANs';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},fetchApprovedPanById: async (id) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchapprovedpanbyid/${id}`, config);
    const { pan } = res.data;

    set({ loading: false });
    return pan;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching approved PAN by ID';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},
fetchAllApprovedPans: async () => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchallapproved`, config);
    const { pan } = res.data;

    set({
      approvedPans: pan,
      loading: false,
      error: null
    });

    return pan;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching approved PANs';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},

fetchAllRejectedPans: async () => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchallrejected`, config);
    const { pan } = res.data;

    set({
      rejectedPans: pan,
      loading: false,
      error: null
    });

    return pan;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching rejected PANs';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},
fetchRejectedPanByUserId: async (userId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchallrejectpanbyuserId/${userId}`, config);
    const { pan } = res.data;

    set({
      rejectedPans: pan,
      loading: false,
      error: null
    });

    return pan;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching rejected PAN by user ID';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},

fetchApprovedPanByUserId: async (userId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchallapprovedpanbyuserId/${userId}`, config);
    const { pan } = res.data;

    set({
      approvedPans: pan,
      loading: false,
      error: null
    });

    return pan;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching approved PAN by user ID';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},


deletePan: async (id) => {
  set({ loading: true, error: null });
  try {
    await axios.delete(`${base_url}/deletepan/${id}`, config);

    set((state) => ({
      pendingPans: state.pendingPans.filter(p => p._id !== id),
      loading: false,
      error: null
    }));

    toast.success("PAN deleted successfully");
    return true;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error deleting PAN';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},




  clearError: () => {
    set({ error: null });
  },

  clearPans: () => {
    set({
      pendingPans: [],
      approvedPans: [],
      rejectedPans: [],
      error: null,
      loading: false
    });
  },

  resetLoading: () => {
    set({ loading: false });
  },

  updatePanInState: (id, updatedPan) => {
    set((state) => ({
      pendingPans: state.pendingPans.map(pan =>
        pan._id === id ? { ...pan, ...updatedPan } : pan
      ),
      approvedPans: state.approvedPans.map(pan =>
        pan._id === id ? { ...pan, ...updatedPan } : pan
      ),
      rejectedPans: state.rejectedPans.map(pan =>
        pan._id === id ? { ...pan, ...updatedPan } : pan
      )
    }));
  }
}));

export default usePanStore;
