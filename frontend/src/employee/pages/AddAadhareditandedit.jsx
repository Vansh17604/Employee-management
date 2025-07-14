import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddAadharCardForm from '../forms/AddAadharCardForm';
import useAadharStore from '../../app/aadharStore';
import { toast } from 'sonner';
import useAuthStore from '@/app/authStore';
import { useLocation } from 'react-router-dom';

const AddAadhareditandedit = () => {
  const navigate = useNavigate();
  const { employee_id, aadharId } = useParams();
  const {user}= useAuthStore();
  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const type = queryParams.get("type"); // could be "approve"

  const userId= user?.id;
const { 
  createAadhar, 
  fetchAadharByItsOwnId,
  fetchApprovedAadharById,
  editPendingAadhar, 
  editApprovedAadhar,
  loading: aadharLoading, 
  error: aadharError 
} = useAadharStore();


  const [initialData, setInitialData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (aadharId) {
      setIsEditMode(true);
      fetchAadharData();
    }
  }, [aadharId]);
 

const fetchAadharData = async () => {
  setDataLoading(true);
  try {
    let aadharData;

    if (type === "approve") {
      aadharData = await fetchApprovedAadharById(aadharId);
    } else {
      aadharData = await fetchAadharByItsOwnId(aadharId);
    }

    if (aadharData) {
      setInitialData(aadharData);
    }
  } catch (error) {
    console.error('Error fetching aadhar data:', error);
  } finally {
    setDataLoading(false);
  }
};


const handleSubmit = async (data) => {
  try {
    let result;

    if (isEditMode) {
      if (type === "approve") {
        result = await editApprovedAadhar(aadharId, data);
      } else {
        result = await editPendingAadhar(aadharId, data);
      }

      if (result) {
        toast.success('Aadhar card updated successfully!');
        navigate('/employee/viewemployee');
      }
    } else {
      const aadharData = {
        ...data,
        employee_id,
        userId: user?.id
      };
      result = await createAadhar(aadharData);
      if (result) {
        toast.success('Aadhar card added successfully!');
        navigate('/employee/viewemployee');
      }
    }
  } catch (error) {
    toast.error(`Error ${isEditMode ? 'updating' : 'adding'} Aadhar card: ${error.message}`);
  }
};


  const handleCancel = () => {
    navigate('/employee/viewemployee');
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Aadhar Data...</h3>
                <p className="text-sm text-gray-600">
                  Please wait while we fetch the aadhar information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Edit Aadhar Card' : 'Add Aadhar Card'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update the aadhar card details below' : 'Fill in the aadhar card details below'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <AddAadharCardForm
            onNext={handleSubmit}
            onCancel={handleCancel}
            initialData={initialData}
            disabled={aadharLoading}
          />

          {aadharLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isEditMode ? 'Updating Aadhar Card...' : 'Saving Aadhar Card...'}
                </h3>
                <p className="text-sm text-gray-600">
                  Please wait while we {isEditMode ? 'update' : 'save'} the aadhar card information.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAadhareditandedit;