import React, { useState, useEffect } from "react";
import { Users, Loader2, Plus, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CustomInput } from "../components/Customes";
import { useNavigate } from "react-router-dom";

import useAdminStore from '../../app/adminStore';
import ViewUser from "./ViewUser";

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee" 
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  
  const { 
    loading, 
    error, 
    registerEmployee, 
    registerNormalEmployee,
    clearError 
  } = useAdminStore();

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
    
    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must not exceed 50 characters";
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    let success = false;
    
   
    if (formData.role === "employee") {
      success = await registerEmployee(formData.name, formData.email, formData.password);
    } else if (formData.role === "normalemployee") {
      success = await registerNormalEmployee(formData.name, formData.email, formData.password);
    }
    
    if (success) {
      setSuccess(true);
      handleClearForm();
    }
  };

  const handleClearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "employee"
    });
    setErrors({});
    clearError();
    setSuccess(false);
  };

  // Render error message component
  const ErrorMessage = ({ error }) => {
    return error ? <p className="text-xs mt-1 text-red-500 dark:text-red-400">{error}</p> : null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Add User
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {success && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
            <AlertDescription>
              User registered successfully!
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
        
        {/* User Form */}
        <div className="rounded-lg border shadow-sm p-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-2 text-gray-800 dark:text-white">
              User Information
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please fill in the user details below
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                Role <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                  errors.role ? "border-red-500 dark:border-red-400" : ""
                }`}
                required
              >
                <option value="employee">Edit </option>
                <option value="normalemployee">View</option>
              </select>
              <ErrorMessage error={errors.role} />
            </div>

            {/* Name Field */}
            <div>
              <CustomInput
                type="text"
                label="Full Name"
                id="name"
                name="name"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? "border-red-500 dark:border-red-400" : ""}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter user full name"
                required
              />
              <ErrorMessage error={errors.name} />
            </div>

            {/* Email Field */}
            <div>
              <CustomInput
                type="email"
                label="Email Address"
                id="email"
                name="email"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? "border-red-500 dark:border-red-400" : ""}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
              <ErrorMessage error={errors.email} />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                  Password <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    className={`w-full px-4 py-3 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                      errors.password ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <ErrorMessage error={errors.password} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                  Confirm Password <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                    className={`w-full px-4 py-3 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                      errors.confirmPassword ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <ErrorMessage error={errors.confirmPassword} />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 py-3 px-6 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Adding User...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add User
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
       
      </div>
       <ViewUser />
    </div>
  );
}