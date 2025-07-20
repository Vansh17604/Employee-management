import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';
import { config } from '@/utils/axiosConfig';

const base_url = import.meta.env.VITE_BASE_URL;

const useAadharStore = create((set) => ({
  pendingAadhars: [],
  approvedAadhars: [],
  rejectedAadhars: [],
  loading: false,
  error: null,

  createAadhar: async (aadharData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();

      Object.keys(aadharData).forEach(key => {
        if (aadharData[key] !== null && aadharData[key] !== undefined) {
          formData.append(key, aadharData[key]);
        }
      });

      const res = await axios.post(`${base_url}/createaadhar?type=aadharcard`, formData, config);
      const { aadhar } = res.data;

      set((state) => ({
        pendingAadhars: [...state.pendingAadhars, aadhar],
        loading: false,
        error: null
      }));

      toast.success("Aadhar created successfully");
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error creating aadhar';
      set({ error: msg, loading: false });
      toast.error(msg);
      return false;
    }
  },

  approveAadhar: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/approvaadhar/${id}`, {}, config);
      const { aadhar } = res.data;

      set((state) => ({
        pendingAadhars: state.pendingAadhars.filter(aad => aad._id !== id),
        approvedAadhars: [...state.approvedAadhars, aadhar],
        loading: false,
        error: null
      }));

      toast.success("Aadhar approved successfully");
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error approving aadhar';
      set({ error: msg, loading: false });
      toast.error(msg);
      return false;
    }
  },

  rejectAadhar: async (id, remarks) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/rejectaadhar/${id}`, { remarks }, config);
      const { aadhar } = res.data;

      set((state) => ({
        pendingAadhars: state.pendingAadhars.filter(aad => aad._id !== id),
        rejectedAadhars: [...state.rejectedAadhars, aadhar],
        loading: false,
        error: null
      }));

      toast.success("Aadhar rejected successfully");
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error rejecting aadhar';
      set({ error: msg, loading: false });
      toast.error(msg);
      return false;
    }
  },

  editPendingAadhar: async (id, aadharData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${base_url}/editaadhar/${id}?type=editaadharcard`, aadharData, config);
      const { aadhar } = res.data;

      set((state) => ({
        pendingAadhars: state.pendingAadhars.map(aad =>
          aad._id === id ? aadhar : aad
        ),
        loading: false,
        error: null
      }));

      toast.success("Pending Aadhar updated successfully");
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error editing pending aadhar';
      set({ error: msg, loading: false });
      toast.error(msg);
      return false;
    }
  },

  editApprovedAadhar: async (id, aadharData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${base_url}/editapproveaadhar/${id}?type=updatedaprovedaadhar`, aadharData, config);
      const { aadhar } = res.data;

      set((state) => ({
        pendingAadhars: [...state.pendingAadhars, aadhar],
        loading: false,
        error: null
      }));

      toast.success("Update request for approved Aadhar created");
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error creating pending approval';
      set({ error: msg, loading: false });
      toast.error(msg);
      return false;
    }
  },
  fetchaadharbyempolyeeid:async(employeeId)=>{
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/fetchaadharbyemployeeid/${employeeId}`,config);
      const { aadhar } = res.data;
      set({
        pendingAadhars: aadhar,
        loading: false,
        error: null
      });
    return aadhar;
      } catch (err) {
        const msg = err.response?.data?.message || 'Error fetching aadhar by employee id';
        set({ error: msg, loading: false });
        toast.error(msg);
        return false;
  }
},
fetchApprovedBankDetailsByEmployeeId: async (employeeId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchapprovebankdetailsbyemployeeid/${employeeId}`, config);
    const { bankdetail } = res.data;

    set({
      approvedBankDetails: bankdetail,
      loading: false,
      error: null
    });

    return bankdetail;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching approved bank details by employee ID';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},
fetchAadharByItsOwnId: async (id) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchbyitsownid/${id}`, config);
    const { aadhar } = res.data;

    set({ loading: false });
    return aadhar; 
  } catch (err) {
    const msg = err.response?.data?.message || 'Error fetching Aadhar by ID';
    set({ error: msg, loading: false });
    toast.error(msg);
    return false;
  }
},fetchPendingAadharByUserId: async (userId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchpendingaadharbyuserid/${userId}`, config);
    const { aadhar } = res.data;

    set({
      pendingAadhars: aadhar,
      loading: false,
      error: null
    });

    return aadhar;
  } catch (err) {
    const msg = err.response?.data?.message || 'Error fetching pending Aadhar by user ID';
    set({ error: msg, loading: false });
    toast.error(msg);
    return false;
  }
},fetchRejectedAadharByUserId: async (userId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchrejectedaadharbyuserid/${userId}`, config);
    const { aadhar } = res.data;

    set({
      rejectedAadhars: aadhar,
      loading: false,
      error: null
    });

    return aadhar;
  } catch (err) {
    const msg = err.response?.data?.message || 'Error fetching rejected Aadhar by user ID';
    set({ error: msg, loading: false });
    toast.error(msg);
    return false;
  }
},

fetchApprovedAadharByUserId: async (userId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchaprovedaadharbyuserid/${userId}`, config);
    const { aadhar } = res.data;

    set({
      approvedAadhars: aadhar,
      loading: false,
      error: null
    });

    return aadhar;
  } catch (err) {
    const msg = err.response?.data?.message || 'Error fetching approved Aadhar by user ID';
    set({ error: msg, loading: false });
    toast.error(msg);
    return false;
  }
},
deleteAadhar: async (id) => {
  set({ loading: true, error: null });
  try {
    await axios.delete(`${base_url}/deleteaadhar/${id}`, config);

    set((state) => ({
      pendingAadhars: state.pendingAadhars.filter(aadhar => aadhar._id !== id),
      loading: false,
      error: null
    }));

    toast.success("Aadhar deleted successfully");
    return true;
  } catch (err) {
    const msg = err.response?.data?.message || 'Error deleting aadhar';
    set({ error: msg, loading: false });
    toast.error(msg);
    return false;
  }
},
fetchAllPendingAadhar: async () => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchallpendingaadhar`, config);
    const { aadhar } = res.data;

    set({
      pendingAadhars: aadhar,
      loading: false,
      error: null
    });

    return aadhar;
  } catch (err) {
    const msg = err.response?.data?.message || 'Error fetching all pending Aadhar';
    set({ error: msg, loading: false });
    toast.error(msg);
    return false;
  }
},
fetchAllApprovedAadhar: async () => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchapprovedaadhar`, config);
    const { aadhar } = res.data;

    set({
      approvedAadhars: aadhar,
      loading: false,
      error: null
    });

    return aadhar;
  } catch (err) {
    const msg = err.response?.data?.message || 'Error fetching approved Aadhar';
    set({ error: msg, loading: false });
    toast.error(msg);
    return false;
  }
},

fetchAllRejectedAadhar: async () => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchrejectedaadhar`, config);
    const { aadhar } = res.data;

    set({
      rejectedAadhars: aadhar,
      loading: false,
      error: null
    });

    return aadhar;
  } catch (err) {
    const msg = err.response?.data?.message || 'Error fetching rejected Aadhar';
    set({ error: msg, loading: false });
    toast.error(msg);
    return false;
  }
},
fetchApprovedAadharById: async (id) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchapprovaadharbyid/${id}`, config);
    const { aadhar } = res.data;

    set({ loading: false });
    return aadhar;
  } catch (err) {
    const msg = err.response?.data?.message || 'Error fetching approved Aadhar by ID';
    set({ error: msg, loading: false });
    toast.error(msg);
    return false;
  }
},
fetchApprovedAadharByEmployeeId: async (employeeId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchapprovedaadharbyemployeeid/${employeeId}`, config);
    const { aadhar } = res.data;

    set({
      approvedAadhars: aadhar,
      loading: false,
      error: null
    });

    return aadhar;
  } catch (err) {
    const msg = err.response?.data?.message || 'Error fetching approved Aadhar by employee ID';
    set({ error: msg, loading: false });
    toast.error(msg);
    return false;
  }
},







  clearError: () => {
    set({ error: null });
  },

  clearAadhars: () => {
    set({
      pendingAadhars: [],
      approvedAadhars: [],
      rejectedAadhars: [],
      error: null,
      loading: false
    });
  },

  resetLoading: () => {
    set({ loading: false });
  },

  updateAadharInState: (id, updatedAadhar) => {
    set((state) => ({
      pendingAadhars: state.pendingAadhars.map(aadhar =>
        aadhar._id === id ? { ...aadhar, ...updatedAadhar } : aadhar
      ),
      approvedAadhars: state.approvedAadhars.map(aadhar =>
        aadhar._id === id ? { ...aadhar, ...updatedAadhar } : aadhar
      ),
      rejectedAadhars: state.rejectedAadhars.map(aadhar =>
        aadhar._id === id ? { ...aadhar, ...updatedAadhar } : aadhar
      )
    }));
  }
}));

export default useAadharStore;
