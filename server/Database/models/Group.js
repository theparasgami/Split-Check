const mongoose =require("mongoose");

const member={
    user_id:String,
    user_name:String,
    payments:[{
        user_id:String,
        user_name:String,
        amount:Number 
    }],
    TotalExpense:{//It will include all the payments which are splitted currently 
        type:Number,
        default:0
    },
    currTotalExpense:{//This will store the current payments which are not splitted
        type:Number,
        default:0   
    },
    TotalAllTimeExpense:{
        type:Number,
        default:0
    },
    TotalYouPaid:{
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
    expenses:{
        type:[{
            date:Date,
            amount:Number,
            name:String,
            paidBy:Array,
            paidTo:Array,
            whoUpdated:String
        }],
        default:[]
    },
    totalGroupExpense:{
        type:Number,
        default:0
    },
    recentPayments:{
        type:[{
            date:Date,
            payerName:String,
            receiverName:String,
            amount:Number
        }],
        default:[]
    }
})

const Group=new mongoose.model("Group",GroupSchema);

module.exports=Group;