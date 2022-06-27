const mongoose = require("mongoose");


const tokenSchema= new mongoose.Schema({
    user_id:{
        type:String,
		required: true,
		unique: true,
    },
    token:{
        type:String,
        required:true
    },
    createdAt: { 
        type: Date,
        default: Date.now,
        expires: 60
    },
})

const Token=new mongoose.model("Token",tokenSchema);



module.exports=Token;