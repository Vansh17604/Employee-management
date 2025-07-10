const mongoose = require('mongoose');
const { Schema } = mongoose;
const workSchema = new  Schema({
    work_place_name:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Work = mongoose.model("Work",workSchema);
module.exports= Work