const express= require('express');
const UserController= require('../controller/user');
const {verifyTokenAndAuthorize}= require('../middleware/auth')


const router= express.Router();
router.get('/getuser',verifyTokenAndAuthorize('admin'),UserController.FetchUsers);

router.delete('/deleteuser/:id',verifyTokenAndAuthorize('admin'),UserController.DeleteUser);
router.put('/edituser/:id',verifyTokenAndAuthorize('admin'),UserController.EditUser);


module.exports=router