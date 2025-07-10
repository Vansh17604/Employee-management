const express= require('express');
const AadharController = require('../controller/aadhar');

const {verifyTokenAndAuthorize}= require('../middleware/auth');
 const upload = require('../middleware/upload'); // Uncomment if you need to handle file uploads


const router = express.Router();
router.post('/createaadhar',upload.single('aadhar_card'),AadharController.createAadhar);
router.post('/approvaadhar/:id',AadharController.approveAadhar);
router.post('/rejectaadhar/:id',AadharController.markReject);
router.put('/editaadhar/:id',upload.single('aadhar_card'),AadharController.editAadharData);
router.put('/editapproveaadhar/:id',AadharController.editApprovalAadharData);
router.get('/fetchaadharbyemployeeid/:id',AadharController.fetchaadharbyemployeid);
router.get('/fetchbyitsownid/:id',AadharController.fetchaadharbyitsid);


module.exports=router