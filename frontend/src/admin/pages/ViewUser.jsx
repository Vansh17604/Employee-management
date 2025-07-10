import React, { useState, useEffect } from "react";
import { Users, Loader2, Eye, EyeOff, Edit, Trash2, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Input } from "../../components/ui/input";
import { CustomModal } from "../components/Customes";
import gif from '/assets/Animation - 1747722366024.gif';

import useAdminStore from '../../app/adminStore';

export default function ViewUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee"
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const { 
    loading, 
    error, 
    users, 
    editUser,
    deleteUser,
    fetchUsers,
    clearError 
  } = useAdminStore();

  useEffect(() => {
    clearError();
    fetchUsers(); // Load users on component mount
  }, [clearError, fetchUsers]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  useEffect(() => {
    if (success) {
      const resetTimer = setTimeout(() => {
        setSuccess(false);
      }, 2500);

      return () => {
        clearTimeout(resetTimer);
      };
    }
  }, [success]);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!editForm.name) {
      newErrors.name = "Name is required";
    } else if (editForm.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (editForm.name.length > 50) {
      newErrors.name = "Name must not exceed 50 characters";
    }
    
    // Email validation
    if (!editForm.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation (only if password is provided)
    if (editForm.password && editForm.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (editForm.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(editForm.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    
    // Confirm password validation
    if (editForm.password && !editForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (editForm.password && editForm.password !== editForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role validation
    if (!editForm.role) {
      newErrors.role = "Role is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      password: "",
      confirmPassword: "",
      role: user.role
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!validateForm()) return;
    
    const success = await editUser(selectedUser._id, editForm.name, editForm.email, editForm.password, editForm.role);
    
    if (success) {
      setSuccess(true);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setEditForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "employee"
      });
      setErrors({});
      fetchUsers(); // Refresh the user list
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    const success = await deleteUser(selectedUser._id);
    
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the user list
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setEditForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "employee"
    });
    setErrors({});
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // Filter users based on search term and selected role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Render error message component
  const ErrorMessage = ({ error }) => {
    return error ? <p className="text-xs mt-1 text-red-500 dark:text-red-400">{error}</p> : null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      
      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {success && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
            <AlertDescription>
              User updated successfully!
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert className="mb-6 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Users Table */}
        <div className="rounded-lg border shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">All Users</h3>
            
            {/* Search and Filter */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="employee">Edit</option>
                <option value="normalemployee">View</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-16 bg-white dark:bg-gray-800">
                <img
                  src={gif}
                  alt="Loading..."
                  className="h-16 w-16"
                />
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  Loading users...
                </span>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'employee' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {user.role === 'employee' ? 'Edit' : 'View'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            onClick={() => handleEdit(user)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(user)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Edit User "{selectedUser?.name}"
            </h3>
            
            <div className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                    errors.role ? "border-red-500 dark:border-red-400" : ""
                  }`}
                >
                  <option value="employee">Edit</option>
                  <option value="normalemployee">View</option>
                </select>
                <ErrorMessage error={errors.role} />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  className={`w-full border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${
                    errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}/>
                <ErrorMessage error={errors.name} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  className={`w-full border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                <ErrorMessage error={errors.email} />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password (leave blank to keep current)
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={editForm.password}
                    onChange={handleChange}
                    className={`w-full pr-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${
                      errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <ErrorMessage error={errors.password} />
              </div>

              {/* Confirm Password */}
              {editForm.password && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={editForm.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pr-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${
                        errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <ErrorMessage error={errors.confirmPassword} />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                onClick={closeEditModal}
                variant="outline"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update User'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Delete User
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete user "{selectedUser?.name}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                onClick={closeDeleteModal}
                variant="outline"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteUser}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete User'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}