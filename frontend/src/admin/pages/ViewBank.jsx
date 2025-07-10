import React, { useState, useEffect } from "react";

import { Building2, Trash2, Search, Edit } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { CustomModal } from "../components/Customes";
import gif from '/assets/Animation - 1747722366024.gif';
import useBankStore from "../../app/bankStore";

export default function ViewBank() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  

  const [editForm, setEditForm] = useState({
    bank_name: ''
  });

 
  const [validationErrors, setValidationErrors] = useState({
    bank_name: ''
  });
  
  const { 
    banks, 
    loading, 
    error, 
    fetchBanks,
    deleteBank, 
    updateBank,
    clearError 
  } = useBankStore();

  useEffect(() => {
    // Fetch banks on component mount
    fetchBanks();
    
    return () => {
      clearError();
    };
  }, [fetchBanks, clearError]);

  const checkBankNameAvailability = (bankName, currentBankId) => {
    // Check if bank name exists in banks
    const nameExists = banks.some(bank => 
      bank.bank_name?.toLowerCase() === bankName.toLowerCase() && bank._id !== currentBankId
    );
    
    return !nameExists;
  };

  const validateForm = () => {
    const newErrors = {
      bank_name: ''
    };

    // Bank name validation
    if (!editForm.bank_name.trim()) {
      newErrors.bank_name = "Bank name is required";
    } else if (editForm.bank_name.trim().length < 2) {
      newErrors.bank_name = "Bank name must be at least 2 characters";
    } else if (!checkBankNameAvailability(editForm.bank_name, selectedBank?._id)) {
      newErrors.bank_name = "This bank name already exists";
    }

    setValidationErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Filter banks based on search term
  const filteredBanks = banks.filter(bank => {
    const matchesName = (bank.bank_name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    return matchesName;
  });

  const handleDelete = (bank) => {
    setSelectedBank(bank);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (bank) => {
    setSelectedBank(bank);
    setEditForm({
      bank_name: bank.bank_name || ''
    });
    // Clear validation errors when opening edit modal
    setValidationErrors({
      bank_name: ''
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteBank = async () => {
    if (!selectedBank) return;
    
    const success = await deleteBank(selectedBank._id);
    
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedBank(null);
    }
  };

  const handleEditBank = async () => {
    if (!selectedBank) return;
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    const success = await updateBank(selectedBank._id, editForm.bank_name);
    
    if (success) {
      setIsEditModalOpen(false);
      setSelectedBank(null);
      setEditForm({ bank_name: '' });
      setValidationErrors({ bank_name: '' });
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedBank(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBank(null);
    setEditForm({ bank_name: '' });
    setValidationErrors({ bank_name: '' });
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
          View Banks
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Manage and view all banks
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <Input
            type="text"
            placeholder="Search banks by name..."
            className="pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Banks Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16 bg-white dark:bg-gray-800">
            <img
              src={gif}
              alt="Loading..."
              className="h-16 w-16"
            />
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading banks...
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Bank Name
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
                {filteredBanks.length > 0 ? (
                  filteredBanks.map((bank) => (
                    <tr key={bank._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">
                        {bank.bank_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {formatDate(bank.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center px-3 py-1.5 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-700 hover:border-blue-600 dark:hover:border-blue-700 transition-all duration-200 rounded-md"
                            onClick={() => handleEdit(bank)}
                          >
                            <Edit size={16} className="mr-1.5" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center px-3 py-1.5 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 hover:border-red-600 dark:hover:border-red-700 transition-all duration-200 rounded-md"
                            onClick={() => handleDelete(bank)}
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
                    <td colSpan="3" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                      <div className="flex flex-col items-center">
                        <Building2 className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" strokeWidth={1.5} />
                        <p className="text-lg font-medium">
                          No banks found
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Try adjusting your search criteria or add some banks.
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
        performAction={handleDeleteBank}
        title={`Delete Bank "${selectedBank?.bank_name || ''}"?`}
        description="Are you sure you want to delete this bank? This action cannot be undone."
      />

      {/* Edit Bank Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Edit Bank "{selectedBank?.bank_name}"
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bank Name
                </label>
                <Input
                  type="text"
                  value={editForm.bank_name}
                  onChange={(e) => handleEditFormChange('bank_name', e.target.value)}
                  className={`w-full border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 ${
                    validationErrors.bank_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter bank name"
                />
                {validationErrors.bank_name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.bank_name}
                  </p>
                )}
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
                onClick={handleEditBank}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Updating...' : 'Update Bank'}
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