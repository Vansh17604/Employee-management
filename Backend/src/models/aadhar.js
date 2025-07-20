const mongoose= require('mongoose');
const {Schema} = mongoose
const aadharSchema = new Schema({
    employee_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UpdateModel',
        required:true
    },
      userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:'true'
    
      },
  aadhar_card: {
    type: String,
    required: true,
  },
  aadhar_name: {
    type: String,
    required: true,
  },
  aadhar_no: {
    type: Number,
    required: true,
  },
  status:{
    type:String,
    required:true
  },
  reply:{
    type:String
  },
  updateAadharData:[
    {
      id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UpdatedAadhar',

      },
      date:{
        type:Date,
        required:true
      }
    }
  ]
},{
    timestamps: true
});
 const Aadhar = mongoose.model("Aadhar",aadharSchema);
 module.exports=Aadhar