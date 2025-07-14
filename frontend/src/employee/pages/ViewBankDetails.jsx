import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useBankdetailStore from '../../app/bankdetailStore'; // Assuming you have a similar store for bank details
import { useLocation } from 'react-router-dom';
import { 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Building2,
  CreditCard
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewBankDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bankDetail, setBankDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  
  const base_url = import.meta.env.VITE_BASE_URL;
  const { fetchBankDetailByItsId,fetchApprovedBankDetailById } = useBankdetailStore(); 

 const location = useLocation();
 
 useEffect(() => {
   const fetchBankData = async () => {
     if (!id) return;
 
     try {
       setLoading(true);
       setError(null);
 
       const searchParams = new URLSearchParams(location.search);
       const type = searchParams.get('type');
       let bankData;
 
       if (type === 'Aprov') {
         bankData = await fetchApprovedBankDetailById(id);
       } else {
         bankData = await fetchBankDetailByItsId(id);
       }
 
       if (bankData) {
         setBankDetail(bankData);
       }
     } catch (err) {
       setError(err.message || 'Failed to fetch bank details');
       console.error('Error fetching bank data:', err);
     } finally {
       setLoading(false);
     }
   };
 
   fetchBankData();
 }, [id, location.search, fetchBankDetailByItsId, fetchApprovedBankDetailById]);
 
  const handleBack = () => {
    navigate('/employee/viewpendingdocument');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading bank details...</span>
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

  if (!bankDetail && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="w-8 h-8 text-yellow-500" />
        <span className="ml-2 text-yellow-600">No bank details found for ID: {id}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
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
            <h1 className="text-3xl font-bold">Bank Details</h1>
            <p className="text-gray-600">Bank Account Information</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Bank Passbook Design */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center justify-center">
              <Building2 className="w-6 h-6 mr-2" />
              Bank Passbook Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-w-md mx-auto bg-pink-50 shadow-lg rounded-lg overflow-hidden border-2 border-pink-200">
              {/* Passbook Header */}
              <div className="bg-pink-100 p-4 border-b border-pink-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-pink-300 rounded-full flex items-center justify-center mr-3">
                      <Building2 className="w-5 h-5 text-pink-700" />
                    </div>
                    <div>
                      <div className="text-pink-800 font-bold text-sm">Bank of India</div>
                      <div className="text-pink-600 text-xs">Savings Account</div>
                    </div>
                  </div>
                  <div className="w-16 h-12 bg-white border border-pink-200 flex items-center justify-center rounded">
                    <div className="w-10 h-8 bg-pink-200 rounded flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-pink-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Passbook Content */}
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-gray-600 font-medium">A/c Name:</div>
                    <div className="text-gray-800 font-semibold text-sm break-words">
                      {bankDetail?.bank_acc_name || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 font-medium">A/c No:</div>
                    <div className="text-gray-800 font-semibold text-sm">
                      {bankDetail?.bank_acc_no || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-gray-600 font-medium">Branch:</div>
                    <div className="text-gray-800 font-semibold text-sm break-words">
                      {bankDetail?.branch_name || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 font-medium">IFSC Code:</div>
                    <div className="text-gray-800 font-semibold text-sm">
                      {bankDetail?.ifsc_code || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Passbook lines simulation */}
                <div className="pt-4 space-y-2">
                  <div className="text-xs text-gray-500 font-medium">Recent Transactions:</div>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>

                {/* Bank stamp area */}
                <div className="flex justify-end pt-2">
                  <div className="w-12 h-12 border-2 border-dashed border-pink-300 rounded-full flex items-center justify-center">
                    <div className="text-pink-400 text-xs font-bold">BANK</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Actual Passbook Image */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center justify-center">
              <CreditCard className="w-6 h-6 mr-2" />
              Uploaded Passbook
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={`${base_url}${bankDetail?.passbook_image}`}
                  alt="Bank Passbook"
                  onClick={() => setShowFullImage(true)}
                  className="w-full max-w-md h-auto rounded-lg object-cover border-4 border-blue-100 cursor-pointer hover:opacity-90 transition-opacity shadow-md"
                />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Click image to view full size</p>
              </div>
            </div>

            {/* Full Image Modal */}
            {showFullImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                onClick={() => setShowFullImage(false)}
              >
                <img
                  src={`${base_url}${bankDetail?.passbook_image}`}
                  alt="Full Bank Passbook"
                  className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
                />
                <button
                  onClick={() => setShowFullImage(false)}
                  className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 transition-colors"
                >
                  &times;
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewBankDetail;