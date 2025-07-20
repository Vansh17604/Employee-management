import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import useAuthStore from './app/authStore';
import { Toaster } from './components/ui/sonner';
import AdminLayout from './admin/components/AdminLayout';
import EmployeLayout from './employee/components/EmployeLayout';
import EmployeeDashboard from './employee/pages/EmployeeDashboards';
import NormalEmployeLayout from './normalemployee/componets/NormalEmployee';
import NormalEmployeeDashboard from './normalemployee/pages/NormalEmployee';
import AdminDashboard from './admin/pages/AdminDashboard';
import AddUser from './admin/pages/AddUser';
import AddWorkPlace from './admin/pages/AddWorkPlace';
import AddBank from './admin/pages/AddBank';
import AdminProfile from './admin/pages/AdminProfile';
import ChangePassword from './admin/pages/ChangePassword';
import AddEmployeeandedit from './employee/pages/AddEmployeeandedit';
import AddPanaddandedit from './employee/pages/AddPanaddandedit';
import AddAadhareditandedit from './employee/pages/AddAadhareditandedit';
import AddBankdetailsaddandedit from './employee/pages/AddBankdetailaddandedit';
import ViewEmployees from './admin/pages/ViewEmployees';
import ViewEmployee from './employee/pages/ViewEmployee';
import ViewApprovedEmployee from './admin/pages/ViewApprovedEmployees';
import ViewRejectedEmployee from './admin/pages/ViewRejectEmployee';
import EmployeeView from './employee/pages/EmployeeView';
import EmployeeDetailsView from './employee/pages/EmployeeDetailsView';
import ViewRejectedEmployees from './employee/pages/ViewRejectedEmployeeinemployy';
import ViewApprovalEmployees from './employee/pages/ViewApprovalEmployees';
import ViewAprovweddata from './normalemployee/pages/ViewAprovweddata';
import AdminEmployeeView from './admin/pages/AdminEmployeeView';
import NormalEmployeeView from './normalemployee/pages/NormalEmployeeView';
import AddDocument from './employee/pages/AddDocument';
import ViewPendingDocuments from './employee/pages/ViewPendingDocuments';
import ViewAadhar from './employee/pages/ViewAadhar';
import ViewPan from './employee/pages/ViewPan';
import ViewBankDetail from './employee/pages/ViewBankDetails';
import ViewEmployeePendingDocuments from './admin/pages/ViewPendingDocuments';
import AdminAadharview from './admin/pages/AdminAadharview';
import AdminPanview from './admin/pages/AdminPanview';
import AdminBankdetailview from './admin/pages/AdminBankdetailview';
import AdminRejectedDocuments from './admin/pages/RejectedDocument';
import AdminApprovedDocuments from './admin/pages/ApprovedDocument';
import ViewApprovedDocuments from './employee/pages/ViewApprovedDocument';
import ViewRejectedDocuments from './employee/pages/ViewRejectedDocument';
import NormalViewApprovedDocument from './normalemployee/pages/normalViewApprovedDocument';
import NormalDocumentView from './normalemployee/pages/NormalDocumentView';
import NormalPan from './normalemployee/pages/NormalPan';
import NormalBankDetail from './normalemployee/pages/NormalBankdetails';
import ManegerChangepassword from './employee/pages/ManegerChangepassword';
import MangeProfile from './employee/pages/MangeProfile';
import SuperviserChangePassword from './normalemployee/pages/SuperviserChangePassword';
import SupervisorProfile from './normalemployee/pages/SupervisorProfile';



