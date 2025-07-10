const express= require('express');
const AuthController= require('../controller/auth');
const {verifyTokenAndAuthorize}= require('../middleware/auth')


const router= express.Router();
router.post('/register', AuthController.RegisterAdmin);
router.post('/employeeregister',verifyTokenAndAuthorize('admin'), AuthController.RegisterEmployee);
router.post('/normalemployregister',verifyTokenAndAuthorize('admin'),AuthController.RegisterNormalEmployee);
router.post('/login', AuthController.Login);
router.post('/validatetoken',verifyTokenAndAuthorize('admin','employee','normalemployee'),AuthController.validateToken);
router.post('/changepassword/:id',verifyTokenAndAuthorize('admin','employee','normalemployee'),AuthController.ChangePassword);
router.post('/logout',verifyTokenAndAuthorize('admin','employee','normalemployee'),AuthController.Logout);
router.get('/getuser/:id',verifyTokenAndAuthorize('admin','employee','normalemployee'),AuthController.GetUserById);
router.put('/updateprofile/:id',verifyTokenAndAuthorize('admin','employee','normalemployee'),AuthController.UpdateUserProfile);
module.exports=router