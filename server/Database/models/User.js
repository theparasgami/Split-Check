const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        max:40
    },
    name:{
        type:String,
        required:true,
        min:3,
        max:50
    },
    phone:{
        type:Number,
    },
    password:{
        type:String
    },
    profilePicture: {
        type: String,
        default:
            "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg"
          
    },
    groups:{
        type:Array,
        default:[]
    },
    googleId:{
        type: String,
        default:"No-GoogleID"
    },
    verified:{
        type:Boolean,
        default:false  
    }
});

userSchema.plugin(passportLocalMongoose);

const User=new mongoose.model("User",userSchema);



module.exports=User;