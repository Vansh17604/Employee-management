import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';
import { config } from '@/utils/axiosConfig';

const base_url = import.meta.env.VITE_BASE_URL;

const useAdminStore = create((set) => ({
  employees: [],
  normalEmployees: [],
  users: [],
  loading: false,
  error: null,

  registerEmployee: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/employeeregister`, { name, email, password }, config);
      const { message, user } = res.data;

      set((state) => ({
        employees: [...state.employees, user],
        loading: false,
        error: null
      }));

      toast.success("Employee registered successfully");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Employee registration failed';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  registerNormalEmployee: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${base_url}/normalemployregister`, { name, email, password }, config);
      const { message, user } = res.data;

      set((state) => ({
        normalEmployees: [...state.normalEmployees, user],
        loading: false,
        error: null
      }));

      toast.success("Normal employee registered successfully");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Normal employee registration failed';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  editUser: async (id, name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const requestData = { name, email, role };
      if (password) requestData.password = password;

      const res = await axios.put(`${base_url}/edituser/${id}`, requestData, config);
      const { user } = res.data;

      set((state) => ({
        users: state.users.map(u => u._id === id ? user : u),
        employees: state.employees.map(emp => emp._id === id ? user : emp),
        normalEmployees: state.normalEmployees.map(emp => emp._id === id ? user : emp),
        loading: false,
        error: null
      }));

      toast.success("User updated successfully");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error editing user';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  editEmployee: async (id, name, email, password) => {
    return useAdminStore.getState().editUser(id, name, email, password, 'employee');
  },

  editNormalEmployee: async (id, name, email, password) => {
    return useAdminStore.getState().editUser(id, name, email, password, 'normal_employee');
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${base_url}/getuser`, config);
      const { users } = res.data;

      const employees = users.filter(user => user.role === 'employee');
      const normalEmployees = users.filter(user => user.role === 'normalemployee');

      set({
        users,
        employees,
        normalEmployees,
        loading: false,
        error: null
      });

    
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching users';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchEmployees: async () => {
    return useAdminStore.getState().fetchUsers();
  },

  fetchNormalEmployees: async () => {
    return useAdminStore.getState().fetchUsers();
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`${base_url}/deleteuser/${id}`, config);

      set((state) => ({
        users: state.users.filter(user => user._id !== id),
        employees: state.employees.filter(emp => emp._id !== id),
        normalEmployees: state.normalEmployees.filter(emp => emp._id !== id),
        loading: false,
        error: null
      }));

      toast.success("User deleted successfully");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error deleting user';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  deleteEmployee: async (id) => {
    return useAdminStore.getState().deleteUser(id);
  },

  deleteNormalEmployee: async (id) => {
    return useAdminStore.getState().deleteUser(id);
  },

  clearError: () => {
    set({ error: null });
  },

  clearEmployees: () => {
    set({
      employees: [],
      normalEmployees: [],
      users: [],
      error: null,
      loading: false
    });
  }
}));

export default useAdminStore;
