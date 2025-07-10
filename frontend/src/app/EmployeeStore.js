import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';
import { config } from '@/utils/axiosConfig';

const base_url = import.meta.env.VITE_BASE_URL;

const useEmployeeStore = create((set) => ({
  userEmployees: [],
  pendingEmployees: [],
  approvedEmployees: [],
  rejectedEmployees: [],
  currentEmployee: null,  
  loading: false,
  error: null,

  createEmployee: async (employeeData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      Object.keys(employeeData).forEach(key => {
        if (employeeData[key] !== null && employeeData[key] !== undefined) {
          formData.append(key, employeeData[key]);
        }
      });

      const res = await axios.post(`${base_url}/createemployee?type=profilependingemploye`, formData, config);
      const { employee } = res.data;

      set((state) => ({
        pendingEmployees: [...state.pendingEmployees, employee],
        loading: false,
        error: null
      }));

      toast.success("Employee created and sent for approval");
      return res.data.employee;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error creating employee';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  approveEmployee: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/makrkapprove/${id}`, {}, config);
      const { employee } = res.data;

      set((state) => ({
        pendingEmployees: state.pendingEmployees.filter(emp => emp._id !== id),
        approvedEmployees: [...state.approvedEmployees, employee],
        loading: false,
        error: null
      }));

      toast.success("Employee approved successfully");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error approving employee';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  rejectEmployee: async (id, reply) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/markreject/${id}`, { reply }, config);
      const { employee } = res.data;

      set((state) => ({
        pendingEmployees: state.pendingEmployees
          .map(emp => (emp._id === id ? employee : emp))
          .filter(emp => emp._id !== id),
        rejectedEmployees: [...state.rejectedEmployees, employee],
        loading: false,
        error: null
      }));

      toast.success("Employee rejected");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error rejecting employee';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  editPendingEmployee: async (id, employeeData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      Object.keys(employeeData).forEach(key => {
        if (employeeData[key] !== null && employeeData[key] !== undefined) {
          formData.append(key, employeeData[key]);
        }
      });

      const res = await axios.put(`${base_url}/editpendingemployee/${id}?type=editprofile`, formData, config);
      
      const { employee } = res.data;
      
      set((state) => ({
        // Ensure pendingEmployees is always an array
        pendingEmployees: Array.isArray(state.pendingEmployees) 
          ? state.pendingEmployees.map(emp => emp._id === id ? employee : emp)
          : [employee],
        currentEmployee: employee, // Update current employee too
        loading: false,
        error: null
      }));

      toast.success("Pending employee updated successfully");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update employee";
      
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  editApprovedEmployee: async (id, employeeData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      Object.keys(employeeData).forEach(key => {
        if (employeeData[key] !== null && employeeData[key] !== undefined) {
          formData.append(key, employeeData[key]);
        }
      });

      const res = await axios.put(`${base_url}/editapproveemployee/${id}?type=editupadated`, formData, config);
      const { employee } = res.data;

      set((state) => ({
        pendingEmployees: [...state.pendingEmployees, employee],
        loading: false,
        error: null
      }));

      toast.success("Approved employee sent for re-approval");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error creating pending approval';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchEmployeesByUserId: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/getemployeebyuserid/${userId}`, config);
      const employees = res.data;

      set({
        userEmployees: employees,
        loading: false,
        error: null
      });

      return employees;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching employees by userId';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return [];
    }
  },

  // FIXED: Don't overwrite pendingEmployees with a single object
  fetchEmployeebyEmployeeId: async(employeeId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/fetchemployeebyid/${employeeId}`, config);
      const employee = res.data;
      
      set({
        currentEmployee: employee, // Store single employee here
        loading: false,
        error: null
      });
      
      return employee;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching employee by id';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  fetchAllPendingEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/allpendingemployee`, config);
      const employees = res.data;

      set({
        pendingEmployees: Array.isArray(employees) ? employees : [],
        loading: false,
        error: null
      });

      return employees;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching pending employees';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return [];
    }
  },

  deletePendingEmployee: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`${base_url}/deletependingemployee/${id}`, config);

      set((state) => ({
        pendingEmployees: Array.isArray(state.pendingEmployees) 
          ? state.pendingEmployees.filter(emp => emp._id !== id)
          : [],
        loading: false,
        error: null
      }));

      toast.success("Pending employee deleted successfully");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error deleting pending employee';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  updateEmployeeWorkstatus: async (id, status) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.put(
        `${base_url}/markinactive/${id}`,
        { workstatus: status },
        config
      );

      const updatedEmployee = res.data;

      set((state) => ({
        userEmployees: Array.isArray(state.userEmployees) 
          ? state.userEmployees.map(emp => emp._id === id ? { ...emp, workstatus: status } : emp)
          : [],
        pendingEmployees: Array.isArray(state.pendingEmployees) 
          ? state.pendingEmployees.map(emp => emp._id === id ? { ...emp, workstatus: status } : emp)
          : [],
        approvedEmployees: Array.isArray(state.approvedEmployees) 
          ? state.approvedEmployees.map(emp => emp._id === id ? { ...emp, workstatus: status } : emp)
          : [],
        loading: false,
        error: null
      }));

      toast.success(`Employee marked as ${status.toLowerCase()} successfully`);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchApprovedEmployeesByUserId: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/fetchtheapprovaldata/${userId}`, config);
      const approved = res.data;

      set({
        approvedEmployees: Array.isArray(approved) ? approved : [],
        loading: false,
        error: null
      });

      
      return approved;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching approved employees';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return [];
    }
  },
  fetchApprovedEmployeeById: async (employeeId) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`${base_url}/getapprovedemployee/${employeeId}`, config);
    const employee = res.data;

    set({
      currentEmployee: employee,
      loading: false,
      error: null
    });

   
    return employee;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error fetching approved employee';
    set({ error: errorMessage, loading: false });
    toast.error(errorMessage);
    return null;
  }
},


  fetchRejectedEmployeesByUserId: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/fetchtherejected/${userId}`, config);
      const rejected = res.data;

      set({
        rejectedEmployees: Array.isArray(rejected) ? rejected : [],
        loading: false,
        error: null
      });

      toast.success("Rejected employees fetched successfully");
      return rejected;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching rejected employees';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return [];
    }
  },

  fetchAllApprovedEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/allapprovedemployee`, config);
      const employees = res.data;

      set({
        approvedEmployees: Array.isArray(employees) ? employees : [],
        loading: false,
        error: null
      });

      toast.success("All approved employees fetched");
      return employees;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching approved employees';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return [];
    }
  },

  fetchAllRejectedEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/allrejectedemployee`, config);
      const employees = res.data;

      set({
        rejectedEmployees: Array.isArray(employees) ? employees : [],
        loading: false,
        error: null
      });

     
      return employees;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching rejected employees';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return [];
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearEmployees: () => {
    set({
      pendingEmployees: [],
      approvedEmployees: [],
      rejectedEmployees: [],
      currentEmployee: null,
      error: null,
      loading: false
    });
  },

  resetLoading: () => {
    set({ loading: false });
  }
}));

export default useEmployeeStore;