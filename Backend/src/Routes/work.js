const express= require('express');
const WorkController = require('../controller/work');


const router = express.Router();
router.post('/creatework',WorkController.createWork);
router.put('/editwork/:id',WorkController.updateWork);
router.get('/getwork',WorkController.getAllWorks);
router.delete('/delwork/:id',WorkController.deleteWork);


module.exports=router



