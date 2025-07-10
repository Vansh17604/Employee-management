import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useEmployeeStore from '../../app/EmployeeStore';
import { 
  User, 
  Phone, 
  MapPin, 
  Building2, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  CreditCard
} from 'lucide-react';


const AdminEmployeeView = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const type = queryParams.get("type");


  
  const base_url = import.meta.env.VITE_BASE_URL;
  const { fetchEmployeebyEmployeeId, pendingEmployees,fetchApprovedEmployeeById } = useEmployeeStore();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!employeeId) return;
      
      try {
        setLoading(true);
        setError(null);
        
       const employeeData =
  type === 'approved'
    ? await fetchApprovedEmployeeById(employeeId)
    : await fetchEmployeebyEmployeeId(employeeId);

        if (employeeData) {
          setEmployee(employeeData);
        }
        
      } catch (err) {
        setError(err.message || 'Failed to fetch employee details');
        console.error('Error fetching employee data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId, fetchEmployeebyEmployeeId,fetchApprovedEmployeeById]);

  useEffect(() => {
    if (pendingEmployees) {
      setEmployee(pendingEmployees);
    }
  }, [pendingEmployees]);

  const handleBack = () => {
    navigate('/admin/vieweemployees');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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

  const getWorkStatusColor = (workStatus) => {
    switch (workStatus?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  if (!employee && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="w-8 h-8 text-yellow-500" />
        <span className="ml-2 text-yellow-600">No employee data found for ID: {employeeId}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
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
            <h1 className="text-3xl font-bold">Employee Profile</h1>
            <p className="text-gray-600">Personal Information</p>
          </div>
        </div>
      </div>

      
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center justify-center">
            <CreditCard className="w-6 h-6 mr-2" />
            Employee Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
         
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="flex-shrink-0">
             
<div className="relative">
  <img
    src={`${base_url}${employee.photo}`}
    alt="Employee"
    onClick={() => setShowFullImage(true)}
    className="w-32 h-32 rounded-lg object-cover border-4 border-blue-100 cursor-pointer hover:opacity-90 transition-opacity"
  />
</div>

{showFullImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    onClick={() => setShowFullImage(false)}
  >
    <img
      src={`${base_url}${employee.photo}`}
      alt="Full Employee"
      className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
    />
    <button
      onClick={() => setShowFullImage(false)}
      className="absolute top-4 right-4 text-white text-3xl font-bold"
    >
      &times;
    </button>
  </div>
)}

            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{employee?.name || 'N/A'}</h2>
              <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 mr-2">Employee ID:</span>
                  <span className="text-lg font-bold text-blue-600">{employee?.employeeId || employeeId}</span>
                </div>
                <div className="flex gap-2">
                  <Badge className={`${getStatusColor(employee?.status)} border`}>
                    {employee?.status || 'Unknown'}
                  </Badge>
                  <Badge className={`${getWorkStatusColor(employee?.workstatus)} border`}>
                    {employee?.workstatus || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Primary Mobile</p>
                    <p className="text-gray-800">{employee?.primary_mno || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Secondary Mobile</p>
                    <p className="text-gray-800">{employee?.secondary_mno || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Home Number</p>
                    <p className="text-gray-800">{employee?.home_mno || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Address Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Permanent Address</p>
                    <p className="text-gray-800">{employee?.perment_address || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Address</p>
                    <p className="text-gray-800">{employee?.current_address || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Building2 className="w-5 h-5 text-purple-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Workplace</p>
                    <p className="text-gray-800">{employee?.work_id?.work_place_name || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          

        
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEmployeeView;