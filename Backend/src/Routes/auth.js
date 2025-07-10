const express= require('express');
const AuthController= require('../controller/auth');
const {verifyTokenAndAuthorize}= require('../middleware/auth')


const router= express.Router();
router.post('/register', AuthController.RegisterAdmin);
router.post('/employeeregister',verifyTokenAndAuthorize('admin'), AuthController.RegisterEmployee);
router.post('/normalemployregister',verifyTokenAndAuthorize('admin'),AuthController.RegisterNormalEmployee);
router.post('/login', AuthController.Login);
router.post('/validatetoken',verifyTokenAndAuthorize('admin','employee','normalemployee'),AuthController.validateToken);
router.post('/changepassword/:id',AuthController.ChangePassword);
router.post('/logout',AuthController.Logout);
router.get('/getuser/:id',AuthController.GetUserById);
router.put('/updateprofile/:id',AuthController.UpdateUserProfile);
module.exports=router