import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useBankdetailStore from '../../app/bankdetailStore'; 
import { 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Building2,
  FileText,
  CreditCard
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const AdminBankdetailview = () => {
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
    navigate('/admin/viewpendingdoc');
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
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
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
            <h1 className="text-2xl font-bold text-gray-800">PAN Details</h1>
            <p className="text-gray-600">View PAN Information</p>
          </div>
        </div>
        
     
      </div>

      {/* Main Content Card */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center text-gray-800">
            <FileText className="w-5 h-5 mr-2" />
            PAN Card Information
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side - PAN Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900 font-medium">{pan?.pan_name || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600">PAN Number</label>
                      <p className="text-gray-900 font-medium tracking-wider">
                        {pan?.pan_no || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - PAN Card Image */}
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Uploaded Document</h3>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={`${base_url}${pan?.pan_card}`}
                    alt="PAN Card"
                    onClick={() => setShowFullImage(true)}
                    className="w-full max-w-sm h-auto rounded-lg object-cover border-2 border-gray-200 cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                  />
                </div>
                
                <div className="text-center mt-3">
                  <p className="text-sm text-gray-500">Click image to view full size</p>
                </div>
              </div>
            </div>
            
          </div>
        </CardContent>
      </Card>

      {/* Full Image Modal */}
      {showFullImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={`${base_url}${pan?.pan_card}`}
              alt="Full PAN Card"
              className="max-w-full max-h-full rounded-lg shadow-lg"
            />
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBankdetailview;