const mongoose = require("mongoose");
const { Schema } = mongoose;

const updatedPanSchema = new Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UpdateModel",
      required: true,
    },
     userId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
    pan_card: {
      type: String,
      required: true,
    },
    pan_no: {
      type: String,
      required: true,
    },
    pan_name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    remarks: {
      type: String,
    },
    PanData:[
      {
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Pan",
          required:true
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const UpdatedPan = mongoose.model("UpdatedPan", updatedPanSchema);
module.exports = UpdatedPan;
