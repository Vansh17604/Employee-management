const Pan = require('../models/pan');
const UpdatedPan = require('../models/updatedpan');
const { check, validationResult } = require('express-validator');

module.exports.createPan = [
    check('employee_id').not().isEmpty().withMessage('Employee Id is required'),
   
    check('pan_no').not().isEmpty().withMessage('Pan card No is required'),
    check('pan_name').not().isEmpty().withMessage('Pan name is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const {
                userId,
                employee_id,
                pan_no,
                pan_name
            } = req.body;
             const  pan_card=  req.file ? `/uploads/pancard/${req.file.filename}` : req.body.pan_card;

            const pan = new UpdatedPan({
                userId,
                employee_id,
                pan_card,
                pan_no,
                pan_name,
                status: "Pending"
            });
            const savedPan = await pan.save();
            res.json({ message: "Pan created successfully", pan: savedPan });
        } catch (err) {
            res.status(400).json({ message: 'Error creating pan', error: err });
        }
    }
];

module.exports.approvePan = async (req, res) => {
    const { id } = req.params;

    try {
        const pendingPan = await UpdatedPan.findById(id);
        if (!pendingPan) {
            return res.status(404).json({ message: "Pending pan not found" });
        }
        
        const linkedPanId = pendingPan.PanData?.[0]?.id;
        let panToUpdate = null;

        if (linkedPanId) {
            panToUpdate = await Pan.findById(linkedPanId);
        }

        if (panToUpdate) {
            panToUpdate.userId=pendingPan.userId,
            panToUpdate.employee_id = pendingPan.employee_id;
            panToUpdate.pan_card = pendingPan.pan_card;
            panToUpdate.pan_name = pendingPan.pan_name;
            panToUpdate.pan_no = pendingPan.pan_no;
            panToUpdate.status = "Approved";

            // Remove the reference to this pending update
            panToUpdate.updatedpanData = (panToUpdate.updatedpanData || []).filter(
                entry => entry.id.toString() !== pendingPan._id.toString()
            );

            await panToUpdate.save();
        } else {
            // Create new PAN record with correct field names
            panToUpdate = new Pan({
                userId:pendingPan.userId,
                employee_id: pendingPan.employee_id,
                pan_card: pendingPan.pan_card,
                pan_name: pendingPan.pan_name,
                pan_no: pendingPan.pan_no,
                status: "Approved"
            });

            await panToUpdate.save();
        }

        // Link the approved PAN back to the pending record
        const alreadyLinked = pendingPan.PanData?.some(
            e => e.id.toString() === panToUpdate._id.toString()
        );

        if (!alreadyLinked) {
            pendingPan.PanData = [
                ...(pendingPan.PanData || []),
                { id: panToUpdate._id, date: new Date() }
            ];
        }

        pendingPan.status = "Approved";
        await pendingPan.save();
        await UpdatedPan.findByIdAndDelete(id);
        
        res.json({
            message: "Pan approved and updated successfully",
            pan: panToUpdate
        });
    } catch (err) {
        res.status(500).json({ message: "Error approving pan", error: err.message });
    }
};

module.exports.markReject = async (req, res) => {
    const { id } = req.params;
    const { remarks } = req.body || {};

    if (!remarks) {
        return res.status(400).json({ message: "Remarks is required" });
    }

    try {
        const pendingPan = await UpdatedPan.findById(id);

        if (!pendingPan) {
            return res.status(404).json({ message: "Pending pan not found" });
        }

        pendingPan.status = "Rejected";
        pendingPan.remarks = remarks || "No reason provided";

        await pendingPan.save();

        res.json({
            message: "Pan marked as rejected",
            pan: pendingPan
        });
    } catch (err) {
        res.status(500).json({ message: "Error rejecting pan", error: err });
    }
};

module.exports.editPanData = [
    check('pan_card').not().isEmpty().withMessage('Pan Card is required'),
    check('pan_no').not().isEmpty().withMessage('Pan card No is required'),
    check('pan_name').not().isEmpty().withMessage('Pan name is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const {
          
            pan_name,
            pan_no
        } = req.body;
        const  pan_card=  req.file ? `/uploads/updatedpancard/${req.file.filename}` : req.body.pan_card;

        try {
            const pendingPan = await UpdatedPan.findById(id);
            if (!pendingPan) {
                return res.status(404).json({ message: "Pending pan not found" });
            }

            pendingPan.pan_card = pan_card || pendingPan.pan_card;
            pendingPan.pan_name = pan_name || pendingPan.pan_name;
            pendingPan.pan_no = pan_no || pendingPan.pan_no;

            pendingPan.status = "Pending";

            const updatedPan = await pendingPan.save();

            res.json({
                message: "Pending pan data updated and status set to Pending",
                pan: updatedPan
            });
        } catch (err) {
            res.status(500).json({ message: "Error editing pending pan", error: err });
        }
    }
];

module.exports.editApprovalPanData = [
    check('pan_card').not().isEmpty().withMessage('Pan Card is required'),
    check('pan_no').not().isEmpty().withMessage('Pan card No is required'),
    check('pan_name').not().isEmpty().withMessage('Pan name is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const {
            pan_name,
            pan_no
        } = req.body;
        const  pan_card=  req.file ? `/uploads/updateapprovpancard/${req.file.filename}` : req.body.pan_card;

        try {
            const approvedPan = await Pan.findById(id);
            if (!approvedPan) {
                return res.status(404).json({ message: "Approved pan not found" });
            }

            
            const newPendingEntry = new UpdatedPan({
              userId:approvedPan.userId,
                employee_id: approvedPan.employee_id,
                pan_card,
                pan_name,
                pan_no,
                status: "Pending"
            });

            const existingPanData = newPendingEntry.PanData || [];
            const isPanAlreadyLinked = existingPanData.some(e => e.id.toString() === id);
            if (!isPanAlreadyLinked) {
                newPendingEntry.PanData = [
                    ...(newPendingEntry.PanData || []),
                    { id, date: new Date() }
                ];
            }

            const savedPending = await newPendingEntry.save();
            const existingUpdateData = approvedPan.updatedpanData || [];
            const isUpdateAlreadyLinked = existingUpdateData.some(
                e => e.id.toString() === savedPending._id.toString()
            );
            if (!isUpdateAlreadyLinked) {
                approvedPan.updatedpanData.push({
                    id: savedPending._id,
                    date: new Date()
                });
                await approvedPan.save();
            }

            res.json({
                message: "Pan data copied to pending model for approval and references updated",
                pan: savedPending
            });

        } catch (err) {
            res.status(500).json({ message: "Error creating pending approval", error: err.message });
        }
    }
];


module.exports.fetctpanbyemployeeid= async(req,res)=>{
    try {
        const pan = await UpdatedPan.find({ employee_id: req.params.id });
        res.json({pan:pan});
        } catch (err) {
            res.status(500).json({ message: "Error fetching pan data", error: err.message});
            }
}

module.exports.fetchpanbyitsid=async(req,res)=>{
    try{
        const pan = await UpdatedPan.findById(req.params.id);
        res.json({pan});
    }catch(err){
          res.status(500).json({ message: "Error fetching pan data", error: err.message});
    }
}

