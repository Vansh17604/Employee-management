import React, { useState, useEffect } from "react";
import { FileText, Search, CreditCard, Building, IdCard, Edit, Eye } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import gif from '/assets/Animation - 1747722366024.gif';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";

import useAadharStore from '../../app/aadharStore';
import usePanStore from '../../app/panStore';
import useBankdetailStore from '../../app/bankdetailStore';
import useAuthStore from '../../app/authStore';

export default function AdminApprovedDocuments() {
  const [activeTab, setActiveTab] = useState("aadhar");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const base_url = import.meta.env.VITE_BASE_URL;
  
  const { 
    loading: aadharLoading, 
    error: aadharError, 
    approvedAadhars, 
    fetchAllApprovedAadhar,
    clearError: clearAadharError 
  } = useAadharStore();

  const { 
    loading: panLoading, 
    error: panError, 
    approvedPans, 
    fetchAllApprovedPans,
    clearError: clearPanError 
  } = usePanStore();

  // Bank Details Store
  const { 
    loading: bankLoading, 
    error: bankError, 
    approvedBankDetails, 
    fetchAllApprovedBankDetails,
    clearError: clearBankError 
  } = useBankdetailStore();

  const { user } = useAuthStore();

  // On component load
  useEffect(() => {
    
    clearAadharError();
    clearPanError();
    clearBankError();
      
  
      fetchAllApprovedAadhar();
      fetchAllApprovedBankDetails();
      fetchAllApprovedPans();
    
  }, [clearAadharError, clearPanError, clearBankError, fetchAllApprovedAadhar, fetchAllApprovedPans, fetchAllApprovedBankDetails]);

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



  const handleViewDetails = (item) => {
    if (item && item._id) {
      switch (activeTab) {
        case 'aadhar':
          navigate(`/admin/adminaddhar/${item._id}?type=Aprov`);
          break;
        case 'pan':
          navigate(`/admin/adminpan/${item._id}?type=Aprov`);
          break;
        case 'bank':
          navigate(`/admin/adminbankdetails/${item._id}?type=Aprov`);
          break;
        default:
          break;
      }
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'aadhar':
        return approvedAadhars || [];
      case 'pan':
        return approvedPans || [];
      case 'bank':
        return approvedBankDetails || [];
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

  const renderTableRows = () => {
    if (filteredData.length === 0) {
      return (
        <tr>
          <td colSpan="11" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
            No approved {activeTab} documents found
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
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {item.status || 'Approved'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                
                  <Button
                    onClick={() => handleViewDetails(item)}
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
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
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {item.status || 'Approved'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
               
                  <Button
                    onClick={() => handleViewDetails(item)}
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
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
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {item.status || 'Approved'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                
                  <Button
                    onClick={() => handleViewDetails(item)}
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
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

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600 dark:text-green-400'
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
              All Approved {tabs.find(t => t.id === activeTab)?.label}
            </h3>
          
            <div className="mt-4 flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search approved ${activeTab} documents...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                  Loading approved {activeTab} documents...
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
    </div>
  );
}