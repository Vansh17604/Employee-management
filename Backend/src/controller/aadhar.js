const UpdatedAadhar = require('../models/updatedaadhar');
const Aadhar = require('../models/aadhar');
const { check, validationResult } = require('express-validator');

module.exports.createAadhar = [
  check('employee_id').not().isEmpty().withMessage('Employee ID is required'),

  check('aadhar_name').not().isEmpty().withMessage('Aadhar name is required'),
  check('aadhar_no').isNumeric().withMessage('Aadhar number must be numeric'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });

    }

    try {
      const {
        userId,
        employee_id,
        aadhar_name,
        aadhar_no
      } = req.body;
      const  aadhar_card=  req.file ? `/uploads/aadharcard/${req.file.filename}` : req.body.aadhar_card;
      const existingApproved = await Aadhar.findOne({ employee_id });
      if (existingApproved) {
        return res.status(400).json({ message: 'Aadhar already exists and is approved for this employee.' });
      }

      const existingPending = await UpdatedAadhar.findOne({ employee_id, status: 'Pending' });
      if (existingPending) {
        return res.status(400).json({ message: 'Aadhar already submitted and is pending approval for this employee.' });
      }
      const aadhar = new UpdatedAadhar({
        employee_id,
        aadhar_card,
        aadhar_name,
        aadhar_no,
        userId,
        status: "Pending"
      });

      const savedAadhar = await aadhar.save();
      res.json({ message: 'Aadhar created successfully', aadhar: savedAadhar });
    } catch (err) {
      res.status(400).json({ message: 'Error creating aadhar', error: err });
    }
  }
];

module.exports.approveAadhar = async (req, res) => {
  const { id } = req.params;

  try {
    const pendingAadhar = await UpdatedAadhar.findById(id);
    if (!pendingAadhar) {
      return res.status(404).json({ message: "Pending aadhar not found" });
    }
    const linkedAadharId = pendingAadhar.aadharData?.[0]?.id;

    let aadharToUpdate = null;

    if (linkedAadharId) {
      aadharToUpdate = await Aadhar.findById(linkedAadharId);
    }

    if (aadharToUpdate) {

      aadharToUpdate.employee_id = pendingAadhar.employee_id;
      aadharToUpdate.userId=pendingAadhar.userId;
      aadharToUpdate.aadhar_card = pendingAadhar.aadhar_card;
      aadharToUpdate.aadhar_name = pendingAadhar.aadhar_name;
      aadharToUpdate.aadhar_no = pendingAadhar.aadhar_no;
      aadharToUpdate.status = "Approved";

      aadharToUpdate.updateAadharData = (aadharToUpdate.updateAadharData || []).filter(
        entry => entry.id.toString() !== pendingAadhar._id.toString()
      );

      await aadharToUpdate.save();
    } else {
      
      aadharToUpdate = new Aadhar({
        employee_id: pendingAadhar.employee_id,
        userId: pendingAadhar.userId,
        aadhar_card: pendingAadhar.aadhar_card,
        aadhar_name: pendingAadhar.aadhar_name,
        aadhar_no: pendingAadhar.aadhar_no,
        status: "Approved"
      });

      await aadharToUpdate.save();
    }

    const alreadyLinked = pendingAadhar.aadharData?.some(
      e => e.id.toString() === aadharToUpdate._id.toString()
    );

    if (!alreadyLinked) {
      pendingAadhar.aadharData = [
        ...(pendingAadhar.aadharData || []),
        { id: aadharToUpdate._id, date: new Date() }
      ];
    }

    pendingAadhar.status = "Approved";
    await pendingAadhar.save();
    await UpdatedAadhar.findByIdAndDelete(id);
    res.json({
      message: "Aadhar approved and updated successfully",
      aadhar: aadharToUpdate
    });
  } catch (err) {
    res.status(500).json({ message: "Error approving aadhar", error: err.message });
  }
};

module.exports.markReject = async (req, res) => {
  const { id } = req.params;
  const { remarks } = req.body || {};
  
  if (!remarks) {
    return res.status(400).json({ message: "Remarks is required" });
  }

  try {
    const pendingAadhar = await UpdatedAadhar.findById(id);

    if (!pendingAadhar) {
      return res.status(404).json({ message: "Pending aadhar not found" });
    }

    pendingAadhar.status = "Rejected";
    pendingAadhar.remarks = remarks || "No reason provided";

    await pendingAadhar.save();

    res.json({
      message: "Aadhar marked as rejected",
      aadhar: pendingAadhar
    });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting aadhar", error: err });
  }
};

module.exports.editAadharData = [
  check('aadhar_card').not().isEmpty().withMessage('Aadhar card is required'),
  check('aadhar_name').not().isEmpty().withMessage('Aadhar name is required'),
  check('aadhar_no').isNumeric().withMessage('Aadhar number must be numeric'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
     
      aadhar_name,
      aadhar_no
    } = req.body;
    const  aadhar_card=  req.file ? `/uploads/editaadharcard/${req.file.filename}` : req.body.aadhar_card;

    try {
      const pendingAadhar = await UpdatedAadhar.findById(id);
      if (!pendingAadhar) {
        return res.status(404).json({ message: "Pending aadhar not found" });
      }

    
      pendingAadhar.aadhar_card = aadhar_card || pendingAadhar.aadhar_card;
      pendingAadhar.aadhar_name = aadhar_name || pendingAadhar.aadhar_name;
      pendingAadhar.aadhar_no = aadhar_no || pendingAadhar.aadhar_no;
      
      pendingAadhar.status = "Pending";

      const updatedAadhar = await pendingAadhar.save();

      res.json({
        message: "Pending aadhar data updated and status set to Pending",
        aadhar: updatedAadhar
      });
    } catch (err) {
      res.status(500).json({ message: "Error editing pending aadhar", error: err });
    }
  }
];

module.exports.editApprovalAadharData = [
  check('aadhar_card').not().isEmpty().withMessage('Aadhar card is required'),
  check('aadhar_name').not().isEmpty().withMessage('Aadhar name is required'),
  check('aadhar_no').isNumeric().withMessage('Aadhar number must be numeric'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
    
      aadhar_name,
      aadhar_no
    } = req.body;
    const  aadhar_card=  req.file ? `/uploads/updatedaprovedaadhar/${req.file.filename}` : req.body.aadhar_card;

    try {
      const approvedAadhar = await Aadhar.findById(id);
      if (!approvedAadhar) {
        return res.status(404).json({ message: "Approved aadhar not found" });
      }

      
      const newPendingEntry = new UpdatedAadhar({
        userId:approvedAadhar.userId,
         employee_id: approvedAadhar.employee_id,
        aadhar_card,
        aadhar_name,
        aadhar_no,
        status: "Pending"
      });

      
      const existingAadharData = newPendingEntry.aadharData || [];
      const isAadharAlreadyLinked = existingAadharData.some(e => e.id.toString() === id);
      if (!isAadharAlreadyLinked) {
        newPendingEntry.aadharData = [
          ...(newPendingEntry.aadharData || []),
          { id, date: new Date() }
        ];
      }

      const savedPending = await newPendingEntry.save();
      const existingUpdateData = approvedAadhar.updateAadharData || [];
      const isUpdateAlreadyLinked = existingUpdateData.some(
        e => e.id.toString() === savedPending._id.toString()
      );
      if (!isUpdateAlreadyLinked) {
        approvedAadhar.updateAadharData.push({
          id: savedPending._id,
          date: new Date()
        });
        await approvedAadhar.save();
      }

      res.json({
        message: "Aadhar data copied to pending model for approval and references updated",
        aadhar: savedPending
      });

    } catch (err) {
      res.status(500).json({ message: "Error creating pending approval", error: err.message });
    }
  }
];


