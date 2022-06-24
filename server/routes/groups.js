const { default: axios } = require("axios");
const express=require("express")
const router =express.Router();

const Group=require("../Database/models/GroupSchema");
const User=require("../Database/models/UserSchema");



// For Groups

router.get("/verifyMember/:email",(req,res)=>{
   
    const userName=req.params.email;
    console.log(userName); 

    User.findOne({username:userName},(err,response)=>{
          if(response)return res.status(201).json(response);
    });
    return res.status(422);
})


router.post("/saveGroup",async(req,res)=>{
    const {group,user}=req.body;
    
    console.log(group)

    const newGroup=new Group(group);
    await newGroup.save();

    await group.groupMembers.forEach(async(data) => {
        await User.updateOne({_id:data.user_id},
                             {$push:{"groups":{$each:[newGroup._id.toString()],$position:0}}});
    });

    const ourUser=await User.findOne({_id:user._id});
    console.log(ourUser); 
    if(ourUser) return res.status(201).json({id:newGroup._id,ourUser});
    
    return res.status(422);
});


router.get("/getGroups/:id",async(req,res)=>{
    const user_id=req.params.id;
    var response=[];
    try{
        const user = await User.findOne({_id:user_id});
        user.groups.forEach(e=>{
              Group.findOne({_id:e},(err,group)=>{
                     group.groupMembers.forEach(member=>{
                         if(member.user_id===user_id){
                                 (response.push(
                                     {   group:{_id:group._id,groupName:group.groupName,groupImage:group.groupImage},
                                         totAmnt:member.TotalExpense
                                     }
                                 ));
                         }
                     })
              });
        });
        

        setTimeout(() => {
            return res.status(201).json(response);
        }, 1000);
    }
    catch(err){
        console.log(err);
        return res.status(422).json(err);
    }
});

router.get("/getGroup/:id/:user_id",(req,res)=>{
    const groupID=req.params.id;
    const uID=req.params.user_id;
    console.log("request for group ",groupID);
    try{
    Group.findById(groupID,(err,group)=>{
       
        if(err)return res.status(422).json(err);
        group.groupMembers.forEach((userData)=>{
            if(userData.user_id===uID)return res.status(201).json(
                                   {
                                       group:{
                                           groupName:group.groupName,
                                           groupImage:group.groupImage,
                                           simplifyDebts:group.simplifyDebts,
                                           totalGroupExpense:group.totalGroupExpense
                                       },
                                       userData:{
                                           TotalExpense:userData.TotalExpense,
                                           TotalAllTimeExpense:userData.TotalAllTimeExpense,
                                           TotalYouPaid:userData.TotalYouPaid
                                       }
                                   });
        }) 
    });
    }
    catch(err){
        console.log(err);
    }
});

router.post("/group/:group_id/addMember",async(req,res)=>{
   const {user}=req.body;
   const group = await Group.findOne({_id:req.params.group_id});
   const member={
       user_id:user._id,
       user_name:user.name,         
       expenses:[]
   }
   try{
        var flag=false;
        await group.groupMembers.forEach((data)=>{
            if(data.user_id===user._id){
                flag=true;
                console.log(data.user_id);
                return res.status(422).json({error:"Already a Group Member"});
            }
        });
        if(!flag){
            await Group.updateOne({_id:group._id},
                            {$push:{"groupMembers":member}},
                            );
            await User.updateOne({_id:user._id},
                            {$push:{"groups":JSON.stringify(req.params.group_id)}},
                            );
            
            return  res.status(200).json("Successfully added member");
        }
   }
   catch(err){
       console.log(err);
       return  res.status(422).json("Can't Add");
   }

});

router.get("/group/:id/getExpenses",async(req,res)=>{
    console.log('GetExpense ');
    const group = await Group.findOne({_id:req.params.id});
    return res.status(201).json(group.expenses);
});

router.get("/group/:group_id/:user_id/getPaymentsofUser",async(req,res)=>{
    console.log("getPaymentsofUser");
    const group=await Group.findOne({_id:req.params.group_id});
    const response=group.groupMembers.find((member)=>member.user_id===req.params.user_id).payments;
    return res.status(200).json(response);
});

router.get("/group/:id/getGroupMembers",async(req,res)=>{
    console.log('GetGroupMembers ');
    const group = await Group.findOne({_id:req.params.id});
    // console.log(group.groupMembers);
    return res.status(201).json(group.groupMembers);
});

router.get("/group/:id/recentPayments",async(req,res)=>{
    console.log('Recent Payment ');
    const group = await Group.findOne({_id:req.params.id});
    return res.status(201).json(group.recentPayments);
});

module.exports=router;