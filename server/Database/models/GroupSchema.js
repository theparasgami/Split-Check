const mongoose =require("mongoose");

const member={
    user_id:String,
    expenses:[{
        amount:Number,  
        user_id:String
    }],
    currTotalExpense:{
        type:Number,
        default:0
    }  
}

const GroupSchema=new mongoose.Schema({
    groupName:{
        type:String,
        required:true,
        max:50
    },
    groupMembers:{
        type:[member],
        default:[]
    },
    groupImage:{    
        type:String,
        default:"https://wc.wallpaperuse.com/wallp/77-777508_s.jpg",
    },
    simplifyDebts:Boolean,
    records:{
        type:[String],
        default:[]
    }
})

const Group=new mongoose.model("Group",GroupSchema);

module.exports=Group;