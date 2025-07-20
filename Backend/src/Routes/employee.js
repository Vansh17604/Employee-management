const EmployeController= require('../controller/employee');
const express= require('express');
const upload= require('../middleware/upload');
const {verifyTokenAndAuthorize}= require('../middleware/auth');

const router= express.Router();
router.post('/createemployee',verifyTokenAndAuthorize('employee'),upload.single('photo'),EmployeController.createEmployee);
router.post('/makrkapprove/:id',verifyTokenAndAuthorize('admin'),EmployeController.approveEmployee);
router.post('/markreject/:id',verifyTokenAndAuthorize('admin'),EmployeController.markReject);
router.put('/editpendingemployee/:id',verifyTokenAndAuthorize('employee'),upload.single('photo'),EmployeController.editEmployeeData);
router.put('/editapproveemployee/:id',verifyTokenAndAuthorize('employee'),upload.single('photo'),EmployeController.editApprovalEmployeeData);
router.get('/fetchemployeebyid/:id',EmployeController.fetchEmployeesbyId);
router.get('/fetchtheapprovaldata/:id',EmployeController.fetchApprovedEmployeesByUserId);
router.get('/fetchtherejected/:id',EmployeController.fetchRejectedEmployeesByUserId);
router.get('/getemployeebyuserid/:id',EmployeController.fetchEmployeesByUserId);
router.get('/allpendingemployee',EmployeController.fetchallthePendingUser);
router.delete('/deletependingemployee/:id',verifyTokenAndAuthorize('admin'),EmployeController.DeletependingEmployee);
router.put('/markinactive/:id',verifyTokenAndAuthorize('employee'),EmployeController.updateWorkstatus);
router.get('/allapprovedemployee',EmployeController.fetchalltheApproved);
router.get('/allrejectedemployee',EmployeController.fetchalltheRejected);
router.get('/getapprovedemployee/:id',EmployeController.fetchapprovedemployeebyitsid);

module.exports=router