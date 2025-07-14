import React, { useState, useEffect } from 'react';

const AddAadharCardForm = ({ onNext, onCancel, initialData, disabled }) => {
  const [formData, setFormData] = useState({
    aadhar_name: '',
    aadhar_no: '',
    aadhar_card: null
  });

  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(initialData);

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        aadhar_name: initialData.aadhar_name || '',
        aadhar_no: initialData.aadhar_no || '',
        aadhar_card: initialData.aadhar_card || null
      });
    } else {
      // Reset form data for new aadhar
      setFormData({
        aadhar_name: '',
        aadhar_no: '',
        aadhar_card: null
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
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
      aadhar_card: file
    }));
  
    if (errors.aadhar_card) {
      setErrors(prev => ({
        ...prev,
        aadhar_card: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.aadhar_name) {
      newErrors.aadhar_name = 'Aadhar name is required';
    }

    if (!formData.aadhar_no) {
      newErrors.aadhar_no = 'Aadhar number is required';
    } else if (!/^\d+$/.test(formData.aadhar_no)) {
      newErrors.aadhar_no = 'Aadhar number must be numeric';
    } 

    // Only require photo for new aadhar cards
    if (!isEditMode && !formData.aadhar_card) {
      newErrors.aadhar_card = 'Aadhar card is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const aadharData = { ...formData };

    // If editing and no new photo selected, remove photo from data
    if (isEditMode && !formData.aadhar_card) {
      delete aadharData.aadhar_card;
    }

    try {
      if (onNext) {
        await onNext(aadharData);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <img 
          src="/assets/aadhaar.svg" 
          alt="Aadhaar Card" 
          className="w-8 h-8 mr-3"
        />
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Aadhaar Card' : 'Add Aadhaar Card'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Aadhar Name */}
        <div>
          <label htmlFor="aadhar_name" className="block text-sm font-medium text-gray-700 mb-1">
            Name as on Aadhaar *
          </label>
          <input
            type="text"
            id="aadhar_name"
            name="aadhar_name"
            value={formData.aadhar_name}
            onChange={handleInputChange}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.aadhar_name ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter name as on Aadhaar card"
          />
          {errors.aadhar_name && <p className="mt-1 text-sm text-red-500">{errors.aadhar_name}</p>}
        </div>

        {/* Aadhar Number */}
        <div>
          <label htmlFor="aadhar_no" className="block text-sm font-medium text-gray-700 mb-1">
            Aadhaar Number *
          </label>
          <input
            type="text"
            id="aadhar_no"
            name="aadhar_no"
            value={formData.aadhar_no}
            onChange={handleInputChange}
            disabled={disabled}
            maxLength={12}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.aadhar_no ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter 12-digit Aadhaar number"
          />
          {errors.aadhar_no && <p className="mt-1 text-sm text-red-500">{errors.aadhar_no}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Enter 12-digit Aadhaar number without spaces or dashes
          </p>
        </div>

        {/* Aadhar Card Upload */}
        <div>
          <label htmlFor="aadhar_card" className="block text-sm font-medium text-gray-700 mb-1">
            Aadhaar Card Image {!isEditMode && '*'}
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="aadhar_card"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload Aadhaar card</span>
                  <input
                    id="aadhar_card"
                    name="aadhar_card"
                    type="file"
                    className="sr-only"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    disabled={disabled}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
          {errors.aadhar_card && <p className="mt-1 text-sm text-red-500">{errors.aadhar_card}</p>}
          {formData.aadhar_card && typeof formData.aadhar_card === 'object' && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Selected: {formData.aadhar_card.name}
              </p>
            </div>
          )}
          {formData.aadhar_card && typeof formData.aadhar_card === 'string' && (
            <p className="mt-1 text-sm text-blue-600">
              Current aadhar card available
            </p>
          )}
          {isEditMode && !formData.aadhar_card && (
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to keep current aadhar card
            </p>
          )}
        </div>

        {/* Information Note */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important Information
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ensure the Aadhaar card image is clear and readable</li>
                  <li>The name should match exactly as printed on the Aadhaar card</li>
                  <li>Double-check the Aadhaar number for accuracy</li>
                  <li>Your submission will be pending approval</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={handleCancelClick}
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
            {disabled ? 'Processing...' : (isEditMode ? 'Update' : 'Save & Next')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAadharCardForm;