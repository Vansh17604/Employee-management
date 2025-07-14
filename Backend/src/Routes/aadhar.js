const express= require('express');
const AadharController = require('../controller/aadhar');

const {verifyTokenAndAuthorize}= require('../middleware/auth');
 const upload = require('../middleware/upload'); // Uncomment if you need to handle file uploads


const router = express.Router();
router.post('/createaadhar',verifyTokenAndAuthorize('employee'),upload.single('aadhar_card'),AadharController.createAadhar);
router.post('/approvaadhar/:id',verifyTokenAndAuthorize('admin'),AadharController.approveAadhar);
router.post('/rejectaadhar/:id',verifyTokenAndAuthorize('admin'),AadharController.markReject);
router.put('/editaadhar/:id',verifyTokenAndAuthorize('employee'),upload.single('aadhar_card'),AadharController.editAadharData);
router.put('/editapproveaadhar/:id',verifyTokenAndAuthorize('employee'),upload.single('aadhar_card'),AadharController.editApprovalAadharData);
router.get('/fetchaadharbyemployeeid/:id',verifyTokenAndAuthorize('admin','employee','normalemployee'),AadharController.fetchaadharbyemployeid);
router.get('/fetchbyitsownid/:id',verifyTokenAndAuthorize('admin','employee','normalemployee'),AadharController.fetchaadharbyitsid);
router.get('/fetchpendingaadharbyuserid/:id',AadharController.fetchpendingaadharbyuserId);
router.get('/fetchrejectedaadharbyuserid/:id',AadharController.fetchrejectedaadharbyuserId);
router.get('/fetchaprovedaadharbyuserid/:id',AadharController.fetchApprovedaadharbyuserId);
router.get('/fetchapprovedaadharbyitsid/:id',AadharController.getApprovedAadharById);
router.delete('/deleteaadhar/:id',AadharController.deleteAadhar);
router.get('/fetchallpendingaadhar',AadharController.fetchAllPendingAadhar);
router.get('/fetchapprovedaadhar',AadharController.fetchAllApprovedAadhar);
router.get('/fetchrejectedaadhar',AadharController.fetchAllRejectedAadhar);
router.get('/fetchapprovaadharbyid/:id',AadharController.fetchaprovaadharbyitsid);

module.exports=router