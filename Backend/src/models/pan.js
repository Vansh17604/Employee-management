const mongoose = require("mongoose");
const { Schema } = mongoose;
const panSchema = new Schema(
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
    },status:{
      type:String,
      required:true

    },
    updatedpanData:[
      {
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"UpdatedPan",
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
const Pan = mongoose.model("Pan", panSchema);
module.exports = Pan;
