const BankController= require('../controller/bank');

const express= require('express');



const router= express.Router();
router.post('/createbank',BankController.createBank);
router.put('/updatebank/:id',BankController.updateBank);
router.delete('/deletebank/:id',BankController.deleteBank);
router.get('/getallbanks',BankController.getBank);


module.exports=router
