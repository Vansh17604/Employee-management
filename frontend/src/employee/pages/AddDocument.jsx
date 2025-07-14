import React, { useState, useEffect } from "react";
import { Users, Loader2, Edit, Trash2, Search, Plus, ChevronDown, FileText, CreditCard, Building, UserPlus, Power } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import gif from '/assets/Animation - 1747722366024.gif';

import useEmployeeStore from '../../app/EmployeeStore';
import useAuthStore from '../../app/authStore';

export default function ViewApprovalEmployees() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  const [success, setSuccess] = useState(false);
  const [toggleSuccess, setToggleSuccess] = useState(false);

  const base_url = import.meta.env.VITE_BASE_URL;
  
  const { 
    loading, 
    error, 
    approvedEmployees, 
    deleteEmployee,
    fetchApprovedEmployeesByUserId,
    updateEmployeeWorkstatus,
    clearError 
  } = useEmployeeStore();

  const { user } = useAuthStore();

  useEffect(() => {
    clearError();
      
    if (user && user?.id) {
      fetchApprovedEmployeesByUserId(user?.id);
    }
  }, [clearError, fetchApprovedEmployeesByUserId, user]);

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

  useEffect(() => {
    if (toggleSuccess) {
      const resetTimer = setTimeout(() => {
        setToggleSuccess(false);
      }, 2500);

      return () => {
        clearTimeout(resetTimer);
      };
    }
  }, [toggleSuccess]);

  const handleEdit = (employee) => {
    navigate(`/employee/addemployeeandedit/${employee._id}?type=approveemployeeedit`);
  };
  
  const handleToggleStatus = async (employee) => {
    const currentStatus = employee.workstatus?.toLowerCase();
    const newStatus = currentStatus === "active" ? "Inactive" : "Active";

    const success = await updateEmployeeWorkstatus(employee._id, newStatus);

    if (success) {
      setToggleSuccess(true);
      if (user && user?.id) {
        fetchApprovedEmployeesByUserId(user?.id);
      }
    }
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };
    const handleViewDetils=(employee)=>{
    navigate(`/employee/employeeview/${employee._id}?type=approve`);
  }

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    const success = await deleteEmployee(selectedEmployee._id);
    
    if (success) {
      setSuccess(true);
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
      if (user && user?.id) {
        fetchApprovedEmployeesByUserId(user?.id);
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

  const handleViewDetails = (employee) => {
    navigate(`/employee/employeedetails/${employee._id}`);
  };

  const filteredEmployees = approvedEmployees.filter(employee => {
    const matchesSearch = employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.primary_mno?.toString().includes(searchTerm) ||
                         employee.secondary_mno?.toString().includes(searchTerm) ||
                         employee.home_mno?.toString().includes(searchTerm);
    
    const matchesStatus = selectedStatus === "all" || employee.status?.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

 

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

        {toggleSuccess && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
            <AlertDescription>
              Employee work status updated successfully!
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

        
        
        <div className="rounded-lg border shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">All Approved Employees</h3>
          
            <div className="mt-4 flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
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
                  Loading approved employees...
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
                      Mobile No
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No approved employees found
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee, index) => (
                      <tr key={employee._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {index + 1}
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
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <div>{employee.primary_mno || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <div>{employee.perment_address || 'N/A'}</div>
                          </div>
                          </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <div>{employee.work_id.work_place_name|| 'N/A'}</div>
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
                            {employee.status || 'N/A'}
                          </span>
                        </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex items-center space-x-3">
    <button
      onClick={() => handleViewDetails(employee)}
      className="flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      title="Add Document"
    >
      <FileText className="h-4 w-4" />
      <span>Add Document</span>
    </button>
   
   
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

   
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete employee "{selectedEmployee?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteEmployee}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

