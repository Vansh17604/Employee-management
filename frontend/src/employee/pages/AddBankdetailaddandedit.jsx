import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddBankDetailForm from '../forms/AddBankDetails';
import useBankDetailsStore from '../../app/bankdetailStore';
import { toast } from 'sonner';
import useAuthStore from '@/app/authStore';
import { useLocation } from 'react-router-dom';


const AddBankDetailsAddAndEdit = () => {
  const navigate = useNavigate();
  const { employee_id, bankDetailId } = useParams();
  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const type = queryParams.get("type"); // "approve" or null

  const {user}=useAuthStore();
 const {
  createBankDetail,
  fetchBankDetailByItsId,
  fetchApprovedBankDetailById,
  editPendingBankDetail,
  editApprovedBankDetail,
  loading: bankDetailsLoading,
  error: bankDetailsError
} = useBankDetailsStore();


  const [initialData, setInitialData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (bankDetailId) {
      setIsEditMode(true);
      fetchBankDetailData();
    }
  }, [bankDetailId]);

 const fetchBankDetailData = async () => {
  setDataLoading(true);
  try {
    const bankDetailData = type === "approve"
      ? await fetchApprovedBankDetailById(bankDetailId)
      : await fetchBankDetailByItsId(bankDetailId);

    if (bankDetailData) {
      setInitialData(bankDetailData);
    }
  } catch (error) {
    console.error('Error fetching bank detail data:', error);
  } finally {
    setDataLoading(false);
  }
};


  const handleSubmit = async (data) => {
  try {
    let result;

    if (isEditMode) {
      if (type === "approve") {
        result = await editApprovedBankDetail(bankDetailId, data);
      } else {
        result = await editPendingBankDetail(bankDetailId, data);
      }

      if (result) {
        toast.success('Bank details updated successfully!');
        navigate('/employee/viewapprov');
      }
    } else {
      const bankDetailData = {
        ...data,
        employee_id,
        userId: user?.id
      };
      result = await createBankDetail(bankDetailData);
      if (result) {
        toast.success('Bank details added successfully!');
        navigate('/employee/viewapprov');
      }
    }
  } catch (error) {
    toast.error(`Error ${isEditMode ? 'updating' : 'adding'} bank details: ${error.message}`);
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Bank Details...</h3>
                <p className="text-sm text-gray-600">
                  Please wait while we fetch the bank account information.
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
            {isEditMode ? 'Edit Bank Details' : 'Add Bank Details'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update the bank account details below' : 'Fill in the bank account details below'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <AddBankDetailForm
            onNext={handleSubmit}
            onCancel={handleCancel}
            initialData={initialData}
            disabled={bankDetailsLoading}
          />

          {bankDetailsLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isEditMode ? 'Updating Bank Details...' : 'Saving Bank Details...'}
                </h3>
                <p className="text-sm text-gray-600">
                  Please wait while we {isEditMode ? 'update' : 'save'} the bank account information.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBankDetailsAddAndEdit;