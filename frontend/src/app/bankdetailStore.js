import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';
import { config } from '@/utils/axiosConfig';

const base_url = import.meta.env.VITE_BASE_URL;

const useBankdetailStore = create((set) => ({
  pendingBankDetails: [],
  approvedBankDetails: [],
  rejectedBankDetails: [],
  loading: false,
  error: null,

  createBankDetail: async (bankData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      Object.keys(bankData).forEach((key) => {
        if (bankData[key] !== null && bankData[key] !== undefined) {
          formData.append(key, bankData[key]);
        }
      });

      const res = await axios.post(`${base_url}/createbankdetail?type=passbookimage`, formData, config);
      const { bankDetail } = res.data;

      set((state) => ({
        pendingBankDetails: [...(state.pendingBankDetails || []), bankDetail],
        loading: false,
        error: null
      }));

      toast.success("Bank detail submitted for approval");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error creating bank detail';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  approveBankDetail: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/markapprovebankdetail/${id}`, {}, config);
      const { bankDetail } = res.data;

      set((state) => ({
        pendingBankDetails: state.pendingBankDetails.filter(b => b._id !== id),
        approvedBankDetails: [...state.approvedBankDetails, bankDetail],
        loading: false,
        error: null
      }));

      toast.success("Bank detail approved");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error approving bank detail';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  rejectBankDetail: async (id, remarks) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/markrejectbankdetail/${id}`, { remarks }, config);
      const { bankDetail } = res.data;

      set((state) => ({
        pendingBankDetails: state.pendingBankDetails.map(b =>
          b._id === id ? bankDetail : b
        ).filter(b => b._id !== id),
        rejectedBankDetails: [...state.rejectedBankDetails, bankDetail],
        loading: false,
        error: null
      }));

      toast.success("Bank detail rejected");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error rejecting bank detail';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  editPendingBankDetail: async (id, bankData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${base_url}/editbankdetail/${id}?type=updatepassbookimage`, bankData, config);
      const { bankDetail } = res.data;

      set((state) => ({
        pendingBankDetails: state.pendingBankDetails.map(b =>
          b._id === id ? bankDetail : b
        ),
        loading: false,
        error: null
      }));

      toast.success("Pending bank detail updated");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error editing pending bank detail';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  editApprovedBankDetail: async (id, bankData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${base_url}/editapprovebankdetail/${id}?type=updateapprovepassbookimage`, bankData, config);
      const { bankDetail } = res.data;

      set((state) => ({
        pendingBankDetails: [...state.pendingBankDetails, bankDetail],
        loading: false,
        error: null
      }));

      toast.success("Edit request for approved bank detail submitted");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error creating pending approval';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },
  fetchbankdetailsnyemployeeid: async(employeeId)=>{
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/fetchbankdetailsbyemployeeid/${employeeId}`,config);
      const { bankdetail } = res.data;
      set({
         pendingBankDetails: bankdetail,
         loading: false,
         error: null
          
      });
      return bankdetail;
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error fetching bank details';
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
        return false;

  }
},
 fetchBankDetailByItsId: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/fetchbankdetailitid/${id}`, config);
      const { bankdetail } = res.data;
      set({ loading: false });
      return bankdetail;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching bank detail by ID';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },fetchPendingBankDetailsByUserId: async (userId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchpendingbankdetailsbyuserid/${userId}`, config);
    const { bankdetail } = res.data;

    set({
      pendingBankDetails: bankdetail,
      loading: false,
      error: null
    });

    return bankdetail;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching pending bank details by user ID';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},deleteBankDetail: async (id) => {
  set({ loading: true, error: null });
  try {
    await axios.delete(`${base_url}/deletebankdetails/${id}`, config);

    set((state) => ({
      pendingBankDetails: state.pendingBankDetails.filter(b => b._id !== id),
      loading: false,
      error: null
    }));

    toast.success("Bank detail deleted successfully");
    return true;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error deleting bank detail';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},fetchAllPendingBankDetails: async () => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchallpendingbankdetails`, config);
    const { bankdetails } = res.data;

    set({
      pendingBankDetails: bankdetails,
      loading: false,
      error: null
    });

    return bankdetails;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching all pending bank details';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},fetchAllApprovedBankDetails: async () => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchapprovbankdetails`, config);
    const { bankdetails } = res.data;

    set({
      approvedBankDetails: bankdetails,
      loading: false,
      error: null
    });

    return bankdetails;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching approved bank details';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},
fetchApprovedBankDetailById: async (id) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchapprovedbankdetailbyid/${id}`, config);
    const { bankdetail } = res.data;

    set({ loading: false });
    return bankdetail;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching approved bank detail by ID';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},


fetchAllRejectedBankDetails: async () => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchallrejectedbankdetails`, config);
    const { bankdetails } = res.data;

    set({
      rejectedBankDetails: bankdetails,
      loading: false,
      error: null
    });

    return bankdetails;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching rejected bank details';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},fetchRejectedBankDetailsByUserId: async (userId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchallrejectedbankdetailsbyuserid/${userId}`, config);
    const { bankdetail } = res.data;

    set({
      rejectedBankDetails: bankdetail,
      loading: false,
      error: null
    });

    return bankdetail;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching rejected bank details by user ID';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},

fetchApprovedBankDetailsByUserId: async (userId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/fetchallapprovedbankdetailvyuserid/${userId}`, config);
    const { bankdetail } = res.data;

    set({
      approvedBankDetails: bankdetail,
      loading: false,
      error: null
    });

    return bankdetail;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching approved bank details by user ID';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return false;
  }
},




  clearError: () => {
    set({ error: null });
  },

  clearBankDetails: () => {
    set({
      pendingBankDetails: [],
      approvedBankDetails: [],
      rejectedBankDetails: [],
      error: null,
      loading: false
    });
  },

  resetLoading: () => {
    set({ loading: false });
  },

  updateBankDetailInState: (id, updatedBankDetail) => {
    set((state) => ({
      pendingBankDetails: state.pendingBankDetails.map(bankDetail =>
        bankDetail._id === id ? { ...bankDetail, ...updatedBankDetail } : bankDetail
      ),
      approvedBankDetails: state.approvedBankDetails.map(bankDetail =>
        bankDetail._id === id ? { ...bankDetail, ...updatedBankDetail } : bankDetail
      ),
      rejectedBankDetails: state.rejectedBankDetails.map(bankDetail =>
        bankDetail._id === id ? { ...bankDetail, ...updatedBankDetail } : bankDetail
      )
    }));
  }
}));

export default useBankdetailStore;
