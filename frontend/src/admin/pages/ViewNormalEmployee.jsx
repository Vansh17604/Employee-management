import React, { useState, useEffect } from "react";

import { Users, Trash2, Search, Edit } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { CustomModal } from "../components/Customes";
import gif from '/assets/Animation - 1747722366024.gif';
import useAdminStore from "../../app/adminStore";

export default function ViewNormalEmployee() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const { 
    normalEmployees, 
    employees,
    loading, 
    error, 
    fetchNormalEmployees,
    fetchEmployees,
    deleteNormalEmployee,
    editNormalEmployee,
    clearError 
  } = useAdminStore();

  useEffect(() => {
    fetchNormalEmployees();
    fetchEmployees(); // Fetch regular employees for email validation
    
    return () => {
      clearError();
    };
  }, [fetchNormalEmployees, fetchEmployees, clearError]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    if (!password) return true; // Allow empty password (won't update if empty)
    if (password.length < 8) return false;
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return false;
    return true;
  };

  const checkEmailAvailability = (email, currentEmployeeId) => {
    // Check if email exists in regular employees
    const emailExistsInRegular = employees.some(emp => 
      emp.email?.toLowerCase() === email.toLowerCase()
    );
    
    // Check if email exists in normal employees (excluding current employee)
    const emailExistsInNormal = normalEmployees.some(emp => 
      emp.email?.toLowerCase() === email.toLowerCase() && emp._id !== currentEmployeeId
    );
    
    return !emailExistsInRegular && !emailExistsInNormal;
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: ''
    };

    // Name validation
    if (!editForm.name.trim()) {
      newErrors.name = "Name is required";
    } else if (editForm.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!editForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(editForm.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (!checkEmailAvailability(editForm.email, selectedEmployee?._id)) {
      newErrors.email = "This email is already in use by another employee";
    }

    // Password validation (only if password is provided)
    if (editForm.password) {
      if (editForm.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(editForm.password)) {
        newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
      }
    }

    setValidationErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const filteredEmployees = normalEmployees.filter(employee => {
    const matchesName = (employee.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesEmail = (employee.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    return matchesName || matchesEmail;
  });

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      name: employee.name || '',
      email: employee.email || '',
      password: '' // Always start with empty password
    });
    // Clear validation errors when opening edit modal
    setValidationErrors({
      name: '',
      email: '',
      password: ''
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    const success = await deleteNormalEmployee(selectedEmployee._id);
    
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleEditEmployee = async () => {
    if (!selectedEmployee) return;
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    const success = await editNormalEmployee(selectedEmployee._id, editForm.name, editForm.email, editForm.password);
    
    if (success) {
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
      setEditForm({ name: '', email: '', password: '' });
      setValidationErrors({ name: '', email: '', password: '' });
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEmployee(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
    setEditForm({ name: '', email: '', password: '' });
    setValidationErrors({ name: '', email: '', password: '' });
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for the field being edited
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
          View Normal Employees
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Manage and view all normal employee accounts
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <Input
            type="text"
            placeholder="Search normal employees by name or email..."
            className="pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Employee Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16 bg-white dark:bg-gray-800">
            <img
              src={gif}
              alt="Loading..."
              className="h-16 w-16"
            />
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading normal employees...
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">
                        {employee.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {employee.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Normal Employee
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {formatDate(employee.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center px-3 py-1.5 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-700 hover:border-blue-600 dark:hover:border-blue-700 transition-all duration-200 rounded-md"
                            onClick={() => handleEdit(employee)}
                          >
                            <Edit size={16} className="mr-1.5" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center px-3 py-1.5 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 hover:border-red-600 dark:hover:border-red-700 transition-all duration-200 rounded-md"
                            onClick={() => handleDelete(employee)}
                          >
                            <Trash2 size={16} className="mr-1.5" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                      <div className="flex flex-col items-center">
                        <Users className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" strokeWidth={1.5} />
                        <p className="text-lg font-medium">
                          No normal employees found
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Try adjusting your search criteria or add some normal employees.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={isDeleteModalOpen}
        hideModal={closeDeleteModal}
        performAction={handleDeleteEmployee}
        title={`Delete Normal Employee "${selectedEmployee?.name || ''}"?`}
        description="Are you sure you want to delete this normal employee? This action cannot be undone."
      />

      {/* Edit Employee Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Edit Normal Employee "{selectedEmployee?.name}"
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                  className={`w-full border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 ${
                    validationErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter employee name"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleEditFormChange('email', e.target.value)}
                  className={`w-full border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 ${
                    validationErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter employee email"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password (Leave blank to keep current)
                </label>
                <Input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => handleEditFormChange('password', e.target.value)}
                  className={`w-full border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 ${
                    validationErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter new password (optional)"
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.password}
                  </p>
                )}
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Employee Type: Normal Employee
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={closeEditModal}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditEmployee}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Updating...' : 'Update Employee'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}