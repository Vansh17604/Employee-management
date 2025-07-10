const Bank = require('../models/bank');
const { check, validationResult } = require('express-validator');


module.exports.createBank = [
  check('bank_name').not().isEmpty().withMessage('Bank place name is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { bank_name } = req.body;
       const existingBank = await Bank.findOne({ bank_name: { $regex: new RegExp(`^${bank_name}$`, 'i') } });
      if (existingBank) {
        return res.status(400).json({ message: 'Bank name already exists' });
      }
      const bank = new Bank({ bank_name });
      const savedBank = await bank.save();
      res.json({ message: 'Bank created successfully', work: savedBank });
    } catch (err) {
      res.status(400).json({ message: 'Error creating bank', error: err });
    }
  }
];

module.exports.updateBank = [
  check('bank_name').not().isEmpty().withMessage('Bank place name is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { bank_name } = req.body;
       const existingBank = await Bank.findOne({ bank_name: { $regex: new RegExp(`^${bank_name}$`, 'i') } });
      if (existingBank) {
        return res.status(400).json({ message: 'Bank name already exists' });
      }

      const updatedBank = await Bank.findByIdAndUpdate(
        id,
        { bank_name },
        { new: true }
      );

      if (!updatedBank) {
        return res.status(404).json({ message: 'Bank not found' });
      }

      res.json({ message: 'Bank updated successfully', bank: updatedBank });
    } catch (err) {
      res.status(400).json({ message: 'Error updating bank', error: err });
    }
  }
];

module.exports.deleteBank = async(req,res)=>{
  try {
    const { id } = req.params;
    const deletedBank = await Bank.findByIdAndDelete(id);
    if (!deletedBank) {
      return res.status(404).json({ message: 'Bank not found' });
      }
      res.json({ message: 'Bank deleted successfully' });
      } catch (err) {
        res.status(400).json({ message: 'Error deleting bank', error: err });
        }
}

module.exports.getBank = async(req,res)=>{
  try {
    const banks = await Bank.find();
    res.json(banks);
    } catch (err) {
      res.status(400).json({ message: 'Error getting banks', error: err });
      }
}
