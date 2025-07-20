import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import useAadharStore from '../../app/aadharStore';
import usePanStore from '../../app/panStore';
import useBankdetailStore from '../../app/bankdetailStore';
import { 
  ArrowLeft,
  Loader2,
  AlertCircle,
  CreditCard,
  FileText,
  Landmark,
  X,
  RefreshCw,
  FileX
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const NormalDocumentView = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  
  const base_url = import.meta.env.VITE_BASE_URL;
  
  const [activeTab, setActiveTab] = useState('aadhar');
  const [aadhar, setAadhar] = useState(null);
  const [pan, setPan] = useState(null);
  const [bankDetail, setBankDetail] = useState(null);
  const [loading, setLoading] = useState({
    aadhar: false,
    pan: false,
    bank: false
  });
  const [error, setError] = useState({
    aadhar: null,
    pan: null,
    bank: null
  });
  const [showFullImage, setShowFullImage] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [dataFetched, setDataFetched] = useState({
    aadhar: false,
    pan: false,
    bank: false
  });

  const { fetchApprovedAadharByEmployeeId } = useAadharStore();
  const { fetchApprovedPanByEmployeeId } = usePanStore();
  const { fetchApprovedBankDetailsByEmployeeId } = useBankdetailStore();

  const fetchAadharData = async () => {
    if (!employeeId) return;
    
    setLoading(prev => ({ ...prev, aadhar: true }));
    setError(prev => ({ ...prev, aadhar: null }));
    
    try {
      const aadharData = await fetchApprovedAadharByEmployeeId(employeeId);
      
     if (Array.isArray(aadharData) && aadharData.length > 0) {
  setAadhar(aadharData[0]);
}
      setDataFetched(prev => ({ ...prev, aadhar: true }));
    } catch (err) {
      setError(prev => ({ ...prev, aadhar: err.message || 'Failed to fetch Aadhar details' }));
      console.error('Error fetching Aadhar data:', err);
    } finally {
      setLoading(prev => ({ ...prev, aadhar: false }));
    }
   
  };

  const fetchPanData = async () => {
    if (!employeeId) return;
    
    setLoading(prev => ({ ...prev, pan: true }));
    setError(prev => ({ ...prev, pan: null }));
    
    try {
      const panData = await fetchApprovedPanByEmployeeId(employeeId);
       if (Array.isArray(panData) && panData.length > 0) {
        setPan(panData[0]);
      }
      setDataFetched(prev => ({ ...prev, pan: true }));
    } catch (err) {
      setError(prev => ({ ...prev, pan: err.message || 'Failed to fetch PAN details' }));
      console.error('Error fetching PAN data:', err);
    } finally {
      setLoading(prev => ({ ...prev, pan: false }));
    }
  };

  const fetchBankData = async () => {
    if (!employeeId) return;
    
    setLoading(prev => ({ ...prev, bank: true }));
    setError(prev => ({ ...prev, bank: null }));
    
    try {
      const bankData = await fetchApprovedBankDetailsByEmployeeId(employeeId);
    if (Array.isArray(bankData) && bankData.length > 0) {
        setBankDetail(bankData[0]);
      }
      setDataFetched(prev => ({ ...prev, bank: true }));
    } catch (err) {
      setError(prev => ({ ...prev, bank: err.message || 'Failed to fetch Bank details' }));
      console.error('Error fetching Bank data:', err);
    } finally {
      setLoading(prev => ({ ...prev, bank: false }));
    }
  };

  useEffect(() => {
    // Fetch data based on active tab
    if (activeTab === 'aadhar' && !dataFetched.aadhar) {
      fetchAadharData();
    } else if (activeTab === 'pan' && !dataFetched.pan) {
      fetchPanData();
    } else if (activeTab === 'bank' && !dataFetched.bank) {
      fetchBankData();
    }
  }, [activeTab, employeeId]);

  const handleBack = () => {
    navigate('/normalemployee/viewapproveddata');
  };

  const handleRefresh = () => {
    if (activeTab === 'aadhar') {
      fetchAadharData();
    } else if (activeTab === 'pan') {
      fetchPanData();
    } else if (activeTab === 'bank') {
      fetchBankData();
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const openFullImage = (imageSrc) => {
    setCurrentImage(imageSrc);
    setShowFullImage(true);
  };

  const closeFullImage = () => {
    setShowFullImage(false);
    setCurrentImage('');
  };

  const tabs = [
    { id: 'aadhar', label: 'Aadhar Card', icon: CreditCard, color: 'text-orange-600' },
    { id: 'pan', label: 'PAN Card', icon: FileText, color: 'text-green-600' },
    { id: 'bank', label: 'Bank Details', icon: Landmark, color: 'text-purple-600' }
  ];

  const NoDataState = ({ type, onRefresh }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <FileX className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">No {type} Data Found</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        {type} information has not been entered or is not available for this employee.
      </p>
      <Button onClick={onRefresh} variant="outline" size="sm">
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>
  );

  const LoadingState = ({ message }) => (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      <span className="text-gray-600">{message}</span>
    </div>
  );

  const ErrorState = ({ error, onRefresh }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Data</h3>
      <p className="text-red-500 text-center mb-6 max-w-md">{error}</p>
      <Button onClick={onRefresh} variant="outline" size="sm">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );

  const DocumentTable = ({ children, title, icon: Icon, bgColor }) => (
    <Card className="h-full">
      <CardHeader className={bgColor}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon className="w-5 h-5 mr-2" />
            {title}
          </div>
          <Button onClick={handleRefresh} variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );

  const renderAadharContent = () => {
    if (loading.aadhar) return <LoadingState message="Loading Aadhar details..." />;
    if (error.aadhar) return <ErrorState error={error.aadhar} onRefresh={fetchAadharData} />;
    if (!aadhar) return <NoDataState type="Aadhar" onRefresh={fetchAadharData} />;

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="px-3 py-4 bg-gray-50 font-semibold w-full sm:w-1/3 block sm:table-cell">
                <span className="text-sm sm:text-base">Aadhar Card Image</span>
              </td>
              <td className="px-3 py-4 block sm:table-cell">
                <div className="flex items-center gap-4">
                  <img
                    src={`${base_url}${aadhar?.aadhar_card}`}
                    alt="Aadhar Card"
                    onClick={() => openFullImage(`${base_url}${aadhar?.aadhar_card}`)}
                    className="w-16 h-10 sm:w-20 sm:h-12 rounded object-cover border-2 border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <span className="text-xs sm:text-sm text-gray-500">Click to view full size</span>
                </div>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-4 bg-gray-50 font-semibold block sm:table-cell">
                <span className="text-sm sm:text-base">Name on Aadhar</span>
              </td>
              <td className="px-3 py-4 block sm:table-cell text-sm sm:text-base">{aadhar?.aadhar_name || 'N/A'}</td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-4 bg-gray-50 font-semibold block sm:table-cell">
                <span className="text-sm sm:text-base">Aadhar Number</span>
              </td>
              <td className="px-3 py-4 font-mono text-sm sm:text-base block sm:table-cell">{aadhar?.aadhar_no || 'N/A'}</td>
            </tr>
            <tr>
              <td className="px-3 py-4 bg-gray-50 font-semibold block sm:table-cell">
                <span className="text-sm sm:text-base">Status</span>
              </td>
              <td className="px-3 py-4 block sm:table-cell">
                <Badge className={`${getStatusColor(aadhar?.status)} border text-xs sm:text-sm`}>
                  {aadhar?.status || 'Unknown'}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderPanContent = () => {
    if (loading.pan) return <LoadingState message="Loading PAN details..." />;
    if (error.pan) return <ErrorState error={error.pan} onRefresh={fetchPanData} />;
    if (!pan) return <NoDataState type="PAN" onRefresh={fetchPanData} />;

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="px-3 py-4 bg-gray-50 font-semibold w-full sm:w-1/3 block sm:table-cell">
                <span className="text-sm sm:text-base">PAN Card Image</span>
              </td>
              <td className="px-3 py-4 block sm:table-cell">
                <div className="flex items-center gap-4">
                  <img
                    src={`${base_url}${pan?.pan_card}`}
                    alt="PAN Card"
                    onClick={() => openFullImage(`${base_url}${pan?.pan_card}`)}
                    className="w-16 h-10 sm:w-20 sm:h-12 rounded object-cover border-2 border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <span className="text-xs sm:text-sm text-gray-500">Click to view full size</span>
                </div>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-4 bg-gray-50 font-semibold block sm:table-cell">
                <span className="text-sm sm:text-base">Name on PAN</span>
              </td>
              <td className="px-3 py-4 block sm:table-cell text-sm sm:text-base">{pan?.pan_name || 'N/A'}</td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-4 bg-gray-50 font-semibold block sm:table-cell">
                <span className="text-sm sm:text-base">PAN Number</span>
              </td>
              <td className="px-3 py-4 font-mono tracking-wider text-sm sm:text-base block sm:table-cell">{pan?.pan_no || 'N/A'}</td>
            </tr>
            <tr>
              <td className="px-3 py-4 bg-gray-50 font-semibold block sm:table-cell">
                <span className="text-sm sm:text-base">Status</span>
              </td>
              <td className="px-3 py-4 block sm:table-cell">
                <Badge className={`${getStatusColor(pan?.status)} border text-xs sm:text-sm`}>
                  {pan?.status || 'Unknown'}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderBankContent = () => {
    if (loading.bank) return <LoadingState message="Loading Bank details..." />;
    if (error.bank) return <ErrorState error={error.bank} onRefresh={fetchBankData} />;
    if (!bankDetail) return <NoDataState type="Bank Details" onRefresh={fetchBankData} />;

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="px-3 py-4 bg-gray-50 font-semibold w-full sm:w-1/3 block sm:table-cell">
                <span className="text-sm sm:text-base">Passbook Image</span>
              </td>
              <td className="px-3 py-4 block sm:table-cell">
                <div className="flex items-center gap-4">
                  <img
                    src={`${base_url}${bankDetail?.passbook_image}`}
                    alt="Bank Passbook"
                    onClick={() => openFullImage(`${base_url}${bankDetail?.passbook_image}`)}
                    className="w-16 h-10 sm:w-20 sm:h-12 rounded object-cover border-2 border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <span className="text-xs sm:text-sm text-gray-500">Click to view full size</span>
                </div>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-4 bg-gray-50 font-semibold block sm:table-cell">
                <span className="text-sm sm:text-base">Account Name</span>
              </td>
              <td className="px-3 py-4 block sm:table-cell text-sm sm:text-base">{bankDetail?.bank_acc_name || 'N/A'}</td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-4 bg-gray-50 font-semibold block sm:table-cell">
                <span className="text-sm sm:text-base">Account Number</span>
              </td>
              <td className="px-3 py-4 font-mono text-sm sm:text-base block sm:table-cell">{bankDetail?.bank_acc_no || 'N/A'}</td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-4 bg-gray-50 font-semibold block sm:table-cell">
                <span className="text-sm sm:text-base">Branch Name</span>
              </td>
              <td className="px-3 py-4 block sm:table-cell text-sm sm:text-base">{bankDetail?.branch_name || 'N/A'}</td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-4 bg-gray-50 font-semibold block sm:table-cell">
                <span className="text-sm sm:text-base">IFSC Code</span>
              </td>
              <td className="px-3 py-4 font-mono text-sm sm:text-base block sm:table-cell">{bankDetail?.ifsc_code || 'N/A'}</td>
            </tr>
            <tr>
              <td className="px-3 py-4 bg-gray-50 font-semibold block sm:table-cell">
                <span className="text-sm sm:text-base">Status</span>
              </td>
              <td className="px-3 py-4 block sm:table-cell">
                <Badge className={`${getStatusColor(bankDetail?.status)} border text-xs sm:text-sm`}>
                  {bankDetail?.status || 'Unknown'}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-3 sm:p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold">Employee Documents</h1>
            <p className="text-sm sm:text-base text-gray-600">Document Verification Details</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                    ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : tab.color}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'aadhar' && (
          <DocumentTable 
            title="Aadhar Card Information" 
            icon={CreditCard} 
            bgColor="bg-orange-50"
          >
            {renderAadharContent()}
          </DocumentTable>
        )}

        {activeTab === 'pan' && (
          <DocumentTable 
            title="PAN Card Information" 
            icon={FileText} 
            bgColor="bg-green-50"
          >
            {renderPanContent()}
          </DocumentTable>
        )}

        {activeTab === 'bank' && (
          <DocumentTable 
            title="Bank Details Information" 
            icon={Landmark} 
            bgColor="bg-purple-50"
          >
            {renderBankContent()}
          </DocumentTable>
        )}
      </div>

      {/* Full Screen Image Modal */}
      {showFullImage && currentImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeFullImage}
        >
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <img
              src={currentImage}
              alt="Full Size Document"
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeFullImage}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NormalDocumentView;