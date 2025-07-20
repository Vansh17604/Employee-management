const Work = require('../models/work');
const { check, validationResult } = require('express-validator');
const UpdateModel = require('../models/update');
const Employee = require('../models/employee');


module.exports.createWork = [
  check('work_place_name').not().isEmpty().withMessage('Work place name is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { work_place_name } = req.body;
         const existingWork = await Work.findOne({ work_place_name: { $regex: new RegExp(`^${work_place_name}$`, 'i') } });
            if (existingWork) {
              return res.status(400).json({ message: 'Work name already exists' });
            }
      const work = new Work({ work_place_name });
      const savedWork = await work.save();
      res.json({ message: 'Work created successfully', work: savedWork });
    } catch (err) {
      res.status(400).json({ message: 'Error creating work', error: err });
    }
  }
];

module.exports.updateWork = [
  check('work_place_name').not().isEmpty().withMessage('Work place name is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { work_place_name } = req.body;
        const existingWork = await Work.findOne({ work_place_name: { $regex: new RegExp(`^${work_place_name}$`, 'i') } });
            if (existingWork) {
              return res.status(400).json({ message: 'Work name already exists' });
            }

      const updatedWork = await Work.findByIdAndUpdate(
        id,
        { work_place_name },
        { new: true }
      );

      if (!updatedWork) {
        return res.status(404).json({ message: 'Work not found' });
      }

      res.json({ message: 'Work updated successfully', work: updatedWork });
    } catch (err) {
      res.status(400).json({ message: 'Error updating work', error: err });
    }
  }
];

module.exports.deleteWork = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if any UpdateModel documents reference this work_id
    const relatedUpdates = await UpdateModel.findOne({ work_id: id });
    if (relatedUpdates) {
      return res.status(400).json({
        message: 'Please delete related update records before deleting this work.'
      });
    }

    // Check if any Employee documents reference this work_id
    const relatedEmployees = await Employee.findOne({ work_id: id });
    if (relatedEmployees) {
      return res.status(400).json({
        message: 'Please delete related employees before deleting this work.'
      });
    }

    // If no related records, delete the work entry
    const deletedWork = await Work.findByIdAndDelete(id);

    if (!deletedWork) {
      return res.status(404).json({ message: 'Work not found' });
    }

    res.json({ message: 'Work deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting work', error: err });
  }
};

module.exports.getAllWorks = async (req, res) => {
  try {
    const works = await Work.find().sort({ createdAt: -1 });
    res.json({ works });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching works', error: err });
  }
};