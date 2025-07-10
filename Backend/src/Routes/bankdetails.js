const BankDetailController = require('../controller/bankdetails');
const express= require('express');
const upload = require('../middleware/upload'); 



const router= express.Router();
router.post('/createbankdetail',upload.single('passbook_image'),BankDetailController.createBankDetail);
router.post('/markapprovebankdetail/:id',BankDetailController.approveBankDetail);
router.post('/markrejectbankdetail/:id', BankDetailController.markReject);
router.put('/editbankdetail/:id',upload.single('passbook_image'),BankDetailController.editBankDetailData);
router.put('/editapprovebankdetail/:id',BankDetailController.editApprovalBankDetailData);
router.get('/getallpendingbanks',BankDetailController.getAllPendingBankDetails);
router.get('/fetchbankdetailsbyemployeeid/:id',BankDetailController.fetchbankdetailbyemployeid);
router.get('/fetchbankdetailitid/:id',BankDetailController.fetchbankdetailsbyitid);

module.exports=router