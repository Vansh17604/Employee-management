const EmployeController= require('../controller/employee');
const express= require('express');
const upload= require('../middleware/upload');


const router= express.Router();
router.post('/createemployee',upload.single('photo'),EmployeController.createEmployee);
router.post('/makrkapprove/:id',EmployeController.approveEmployee);
router.post('/markreject/:id',EmployeController.markReject);
router.put('/editpendingemployee/:id',upload.single('photo'),EmployeController.editEmployeeData);
router.put('/editapproveemployee/:id',upload.single('photo'),EmployeController.editApprovalEmployeeData);
router.get('/fetchemployeebyid/:id',EmployeController.fetchEmployeesbyId);
router.get('/fetchtheapprovaldata/:id',EmployeController.fetchApprovedEmployeesByUserId);
router.get('/fetchtherejected/:id',EmployeController.fetchRejectedEmployeesByUserId);
router.get('/getemployeebyuserid/:id',EmployeController.fetchEmployeesByUserId);
router.get('/allpendingemployee',EmployeController.fetchallthePendingUser);
router.delete('/deletependingemployee/:id',EmployeController.DeletependingEmployee);
router.put('/markinactive/:id',EmployeController.updateWorkstatus);
router.get('/allapprovedemployee',EmployeController.fetchalltheApproved);
router.get('/allrejectedemployee',EmployeController.fetchalltheRejected);
router.get('/getapprovedemployee/:id',EmployeController.fetchapprovedemployeebyitsid);
module.exports=router