const BankDetail= require('../models/bankdetails');
const UpdatedBankDetail= require('../models/updatedbankdetails');
const { check, validationResult } = require('express-validator');

module.exports.createBankDetail = [
  check('employee_id').not().isEmpty().withMessage('Employee ID is required'),
  check('bank_acc_no').isNumeric().withMessage('Bank account number must be numeric'),
  check('bank_acc_name').not().isEmpty().withMessage('Bank account name is required'),
  check('bank_id').not().isEmpty().withMessage('Bank ID is required'),
  check('branch_name').not().isEmpty().withMessage('Branch name is required'),
  check('ifsc_code').not().isEmpty().withMessage('IFSC code is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        employee_id,
        userId,
        bank_acc_no,
        bank_acc_name,
        bank_id,
        branch_name,
        ifsc_code
      } = req.body;  
      const  passbook_image=  req.file ? `/uploads/passbookimage/${req.file.filename}` : req.body.passbook_image;


      const bankDetail = new UpdatedBankDetail({
        employee_id,
        userId,
        bank_acc_no,
        bank_acc_name,
        bank_id,
        branch_name,
        ifsc_code,
        passbook_image,
        status: "Pending"
      });

      const savedBankDetail = await bankDetail.save();
      res.json({ message: 'Bank detail created successfully', bankDetail: savedBankDetail });
    } catch (err) {
      res.status(400).json({ message: 'Error creating bank detail', error: err });
    }
  }
];

module.exports.approveBankDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const pendingBankDetail = await UpdatedBankDetail.findById(id);
    if (!pendingBankDetail) {
      return res.status(404).json({ message: "Pending bank detail not found" });
    }
    
    const linkedBankDetailId = pendingBankDetail.BankData?.[0]?.id;

    let bankDetailToUpdate = null;

    if (linkedBankDetailId) {
      bankDetailToUpdate = await BankDetail.findById(linkedBankDetailId);
    }

    if (bankDetailToUpdate) {
      // Update existing bank detail
      bankDetailToUpdate.userId=pendingBankDetail.userId;
      bankDetailToUpdate.employee_id = pendingBankDetail.employee_id;
      bankDetailToUpdate.bank_acc_no = pendingBankDetail.bank_acc_no;
      bankDetailToUpdate.bank_acc_name = pendingBankDetail.bank_acc_name;
      bankDetailToUpdate.bank_id = pendingBankDetail.bank_id;
      bankDetailToUpdate.branch_name = pendingBankDetail.branch_name;
      bankDetailToUpdate.ifsc_code = pendingBankDetail.ifsc_code;
      bankDetailToUpdate.passbook_image = pendingBankDetail.passbook_image;

      
      bankDetailToUpdate.updatedBankData = (bankDetailToUpdate.updatedBankData || []).filter(
        entry => entry.id.toString() !== pendingBankDetail._id.toString()
      );

      await bankDetailToUpdate.save();
    } else {
      
      bankDetailToUpdate = new BankDetail({
        userId:pendingBankDetail.userId,
        employee_id: pendingBankDetail.employee_id,
        bank_acc_no: pendingBankDetail.bank_acc_no,
        bank_acc_name: pendingBankDetail.bank_acc_name,
        bank_id: pendingBankDetail.bank_id,
        branch_name: pendingBankDetail.branch_name,
        ifsc_code: pendingBankDetail.ifsc_code,
        passbook_image: pendingBankDetail.passbook_image
      });

      await bankDetailToUpdate.save();
    }

    const alreadyLinked = pendingBankDetail.BankData?.some(
      e => e.id.toString() === bankDetailToUpdate._id.toString()
    );

    if (!alreadyLinked) {
      pendingBankDetail.BankData = [
        ...(pendingBankDetail.BankData || []),
        { id: bankDetailToUpdate._id, data: new Date() }
      ];
    }

    pendingBankDetail.status = "Approved";
    await pendingBankDetail.save();
    await UpdatedBankDetail.findByIdAndDelete(id);
    
    res.json({
      message: "Bank detail approved and updated successfully",
      bankDetail: bankDetailToUpdate
    });
  } catch (err) {
    res.status(500).json({ message: "Error approving bank detail", error: err.message });
  }
};

module.exports.markReject = async (req, res) => {
  const { id } = req.params;
  const { remarks } = req.body || {};
  
  if (!remarks) {
    return res.status(400).json({ message: "Remarks is required" });
  }

  try {
    const pendingBankDetail = await UpdatedBankDetail.findById(id);

    if (!pendingBankDetail) {
      return res.status(404).json({ message: "Pending bank detail not found" });
    }

    pendingBankDetail.status = "Rejected";
    pendingBankDetail.remarks = remarks || "No reason provided";

    await pendingBankDetail.save();

    res.json({
      message: "Bank detail marked as rejected",
      bankDetail: pendingBankDetail
    });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting bank detail", error: err });
  }
};

module.exports.editBankDetailData = [
  check('bank_acc_no').isNumeric().withMessage('Bank account number must be numeric'),
  check('bank_acc_name').not().isEmpty().withMessage('Bank account name is required'),
  check('bank_id').not().isEmpty().withMessage('Bank ID is required'),
  check('branch_name').not().isEmpty().withMessage('Branch name is required'),
  check('ifsc_code').not().isEmpty().withMessage('IFSC code is required'),
  check('passbook_image').not().isEmpty().withMessage('Passbook image is required'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      bank_acc_no,
      bank_acc_name,
      bank_id,
      branch_name,
      ifsc_code,
    } = req.body;
      const  passbook_image=  req.file ? `/uploads/updatepassbookimage/${req.file.filename}` : req.body.passbook_image;

    try {
      const pendingBankDetail = await UpdatedBankDetail.findById(id);
      if (!pendingBankDetail) {
        return res.status(404).json({ message: "Pending bank detail not found" });
      }

      // Update fields
      pendingBankDetail.bank_acc_no = bank_acc_no || pendingBankDetail.bank_acc_no;
      pendingBankDetail.bank_acc_name = bank_acc_name || pendingBankDetail.bank_acc_name;
      pendingBankDetail.bank_id = bank_id || pendingBankDetail.bank_id;
      pendingBankDetail.branch_name = branch_name || pendingBankDetail.branch_name;
      pendingBankDetail.ifsc_code = ifsc_code || pendingBankDetail.ifsc_code;
      pendingBankDetail.passbook_image = passbook_image || pendingBankDetail.passbook_image;
      
      pendingBankDetail.status = "Pending";

      const updatedBankDetail = await pendingBankDetail.save();

      res.json({
        message: "Pending bank detail data updated and status set to Pending",
        bankDetail: updatedBankDetail
      });
    } catch (err) {
      res.status(500).json({ message: "Error editing pending bank detail", error: err });
    }
  }
];

module.exports.editApprovalBankDetailData = [
  check('bank_acc_no').isNumeric().withMessage('Bank account number must be numeric'),
  check('bank_acc_name').not().isEmpty().withMessage('Bank account name is required'),
  check('bank_id').not().isEmpty().withMessage('Bank ID is required'),
  check('branch_name').not().isEmpty().withMessage('Branch name is required'),
  check('ifsc_code').not().isEmpty().withMessage('IFSC code is required'),
  check('passbook_image').not().isEmpty().withMessage('Passbook image is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      bank_acc_no,
      bank_acc_name,
      bank_id,
      branch_name,
      ifsc_code,
    } = req.body;
      const  passbook_image=  req.file ? `/uploads/updateapprovepassbookimage/${req.file.filename}` : req.body.passbook_image;

    try {
      const approvedBankDetail = await BankDetail.findById(id);
      if (!approvedBankDetail) {
        return res.status(404).json({ message: "Approved bank detail not found" });
      }

   
      const newPendingEntry = new UpdatedBankDetail({
        userId: approvedBankDetail.userId,
        employee_id: approvedBankDetail.employee_id,
        bank_acc_no,
        bank_acc_name,
        bank_id,
        branch_name,
        ifsc_code,
        passbook_image,
        status: "Pending"
      });

      // Link to existing approved bank detail
      const existingBankData = newPendingEntry.BankData || [];
      const isBankDetailAlreadyLinked = existingBankData.some(e => e.id.toString() === id);
      if (!isBankDetailAlreadyLinked) {
        newPendingEntry.BankData = [
          ...(newPendingEntry.BankData || []),
          { id, data: new Date() }
        ];
      }

      const savedPending = await newPendingEntry.save();

      // Update approved bank detail with reference to pending update
      const existingUpdateData = approvedBankDetail.updatedBankData || [];
      const isUpdateAlreadyLinked = existingUpdateData.some(
        e => e.id.toString() === savedPending._id.toString()
      );
      if (!isUpdateAlreadyLinked) {
        approvedBankDetail.updatedBankData.push({
          id: savedPending._id,
          date: new Date()
        });
        await approvedBankDetail.save();
      }

      res.json({
        message: "Bank detail data copied to pending model for approval and references updated",
        bankDetail: savedPending
      });

    } catch (err) {
      res.status(500).json({ message: "Error creating pending approval", error: err.message });
    }
  }
];

