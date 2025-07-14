import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useAadharStore from '../../app/aadharStore';
import { useLocation } from 'react-router-dom';
import { 
  ArrowLeft,
  Loader2,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const AdminAadharview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aadhar, setAadhar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  
  const base_url = import.meta.env.VITE_BASE_URL;
  const { fetchAadharByItsOwnId,fetchApprovedAadharById } = useAadharStore();



// Inside component
const location = useLocation();

useEffect(() => {
  const fetchAadharData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams(location.search);
      const type = searchParams.get('type');
      let aadharData;

      if (type === 'Aprov') {
        aadharData = await useAadharStore.getState().fetchApprovedAadharById(id);
      } else {
        aadharData = await fetchAadharByItsOwnId(id);
      }

      if (aadharData) {
        setAadhar(aadharData);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch Aadhar details');
      console.error('Error fetching Aadhar data:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchAadharData();
}, [id, location.search, fetchAadharByItsOwnId,fetchApprovedAadharById]);


  const handleBack = () => {
    navigate('/admin/viewpendingdoc');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading Aadhar details...</span>
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
            <h1 className="text-3xl font-bold">Aadhar Profile</h1>
            <p className="text-gray-600">Aadhar Information</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Aadhar Card Design */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center justify-center">
              <CreditCard className="w-6 h-6 mr-2" />
              Aadhar Card Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden" style={{ aspectRatio: '1.6/1' }}>
              {/* Top Header with Tricolor Bands */}
              <div className="relative">
                {/* Saffron Band */}
                <div className="h-6 bg-gradient-to-r from-orange-400 to-orange-500 relative">
                  <div className="absolute right-4 top-1 text-white font-bold text-sm">भारत सरकार</div>
                </div>
                
                {/* White Band */}
                <div className="h-6 bg-white relative flex items-center">
                  <div className="absolute left-4 flex items-center">
                    {/* Government Logo */}
                    <div className="w-8 h-16 flex items-center justify-center">
                      <div className="w-6 h-16  rounded-full flex items-center justify-center">
                        <img
                          src="/assets/govermentofindia.svg"
                          alt="Government"
                          className="h-8"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-4 text-black font-bold text-sm">GOVERNMENT OF INDIA</div>
                </div>
                
                {/* Green Band */}
                <div className="h-6 bg-gradient-to-r from-green-400 to-green-500"></div>
              </div>
              
              {/* Main Content */}
              <div className="bg-white p-4 flex">
                <img
                  src="/assets/person.svg"
                  alt="Person"
                  className="h-8"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <div className="w-20 h-24 border-2 border-blue-600 bg-gray-100 mr-4 flex-shrink-0">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-1"></div>
                      <div className="w-8 h-3 bg-gray-300 mx-auto"></div>
                    </div>
                  </div>
                </div>
                
                {/* Middle - Details */}
                <div className="flex-1 space-y-1 text-sm">
                  <div className="font-bold text-gray-800 mb-2">{aadhar?.aadhar_name || 'N/A'}</div>
                  <div><span className="font-semibold">Name:</span> {aadhar?.aadhar_name || 'N/A'}</div>
                
                </div>
                
                {/* Right Side - QR Code */}
                <div className="w-16 h-16  flex-shrink-0">
                  
                    <img
                      src="/assets/aadhaar.svg"
                      alt="Aadhaar"
                      className="h-16"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                 
                </div>
              </div>
              
              {/* Aadhaar Number */}
              <div className="bg-white px-4 py-2 text-center">
                <div className="text-xl font-bold text-black tracking-widest">
                  {aadhar?.aadhar_no || '0000 1111 2222'}
                </div>
              </div>
              
              {/* Bottom Red Band */}
              <div className="bg-red-600 text-white px-4 py-2 text-center">
                <div className="font-bold text-sm">
                  आधार - आम आदमी का अधिकार
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Actual Aadhar Card Image */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center justify-center">
              <CreditCard className="w-6 h-6 mr-2" />
              Uploaded Aadhar Card
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={`${base_url}${aadhar?.aadhar_card}`}
                  alt="Aadhar Card"
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
                  src={`${base_url}${aadhar?.aadhar_card}`}
                  alt="Full Aadhar Card"
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

export default AdminAadharview;