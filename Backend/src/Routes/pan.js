const express= require('express');
const PanController = require('../controller/pan');
const upload = require('../middleware/upload'); // Uncomment if you need to handle file uploads
const {verifyTokenAndAuthorize}= require('../middleware/auth');
const router = express.Router();
router.post('/createpan',verifyTokenAndAuthorize('employee'),upload.single('pan_card'),PanController.createPan);
router.post('/approvpan/:id',verifyTokenAndAuthorize('admin'),PanController.approvePan);
router.post('/rejectpan/:id',verifyTokenAndAuthorize('admin'),PanController.markReject);
router.put('/editpan/:id',verifyTokenAndAuthorize('admin'),upload.single('pan_card'),PanController.editPanData);
router.put('/editapprovepan/:id',verifyTokenAndAuthorize('admin'),PanController.editApprovalPanData);
router.get('/fetchpanbyemployeeid/:id',PanController.fetctpanbyemployeeid);
router.get('/fetchbyitsid/:id',PanController.fetchpanbyitsid);



module.exports=router