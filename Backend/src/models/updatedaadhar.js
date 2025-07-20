const mongoose = require('mongoose');
const { Schema } = mongoose;

const updatedAadharSchema = new Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UpdateModel',
    required: true
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:'true'

  },
  aadhar_card: {
    type: String,
    required: true
  },
  aadhar_name: {
    type: String,
    required: true
  },
  aadhar_no: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  remarks: {
    type: String
  },
  aadharData:[
    {
      id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Aadhar'

      },
      date:{
        type:Date,
        default:Date.now,
        required:true
      }
      }
  ]
}, {
  timestamps: true
});

const UpdatedAadhar = mongoose.model("UpdatedAadhar", updatedAadharSchema);
module.exports = UpdatedAadhar;
