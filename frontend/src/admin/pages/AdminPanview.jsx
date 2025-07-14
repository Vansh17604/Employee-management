import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import usePanStore from '../../app/panStore';
import { useLocation } from 'react-router-dom';

import { 
  ArrowLeft,
  Loader2,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const AdminPanview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pan, setPan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  
  const base_url = import.meta.env.VITE_BASE_URL;
  const { fetchPanById ,fetchApprovedPanById} = usePanStore();

const location = useLocation();

useEffect(() => {
  const fetchPanData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams(location.search);
      const type = searchParams.get('type');

      let panData;

      if (type === 'Aprov') {
        panData = await fetchApprovedPanById(id);
      } else {
        panData = await fetchPanById(id);
      }

      if (panData) {
        setPan(panData);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch PAN details');
      console.error('Error fetching PAN data:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchPanData();
}, [id, location.search, fetchPanById, fetchApprovedPanById]);


 const handleBack = () => {
    navigate('/admin/viewpendingdoc');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading PAN details...</span>
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

  if (!pan && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="w-8 h-8 text-yellow-500" />
        <span className="ml-2 text-yellow-600">No PAN data found for ID: {id}</span>
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
            <h1 className="text-3xl font-bold">PAN Profile</h1>
            <p className="text-gray-600">PAN Card Information</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - PAN Card Design */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center justify-center">
              <CreditCard className="w-6 h-6 mr-2" />
              PAN Card Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-w-md mx-auto bg-sky-300 shadow-lg rounded-lg overflow-hidden" style={{ aspectRatio: '1.6/1' }}>
              {/* Main Content */}
              <div className="bg-sky-300 p-4 h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="text-black font-bold text-sm mb-1">आयकर विभाग</div>
                    <div className="text-black text-xs font-medium">INCOME TAX DEPARTMENT</div>
                  </div>
                  
                  {/* Government Logo */}
                  <div className="mx-4 flex items-center justify-center">
                    <div className="w-12 h-12  flex items-center justify-center">
                            <img
                          src="/assets/govermentofindia.svg"
                          alt="Government"
                          className="h-12"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                    
                    </div>
                  </div>
                  
                  <div className="text-right flex-1">
                    <div className="text-black font-bold text-sm mb-1">भारत सरकार</div>
                    <div className="text-black text-xs font-medium">GOVT. OF INDIA</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {/* Left side - Name bars */}
                  <div className="flex-1 space-y-2">
                     <div className="space-y-1 text-xs">
                      <div><span className="font-semibold">नाम/Name:</span></div>
                      <div className="font-bold text-black">{pan?.pan_name || 'N/A'}</div>
                      
                      
                    </div>
                    
                    <div className="h-3 bg-gray-600 rounded" style={{ width: '70%' }}></div>
                    <div className="h-3 bg-gray-600 rounded" style={{ width: '75%' }}></div>
                    
                    {/* PAN Number */}
                    <div className="mt-4">
                      <div className="text-black font-bold text-lg tracking-wider">
                        {pan?.pan_no || 'XXXXXXXXXX'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - QR Code and Photo */}
                  <div className="flex flex-col items-end space-y-2">
                 
                    
                    {/* Photo */}
                    <div className="w-16 h-16 bg-white border border-gray-300 flex items-center justify-center">
                      <div className="w-10 h-10  rounded-full flex items-center justify-center">
                        <img
                  src="/assets/person.svg"
                  alt="Person"
                  className="h-8"
                  onError={(e) => (e.target.style.display = "none")}
                />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Actual PAN Card Image */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center justify-center">
              <CreditCard className="w-6 h-6 mr-2" />
              Uploaded PAN Card
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={`${base_url}${pan?.pan_card}`}
                  alt="PAN Card"
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
                  src={`${base_url}${pan?.pan_card}`}
                  alt="Full PAN Card"
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

export default AdminPanview;