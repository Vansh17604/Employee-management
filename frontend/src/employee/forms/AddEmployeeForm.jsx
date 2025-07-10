import React, { useState, useEffect } from 'react';
import useAuthStore from '../../app/authStore';
import useWorkStore from '../../app/workStore';
import { toast } from 'sonner';

const AddEmployeeForm = ({ onNext, onCancel, initialData, disabled }) => {
  const { user } = useAuthStore();
  const { works, loading: workLoading, fetchWorks } = useWorkStore();

  const [formData, setFormData] = useState({
    name: '',
    perment_address: '',
    current_address: '',
    primary_mno: '',
    secondary_mno: '',
    home_mno: '',
    work_id: '',
    employeeId:'',
    photo: null
  });

  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(initialData);

 
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        perment_address: initialData.perment_address || '',
        current_address: initialData.current_address || '',
        primary_mno: initialData.primary_mno || '',
        secondary_mno: initialData.secondary_mno || '',
        home_mno: initialData.home_mno || '',
       employeeId:initialData.employeeId|| '',
        work_id: initialData.work_id?._id || initialData.work_id || '',
        photo: initialData.photo || null
      });
    } else {
   
      setFormData({
        name: '',
        perment_address: '',
        current_address: '',
        primary_mno: '',
        secondary_mno: '',
        home_mno: '',
        work_id: '',
        employeeId:'',
        photo: null
      });
    }
  }, [initialData]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
  
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
    
    if (errors.photo) {
      setErrors(prev => ({
        ...prev,
        photo: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.perment_address) {
      newErrors.perment_address = 'Permanent address is required';
    }

    if (!formData.current_address) {
      newErrors.current_address = 'Current address is required';
    }

    if (!formData.primary_mno) {
      newErrors.primary_mno = 'Primary mobile number is required';
    } else if (!/^\d+$/.test(formData.primary_mno)) {
      newErrors.primary_mno = 'Primary mobile number must be numeric';
    }

    if (!formData.secondary_mno) {
      newErrors.secondary_mno = 'Secondary mobile number is required';
    } else if (!/^\d+$/.test(formData.secondary_mno)) {
      newErrors.secondary_mno = 'Secondary mobile number must be numeric';
    }

    if (!formData.home_mno) {
      newErrors.home_mno = 'Home mobile number is required';
    } else if (!/^\d+$/.test(formData.home_mno)) {
      newErrors.home_mno = 'Home mobile number must be numeric';
    }

    if (!formData.work_id) {
      newErrors.work_id = 'Work ID is required';
    }

    
    if (!isEditMode && !formData.photo) {
      newErrors.photo = 'Photo is required';
    }

    if (!user?.id) {
      newErrors.userId = 'User authentication required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    
    const employeeData = {
      ...formData,
      userId: user.id
    };

  
    if (isEditMode && !formData.photo) {
      delete employeeData.photo;
    }

   

    try {
      if (onNext) {
        await onNext(employeeData);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter full name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="perment_address" className="block text-sm font-medium text-gray-700 mb-1">
            Permanent Address *
          </label>
          <textarea
            id="perment_address"
            name="perment_address"
            value={formData.perment_address}
            onChange={handleInputChange}
            disabled={disabled}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.perment_address ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter permanent address"
          />
          {errors.perment_address && <p className="mt-1 text-sm text-red-500">{errors.perment_address}</p>}
        </div>

        <div>
          <label htmlFor="current_address" className="block text-sm font-medium text-gray-700 mb-1">
            Current Address *
          </label>
          <textarea
            id="current_address"
            name="current_address"
            value={formData.current_address}
            onChange={handleInputChange}
            disabled={disabled}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.current_address ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter current address"
          />
          {errors.current_address && <p className="mt-1 text-sm text-red-500">{errors.current_address}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="primary_mno" className="block text-sm font-medium text-gray-700 mb-1">
              Primary Mobile *
            </label>
            <input
              type="text"
              id="primary_mno"
              name="primary_mno"
              value={formData.primary_mno}
              onChange={handleInputChange}
              disabled={disabled}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.primary_mno ? 'border-red-500' : 'border-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Primary mobile"
            />
            {errors.primary_mno && <p className="mt-1 text-sm text-red-500">{errors.primary_mno}</p>}
          </div>

          <div>
            <label htmlFor="secondary_mno" className="block text-sm font-medium text-gray-700 mb-1">
              Secondary Mobile *
            </label>
            <input
              type="text"
              id="secondary_mno"
              name="secondary_mno"
              value={formData.secondary_mno}
              onChange={handleInputChange}
              disabled={disabled}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.secondary_mno ? 'border-red-500' : 'border-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Secondary mobile"
            />
            {errors.secondary_mno && <p className="mt-1 text-sm text-red-500">{errors.secondary_mno}</p>}
          </div>

          <div>
            <label htmlFor="home_mno" className="block text-sm font-medium text-gray-700 mb-1">
              Home Mobile *
            </label>
            <input
              type="text"
              id="home_mno"
              name="home_mno"
              value={formData.home_mno}
              onChange={handleInputChange}
              disabled={disabled}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.home_mno ? 'border-red-500' : 'border-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Home mobile"
            />
            {errors.home_mno && <p className="mt-1 text-sm text-red-500">{errors.home_mno}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="work_id" className="block text-sm font-medium text-gray-700 mb-1">
            Work Place *
          </label>
          <select
            id="work_id"
            name="work_id"
            value={formData.work_id}
            onChange={handleInputChange}
            disabled={disabled || workLoading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.work_id ? 'border-red-500' : 'border-gray-300'
            } ${disabled || workLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">
              {workLoading ? 'Loading work places...' : 'Select work place'}
            </option>
            {works.map((work) => (
              <option key={work._id} value={work._id}>
                {work.work_place_name}
              </option>
            ))}
          </select>
          {errors.work_id && <p className="mt-1 text-sm text-red-500">{errors.work_id}</p>}
        </div>

        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
            Photo {!isEditMode && '*'}
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            onChange={handleFileChange}
            accept="image/*"
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.photo ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {errors.photo && <p className="mt-1 text-sm text-red-500">{errors.photo}</p>}
          {formData.photo && typeof formData.photo === 'object' && (
            <p className="mt-1 text-sm text-green-600">
              Selected: {formData.photo.name}
            </p>
          )}
          {formData.photo && typeof formData.photo === 'string' && (
            <p className="mt-1 text-sm text-blue-600">
              Current photo available
            </p>
          )}
          {isEditMode && !formData.photo && (
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to keep current photo
            </p>
          )}
        </div>

        {errors.userId && <p className="text-sm text-red-500">{errors.userId}</p>}

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={handleCancel}
            disabled={disabled}
            className={`px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={disabled}
            className={`px-6 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              disabled 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {disabled ? 'Processing...' : (isEditMode ? 'Update' : 'Submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm;