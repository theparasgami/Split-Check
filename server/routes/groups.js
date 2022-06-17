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
                             {$push:{"groups":newGroup._id.toString()}});
    });

    const ourUser=await User.findOne({_id:user._id});
    console.log(ourUser); 
    if(ourUser) return res.status(201).json(ourUser);
    
    return res.status(422);
});


router.post("/getGroups",(req,res)=>{
    const user=req.body;
   
    var response=[];
    try{
        user.groups.forEach(e=>{
           // console.log("Hi",e);
            Group.findOne({_id:e},(err,group)=>{
                group.groupMembers.forEach(member=>{
                    (member.user_id===user._id)&&
                            (response.push(
                                {   group:group,
                                    totAmnt:member.currTotalExpense
                                })
                            );
                })
            });
        })

        setTimeout(() => {
            //console.log(response);
            return res.status(201).json(response);
        }, 100);
    }
    catch(err){
        console.log(err);
        return res.status(422).json(err);
    }
});

router.get("/group/:id/:user_id",(req,res)=>{
    const groupID=req.params.id;
    const uID=req.params.user_id;
    console.log("request for group ",groupID);
    try{
    Group.findById(groupID,(err,group)=>{
       
        if(err)return res.status(422).json(err);
        group.groupMembers.forEach((userData)=>{
            if(userData.user_id===uID)return res.status(201).json({group,userData});
        }) 
    });
    }
    catch(err){
        console.log(err);
    }
});

router.post("/group/addMember",async(req,res)=>{
   const {group,user}=req.body;
   const member={
       user_id:user._id,
       expenses:[]
   }
   await group.groupMembers.forEach((data)=>{
       if(data.user_id===user._id)return res.status(406).json("Already a Group Member");
   });
   
   await Group.updateOne({_id:group._id},
                   {$push:{"groupMembers":member}}
                  );
   await User.updateOne({_id:user._id},
                   {$push:{"groups":group._id}}
                  );
                
   return res.status(200).json("Successfully added member");

})


module.exports=router;