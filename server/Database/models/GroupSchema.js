const mongoose =require("mongoose");

const member={
    user_id:String,
    expenses:[{
        user_id:String,
        amount:Number 
    }],
    currTotalExpense:{
        type:Number,
        default:0   
    }     
}
const transaction={
    name:String,
    paid_by:String,
    involved:{
        type:[String],
        default:[]
    },
    img:{
        type:String,
        default:"https://png.pngtree.com/png-clipart/20200701/original/pngtree-consumer-bill-png-image_5408121.jpg"
    }
}
const payment={
     paid_by:String,
     paid_to:String,
     img:{
        type:String,
        default:"https://png.pngtree.com/png-clipart/20190612/original/pngtree-a-wad-of-dollar-bills-png-image_3326543.jpg" 
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
    transactions:{
        type:[{
            date:Date,
            transaction:transaction,
            payment:payment
        }],
        default:[]
    },
})

const Group=new mongoose.model("Group",GroupSchema);

module.exports=Group;