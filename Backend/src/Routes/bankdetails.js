const BankDetailController = require('../controller/bankdetails');
const express= require('express');
const upload = require('../middleware/upload'); 

const {verifyTokenAndAuthorize}= require('../middleware/auth');

const router= express.Router();
router.post('/createbankdetail',verifyTokenAndAuthorize('employee'),upload.single('passbook_image'),BankDetailController.createBankDetail);
router.post('/markapprovebankdetail/:id',verifyTokenAndAuthorize('admin'),BankDetailController.approveBankDetail);
router.post('/markrejectbankdetail/:id',verifyTokenAndAuthorize('admin'), BankDetailController.markReject);
router.put('/editbankdetail/:id',verifyTokenAndAuthorize('employee'),upload.single('passbook_image'),BankDetailController.editBankDetailData);
router.put('/editapprovebankdetail/:id',verifyTokenAndAuthorize('employee'),upload.single('passbook_image'),BankDetailController.editApprovalBankDetailData);

router.get('/fetchbankdetailsbyemployeeid/:id',BankDetailController.fetchbankdetailbyemployeid);
router.get('/fetchbankdetailitid/:id',BankDetailController.fetchbankdetailsbyitid);
router.get('/fetchapprovedbankdetailbyid/:id',BankDetailController.fetchapprovbankdetailsbyitid);
router.get('/fetchpendingbankdetailsbyuserid/:id',BankDetailController.fetchallpendingbankdetailsbyuserid);
router.delete('/deletebankdetails/:id',BankDetailController.deleteBankDetails);
router.get('/fetchallpendingbankdetails',BankDetailController.fetchAllPendingBankDetails);
router.get('/fetchapprovbankdetails',BankDetailController.fetchAllApprovedBankDetails);
router.get('/fetchallrejectedbankdetails',BankDetailController.fetchAllRejecedBankDetails);
router.get('/fetchapprovedbankdetailbyuserid/:id',BankDetailController.fetchapprovbankdetailsbyitid);
router.get('/fetchallrejectedbankdetailsbyuserid/:id',BankDetailController.fetchallRejectedbankdetailsbyuserid);
router.get('/fetchallapprovedbankdetailvyuserid/:id',BankDetailController.fetchallApprovedbankdetailsbyuserid);

module.exports=router