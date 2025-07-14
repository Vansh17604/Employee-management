import React, { useState, useEffect } from "react";
import { FileText, Search, CreditCard, Building, IdCard, Trash2, Check, X,Eye } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import gif from '/assets/Animation - 1747722366024.gif';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";

import useAadharStore from '../../app/aadharStore';
import usePanStore from '../../app/panStore';
import useBankdetailStore from '../../app/bankdetailStore';

export default function ViewEmployeePendingDocuments() {
  const [activeTab, setActiveTab] = useState("aadhar");
  const [searchTerm, setSearchTerm] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectItem, setRejectItem] = useState(null);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const navigate = useNavigate();

  const base_url = import.meta.env.VITE_BASE_URL;
  
  const { 
    loading: aadharLoading, 
    error: aadharError, 
    pendingAadhars, 
    fetchAllPendingAadhar,
    clearError: clearAadharError,
    approveAadhar,
    rejectAadhar,
    deleteAadhar
  } = useAadharStore();

  const { 
    loading: panLoading, 
    error: panError, 
    pendingPans, 
    fetchAllPendingPans,
    clearError: clearPanError,
    approvePan,
    rejectPan,
    deletePan
  } = usePanStore();

  const { 
    loading: bankLoading, 
    error: bankError, 
    pendingBankDetails, 
    fetchAllPendingBankDetails,
    clearError: clearBankError,
    approveBankDetail,
    rejectBankDetail,
    deleteBankDetail
  } = useBankdetailStore();

  useEffect(() => {
    clearAadharError();
    clearPanError();
    clearBankError();
      
    fetchAllPendingAadhar();
    fetchAllPendingPans();
    fetchAllPendingBankDetails();
  }, [clearAadharError, clearPanError, clearBankError, fetchAllPendingAadhar, fetchAllPendingPans, fetchAllPendingBankDetails]);

  useEffect(() => {
    if (aadharError) {
      const timer = setTimeout(() => {
        clearAadharError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [aadharError, clearAadharError]);

  useEffect(() => {
    if (panError) {
      const timer = setTimeout(() => {
        clearPanError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [panError, clearPanError]);

  useEffect(() => {
    if (bankError) {
      const timer = setTimeout(() => {
        clearBankError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [bankError, clearBankError]);

  const tabs = [
    { id: 'aadhar', label: 'Aadhar Documents', icon: '/assets/aadhaar.svg' },
    { id: 'pan', label: 'PAN Documents', icon: '/assets/pan (2).svg' },
    { id: 'bank', label: 'Bank Details', icon: '/assets/bank.svg' }
  ];

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      let result = false;
      
      switch (activeTab) {
        case 'aadhar':
          result = await deleteAadhar(item._id);
          break;
        case 'pan':
          result = await deletePan(item._id);
          break;
        case 'bank':
          result = await deleteBankDetail(item._id);
          break;
        default:
          break;
      }
      
      if (result) {
        // Refresh the data after successful deletion
        switch (activeTab) {
          case 'aadhar':
            fetchAllPendingAadhar();
            break;
          case 'pan':
            fetchAllPendingPans();
            break;
          case 'bank':
            fetchAllPendingBankDetails();
            break;
          default:
            break;
        }
      }
    }
  };

  const handleApprove = async (item) => {
    let result = false;
    
    switch (activeTab) {
      case 'aadhar':
        result = await approveAadhar(item._id);
        break;
      case 'pan':
        result = await approvePan(item._id);
        break;
      case 'bank':
        result = await approveBankDetail(item._id);
        break;
      default:
        break;
    }
    
    if (result) {
     
      switch (activeTab) {
        case 'aadhar':
          fetchAllPendingAadhar();
          break;
        case 'pan':
          fetchAllPendingPans();
          break;
        case 'bank':
          fetchAllPendingBankDetails();
          break;
        default:
          break;
      }
    }
  };

  const handleReject = (item) => {
    setRejectItem(item);
    setShowRejectModal(true);
  };

  const handleViewDetails = (item) => {
    if (item && item._id) {
      switch (activeTab) {
        case 'aadhar':
          navigate(`/admin/adminaddhar/${item._id}`);
          break;
        case 'pan':
          navigate(`/admin/adminpan/${item._id}`);
          break;
        case 'bank':
          navigate(`/admin/adminbankdetails/${item._id}`);
          break;
        default:
          break;
      }
    }
  };
  const handleRejectSubmit = async () => {
    if (!rejectRemarks.trim()) {
      alert('Please provide rejection remarks');
      return;
    }
    
    let result = false;
    
    switch (activeTab) {
      case 'aadhar':
        result = await rejectAadhar(rejectItem._id, rejectRemarks);
        break;
      case 'pan':
        result = await rejectPan(rejectItem._id, rejectRemarks);
        break;
      case 'bank':
        result = await rejectBankDetail(rejectItem._id, rejectRemarks);
        break;
      default:
        break;
    }

    
    if (result) {
      // Refresh the data after successful rejection
      switch (activeTab) {
        case 'aadhar':
          fetchAllPendingAadhar();
          break;
        case 'pan':
          fetchAllPendingPans();
          break;
        case 'bank':
          fetchAllPendingBankDetails();
          break;
        default:
          break;
      }
      
      setShowRejectModal(false);
      setRejectItem(null);
      setRejectRemarks("");
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'aadhar':
        return pendingAadhars || [];
      case 'pan':
        return pendingPans || [];
      case 'bank':
        return pendingBankDetails || [];
      default:
        return [];
    }
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'aadhar':
        return aadharLoading;
      case 'pan':
        return panLoading;
      case 'bank':
        return bankLoading;
      default:
        return false;
    }
  };

  const getCurrentError = () => {
    switch (activeTab) {
      case 'aadhar':
        return aadharError;
      case 'pan':
        return panError;
      case 'bank':
        return bankError;
      default:
        return null;
    }
  };

  const filteredData = getCurrentData().filter(item => {
    const searchLower = searchTerm.toLowerCase();
    switch (activeTab) {
      case 'aadhar':
        return item.aadhar_number?.toString().includes(searchLower) ||
               item.name?.toLowerCase().includes(searchLower) ||
               item.employee_id?.employeeId?.toLowerCase().includes(searchLower);
      case 'pan':
        return item.pan_number?.toLowerCase().includes(searchLower) ||
               item.name?.toLowerCase().includes(searchLower) ||
               item.employee_id?.employeeId?.toLowerCase().includes(searchLower);
      case 'bank':
        return item.account_number?.toString().includes(searchLower) ||
               item.account_holder_name?.toLowerCase().includes(searchLower) ||
               item.bank_name?.toLowerCase().includes(searchLower) ||
               item.employee_id?.employeeId?.toLowerCase().includes(searchLower);
      default:
        return true;
    }
  });

  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'aadhar':
        return (
          <>
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
              Work space
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Aadhar Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </>
        );
      case 'pan':
        return (
          <>
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
              Work space
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              PAN Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </>
        );
      case 'bank':
        return (
          <>
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
              Work space
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Account Holder Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Account Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Bank Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              IFSC Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </>
        );
      default:
        return null;
    }
  };

  const renderActionButtons = (item) => (
    <div className="flex space-x-2">
         <Button
                    onClick={() => handleViewDetails(item)}
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
      <Button
        onClick={() => handleDelete(item)}
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
      <Button
        onClick={() => handleApprove(item)}
        variant="outline"
        size="sm"
        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900"
      >
        <Check className="h-4 w-4 mr-1" />
        Approve
      </Button>
      <Button
        onClick={() => handleReject(item)}
        variant="outline"
        size="sm"
        className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900"
      >
        <X className="h-4 w-4 mr-1" />
        Reject
      </Button>
       
              

    </div>
  );

  const renderTableRows = () => {
    if (filteredData.length === 0) {
      return (
        <tr>
          <td colSpan="11" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
            No pending {activeTab} documents found
          </td>
        </tr>
      );
    }

    return filteredData.map((item, index) => {
      switch (activeTab) {
        case 'aadhar':
          return (
            <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {index + 1}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.employee_id?.employeeId || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {item.employee_id?.photo && (
                    <img
                      src={`${base_url}${item.employee_id?.photo}`}
                      alt={item.employee_id?.name}
                      className="h-8 w-8 rounded-full mr-3"
                    />
                  )}
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.employee_id?.name || 'N/A'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.employee_id?.work_id?.work_place_name || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.employee_id?.perment_address || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.aadhar_no || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status?.toLowerCase() === 'approved' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : item.status?.toLowerCase() === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {item.status || 'Pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderActionButtons(item)}
              </td>
            </tr>
          );
        case 'pan':
          return (
            <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {index + 1}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.employee_id?.employeeId || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {item.employee_id?.photo && (
                    <img
                      src={`${base_url}${item.employee_id?.photo}`}
                      alt={item.employee_id?.name}
                      className="h-8 w-8 rounded-full mr-3"
                    />
                  )}
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.employee_id?.name || 'N/A'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.employee_id?.work_id?.work_place_name || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.employee_id?.perment_address || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.pan_no || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status?.toLowerCase() === 'approved' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : item.status?.toLowerCase() === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {item.status || 'Pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderActionButtons(item)}
              </td>
            </tr>
          );
        case 'bank':
          return (
            <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {index + 1}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.employee_id?.employeeId || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {item.employee_id?.photo && (
                    <img
                      src={`${base_url}${item.employee_id.photo}`}
                      alt={item.employee_id?.name}
                      className="h-8 w-8 rounded-full mr-3"
                    />
                  )}
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.employee_id?.name || 'N/A'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.employee_id?.work_id?.work_place_name || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.employee_id?.perment_address || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.bank_acc_name || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.bank_acc_no || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.bank_id?.bank_name || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.ifsc_code || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status?.toLowerCase() === 'approved' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : item.status?.toLowerCase() === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {item.status || 'Pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderActionButtons(item)}
              </td>
            </tr>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {getCurrentError() && (
          <Alert className="mb-6 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700">
            <AlertDescription>
              {getCurrentError()}
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <img src={tab.icon} alt={tab.label} className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Documents Table */}
        <div className="rounded-lg border shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              All Employee Pending {tabs.find(t => t.id === activeTab)?.label}
            </h3>
          
            <div className="mt-4 flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab} documents...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {getCurrentLoading() ? (
              <div className="flex justify-center items-center py-16 bg-white dark:bg-gray-800">
                <img
                  src={gif}
                  alt="Loading..."
                  className="h-16 w-16"
                />
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  Loading all {activeTab} documents...
                </span>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {renderTableHeaders()}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {renderTableRows()}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

         {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Reject Document</h2>
            <textarea
              placeholder="Enter rejection remarks..."
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={4}
            />
            <div className="flex justify-end mt-4 space-x-3">
              <Button
                variant="outline"
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectItem(null);
                  setRejectRemarks('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleRejectSubmit}
              >
                Submit Rejection
              </Button>
               
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
