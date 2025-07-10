const express= require('express');
const PanController = require('../controller/pan');
const upload = require('../middleware/upload'); // Uncomment if you need to handle file uploads

const router = express.Router();
router.post('/createpan',upload.single('pan_card'),PanController.createPan);
router.post('/approvpan/:id',PanController.approvePan);
router.post('/rejectpan/:id',PanController.markReject);
router.put('/editpan/:id',upload.single('pan_card'),PanController.editPanData);
router.put('/editapprovepan/:id',PanController.editApprovalPanData);
router.get('/fetchpanbyemployeeid/:id',PanController.fetctpanbyemployeeid);
router.get('/fetchbyitsid/:id',PanController.fetchpanbyitsid);



module.exports=router