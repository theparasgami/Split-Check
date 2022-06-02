const express=require("express")
const router =express.Router();

const Group=require("../Database/models/GroupSchema");
const User=require("../Database/models/UserSchema");



// For Groups

router.post("/verifyMember",(req,res)=>{
    const {userName}=req.body;
    console.log(userName);  
    
      User.findOne({username:userName},(err,response)=>{
          if(response)return res.status(201).json(response);
      });
      return res.status(422);
})


router.post("/saveGroup",(req,res)=>{
    var group={
        groupName:req.body.groupName,
        groupMembers:req.body.groupMembers,
        groupImage:req.body.image,
        simplifyDebts:req.body.simplifyDebts,
    }
    console.log(group);

    const newGroup=new Group(group);
    newGroup.save();

    var OurMainCreater=false;
    var ouruser;

    group.groupMembers.forEach(e => {

        
        var groupsarray=[];
        User.findOne({_id:e.user_id},(err,user)=>{
            
            if(!OurMainCreater){
                OurMainCreater=true;
                ouruser=user;
            }

            if(err){console.log(err);return res.status(422).json(err);}

            // console.log(user);  
            groupsarray=user.groups;
            groupsarray.push(newGroup._id.toString());
           
            User.updateOne({_id:e.user_id},{groups:groupsarray},(err,userv)=>{
                if(err){console.log(err);return res.status(422).json(err);}
               // console.log(userv);
            });
        })
        
    });

    return res.status(201).json(newGroup,ouruser);
});


router.post("/getGroups",(req,res)=>{
    const user=req.body;
   
    var response=[];
    var letTryFirst=true;
    try{
        user.groups.forEach(e=>{
            Group.findOne({_id:e},(err,group)=>{
               // console.log("Hi",group);
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

})


module.exports=router;