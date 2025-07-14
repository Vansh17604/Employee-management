const express= require('express');
const PanController = require('../controller/pan');
const upload = require('../middleware/upload'); // Uncomment if you need to handle file uploads
const {verifyTokenAndAuthorize}= require('../middleware/auth');
const router = express.Router();
router.post('/createpan',verifyTokenAndAuthorize('employee'),upload.single('pan_card'),PanController.createPan);
router.post('/approvpan/:id',verifyTokenAndAuthorize('admin'),PanController.approvePan);
router.post('/rejectpan/:id',verifyTokenAndAuthorize('admin'),PanController.markReject);
router.put('/editpan/:id',verifyTokenAndAuthorize('employee'),upload.single('pan_card'),PanController.editPanData);
router.put('/editapprovepan/:id',verifyTokenAndAuthorize('employee'),upload.single('pan_card'),PanController.editApprovalPanData);
router.get('/fetchpanbyemployeeid/:id',PanController.fetctpanbyemployeeid);
router.get('/fetchbyitsid/:id',PanController.fetchpanbyitsid);
router.get('/fetchpendingbyuserid/:id',PanController.fetchPendingPanByUserId);
router.delete('/deletepan/:id',PanController.deletePan);
router.get('/fetchallpendingpan',PanController.fetchallPendingpans);
router.get('/fetchallapproved',PanController.fetchAllApprovedPan);
router.get('/fetchallrejected',PanController.fetchAllRejectedPan);
router.get('/fetchapprovedpanbyid/:id',PanController.fetchapprovPanByItsId);
router.get('/fetchallrejectpanbyuserId/:id',PanController.fetchRejectedPanByUserId);
router.get('/fetchallapprovedpanbyuserId/:id',PanController.fetchApprovedPanByUserId);

module.exports=router