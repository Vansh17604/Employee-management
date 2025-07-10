import React, { useState, useEffect } from "react";
import { Building2, Loader2, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CustomInput } from "../components/Customes";
import { useNavigate } from "react-router-dom";

import useBankStore from '../../app/bankStore';
import ViewBank from "./ViewBank"

export default function AddBank() {
  const [formData, setFormData] = useState({
    bank_name: ""
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  
  const { loading, error, createBank, clearError } = useBankStore();

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  useEffect(() => {
    // Handle success state
    if (success) {
      const resetTimer = setTimeout(() => {
        setSuccess(false);
      }, 2500);

      return () => {
        clearTimeout(resetTimer);
      };
    }
  }, [success, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bank_name) {
      newErrors.bank_name = "Bank name is required";
    } else if (formData.bank_name.length < 2) {
      newErrors.bank_name = "Bank name must be at least 2 characters";
    } else if (formData.bank_name.length > 100) {
      newErrors.bank_name = "Bank name must not exceed 100 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await createBank(formData.bank_name);
    
    if (success) {
      setSuccess(true);
      setFormData({
        bank_name: ""
      });
      setErrors({});
    }
  };

  const handleClearForm = () => {
    setFormData({
      bank_name: ""
    });
    setErrors({});
    clearError();
    setSuccess(false);
  };


  const ErrorMessage = ({ error }) => {
    return error ? <p className="text-xs mt-1 text-red-500 dark:text-red-400">{error}</p> : null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add Bank</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 max-w-6xl w-full mx-auto">
        {success && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
            <AlertDescription>
              Bank created successfully!
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
        
        <div className="rounded-lg border shadow-sm p-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-2 text-gray-800 dark:text-white">Bank Information</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Please enter the bank details below</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <CustomInput
                type="text"
                label="Bank Name"
                id="bank_name"
                name="bank_name"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bank_name ? "border-red-500 dark:border-red-400" : ""}`}
                value={formData.bank_name}
                onChange={handleChange}
                placeholder="Enter bank name"
                required
              />
              <ErrorMessage error={errors.bank_name} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 py-3 px-6 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating Bank...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Bank
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleClearForm}
                disabled={loading}
                className="flex-1 sm:flex-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 py-3 px-6 text-base"
              >
                Clear Form
              </Button>
            </div>
          </form>
        </div>
        <ViewBank/>
      </div>
      
    </div>
  );
}