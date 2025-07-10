import React, { useState, useEffect } from "react";
import { Users, Loader2, Edit, Trash2, Search, Plus, ChevronDown, FileText, CreditCard, Building, UserPlus, Power } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import gif from '/assets/Animation - 1747722366024.gif';

import useEmployeeStore from '../../app/EmployeeStore';
import useAuthStore from '../../app/authStore';


export default function ViewEmployee() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  const [success, setSuccess] = useState(false);

  const base_url = import.meta.env.VITE_BASE_URL;
  
  const { 
    loading, 
    error, 
    userEmployees, 
    deleteEmployee,
    fetchEmployeesByUserId,
    updateEmployeeWorkstatus,
    clearError 
  } = useEmployeeStore();

  const { user } = useAuthStore();
  


  useEffect(() => {
    clearError();
      
    if (user && user?.id) {
      fetchEmployeesByUserId(user?.id);
    }
  }, [clearError, fetchEmployeesByUserId, user]);

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
  }, [success]);

  

  const handleEdit = (employee) => {
    navigate(`/employee/addemployeeandedit/${employee._id}`);
  };
  
 const handleToggleStatus = async (employee) => {
  const currentStatus = employee.workstatus?.toLowerCase();
  const newStatus = currentStatus === "active" ? "Inactive" : "Active";

  const success = await updateEmployeeWorkstatus(employee._id, newStatus); // Pass the new status here

  if (success) {
    setToggleSuccess(true);
    if (user && user?.id) {
      fetchEmployeesByUserId(user?.id);
    }
  }
};


  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    const success = await deleteEmployee(selectedEmployee._id);
    
    if (success) {
      setSuccess(true);
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
      if (user && user?.id) {
        fetchEmployeesByUserId(user?.id);
      }
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleAddEmployee = () => {
    navigate('/employee/addemployeeandedit');
  };
  const handleViewDetils=(employee)=>{
    navigate(`/employee/employeeview/${employee._id}`);
  }

  const filteredEmployees = userEmployees.filter(employee => {
    const matchesSearch = employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.primary_mno?.toString().includes(searchTerm) ||
                         employee.secondary_mno?.toString().includes(searchTerm) ||
                         employee.home_mno?.toString().includes(searchTerm);
    
    const matchesStatus = selectedStatus === "all" || employee.status?.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
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
        {success && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
            <AlertDescription>
              Employee deleted successfully!
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

        {/* Action Button - Only Add Employee */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Button
            onClick={handleAddEmployee}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Employees Table */}
        <div className="rounded-lg border shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white"> All Pending Employees</h3>
          
            <div className="mt-4 flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees by name or phone..."
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
                  Loading employees...
                </span>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                       No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                     Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                     Work Place
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Work Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No employees found
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee,index) => (
                      <tr key={employee._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {index+1 }
                          </div>
                        </td>
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
                          <div className="flex justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <div>{employee.primary_mno || 'N/A'}</div>
                           
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <div> {employee.perment_address || 'N/A'}</div>
                           
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <div>{employee.work_id.work_place_name || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.status?.toLowerCase() === 'approved' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : employee.status?.toLowerCase() === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {employee.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Button
                              onClick={() => handleToggleStatus(employee)}
                              disabled={loading}
                              variant="outline"
                              size="sm"
                              className={`${
                                employee.workstatus?.toLowerCase() === 'active' 
                                  ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:border-green-700'
                                  : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:border-red-700'
                              }`}
                            >
                              <Power className="h-4 w-4 mr-1" />
                              {employee.workstatus?.toLowerCase() === 'active' ? 'Active' : 'Inactive'}
                            </Button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleEdit(employee)}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                              <Button
                              onClick={() => handleViewDetils(employee)}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Delete Employee Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Delete Employee
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete employee "{selectedEmployee?.name}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                onClick={closeDeleteModal}
                variant="outline"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteEmployee}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Employee'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}