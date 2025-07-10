const BankController= require('../controller/bank');

const express= require('express');

const {verifyTokenAndAuthorize}= require('../middleware/auth');

const router= express.Router();
router.post('/createbank',verifyTokenAndAuthorize('admin'),BankController.createBank);
router.put('/updatebank/:id',verifyTokenAndAuthorize('admin'),BankController.updateBank);
router.delete('/deletebank/:id',verifyTokenAndAuthorize('admin'),BankController.deleteBank);
router.get('/getallbanks',verifyTokenAndAuthorize('admin','employee','normalemployee'),BankController.getBank);


module.exports=router