const PrivateRoute = ({ children, roles }) => {
  const { user, role, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user || !user.id) {
    return <Navigate to="/login" replace />;
  }

  const userRole = role || user.role;
  if (roles && roles.length > 0 && (!userRole || !roles.includes(userRole))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {
  const { validateToken, user, role } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await validateToken();
      } catch (error) {
        console.log('Token validation failed:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    initializeAuth();
  }, [validateToken]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }


  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
          </div>
        }
      >
        <Toaster richColors position="top-right" />
        <Routes>
         
          
         
          <Route path="/login" element={<Login />} />
          
        <Route
            path="/admin/*"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
           
            <Route index element={<AdminDashboard />} />
             <Route path="adduser" element={<AddUser />} />


             <Route path='addworkplace' element={<AddWorkPlace/>}/>
             <Route path='addbank' element={<AddBank/>} />
             <Route path='vieweemployees' element={<ViewEmployees/>}/>
             <Route path='viewapprovedemployee' element={<ViewApprovedEmployee/>}/>
             <Route path='viewrejectedemployee' element={<ViewRejectedEmployee/>}/>
             <Route path='profile' element={<AdminProfile/>}/>
             <Route path='changepassword' element={<ChangePassword/>} />
             <Route path='adminemployeeview/:employeeId' element={<AdminEmployeeView/>}/>
             <Route path='viewpendingdoc' element={<ViewEmployeePendingDocuments/>}/>
             <Route path='adminaddhar/:id' element={<AdminAadharview/>}/>
             <Route path='adminpan/:id' element={<AdminPanview/>}/>
             <Route path='adminbankdetails/:id' element={<AdminBankdetailview/>}/>
             <Route path='rejectedDocs' element={<AdminRejectedDocuments/>} />
             <Route path='approvedDocs' element={<AdminApprovedDocuments/>}/>
            </Route>
             <Route
            path="/employee/*"
            element={
              <PrivateRoute roles={['employee']}>
                <EmployeLayout />
              </PrivateRoute>
            }
          >
           
            <Route index element={<EmployeeDashboard />} />
             <Route path="addemployeeandedit" element={<AddEmployeeandedit />} />
             <Route path="addemployeeandedit/:employeeId" element={<AddEmployeeandedit />} />
             <Route path='addaddharedit/:employee_id' element={<AddAadhareditandedit/>}/>
              <Route path='addaddharedit/:employee_id/:aadharId' element={<AddAadhareditandedit/>}/>
             <Route path='addpanaddandedit/:employee_id' element={<AddPanaddandedit/>} />
             <Route path='addpanaddandedit/:employee_id/:panId' element={<AddPanaddandedit/>} />
             <Route path='addbankdetailandedit/:employee_id' element={<AddBankdetailsaddandedit/>} />
                    <Route path='addbankdetailandedit/:employee_id/:bankDetailId' element={<AddBankdetailsaddandedit/>} />     
             <Route path="viewemployee" element={<ViewEmployee />} />
             <Route path='employeeview/:employeeId' element={<EmployeeView/>}/>
             <Route path='employeedetails/:employeeId' element={<EmployeeDetailsView/>}/> 
             <Route path='viewreject' element={<ViewRejectedEmployees/>}/>
             <Route path='viewapprov' element={<ViewApprovalEmployees/>}/>
             <Route path='adddocument' element={<AddDocument/>} />
             <Route path='viewpendingdocument' element={<ViewPendingDocuments/>} />
             <Route path='viewaadhar/:id' element={<ViewAadhar/>}/>
             <Route path='viewpan/:id' element={<ViewPan/>}/>
             <Route path='viewbankdetails/:id' element={<ViewBankDetail/>}/>
             <Route path='viewrejectedocument' element={<ViewRejectedDocuments/>}/>
             <Route path='viewapprovedocument' element={<ViewApprovedDocuments/>}/>
             <Route path='managerprofile' element={<MangeProfile/>}/>
             <Route path='managerchangepassworg' element={<ManegerChangepassword/>}/>

            </Route>
               <Route
            path="/normalemployee/*"
            element={
              <PrivateRoute roles={['normalemployee']}>
                <NormalEmployeLayout />
              </PrivateRoute>
            }
          >
           
            <Route index element={<NormalEmployeeDashboard />} />
            <Route path='viewapproveddata' element={<ViewAprovweddata/>}/>
            <Route path='normalemployeeview/:employeeId' element={<NormalEmployeeView/>}/>
            <Route path='normalapproveddocument' element={<NormalViewApprovedDocument/>}/>
            <Route path='normaldocument/:employeeId'  element={<NormalDocumentView/>}/>
            <Route path='normalpan/:id'  element={<NormalPan/>}/>
            <Route path='normalbankdetails/:id'  element={<NormalBankDetail/>}/>
            <Route path='supervisorprofile' element={<SupervisorProfile/>}/>
            <Route path='supervisorchangepassword' element={<SuperviserChangePassword/>}/>
            </Route>

          
          <Route 
            path="/unauthorized" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-red-500 mb-4">Unauthorized Access</h1>
                  <p className="text-gray-600">You don't have permission to access this page.</p>
                </div>
              </div>
            } 
          />
        
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;