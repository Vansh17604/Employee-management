const express= require('express');
const WorkController = require('../controller/work');

const {verifyTokenAndAuthorize}= require('../middleware/auth');
const router = express.Router();
router.post('/creatework',verifyTokenAndAuthorize('admin'),WorkController.createWork);
router.put('/editwork/:id',verifyTokenAndAuthorize('admin'),WorkController.updateWork);
router.get('/getwork',WorkController.getAllWorks);
router.delete('/delwork/:id',verifyTokenAndAuthorize('admin'),WorkController.deleteWork);


module.exports=router



