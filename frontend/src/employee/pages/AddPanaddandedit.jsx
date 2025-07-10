import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddPanCardForm from '../forms/AddPanForm';
import usePanStore from '../../app/panStore';
import { toast } from 'sonner';

const AddPanaddandedit = () => {
  const navigate = useNavigate();
  const { employee_id, panId } = useParams();
  const { 
    createPan, 
    fetchPanById, 
    editPendingPan, 
    loading: panLoading, 
    error: panError 
  } = usePanStore();

  const [initialData, setInitialData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (panId) {
      setIsEditMode(true);
      fetchPanData();
    }
  }, [panId]);

  const fetchPanData = async () => {
    setDataLoading(true);
    try {
      const panData = await fetchPanById(panId);
     
      if (panData) {
        setInitialData(panData);
      }
    } catch (error) {
      console.error('Error fetching PAN data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      let result;
      
      if (isEditMode) {
        
        result = await editPendingPan(panId, data);
        if (result) {
          toast.success('PAN card updated successfully!');
          navigate('/employee/viewapprov');
        }
      } else {
        // Create new PAN
        const panData = {
          ...data,
          employee_id,
        };
        result = await createPan(panData);
        if (result) {
          toast.success('PAN card added successfully!');
          navigate('/employee/viewapprov');
        }
      }
    } catch (error) {
      toast.error(`Error ${isEditMode ? 'updating' : 'adding'} PAN card: ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate('/employee/viewapprov');
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading PAN Data...</h3>
                <p className="text-sm text-gray-600">
                  Please wait while we fetch the PAN information.
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
            {isEditMode ? 'Edit PAN Card' : 'Add PAN Card'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update the PAN card details below' : 'Fill in the PAN card details below'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <AddPanCardForm
            onNext={handleSubmit}
            onCancel={handleCancel}
            initialData={initialData}
            disabled={panLoading}
          />

          {panLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isEditMode ? 'Updating PAN Card...' : 'Saving PAN Card...'}
                </h3>
                <p className="text-sm text-gray-600">
                  Please wait while we {isEditMode ? 'update' : 'save'} the PAN card information.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPanaddandedit;