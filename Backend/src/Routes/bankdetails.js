const BankDetailController = require('../controller/bankdetails');
const express= require('express');
const upload = require('../middleware/upload'); 

const {verifyTokenAndAuthorize}= require('../middleware/auth');

const router= express.Router();
router.post('/createbankdetail',verifyTokenAndAuthorize('employee'),upload.single('passbook_image'),BankDetailController.createBankDetail);
router.post('/markapprovebankdetail/:id',verifyTokenAndAuthorize('admin'),BankDetailController.approveBankDetail);
router.post('/markrejectbankdetail/:id',verifyTokenAndAuthorize('admin'), BankDetailController.markReject);
router.put('/editbankdetail/:id',verifyTokenAndAuthorize('employee'),upload.single('passbook_image'),BankDetailController.editBankDetailData);
router.put('/editapprovebankdetail/:id',verifyTokenAndAuthorize('employee'),BankDetailController.editApprovalBankDetailData);
router.get('/getallpendingbanks',BankDetailController.getAllPendingBankDetails);
router.get('/fetchbankdetailsbyemployeeid/:id',BankDetailController.fetchbankdetailbyemployeid);
router.get('/fetchbankdetailitid/:id',BankDetailController.fetchbankdetailsbyitid);

module.exports=router