const mongoose = require("mongoose");
const { Schema } = mongoose;

const updateSchema = new Schema({
   employeeId: {
  type: String,
  required: true,
  unique: true 
},
  name: {
    type: String,
    required: true,
  },
  perment_address: {
    type: String,
    required: true,
  },
  current_address: {
    type: String,
    required: true,
  },
  primary_mno: {
    type: Number,
    required: true,
  },
  secondary_mno: {
    type: Number,
    required: true,
  },
  home_mno: {
    type: Number,
    required: true,
  },
  work_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Work",
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
    workstatus:{
    type:String,
    required:true,
  },
  photo: {
    type: String,
    required: true,
  },  userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },reply:{
    type:String,
  
  },
  employData:[
    {
      id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee"
        },
        date:{
          type:Date,
          default:Date.now
        }
      }
  ]
}, {
  timestamps: true
});

const UpdateModel = mongoose.model("UpdateModel", updateSchema);
module.exports = UpdateModel;