module.exports.getAllPendingAadhars = async (req, res) => {
  try {
    const pendingAadhars = await UpdatedAadhar.find({ status: "Pending" })
      .populate('employee_id', 'name work_id')
      .sort({ createdAt: -1 });

    res.json({
      message: "Pending aadhars retrieved successfully",
      aadhars: pendingAadhars
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving pending aadhars", error: err.message });
  }
};
module.exports.getAllPendingAadharbyuserId= async(req,res)=>{
  try{
    const pendingAadhars = await UpdatedAadhar.find({status:"Pending",userId:req.params.id});
    res.json({
      message: "Pending aadhars retrieved successfully",
      aadhars: pendingAadhars
      });
      } catch (err) {
        res.status(500).json({ message: "Error retrieving pending aadhars", error:
          err.message });
          }
}

module.exports.getAllApprovedAadhars = async (req, res) => {
  try {
    const approvedAadhars = await Aadhar.find({ status: "Approved" })
      .populate('employee_id', 'name work_id')
      .sort({ createdAt: -1 });

    res.json({
      message: "Approved aadhars retrieved successfully",
      aadhars: approvedAadhars
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving approved aadhars", error: err.message });
  }
};

module.exports.getApprovedAadharById = async (req, res) => {
  const { id } = req.params;

  try {
   
    const  aadhar = await Aadhar.findById(id).populate('employee_id', 'name work_id');


    if (!aadhar) {
      return res.status(404).json({ message: "Aadhar not found" });
    }

    res.json({
      message: "Aadhar retrieved successfully",
      aadhar: aadhar
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving aadhar", error: err.message });
  }
};

module.exports.getAadharByEmployeeId = async (req, res) => {
  const { employee_id } = req.params;

  try {
    const approvedAadhars = await Aadhar.find({ 
      employee_id: employee_id, 
      status: "Approved" 
    }).populate('employee_id', 'name work_id');

    const pendingAadhars = await UpdatedAadhar.find({ 
      employee_id: employee_id 
    }).populate('employee_id', 'name work_id');

    res.json({
      message: "Employee aadhars retrieved successfully",
      approved: approvedAadhars,
      pending: pendingAadhars
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving employee aadhars", error: err.message });
  }
};
module.exports.fetchaadharbyemployeid= async(req,res)=>{
  const employeeid= req.params.id;
  try{
    const aadhar= await UpdatedAadhar.find({employee_id:employeeid}).populate('employee_id');
    res.json({message:"aadhar fetched successfully",aadhar:aadhar});
    }catch(err){
      res.status(500).json({message:"error fetching aadhar",error:err.message});
      }
}

module.exports.fetchaadharbyitsid= async(req,res)=>{
  const id= req.params.id;
  try{
    const aadhar= await UpdatedAadhar.findById(id).populate('employee_id');
   res.status(200).json({ message: "Aadhar fetched successfully", aadhar });
    
  }catch(err){
    res.status(500).json({message:"error fetching aadhar",error:err.message});
  }
}
module.exports.fetchaprovaadharbyitsid= async(req,res)=>{
  const id= req.params.id;
  try{
    const aadhar= await Aadhar.findById(id).populate('employee_id');
   res.status(200).json({ message: "Aadhar fetched successfully", aadhar });
    
  }catch(err){
    res.status(500).json({message:"error fetching aadhar",error:err.message});
  }
}


module.exports.fetchpendingaadharbyuserId= async(req,res)=>{
  const userId=req.params.id;
  try{
    const aadhar= await UpdatedAadhar.find({userId:userId,status:"Pending"}).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    });
    res.json({message:"aadhar fetched successfully",aadhar:aadhar});
    }catch(err){
      res.status(500).json({message:"error fetching aadhar",error:err.message});
      }
}

    module.exports.fetchrejectedaadharbyuserId= async(req,res)=>{
      const userId=req.params.id;
      try{
        const aadhar= await UpdatedAadhar.find({userId:userId,status:"Rejected"}).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    });
        res.json({message:"aadhar fetched successfully",aadhar:aadhar});
        }catch(err){
          res.status(500).json({message:"error fetching aadhar",error:err.message});
        }
    }

    module.exports.fetchApprovedaadharbyuserId= async(req,res)=>{
    const userId= req.params.id;
    try{
      const aadhar= await Aadhar.find({userId:userId,status:"Approved"}).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    });
      res.json({message:"aadhar fetched successfully",aadhar:aadhar});

    }catch(err){
      res.status(500).json({message:"error fetching aadhar",error:err.message});
    }
    }

    module.exports.fetchAllPendingAadhar = async(req,res)=>{
      try{
        const aadhar= await UpdatedAadhar.find({status:"Pending"}).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    });
        res.json({message:"aadhar fetched successfully",aadhar:aadhar});
        }catch(err){
          res.status(500).json({message:"error fetching aadhar",error:err.message});
          }
    }
   module.exports.deleteAadhar = async (req, res) => {
  try {
    const id = req.params.id;

    const aadhar = await UpdatedAadhar.findById(id);
 
    await UpdatedAadhar.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Aadhaar record deleted successfully',
    });
  } catch (err) {
    console.error('Delete Aadhaar Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting Aadhaar record',
      error: err.message,
    });
  }
};
    module.exports.fetchAllRejectedAadhar= async(req,res)=>{
      try{
        const aadhar= await UpdatedAadhar.find({status:"Rejected"}).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    });
        res.json({message:"aadhar fetched successfully",aadhar:aadhar});
        }catch(err){
          res.status(500).json({message:"error fetching aadhar",error:err.message});
          }
    }
    module.exports.fetchAllApprovedAadhar= async(req,res)=>{
      try{
        const aadhar= await Aadhar.find({status:"Approved"}).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    });
        res.json({message:"aadhar fetched successfully", aadhar:aadhar});
        }catch(err){
          res.status(500).json({message:"error fetching aadhar",error:err.message});
        }
    }