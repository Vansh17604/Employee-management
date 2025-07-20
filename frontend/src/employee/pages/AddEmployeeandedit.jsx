import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AddEmployeeForm from "../forms/AddEmployeeForm";
import useEmployeeStore from '../../app/EmployeeStore';
import { toast } from 'sonner';

const AddEmployeeandedit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const editType = queryParams.get("type"); // e.g., "approveemployeeedit"

  const { 
    createEmployee, 
    fetchEmployeebyEmployeeId, 
    fetchApprovedEmployeeById,
    editPendingEmployee,
    editApprovedEmployee,  
    currentEmployee, 
    loading: employeeLoading, 
    error: employeeError 
  } = useEmployeeStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

useEffect(() => {
  const isValidId = employeeId && employeeId !== 'undefined' && employeeId !== 'null';

  if (isValidId) {
    setIsEditMode(true);
    fetchEmployeeData();
  } else {
    setIsEditMode(false);
  }
}, [employeeId]);


const fetchEmployeeData = async () => {
  setDataLoading(true);
  try {
    if (editType === 'approveemployeeedit') {
      await fetchApprovedEmployeeById(employeeId);
 
    } else {
      await fetchEmployeebyEmployeeId(employeeId);

    }
  } catch (error) {
   
  } finally {
    setDataLoading(false);
  }
};


  const handleNext = async (data) => {
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

    
    if (type === "approve") {
      navigate('/employee/viewapprove');
    } else {
      navigate('/employee/viewemployee');
    }
  }


      } else {
        result = await createEmployee(data);
        if (result) {
          navigate('/employee/viewemployee');
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const handleCancel = () => {
      if (isEditMode) {
      if (type === "approve") {
      navigate('/employee/viewapprove');
    } else {
      navigate('/employee/viewemployee');
    }
  }else{
    navigate('/employee/viewpendingdocument');
  }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Employee Data...</h3>
                <p className="text-sm text-gray-600">
                  Please wait while we fetch the employee information.
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
            {isEditMode ? 'Edit Employee' : 'Add New Employee'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update the employee details below' : 'Fill in the employee details below'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <AddEmployeeForm
            onNext={handleNext}
            onCancel={handleCancel}
            initialData={currentEmployee}
            disabled={employeeLoading}
          />

          {employeeLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isEditMode ? 'Updating Employee...' : 'Saving Employee...'}
                </h3>
                <p className="text-sm text-gray-600">
                  Please wait while we {isEditMode ? 'update' : 'save'} the employee information.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeandedit;
