import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useEmployeeStore from '../../app/EmployeeStore';
import useAadharStore from '@/app/aadharStore';
import useBankdetailStore from '@/app/bankdetailStore';
import usePanStore from '@/app/panStore';

import { 
  CreditCard, 
  Building2, 
  FileText, 
  Eye, 
  Download,
  Loader2,
  AlertCircle,
  Plus,
  Edit
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const DocumentViewer = ({ imageUrl, title, onClose }) => {
  const base_url = import.meta.env.VITE_BASE_URL;
  const fullImageUrl = imageUrl?.startsWith('http') ? imageUrl : `${base_url}${imageUrl}`;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="p-4">
          <img 
            src={fullImageUrl} 
            alt={title} 
            className="max-w-full h-auto rounded-lg"
          />
        </div>
        <div className="p-4 border-t flex justify-end">
          <Button variant="outline" size="sm" onClick={() => window.open(fullImageUrl, '_blank')}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

const EmployeeDetailsView = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [aadhar, setAadhar] = useState(null);
  const [pan, setPan] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentViewer, setDocumentViewer] = useState(null);
  
  const base_url = import.meta.env.VITE_BASE_URL;
  
  // Get store functions and data
  const { fetchEmployeebyEmployeeId, pendingEmployees } = useEmployeeStore();
  const { fetchaadharbyempolyeeid, pendingAadhars } = useAadharStore();
  const { fetchpanbyemployeeid, pendingPans } = usePanStore();
  const { fetchbankdetailsnyemployeeid, pendingBankDetails } = useBankdetailStore();

  useEffect(() => {
    const fetchAllData = async () => {
      if (!employeeId) return;
      
      try {
        setLoading(true);
        setError(null);
        setEmployee(null);
        setAadhar(null);
        setPan(null);
        setBankDetails(null);
        
        const employeeData = await fetchEmployeebyEmployeeId(employeeId);
        if (employeeData) {
          setEmployee(employeeData);
        }
        

        await Promise.all([
          fetchaadharbyempolyeeid(employeeId),
          fetchpanbyemployeeid(employeeId),
          fetchbankdetailsnyemployeeid(employeeId)
        ]);
        
      } catch (err) {
        setError(err.message || 'Failed to fetch employee details');
        console.error('Error fetching employee data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [employeeId, fetchEmployeebyEmployeeId, fetchaadharbyempolyeeid, fetchpanbyemployeeid, fetchbankdetailsnyemployeeid]);

  
  useEffect(() => {
    if (pendingEmployees) {
      setEmployee(pendingEmployees);
    }
  }, [pendingEmployees]);

  useEffect(() => {
   
    if (pendingAadhars && pendingAadhars.length > 0) {
     
      const employeeAadhar = pendingAadhars.find(aadhar => 
        aadhar.employee_id?.employeeId === employeeId ||
        aadhar.employee_id?._id === employeeId
      );
      
      if (employeeAadhar) {
        setAadhar(employeeAadhar);
      } else {
        
        setAadhar(pendingAadhars[0]);
      }
    } else {
      setAadhar(null);
    }
  }, [pendingAadhars, employeeId]);

  useEffect(() => {
   
    if (pendingPans && pendingPans.length > 0) {
     const employeePan = pendingPans.find(pan => 
  pan.employee_id === employeeId ||
  pan.employee_id?.employeeId === employeeId ||
  pan.employee_id?._id === employeeId
);

      
      if (employeePan) {
        setPan(employeePan);
      } else {
     
        setPan(pendingPans[pendingPans.length - 1]);
      }
    } else {
      setPan(null);
    }
  }, [pendingPans, employeeId]);

useEffect(() => {
  
  if (pendingBankDetails && pendingBankDetails.length > 0) {
    const employeeBank = pendingBankDetails.find(
      (bank) =>
        bank.employee_id?.employeeId === employeeId || 
        bank.employee_id?._id === employeeId           
    );

    setBankDetails(employeeBank || pendingBankDetails[0]); 
  } else {
    setBankDetails(null);
  }
}, [pendingBankDetails, employeeId]);

  const openDocumentViewer = (imageUrl, title) => {
    setDocumentViewer({ imageUrl, title });
  };

  const handleDownload = (imageUrl, fileName) => {
    const fullImageUrl = imageUrl?.startsWith('http') ? imageUrl : `${base_url}${imageUrl}`;
    const link = document.createElement('a');
    link.href = fullImageUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

const handleAddDocument = (type) => {
  switch (type) {
    case 'aadhar':
      if (aadhar && aadhar._id) {
        navigate(`/employee/addaddharedit/${employeeId}/${aadhar._id}`);
      } else {
        navigate(`/employee/addaddharedit/${employeeId}`);
      }
      break;
    case 'pan':
      if (pan && pan._id) {
        navigate(`/employee/addpanaddandedit/${employeeId}/${pan._id}`);
      } else {
        navigate(`/employee/addpanaddandedit/${employeeId}`);
      }
      break;
    case 'bank':
      if (bankDetails && bankDetails._id) {
        navigate(`/employee/addbankdetailandedit/${employeeId}/${bankDetails._id}`);
      } else {
        navigate(`/employee/addbankdetailandedit/${employeeId}`);
      }
      break;
    default:
      break;
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading employee details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-500">{error}</span>
      </div>
    );
  }



  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Employee Documents</h1>
        <p className="text-gray-600">Document management for {employee?.name} (ID: {employeeId})</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Aadhar Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Aadhar Card
              </div>
              <Badge variant={aadhar?.aadhar_no ? 'default' : 'destructive'}>
                {aadhar?.aadhar_no ? 'Available' : 'Pending'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aadhar ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Aadhar Number:</span>
                    <span className="text-sm text-gray-600">{aadhar.aadhar_no || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm text-gray-600">{aadhar.aadhar_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={aadhar.status === 'Approved' ? 'default' : 'secondary'}>
                      {aadhar.status || 'Unknown'}
                    </Badge>
                  </div>
                </div>
                
                {aadhar.aadhar_card ? (
                  <div className="space-y-2">
                    <img 
                      src={`${base_url}${aadhar.aadhar_card}`} 
                      alt="Aadhar Card" 
                      className="w-full h-32 object-cover rounded cursor-pointer"
                      onClick={() => openDocumentViewer(aadhar.aadhar_card, 'Aadhar Card')}
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDocumentViewer(aadhar.aadhar_card, 'Aadhar Card')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(aadhar.aadhar_card, 'aadhar_card.jpg')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddDocument('aadhar')}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-2">
                      <span className="text-gray-500">No image available</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddDocument('aadhar')}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Aadhar Pending</p>
                <Button 
                  variant="default" 
                  onClick={() => handleAddDocument('aadhar')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Aadhar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

       
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                PAN Card
              </div>
              <Badge variant={pan?.pan_no ? 'default' : 'destructive'}>
                {pan?.pan_no ? 'Available' : 'Pending'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pan ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">PAN Number:</span>
                    <span className="text-sm text-gray-600">{pan.pan_no || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm text-gray-600">{pan.pan_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={pan.status === 'Approved' ? 'default' : 'secondary'}>
                      {pan.status || 'Unknown'}
                    </Badge>
                  </div>
                </div>
                
                {pan.pan_card ? (
                  <div className="space-y-2">
                    <img 
                      src={`${base_url}${pan.pan_card}`} 
                      alt="PAN Card" 
                      className="w-full h-32 object-cover rounded cursor-pointer"
                      onClick={() => openDocumentViewer(pan.pan_card, 'PAN Card')}
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDocumentViewer(pan.pan_card, 'PAN Card')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(pan.pan_card, 'pan_card.jpg')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddDocument('pan')}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-2">
                      <span className="text-gray-500">No image available</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddDocument('pan')}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">PAN Pending</p>
                <Button 
                  variant="default" 
                  onClick={() => handleAddDocument('pan')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add PAN
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

       
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Bank Details
              </div>
              <Badge variant={bankDetails?.bank_acc_no ? 'default' : 'destructive'}>
                {bankDetails?.bank_acc_no ? 'Available' : 'Pending'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bankDetails ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Account No:</span>
                    <span className="text-sm text-gray-600">{bankDetails.bank_acc_no || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Account Name:</span>
                    <span className="text-sm text-gray-600">{bankDetails.bank_acc_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Bank:</span>
                    <span className="text-sm text-gray-600">{bankDetails.bank_id?.bank_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">IFSC:</span>
                    <span className="text-sm text-gray-600">{bankDetails.ifsc_code || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={bankDetails.status === 'Approved' ? 'default' : 'secondary'}>
                      {bankDetails.status || 'Unknown'}
                    </Badge>
                  </div>
                </div>
                
                {bankDetails.passbook_image ? (
                  <div className="space-y-2">
                    <img 
                      src={`${base_url}${bankDetails.passbook_image}`} 
                      alt="Bank Passbook" 
                      className="w-full h-32 object-cover rounded cursor-pointer"
                      onClick={() => openDocumentViewer(bankDetails.passbook_image, 'Bank Passbook')}
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDocumentViewer(bankDetails.passbook_image, 'Bank Passbook')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(bankDetails.passbook_image, 'passbook.jpg')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddDocument('bank')}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-2">
                      <span className="text-gray-500">No image available</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddDocument('bank')}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Bank Details Pending</p>
                <Button 
                  variant="default" 
                  onClick={() => handleAddDocument('bank')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bank Details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {documentViewer && (
        <DocumentViewer 
          imageUrl={documentViewer.imageUrl}
          title={documentViewer.title}
          onClose={() => setDocumentViewer(null)}
        />
      )}
    </div>
  );
};

export default EmployeeDetailsView;