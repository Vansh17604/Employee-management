const mongoose = require("mongoose");
const { Schema } = mongoose;
const bankSchema = new Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
     userId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
    bank_acc_no: {
      type: Number,
      required: true,
    },
    bank_acc_name: {
      type: String,
      required: true,
    },
    bank_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      required: true,
    },
    branch_name: {
      type: String,
      required: true,
    },
    ifsc_code: {
      type: String,
      required: true,
    },
    passbook_image: {
      type: String,
      required: true,
    },
      status: {
      type: String,
      
      default: "pending",
    },
    updatedBankData:[
      {
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"UpdatedBankDetail",
          required:true
        },
        date:{
          type:Date,
          required:true
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const BankDetail = mongoose.model("BankDetail", bankSchema);
module.exports = BankDetail;
