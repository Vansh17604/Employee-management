import React, { useState, useEffect } from "react";

import { Building2, Trash2, Search, Edit } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { CustomModal } from "../components/Customes";
import gif from '/assets/Animation - 1747722366024.gif';
import useWorkStore from "../../app/workStore";

export default function ViewWorkPlace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorkPlace, setSelectedWorkPlace] = useState(null);
  

  const [editForm, setEditForm] = useState({
    work_place_name: ''
  });

  const [validationErrors, setValidationErrors] = useState({
    work_place_name: ''
  });
  
  const { 
    works, 
    loading, 
    error, 
    fetchWorks,
    deleteWork, 
    editWork,
    clearError 
  } = useWorkStore();

  useEffect(() => {
    fetchWorks();
    return () => {
      clearError();
    };
  }, [fetchWorks, clearError]);

  const checkWorkPlaceNameAvailability = (workPlaceName, currentWorkPlaceId) => {
    const nameExists = works.some(work => 
      work.work_place_name?.toLowerCase() === workPlaceName.toLowerCase() && work._id !== currentWorkPlaceId
    );
    
    return !nameExists;
  };

  const validateForm = () => {
    const newErrors = {
      work_place_name: ''
    };

    if (!editForm.work_place_name.trim()) {
      newErrors.work_place_name = "Work place name is required";
    } else if (editForm.work_place_name.trim().length < 2) {
      newErrors.work_place_name = "Work place name must be at least 2 characters";
    } else if (!checkWorkPlaceNameAvailability(editForm.work_place_name, selectedWorkPlace?._id)) {
      newErrors.work_place_name = "This work place name already exists";
    }

    setValidationErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const filteredWorkPlaces = works.filter(work => {
    const matchesName = (work.work_place_name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    return matchesName;
  });

  const handleDelete = (workPlace) => {
    setSelectedWorkPlace(workPlace);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (workPlace) => {
    setSelectedWorkPlace(workPlace);
    setEditForm({
      work_place_name: workPlace.work_place_name || ''
    });

    setValidationErrors({
      work_place_name: ''
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteWorkPlace = async () => {
    if (!selectedWorkPlace) return;
    
    const success = await deleteWork(selectedWorkPlace._id);
    
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedWorkPlace(null);
    }
  };

  const handleEditWorkPlace = async () => {
    if (!selectedWorkPlace) return;
    
    if (!validateForm()) {
      return;
    }
    
    const success = await editWork(selectedWorkPlace._id, editForm.work_place_name);
    
    if (success) {
      setIsEditModalOpen(false);
      setSelectedWorkPlace(null);
      setEditForm({ work_place_name: '' });
      setValidationErrors({ work_place_name: '' });
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedWorkPlace(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedWorkPlace(null);
    setEditForm({ work_place_name: '' });
    setValidationErrors({ work_place_name: '' });
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));

    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
          View Work Places
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Manage and view all work place locations
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <Input
            type="text"
            placeholder="Search work places by name..."
            className="pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Work Places Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16 bg-white dark:bg-gray-800">
            <img
              src={gif}
              alt="Loading..."
              className="h-16 w-16"
            />
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading work places...
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Work Place Name
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
                {filteredWorkPlaces.length > 0 ? (
                  filteredWorkPlaces.map((workPlace) => (
                    <tr key={workPlace._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">
                        {workPlace.work_place_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {formatDate(workPlace.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center px-3 py-1.5 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-700 hover:border-blue-600 dark:hover:border-blue-700 transition-all duration-200 rounded-md"
                            onClick={() => handleEdit(workPlace)}
                          >
                            <Edit size={16} className="mr-1.5" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center px-3 py-1.5 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 hover:border-red-600 dark:hover:border-red-700 transition-all duration-200 rounded-md"
                            onClick={() => handleDelete(workPlace)}
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
                          No work places found
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Try adjusting your search criteria or add some work places.
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

    
      <CustomModal
        open={isDeleteModalOpen}
        hideModal={closeDeleteModal}
        performAction={handleDeleteWorkPlace}
        title={`Delete Work Place "${selectedWorkPlace?.work_place_name || ''}"?`}
        description="Are you sure you want to delete this work place? This action cannot be undone."
      />

      {/* Edit Work Place Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Edit Work Place "{selectedWorkPlace?.work_place_name}"
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Work Place Name
                </label>
                <Input
                  type="text"
                  value={editForm.work_place_name}
                  onChange={(e) => handleEditFormChange('work_place_name', e.target.value)}
                  className={`w-full border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 ${
                    validationErrors.work_place_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter work place name"
                />
                {validationErrors.work_place_name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.work_place_name}
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
                onClick={handleEditWorkPlace}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Updating...' : 'Update Work Place'}
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