import React, { useState, useEffect } from 'react';
import useBankStore from '../../app/bankStore';

const AddBankDetailForm = ({ onNext, onCancel, initialData, disabled }) => {
  const { banks, loading: bankLoading, fetchBanks } = useBankStore();
  const [formData, setFormData] = useState({
    bank_acc_no: '',
    bank_acc_name: '',
    bank_id: '',
    branch_name: '',
    ifsc_code: '',
    passbook_image: null
  });

  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(initialData);

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        bank_acc_no: initialData.bank_acc_no || '',
        bank_acc_name: initialData.bank_acc_name || '',
        bank_id: initialData.bank_id || '',
        branch_name: initialData.branch_name || '',
        ifsc_code: initialData.ifsc_code || '',
        passbook_image: initialData.passbook_image || null
      });
    } else {
      // Reset form data for new bank detail
      setFormData({
        bank_acc_no: '',
        bank_acc_name: '',
        bank_id: '',
        branch_name: '',
        ifsc_code: '',
        passbook_image: null
      });
    }
  }, [initialData]);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

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
      passbook_image: file
    }));
    
    if (errors.passbook_image) {
      setErrors(prev => ({
        ...prev,
        passbook_image: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bank_acc_no) {
      newErrors.bank_acc_no = 'Bank account number is required';
    } else if (!/^\d+$/.test(formData.bank_acc_no)) {
      newErrors.bank_acc_no = 'Bank account number must be numeric';
    }

    if (!formData.bank_acc_name) {
      newErrors.bank_acc_name = 'Bank account name is required';
    }

    if (!formData.bank_id) {
      newErrors.bank_id = 'Bank name is required';
    }

    if (!formData.branch_name) {
      newErrors.branch_name = 'Branch name is required';
    }

    if (!formData.ifsc_code) {
      newErrors.ifsc_code = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code.toUpperCase())) {
      newErrors.ifsc_code = 'Invalid IFSC code format';
    }

    if (!isEditMode && !formData.passbook_image) {
      newErrors.passbook_image = 'Passbook image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const bankData = {
      bank_acc_no: formData.bank_acc_no,
      bank_acc_name: formData.bank_acc_name,
      bank_id: formData.bank_id,
      branch_name: formData.branch_name,
      ifsc_code: formData.ifsc_code.toUpperCase(),
      passbook_image: formData.passbook_image
    };

    // If editing and no new image selected, remove image from data
    if (isEditMode && !formData.passbook_image) {
      delete bankData.passbook_image;
    }

    try {
      if (onNext) {
        await onNext(bankData);
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
          src="/assets/bank.svg" 
          alt="Bank Details" 
          className="w-8 h-8 mr-3"
        />
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Bank Details' : 'Add Bank Details'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank Account Number */}
        
        {/* Account Holder Name */}
        <div>
          <label htmlFor="bank_acc_name" className="block text-sm font-medium text-gray-700 mb-1">
            Account Holder Name *
          </label>
          <input
            type="text"
            id="bank_acc_name"
            name="bank_acc_name"
            value={formData.bank_acc_name}
            onChange={handleInputChange}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.bank_acc_name ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter account holder name"
          />
          {errors.bank_acc_name && <p className="mt-1 text-sm text-red-500">{errors.bank_acc_name}</p>}
        </div><div>
          <label htmlFor="bank_acc_no" className="block text-sm font-medium text-gray-700 mb-1">
            Bank Account Number *
          </label>
          <input
            type="text"
            id="bank_acc_no"
            name="bank_acc_no"
            value={formData.bank_acc_no}
            onChange={handleInputChange}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.bank_acc_no ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter bank account number"
          />
          {errors.bank_acc_no && <p className="mt-1 text-sm text-red-500">{errors.bank_acc_no}</p>}
        </div>


        {/* Bank Selection */}
        <div>
          <label htmlFor="bank_id" className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name *
          </label>
          <select
            id="bank_id"
            name="bank_id"
            value={formData.bank_id}
            onChange={handleInputChange}
            disabled={disabled || bankLoading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.bank_id ? 'border-red-500' : 'border-gray-300'
            } ${disabled || bankLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">
              {bankLoading ? 'Loading banks...' : 'Select bank name'}
            </option>
            {banks && banks.length > 0 ? 
              banks.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.bank_name}
                </option>
              ))
            : null}
          </select>
          {errors.bank_id && <p className="mt-1 text-sm text-red-500">{errors.bank_id}</p>}
        </div>

        {/* Branch Name */}
        <div>
          <label htmlFor="branch_name" className="block text-sm font-medium text-gray-700 mb-1">
            Branch Name *
          </label>
          <input
            type="text"
            id="branch_name"
            name="branch_name"
            value={formData.branch_name}
            onChange={handleInputChange}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.branch_name ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter branch name"
          />
          {errors.branch_name && <p className="mt-1 text-sm text-red-500">{errors.branch_name}</p>}
        </div>

        {/* IFSC Code */}
        <div>
          <label htmlFor="ifsc_code" className="block text-sm font-medium text-gray-700 mb-1">
            IFSC Code *
          </label>
          <input
            type="text"
            id="ifsc_code"
            name="ifsc_code"
            value={formData.ifsc_code}
            onChange={handleInputChange}
            disabled={disabled}
            maxLength={11}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.ifsc_code ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter IFSC code (e.g., SBIN0001234)"
            style={{ textTransform: 'uppercase' }}
          />
          {errors.ifsc_code && <p className="mt-1 text-sm text-red-500">{errors.ifsc_code}</p>}
          <p className="mt-1 text-xs text-gray-500">
            11-character IFSC code (e.g., SBIN0001234)
          </p>
        </div>

        {/* Passbook Image Upload */}
        <div>
          <label htmlFor="passbook_image" className="block text-sm font-medium text-gray-700 mb-1">
            Passbook/Statement Image {!isEditMode && '*'}
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
                  htmlFor="passbook_image"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload passbook/statement</span>
                  <input
                    id="passbook_image"
                    name="passbook_image"
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
          {errors.passbook_image && <p className="mt-1 text-sm text-red-500">{errors.passbook_image}</p>}
          {formData.passbook_image && typeof formData.passbook_image === 'object' && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Selected: {formData.passbook_image.name}
              </p>
            </div>
          )}
          {formData.passbook_image && typeof formData.passbook_image === 'string' && (
            <p className="mt-1 text-sm text-blue-600">
              Current passbook image available
            </p>
          )}
          {isEditMode && !formData.passbook_image && (
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to keep current passbook image
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
                  <li>Ensure the passbook/statement image is clear and readable</li>
                  <li>Account holder name should match your official records</li>
                  <li>Double-check the account number and IFSC code for accuracy</li>
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

export default AddBankDetailForm;