module.exports.getAllPendingBankDetails = async (req, res) => {
  try {
    const pendingBankDetails = await UpdatedBankDetail.find({ status: "pending" })
      .populate('employee_id', 'name work_id')
      .populate('bank_id', 'bank_name')
      .sort({ createdAt: -1 });

    res.json({
      message: "Pending bank details retrieved successfully",
      bankDetails: pendingBankDetails
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving pending bank details", error: err.message });
  }
};

module.exports.getAllApprovedBankDetails = async (req, res) => {
  try {
    const approvedBankDetails = await BankDetail.find({})
      .populate('employee_id', 'name work_id')
      .populate('bank_id', 'bank_name')
      .sort({ createdAt: -1 });

    res.json({
      message: "Approved bank details retrieved successfully",
      bankDetails: approvedBankDetails
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving approved bank details", error: err.message });
  }
};

module.exports.getBankDetailById = async (req, res) => {
  const { id } = req.params;

  try {
    let bankDetail = await UpdatedBankDetail.findById(id)
      .populate('employee_id', 'name work_id')
      .populate('bank_id', 'bank_name');
    
    if (!bankDetail) {
      bankDetail = await BankDetail.findById(id)
        .populate('employee_id', 'name work_id')
        .populate('bank_id', 'bank_name');
    }

    if (!bankDetail) {
      return res.status(404).json({ message: "Bank detail not found" });
    }

    res.json({
      message: "Bank detail retrieved successfully",
      bankDetail: bankDetail
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving bank detail", error: err.message });
  }
};

module.exports.getBankDetailByEmployeeId = async (req, res) => {
  const { employee_id } = req.params;

  try {
    const approvedBankDetails = await BankDetail.find({ 
      employee_id: employee_id
    }).populate('employee_id', 'name work_id')
     .populate('bank_id', 'bank_name');

    const pendingBankDetails = await UpdatedBankDetail.find({ 
      employee_id: employee_id 
    }).populate('employee_id', 'name work_id')
     .populate('bank_id', 'bank_name');

    res.json({
      message: "Employee bank details retrieved successfully",
      approved: approvedBankDetails,
      pending: pendingBankDetails
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving employee bank details", error: err.message });
  }
};

module.exports.getAllRejectedBankDetails = async (req, res) => {
  try {
    const rejectedBankDetails = await UpdatedBankDetail.find({ status: "rejected" })
      .populate('employee_id', 'name work_id')
      .populate('bank_id', 'bank_name')
      .sort({ createdAt: -1 });

    res.json({
      message: "Rejected bank details retrieved successfully",
      bankDetails: rejectedBankDetails
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving rejected bank details", error: err.message });
  }
};




module.exports.fetchbankdetailbyemployeid= async(req,res)=>{
  try{
    const bankdetail=await UpdatedBankDetail.find({employee_id:req.params.id}).populate('bank_id employee_id');
    res.json({message:"Bank details retrieved successfully",bankdetail:bankdetail})
    }
    catch(err){
      res.status(500).json({message:"Error retrieving bank details",error:err.message})
      }
}
module.exports.fetchbankdetailsbyitid= async(req,res)=>{
  try{
    const bankdetail= await UpdatedBankDetail.findById(req.params.id).populate('bank_id employee_id');
    res.json({bankdetail});
  }catch(err){
     res.status(500).json({message:"Error retrieving bank details",error:err.message})
  }
}
module.exports.fetchapprovbankdetailsbyitid= async(req,res)=>{
  try{
    const bankdetail= await BankDetail.findById(req.params.id).populate('bank_id employee_id');
    res.json({bankdetail});
  }catch(err){
     res.status(500).json({message:"Error retrieving bank details",error:err.message})
  }
}
module.exports.fetchallpendingbankdetailsbyuserid= async(req,res)=>{
  try{
    const userId= req.params.id
    const bankdetail= await UpdatedBankDetail.find({userId:userId,status:"Pending"}).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    }).populate('bank_id');
    res.json({message:"Bank details retrieved successfully",bankdetail:bankdetail})
    }catch(err){
      res.status(500).json({message:"Error retrieving bank details",error:err.message})
      }
}

    module.exports.fetchAllPendingBankDetails = async(req,res)=>{
      try{
        const bankdetails= await UpdatedBankDetail.find({status:"Pending"}).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    }).populate('bank_id');
        res.json({message:"bankdetails fetched successfully",bankdetails:bankdetails});
        }catch(err){
          res.status(500).json({message:"error fetching bankdetails",error:err.message});
          }
    }
   module.exports.deleteBankDetails = async (req, res) => {
  try {
    const id = req.params.id;

    const BankDetails = await UpdatedBankDetail.findById(id);
 
    await UpdatedBankDetail.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'BankDetails record deleted successfully',
    });
  } catch (err) {
    console.error('Delete BankDetails Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting BankDetails record',
      error: err.message,
    });
  }
};
module.exports.fetchAllRejecedBankDetails = async(req,res)=>{
      try{
        const bankdetails= await UpdatedBankDetail.find({status:"Rejected"}).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    }).populate('bank_id');
        res.json({message:"bankdetails fetched successfully",bankdetails:bankdetails});
        }catch(err){
          res.status(500).json({message:"error fetching bankdetails",error:err.message});
          }
    }
  module.exports.fetchAllApprovedBankDetails = async(req,res)=>{
      try{
        const bankdetails= await BankDetail.find({status:"Approved"}).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    }).populate('bank_id');
        res.json({message:"bankdetails fetched successfully",bankdetails:bankdetails});
        }catch(err){
          res.status(500).json({message:"error fetching bankdetails",error:err.message});
          }
    }
    module.exports.fetchallRejectedbankdetailsbyuserid= async(req,res)=>{
  try{
    const userId= req.params.id
    const bankdetail= await UpdatedBankDetail.find({userId:userId,status:"Rejected"}).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    }).populate('bank_id');
    res.json({message:"Bank details retrieved successfully",bankdetail:bankdetail})
    }catch(err){
      res.status(500).json({message:"Error retrieving bank details",error:err.message})
      }
}
module.exports.fetchallApprovedbankdetailsbyuserid= async(req,res)=>{
  try{
    const userId= req.params.id
    const bankdetail= await BankDetail.find({userId:userId,status:"Approved"}).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    }).populate('bank_id');
    res.json({message:"Bank details retrieved successfully",bankdetail:bankdetail})
    }catch(err){
      res.status(500).json({message:"Error retrieving bank details",error:err.message})
      }
}