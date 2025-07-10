const express= require('express');
const AadharController = require('../controller/aadhar');

const {verifyTokenAndAuthorize}= require('../middleware/auth');
 const upload = require('../middleware/upload'); // Uncomment if you need to handle file uploads


const router = express.Router();
router.post('/createaadhar',verifyTokenAndAuthorize('employee'),upload.single('aadhar_card'),AadharController.createAadhar);
router.post('/approvaadhar/:id',verifyTokenAndAuthorize('admin'),AadharController.approveAadhar);
router.post('/rejectaadhar/:id',verifyTokenAndAuthorize('admin'),AadharController.markReject);
router.put('/editaadhar/:id',verifyTokenAndAuthorize('employee'),upload.single('aadhar_card'),AadharController.editAadharData);
router.put('/editapproveaadhar/:id',verifyTokenAndAuthorize('employee'),AadharController.editApprovalAadharData);
router.get('/fetchaadharbyemployeeid/:id',verifyTokenAndAuthorize('employee','employee','normalemployee'),AadharController.fetchaadharbyemployeid);
router.get('/fetchbyitsownid/:id',verifyTokenAndAuthorize('employee','employee','normalemployee'),AadharController.fetchaadharbyitsid);


module.exports=router