const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { check, validationResult } = require('express-validator');




module.exports.FetchUsers = async (req, res) => {
  try {
    
    const users = await User.find({ role: { $ne: "admin" } });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};


// Delete a user by ID
module.exports.DeleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
};

// Edit a user
module.exports.EditUser = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('role').not().isEmpty().withMessage('Role is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role } = req.body;

        try {
            const user = await User.findOne({ _id: req.params.id });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.name = name;
            user.email = email;
            user.role = role;
            
            if (password) {
                
                user.password = password;
            }

            const updatedUser = await user.save();
            
            // Remove password from response
            const userResponse = updatedUser.toObject();
            delete userResponse.password;
            
            res.json({ message: 'User updated successfully', user: userResponse });
        } catch (err) {
            res.status(500).json({ message: 'Error updating user', error: err });
        }
    }
];