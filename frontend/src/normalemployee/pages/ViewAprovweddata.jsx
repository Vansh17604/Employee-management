import React, { useState, useEffect } from "react";
import { Users, Search, AlertCircle, CheckCircle, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useNavigate } from "react-router-dom";
import gif from '/assets/Animation - 1747722366024.gif';

import useAuthStore from '../../app/authStore';
import useEmployeeStore from "@/app/EmployeeStore";

export default function ViewAprovweddata() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const {
    approvedEmployees,
    loading,
    error,
    fetchAllApprovedEmployees,
    clearError,
  } = useEmployeeStore();

  const base_url = import.meta.env.VITE_BASE_URL;
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      fetchAllApprovedEmployees();
    }
  }, [fetchAllApprovedEmployees]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleViewDetails = (id) => {
    navigate(`/normalemployee/normalemployeeview/${id}`);
  };


  const filteredUsers = approvedEmployees.filter(user => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.primary_mno?.toString().includes(searchTerm) ||
      user.secondary_mno?.toString().includes(searchTerm) ||
      user.home_mno?.toString().includes(searchTerm)
    );
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center py-16 bg-white dark:bg-gray-800">
        <img
          src={gif}
          alt="Loading..."
          className="h-16 w-16"
        />
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading user data...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {error && (
          <Alert className="mb-6 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Approved Users Table */}
        <div className="rounded-lg border shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
                <Users className="h-5 w-5 mr-2" />
                View Employees ({filteredUsers.length})
              </h3>
           
            </div>
          
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees by name, ID, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
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
                  Loading approved employees...
                </span>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Primary Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Secondary Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Home Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'No matching approved employees found' : 'No approved employees found'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const employee = user;
                      if (!employee) return null;
                      
                      return (
                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {employee.employeeId || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {employee.photo && (
                                <img
                                  src={`${base_url}${employee.photo}`}
                                  alt={employee.name}
                                  className="h-8 w-8 rounded-full mr-3"
                                />
                              )}
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {employee.name || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {employee.primary_mno || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {employee.secondary_mno || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {employee.home_mno || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <Button
                                onClick={() => handleViewDetails(employee._id)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                          </td>
                          
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}