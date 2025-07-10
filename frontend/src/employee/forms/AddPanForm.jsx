import React, { useState, useEffect } from 'react';

const AddPanCardForm = ({ onNext, onCancel, initialData, disabled }) => {
  const [formData, setFormData] = useState({
    pan_name: '',
    pan_no: '',
    pan_card: null
  });

  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(initialData);

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        pan_name: initialData.pan_name || '',
        pan_no: initialData.pan_no || '',
        pan_card: initialData.pan_card || null
      });
    } else {
      // Reset form data for new PAN
      setFormData({
        pan_name: '',
        pan_no: '',
        pan_card: null
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
      pan_card: file
    }));
    
    if (errors.pan_card) {
      setErrors(prev => ({
        ...prev,
        pan_card: ''
      }));
    }
  };

  const validatePanNumber = (panNo) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(panNo.toUpperCase());
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pan_name) {
      newErrors.pan_name = 'PAN name is required';
    }

    if (!formData.pan_no) {
      newErrors.pan_no = 'PAN number is required';
    } else if (!validatePanNumber(formData.pan_no)) {
      newErrors.pan_no = 'Invalid PAN format (e.g., ABCDE1234F)';
    }

    if (!isEditMode && !formData.pan_card) {
      newErrors.pan_card = 'PAN card is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const panData = {
      pan_name: formData.pan_name,
      pan_no: formData.pan_no.toUpperCase(),
      pan_card: formData.pan_card
    };

    // If editing and no new photo selected, remove photo from data
    if (isEditMode && !formData.pan_card) {
      delete panData.pan_card;
    }

    try {
      if (onNext) {
        await onNext(panData);
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
          src="/assets/pan (2).svg" 
          alt="PAN Card" 
          className="w-8 h-8 mr-3"
        />
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit PAN Card' : 'Add PAN Card'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* PAN Name */}
        <div>
          <label htmlFor="pan_name" className="block text-sm font-medium text-gray-700 mb-1">
            Name as on PAN *
          </label>
          <input
            type="text"
            id="pan_name"
            name="pan_name"
            value={formData.pan_name}
            onChange={handleInputChange}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.pan_name ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter name as on PAN card"
          />
          {errors.pan_name && <p className="mt-1 text-sm text-red-500">{errors.pan_name}</p>}
        </div>

        {/* PAN Number */}
        <div>
          <label htmlFor="pan_no" className="block text-sm font-medium text-gray-700 mb-1">
            PAN Number *
          </label>
          <input
            type="text"
            id="pan_no"
            name="pan_no"
            value={formData.pan_no}
            onChange={handleInputChange}
            disabled={disabled}
            maxLength={10}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.pan_no ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter PAN number (e.g., ABCDE1234F)"
            style={{ textTransform: 'uppercase' }}
          />
          {errors.pan_no && <p className="mt-1 text-sm text-red-500">{errors.pan_no}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Format: 5 letters + 4 numbers + 1 letter (e.g., ABCDE1234F)
          </p>
        </div>

        {/* PAN Card Upload */}
        <div>
          <label htmlFor="pan_card" className="block text-sm font-medium text-gray-700 mb-1">
            PAN Card Image {!isEditMode && '*'}
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
                  htmlFor="pan_card"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload PAN card</span>
                  <input
                    id="pan_card"
                    name="pan_card"
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
          {errors.pan_card && <p className="mt-1 text-sm text-red-500">{errors.pan_card}</p>}
          {formData.pan_card && typeof formData.pan_card === 'object' && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Selected: {formData.pan_card.name}
              </p>
            </div>
          )}
          {formData.pan_card && typeof formData.pan_card === 'string' && (
            <p className="mt-1 text-sm text-blue-600">
              Current PAN card available
            </p>
          )}
          {isEditMode && !formData.pan_card && (
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to keep current PAN card
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
                  <li>Ensure the PAN card image is clear and readable</li>
                  <li>The name should match exactly as printed on the PAN card</li>
                  <li>PAN number format: 5 letters + 4 numbers + 1 letter</li>
                  <li>Double-check the PAN number for accuracy</li>
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

export default AddPanCardForm;