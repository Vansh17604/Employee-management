const UpdateModel = require('../models/update');
const Employee = require('../models/employee');
const { check, validationResult } = require('express-validator');
const getNextEmployeeId =require('../utils/getNextEmployeeId');


module.exports.createEmployee = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('perment_address').not().isEmpty().withMessage('Permanent address is required'),
  check('current_address').not().isEmpty().withMessage('Current address is required'),
  check('primary_mno').isNumeric().withMessage('Primary mobile number must be numeric'),
  check('secondary_mno').isNumeric().withMessage('Secondary mobile number must be numeric'),
  check('home_mno').isNumeric().withMessage('Home mobile number must be numeric'),
  check('work_id').not().isEmpty().withMessage('Work ID is required'),
  check('userId').not().isEmpty().withMessage('User Id is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const prefix = "GSS";
const employeeId = await getNextEmployeeId(prefix);

    try {
      
      const {
       
        userId,
        name,
        perment_address,
        current_address,
        primary_mno,
        secondary_mno,
        home_mno,
        work_id,

        
      } = req.body;
      const photo = req.file ? `/uploads/profilependingemploye/${req.file.filename}` : req.body.photo;

      const employee = new UpdateModel({
        employeeId,
        name,
        userId,
        perment_address,
        current_address,
        primary_mno,
        secondary_mno,
        home_mno,
        work_id,
        status : "Pending",
        workstatus:"Active",
        photo
      });

      const savedEmployee = await employee.save();
      res.json({ message: 'Employee created successfully', employee: savedEmployee });
    } catch (err) {
      res.status(400).json({ message: 'Error creating employee', error: err });
    }
  }
];



module.exports.approveEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const pendingEmployee = await UpdateModel.findById(id);
    if (!pendingEmployee) {
      return res.status(404).json({ message: "Pending employee not found" });
    }

  
    const linkedEmployeeId = pendingEmployee.employData?.[0]?.id;

    let employeeToUpdate = null;

    if (linkedEmployeeId) {
      employeeToUpdate = await Employee.findById(linkedEmployeeId);
    }

    if (employeeToUpdate) {
    
      employeeToUpdate.name = pendingEmployee.name;
      employeeToUpdate.employeeId=pendingEmployee.employeeId;
      employeeToUpdate.perment_address = pendingEmployee.perment_address;
      employeeToUpdate.current_address = pendingEmployee.current_address;
      employeeToUpdate.primary_mno = pendingEmployee.primary_mno;
      employeeToUpdate.secondary_mno = pendingEmployee.secondary_mno;
      employeeToUpdate.home_mno = pendingEmployee.home_mno;
      employeeToUpdate.photo = pendingEmployee.photo;
      employeeToUpdate.userId = pendingEmployee.userId;
      employeeToUpdate.status = "Approved";
        employeeToUpdate.workstatus = "Active";
      employeeToUpdate.updateData = (employeeToUpdate.updateData || []).filter(
        entry => entry.id.toString() !== pendingEmployee._id.toString()
      );

      await employeeToUpdate.save();
    } else {
      employeeToUpdate = new Employee({
        name: pendingEmployee.name,
         employeeId: pendingEmployee.employeeId,
        perment_address: pendingEmployee.perment_address,
        current_address: pendingEmployee.current_address,
        primary_mno: pendingEmployee.primary_mno,
        secondary_mno: pendingEmployee.secondary_mno,
        home_mno: pendingEmployee.home_mno,
        work_id: pendingEmployee.work_id,
        userId:pendingEmployee.userId,
        status: "Approved",
        workstatus:"Active",
        photo: pendingEmployee.photo
      });

      await employeeToUpdate.save();
    }
    const alreadyLinked = pendingEmployee.employData?.some(
      e => e.id.toString() === employeeToUpdate._id.toString()
    );

    if (!alreadyLinked) {
      pendingEmployee.employData = [
        ...(pendingEmployee.employData || []),
        { id: employeeToUpdate._id, date: new Date() }
      ];
    }

    pendingEmployee.status = "Approved";
    await pendingEmployee.save();

    await UpdateModel.findByIdAndDelete(id);

    res.json({
      message: "Employee approved and updated successfully",
      employee: employeeToUpdate
    });

  } catch (err) {
    res.status(500).json({ message: "Error approving employee", error: err.message });
  }
};



module.exports.markReject = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body || {};
  if (!reply) {
  return res.status(400).json({ message: "Reply is required" });
}

  try {
    const pendingEmployee = await UpdateModel.findById(id);

    if (!pendingEmployee) {
      return res.status(404).json({ message: "Pending employee not found" });
    }

    pendingEmployee.status = "Rejected";
    pendingEmployee.reply = reply || "No reason provided";

    await pendingEmployee.save();

    res.json({
      message: "Employee marked as rejected",
      employee: pendingEmployee
    });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting employee", error: err });
  }
};


module.exports.editEmployeeData = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('perment_address').not().isEmpty().withMessage('Permanent address is required'),
  check('current_address').not().isEmpty().withMessage('Current address is required'),
  check('primary_mno').isNumeric().withMessage('Primary mobile number must be numeric'),
  check('secondary_mno').isNumeric().withMessage('Secondary mobile number must be numeric'),
  check('home_mno').isNumeric().withMessage('Home mobile number must be numeric'),
  check('work_id').not().isEmpty().withMessage('Work ID is required'),
  check('userId').not().isEmpty().withMessage('User Id is required'),
  check('photo').not().isEmpty().withMessage('Photo is required'),async (req, res) => {
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }
  const { id } = req.params;
  const {
    name,
    userId,
    perment_address,
    current_address,
    primary_mno,
    secondary_mno,
    home_mno,
    work_id,

  } = req.body;
  const photo = req.file ? `/uploads/editprofile/${req.file.filename}` : req.body.photo;


  try {
    const pendingEmployee = await UpdateModel.findById(id);
    if (!pendingEmployee) {
      return res.status(404).json({ message: "Pending employee not found" });
    }

    pendingEmployee.name = name || pendingEmployee.name;
    pendingEmployee.userId = userId || pendingEmployee.userId;
    pendingEmployee.perment_address = perment_address || pendingEmployee.perment_address;
    pendingEmployee.current_address = current_address || pendingEmployee.current_address;
    pendingEmployee.primary_mno = primary_mno || pendingEmployee.primary_mno;
    pendingEmployee.secondary_mno = secondary_mno || pendingEmployee.secondary_mno;
    pendingEmployee.home_mno = home_mno || pendingEmployee.home_mno;
    pendingEmployee.work_id = work_id || pendingEmployee.work_id;
    pendingEmployee.photo = photo || pendingEmployee.photo;
    
  
    pendingEmployee.status = "Pending";

    const updatedEmployee = await pendingEmployee.save();

    res.json({
      message: "Pending employee data updated and status set to Pending",
      employee: updatedEmployee
    });
  } catch (err) {
    res.status(500).json({ message: "Error editing pending employee", error: err });
  }
}
];



module.exports.editApprovalEmployeeData = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('perment_address').not().isEmpty().withMessage('Permanent address is required'),
  check('current_address').not().isEmpty().withMessage('Current address is required'),
  check('primary_mno').isNumeric().withMessage('Primary mobile number must be numeric'),
  check('secondary_mno').isNumeric().withMessage('Secondary mobile number must be numeric'),
  check('home_mno').isNumeric().withMessage('Home mobile number must be numeric'),
  check('work_id').not().isEmpty().withMessage('Work ID is required'),
  check('userId').not().isEmpty().withMessage('User Id is required'),
  check('photo').not().isEmpty().withMessage('Photo is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      name,
      userId,
      employeeId,
      perment_address,
      current_address,
      primary_mno,
      secondary_mno,
      home_mno,
      work_id,
      workstatus,

    
    } = req.body;
    const photo = req.file ? `/uploads/editupadated/${req.file.filename}` : req.body.photo;


    try {
      const approvedEmployee = await Employee.findById(id);
      if (!approvedEmployee) {
        return res.status(404).json({ message: "Approved employee not found" });
      }

     
      const newPendingEntry = new UpdateModel({
        name,
        userId,
        employeeId,
        perment_address,
        current_address,
        primary_mno,
        secondary_mno,
        home_mno,
        work_id,
        photo,
        workstatus: "Active",
        status: "Pending"
      });

      
      const existingEmployData = newPendingEntry.employData || [];
      const isEmployeeAlreadyLinked = existingEmployData.some(e => e.id.toString() === id);
      if (!isEmployeeAlreadyLinked) {
        newPendingEntry.employData = [
          ...(newPendingEntry.employData || []),
          { id, date: new Date() }
        ];
      }

      const savedPending = await newPendingEntry.save();

     
      const existingUpdateData = approvedEmployee.updateData || [];
      const isUpdateAlreadyLinked = existingUpdateData.some(
        e => e.id.toString() === savedPending._id.toString()
      );
      if (!isUpdateAlreadyLinked) {
        approvedEmployee.updateData.push({
          id: savedPending._id,
          date: new Date()
        });
        await approvedEmployee.save();
      }

      res.json({
        message: "Employee data copied to pending model for approval and references updated",
        employee: savedPending
      });

    } catch (err) {
      res.status(500).json({ message: "Error creating pending approval", error: err.message });
    }
  }
];


module.exports.fetchEmployeesbyId = async (req, res) => {
  try{
    const id = req.params.id;
    const employee = await UpdateModel.findById(id).populate( 'work_id userId');
 
    res.json(employee);
    }
  catch (err) {
    res.status(500).json({ message: "Error fetching employee", error: err.message });
  }
  };
  module.exports.fetchEmployeesByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const employees = await UpdateModel.find({ userId,status:"Pending"})
      .populate('work_id')
     

    res.json(employees );
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
};
  module.exports.fetchRejectedEmployeesByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const employees = await UpdateModel.find({ userId,status:"Rejected"})
      .populate('work_id')
     

    res.json(employees );
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
};
  module.exports.fetchApprovedEmployeesByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const employees = await Employee.find({ userId,status:"Approved"})
      .populate('work_id')
     

    res.json(employees );
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
};
module.exports.fetchapprovedemployeebyitsid=async(req,res)=>{
  try{
     const id = req.params.id;
    const employee = await Employee.findById(id).populate( 'work_id userId');
 
    res.json(employee);
    }
  catch (err) {
    res.status(500).json({ message: "Error fetching employee", error: err.message });
  }
}

module.exports.fetchallthePendingUser = async (req, res) => {
  try {
    const pendingUsers = await UpdateModel.find({ status: 'Pending' })
      .populate('work_id');


    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending users", error: err.message });
  }
};
module.exports.fetchalltheRejected = async (req, res) => {
  try {
    const rejectedUsers = await UpdateModel.find({ status: 'Rejected' })
      .populate("work_id");


    res.json(rejectedUsers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending users", error: err.message });
  }
};
module.exports.fetchalltheApproved = async (req, res) => {
  try {
    const approvedUsers = await Employee.find()
        .populate("work_id");


    res.json(approvedUsers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending users", error: err.message });
  }
};
module.exports.updateWorkstatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { workstatus } = req.body; 

 

    const updatedEmployee = await UpdateModel.findByIdAndUpdate(
      id,
      { workstatus },
      { new: true }
    ).populate('work_id userId');

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({message : "Status Changed Sucessfully"});

  } catch (err) {
    res.status(500).json({ message: "Error updating workstatus", error: err.message });
  }
};



module.exports.DeletependingEmployee = async (req, res) => {
  const id = req.params.id;

  try {
      const user = await UpdateModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== 'Pending') {
      return res.status(400).json({ message: "Only pending employees can be deleted" });
    }

    await UpdateModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Pending employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};











