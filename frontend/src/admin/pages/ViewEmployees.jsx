import React, { useState, useEffect } from "react";
import { Users, Loader2, CheckCircle, XCircle, Trash2, Search, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useNavigate } from "react-router-dom";
import gif from '/assets/Animation - 1747722366024.gif';

import useAuthStore from '../../app/authStore';
import useEmployeeStore from "@/app/EmployeeStore";

export default function ViewPendingEmployee() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const {
    pendingEmployees,
    loading,
    error,
    approveEmployee,
    rejectEmployee,
    fetchAllPendingEmployees,
    deletePendingEmployee,
    clearError,
  } = useEmployeeStore();

  const [success, setSuccess] = useState(false);
  const [reply, setReply] = useState(""); 

  const [successMessage, setSuccessMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(null); 
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const base_url = import.meta.env.VITE_BASE_URL;
  const { user } = useAuthStore();

  
  const confirmApprove = async () => {
    if (selectedUser) {
      setActionLoading(selectedUser._id);
      const result = await approveEmployee(selectedUser._id);
      if (result) {
        setSuccess(true);
        setSuccessMessage(`Employee ${selectedUser.name} approved successfully`);
        setTimeout(() => {
          setSuccess(false);
          navigate('/admin/viewapprovedemployee');
        }, 2000);
      }
      setActionLoading(null);
    }
    closeModals();
  };

  const confirmReject = async () => {
  if (selectedUser) {
    setActionLoading(selectedUser._id);
    const result = await rejectEmployee(selectedUser._id, reply.trim());
    if (result) {
      setSuccess(true);
      setSuccessMessage(`Employee ${selectedUser.name} rejected successfully`);
      setTimeout(() => {
          setSuccess(false);
          navigate('/admin/viewrejectedemployee');
        }, 2000);
      }
    setActionLoading(null);
  }
  closeModals();
};


  const confirmDelete = async () => {
    if (selectedUser) {
      setActionLoading(selectedUser._id);
      const result = await deletePendingEmployee(selectedUser._id);
      if (result) {
        setSuccess(true);
        setSuccessMessage(`Employee ${selectedUser.employData?.id?.name} deleted successfully`);
        setTimeout(() => setSuccess(false), 3000);
      }
      setActionLoading(null);
    }
    closeModals();
  };

 
  useEffect(() => {
   
      fetchAllPendingEmployees();
   
  }, [ fetchAllPendingEmployees]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  
  const handleApprove = (user) => {
    setSelectedUser(user);
    setIsApproveModalOpen(true);
  };

  const handleReject = (user) => {
    setSelectedUser(user);
    setIsRejectModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsApproveModalOpen(false);
    setIsRejectModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
     setReply("");
  };

  const handleViewDetails = (userId) => {
    navigate(`/admin/adminemployeeview/${userId}`);
  };


 const filteredUsers = pendingEmployees.filter(user => {
  return (
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.primary_mno?.toString().includes(searchTerm) ||
    user.secondary_mno?.toString().includes(searchTerm) ||
    user.home_mno?.toString().includes(searchTerm)
  );
});



  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {success && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert className="mb-6 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Pending Users Table */}
        <div className="rounded-lg border shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Pending Employees ({filteredUsers.length})
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
                  Loading pending employees...
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'No matching pending employees found' : 'No pending employees found'}
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
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              {user.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Button
                                onClick={() => handleApprove(user)}
                                variant="outline"
                                size="sm"
                                disabled={actionLoading === user._id}
                                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                              >
                                {actionLoading === user._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleReject(user)}
                                variant="outline"
                                size="sm"
                                disabled={actionLoading === user._id}
                                className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                              >
                                {actionLoading === user._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4 mr-1" />
                                )}
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleViewDetails(employee._id)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                View Details
                              </Button>
                              <Button
                                onClick={() => handleDelete(user)}
                                variant="outline"
                                size="sm"
                                disabled={actionLoading === user._id}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                {actionLoading === user._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4 mr-1" />
                                )}
                                Delete
                              </Button>
                            </div>
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

      {/* Approve Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Approve Employee
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to approve employee "{selectedUser?.name}"?
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                onClick={closeModals}
                variant="outline"
                className="px-4 py-2"
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  'Approve Employee'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

   {isRejectModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Reject Employee
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Are you sure you want to reject employee "{selectedUser?.name}"?
      </p>

      {/* Reply Textarea */}
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Enter reason for rejection"
        className="w-full px-3 py-2 border rounded-md mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        rows={3}
      />

      <div className="flex justify-end space-x-3">
        <Button
          onClick={closeModals}
          variant="outline"
          className="px-4 py-2"
          disabled={actionLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={confirmReject}
          disabled={actionLoading || !reply.trim()}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white"
        >
          {actionLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Rejecting...
            </>
          ) : (
            'Reject Employee'
          )}
        </Button>
      </div>
    </div>
  </div>
)}


      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Delete Employee
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete employee "{selectedUser?.employData?.id?.name}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                onClick={closeModals}
                variant="outline"
                className="px-4 py-2"
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
              >
                {actionLoading ? (
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