module.exports.getAllPendingPanByUserId = async (req, res) => {
  try {
    const pendingPans = await UpdatedPan.find({ status: "Pending", userId: req.params.id });
    res.json({
      message: "Pending PANs retrieved successfully",
      pans: pendingPans
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving pending PANs", error: err.message });
  }
};
module.exports.getAllApprovedPans = async (req, res) => {
  try {
    const approvedPans = await Pan.find({ status: "Approved" })
      .populate('employee_id', 'name work_id')
      .sort({ createdAt: -1 });

    res.json({
      message: "Approved PANs retrieved successfully",
      pans: approvedPans
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving approved PANs", error: err.message });
  }
};
module.exports.getApprovedPanById = async (req, res) => {
  const { id } = req.params;

  try {
 
    const  pan = await Pan.findById(id).populate('employee_id', 'name work_id');


    if (!pan) {
      return res.status(404).json({ message: "PAN not found" });
    }

    res.json({
      message: "PAN retrieved successfully",
      pan: pan
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving PAN", error: err.message });
  }
};

module.exports.getPanByEmployeeId = async (req, res) => {
  const { employee_id } = req.params;

  try {
    const approvedPans = await Pan.find({ 
      employee_id: employee_id, 
      status: "Approved" 
    }).populate('employee_id', 'name work_id');

    const pendingPans = await UpdatedPan.find({ 
      employee_id: employee_id 
    }).populate('employee_id', 'name work_id');

    res.json({
      message: "Employee PANs retrieved successfully",
      approved: approvedPans,
      pending: pendingPans
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving employee PANs", error: err.message });
  }
};

module.exports.fetchPendingPanByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const pan = await UpdatedPan.find({ userId: userId, status: "Pending" }).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    });
    res.json({ message: "PAN fetched successfully", pan: pan });
  } catch (err) {
    res.status(500).json({ message: "Error fetching PAN", error: err.message });
  }
};
module.exports.fetchPanByItsId = async (req, res) => {
  const id = req.params.id;
  try {
    const pan = await UpdatedPan.findById(id).populate('employee_id');
    res.status(200).json({ message: "PAN fetched successfully", pan });
  } catch (err) {
    res.status(500).json({ message: "Error fetching PAN", error: err.message });
  }
};
module.exports.fetchapprovPanByItsId = async (req, res) => {
  const id = req.params.id;
  try {
    const pan = await Pan.findById(id).populate('employee_id');
    res.status(200).json({ message: "PAN fetched successfully", pan });
  } catch (err) {
    res.status(500).json({ message: "Error fetching PAN", error: err.message });
  }
};
module.exports.fetchRejectedPanByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const pan = await UpdatedPan.find({ userId: userId, status: "Rejected" }).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    });
    res.json({ message: "PAN fetched successfully", pan: pan });
  } catch (err) {
    res.status(500).json({ message: "Error fetching PAN", error: err.message });
  }
};
module.exports.fetchApprovedPanByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const pan = await Pan.find({ userId: userId, status: "Approved" }).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    });
    res.json({ message: "PAN fetched successfully", pan: pan });
  } catch (err) {
    res.status(500).json({ message: "Error fetching PAN", error: err.message });
  }
};

module.exports.fetchallPendingpans = async (req, res) => {
  try {
    const pendingPans = await UpdatedPan.find({ status: "Pending" })
     .populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    })
      .sort({ createdAt: -1 });

    res.json({
      message: "Pending PANs retrieved successfully",
      pans: pendingPans
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving pending PANs", error: err.message });
  }
};
module.exports.deletePan = async (req, res) => {
  try {
    const id = req.params.id;

    const pan = await UpdatedPan.findById(id);
 
    await UpdatedPan.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'pan record deleted successfully',
    });
  } catch (err) {
    console.error('Delete pan Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting Pan record',
      error: err.message,
    });
  }
};
module.exports.fetchAllRejectedPan = async (req, res) => {
  try {
    const pan = await UpdatedPan.find({ status: "Rejected" }).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    });
    res.json({ message: "PAN fetched successfully", pan: pan });
  } catch (err) {
    res.status(500).json({ message: "Error fetching PAN", error: err.message });
  }
};
module.exports.fetchAllApprovedPan = async (req, res) => {
  try {
    const pan = await Pan.find({ status: "Approved" }).populate({
      path: 'employee_id',
      select: 'name photo perment_address work_id employeeId',
      populate: {
        path: 'work_id',
        select: 'work_place_name'
      }
    });
    res.json({ message: "PAN fetched successfully", pan: pan });
  } catch (err) {
    res.status(500).json({ message: "Error fetching PAN", error: err.message });
  }
};