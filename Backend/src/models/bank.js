const mongoose = require("mongoose");
const { Schema } = mongoose;
const bankSchema= new Schema({
    bank_name:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const Bank = mongoose.model("Bank",bankSchema);
module.exports=Bank