import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useAadharStore from '../../app/aadharStore';
import { useLocation } from 'react-router-dom';
import { 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Edit,
  FileText
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewAadhar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aadhar, setAadhar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  
  const base_url = import.meta.env.VITE_BASE_URL;
  const { fetchAadharByItsOwnId, fetchApprovedAadharById } = useAadharStore();
  
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
  }, [id, location.search, fetchAadharByItsOwnId, fetchApprovedAadharById]);

  const handleBack = () => {
    navigate('/employee/viewpendingdocument');
  };

 
     const handleEdit = () => {
      const searchParams = new URLSearchParams(location.search);
          const type = searchParams.get('type');
           const employeeId =  bankDetail?.employee_id;
  
          if(type== 'approve'){
         
             navigate(`/employee/addaddharedit/${employeeId}/${id}?type=approve`);
          }else{
    
       navigate(`/employee/addaddharedit/${employeeId}/${id}`);
          }
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

  if (!aadhar && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="w-8 h-8 text-yellow-500" />
        <span className="ml-2 text-yellow-600">No Aadhar data found for ID: {id}</span>
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
            <h1 className="text-2xl font-bold text-gray-800">Aadhar Details</h1>
            <p className="text-gray-600">View Aadhar Information</p>
          </div>
        </div>
        
        {/* Edit Button */}
        <Button 
          onClick={handleEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center text-gray-800">
            <FileText className="w-5 h-5 mr-2" />
            Aadhar Card Information
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side - Aadhar Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900 font-medium">{aadhar?.aadhar_name || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Aadhar Number</label>
                      <p className="text-gray-900 font-medium tracking-wider">
                        {aadhar?.aadhar_no || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Aadhar Card Image */}
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Uploaded Document</h3>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={`${base_url}${aadhar?.aadhar_card}`}
                    alt="Aadhar Card"
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
              src={`${base_url}${aadhar?.aadhar_card}`}
              alt="Full Aadhar Card"
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

export default ViewAadhar;