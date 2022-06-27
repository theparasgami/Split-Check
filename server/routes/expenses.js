const express=require("express")
const router =express.Router();

const Group=require("../Database/models/Group");
const User=require("../Database/models/User");



router.post("/group/:group_id/addExpense",async(req,res)=>{
    
    const { expense,
            paidBy,
            paidTo,
            TotalCurrPaidBy,
            TotalCurrPaidTo,
            singlePayer,
            Isequally,
            equally,
            countOfequallySplitting,
            user_name
    } = req.body;

    if(expense.descr.length<3){
     return res.status(422).json("Please Give a name of atleast length 3 to your expense..");
    }
    if(parseFloat(expense.amount)<=0){
      return res.status(422).json("Please add a Positive Amount to you expense.");
    }
    if(singlePayer===0&&parseFloat(expense.amount)!==parseFloat(TotalCurrPaidBy)){
      return res.status(422).json("Please Assign Correct Amounts to Payer");
    }
    if(!Isequally&&parseFloat(expense.amount)!==parseFloat(TotalCurrPaidTo)){
      return res.status(422).json("Please Correct Your Unequal Splitting");  
    }
    if(Isequally&&countOfequallySplitting===0){
      return res.status(422).json("Please select atleast one member to split with.");
    }
    

    var transaction={
           date:new Date(),
           name:expense.descr,
           amount:expense.amount,
           paidBy:[],
           paidTo:[],
           whoUpdated:user_name
    }

    if(Isequally){
        equally.forEach((member,ind)=>{
            if(member.included){
                transaction.paidTo.push({...paidTo[ind],
                                         amount:(expense.amount/countOfequallySplitting).toFixed(2)});
            }
        });
    }else{
         paidTo.forEach((member,ind)=>{
            if(member.amount>0){
                transaction.paidTo.push({...member,amount:(member.amount).toFixed(2)});
            }
         })
    }

    if(singlePayer>0){
        transaction.paidBy.push({...paidBy[singlePayer-1],amount:(expense.amount)});
    }else{
         paidBy.forEach((member,ind)=>{
             if(member.amount>0)transaction.paidBy.push({...member,amount:(member.amount).toFixed(2)});
         })
    }

    console.log("transaction:",transaction);
    
    try{

        await Group.findOneAndUpdate({_id:req.params.group_id},
                                     { $push:{"expenses":{$each:[transaction],$position:0}},
                                       $inc:{"totalGroupExpense":expense.amount}}
                );
       
        transaction.paidBy.forEach(async(member)=>{
            await Group.updateOne({_id:req.params.group_id,"groupMembers.user_id":member.id},
                            {$inc:{"groupMembers.$.currTotalExpense":-(member.amount),
                                   "groupMembers.$.TotalYouPaid":(member.amount)}
            })
          
        });
        transaction.paidTo.forEach(async(member)=>{
            await Group.updateOne({_id:req.params.group_id,"groupMembers.user_id":member.id},
                                  {$inc:{"groupMembers.$.currTotalExpense":(member.amount),
                                         "groupMembers.$.TotalAllTimeExpense":(member.amount)}
            })
        });
        //Now  we only have to arrange the payments which is done in //distributeAmount
        return res.status(201).json("Added Succesfully");
    }
    catch(err){
        console.log(err);
        return res.status(422).json("Oh no (: Something went Wrong");
    }
})

router.get("/group/:group_id/distributeAmount",async(req,res)=>{
    const Gid=req.params.group_id;
    let group;  
    while(true){
        let flag=false;
        group=await Group.findOne({_id:Gid});
        
        if(!group){return res.status(422).json("No such group");}
       // if someone who is currently getting but overall he has to pay then we will decrease from his payments first
        for(let index=0;index<group.groupMembers.length;index++){
            const moneyOwner=group.groupMembers[index];    
            if(moneyOwner.currTotalExpense.toFixed(2)<=(-0.99)){
             
             for(let jindex=0;jindex<moneyOwner.payments.length;jindex++){

                if(moneyOwner.currTotalExpense===0)break;
                const user=moneyOwner.payments[jindex];

                if((user.amount).toFixed(2)<=(-0.99)){
                    let howMuchcangive=moneyOwner.currTotalExpense;
                    let howMuchcantake=user.amount;
                    let givenAmount=Math.max(howMuchcangive,howMuchcantake);
            
                    flag=true;
                    console.log("1:givenAmoune:",givenAmount);
                    await Group.updateOne({_id:Gid},
                        {
                            $inc:{
                                "groupMembers.$[groupMembers].currTotalExpense":-givenAmount,
                                "groupMembers.$[groupMembers].TotalExpense":givenAmount,
                                "groupMembers.$[groupMembers].payments.$[payments].amount":-givenAmount
                            }
                        },
                        {
                            arrayFilters:[
                                {"groupMembers.user_id":moneyOwner.user_id},
                                {"payments.user_id":user.user_id}
                            ]
                        }
                    );
                    await Group.updateOne({_id:Gid},
                        {
                            $inc:{
                                "groupMembers.$[groupMembers].currTotalExpense":givenAmount,
                                "groupMembers.$[groupMembers].TotalExpense":-givenAmount,
                                "groupMembers.$[groupMembers].payments.$[payments].amount":givenAmount
                            }
                        },
                        {
                            arrayFilters:[
                                {"groupMembers.user_id":user.user_id},
                                {"payments.user_id":moneyOwner.user_id}
                            ]
                        }
                    );
                    if(flag)break;
                   
                }
             }
            }
            if(flag)break;
        }
    
                
    // if someone who is currently paying but overall he will get then we will decrease from his payments first
       
        
        for(let index=0;index<group.groupMembers.length;index++){   
            const moneyTaker=group.groupMembers[index];
            if(moneyTaker.currTotalExpense>=0.01){
              
             for(let jindex=0;jindex<moneyTaker.payments.length;jindex++){

                if(moneyTaker.currTotalExpense===0)break;
                const user=moneyTaker.payments[jindex];

                if(user.amount>=0.01){

                    let howMuchcantake=moneyTaker.currTotalExpense;
                    let howMuchcangive=user.amount;
                    let takenAmount=Math.min(howMuchcangive,howMuchcantake);
                    flag=true;
                    console.log("2:takenAmount:",takenAmount);
                    await Group.updateOne({_id:Gid},
                        {
                            $inc:{
                                "groupMembers.$[groupMembers].currTotalExpense":-takenAmount,
                                "groupMembers.$[groupMembers].TotalExpense":takenAmount,
                                "groupMembers.$[groupMembers].payments.$[payments].amount":-takenAmount
                            }
                        },
                        {
                            arrayFilters:[
                                {"groupMembers.user_id":moneyTaker.user_id},
                                {"payments.user_id":user.user_id}
                            ]
                        }
                    );
                    await Group.updateOne({_id:Gid},
                        {
                            $inc:{
                                "groupMembers.$[groupMembers].currTotalExpense":takenAmount,
                                "groupMembers.$[groupMembers].TotalExpense":-takenAmount,
                                "groupMembers.$[groupMembers].payments.$[payments].amount":takenAmount
                            }
                        },
                        {
                            arrayFilters:[
                                {"groupMembers.user_id":user.user_id},
                                {"payments.user_id":moneyTaker.user_id}
                            ]
                        }
                    );
                    if(flag)break;

                }
             }
            }
            if(flag)break;
        }
        //flag=false;
        if(!flag)break;
    }
    
    try{
        var whoGet=[],whoOwe=[];
        await group.groupMembers.forEach((member,ind)=>{
            if(member.currTotalExpense<=(-0.99)){
                whoGet.push({member,ind});
            }
        });
        await group.groupMembers.forEach((member,ind)=>{
            if(member.currTotalExpense>=0.01){
                whoOwe.push({member,ind});
            }
        });
       
        while(true){
            if(whoGet.length===0||whoOwe.length===0)break;
            if(whoGet.length>1)whoGet.sort((a,b)=>a.member.currTotalExpense-b.member.currTotalExpense);
            if(whoOwe.length>1)whoOwe.sort((a,b)=>b.member.currTotalExpense-a.member.currTotalExpense);
            if(whoOwe[0].member.currTotalExpense.toFixed(2)<0.01)break;
            if(whoGet[0].member.currTotalExpense.toFixed(2)>(-0.99))break;

            if(Math.abs(whoGet[0].member.currTotalExpense)>whoOwe[0].member.currTotalExpense){    
                //check if this members are already paying to each other or not
                
                await Group.updateOne({_id:Gid},
                        {
                            $inc:
                            {"groupMembers.$[groupMembers].payments.$[payments].amount":whoOwe[0].member.currTotalExpense,
                             "groupMembers.$[groupMembers].currTotalExpense":whoOwe[0].member.currTotalExpense,
                             "groupMembers.$[groupMembers].TotalExpense":-whoOwe[0].member.currTotalExpense}
                        },
                        {
                            arrayFilters:[
                                {"groupMembers.user_id":whoGet[0].member.user_id},
                                {"payments.user_id":whoOwe[0].member.user_id}
                            ]
                        }
                    
                );
                await Group.updateOne({_id:Gid},
                    {
                        $inc:
                        {"groupMembers.$[groupMembers].payments.$[payments].amount":-whoOwe[0].member.currTotalExpense,
                         "groupMembers.$[groupMembers].currTotalExpense":-whoOwe[0].member.currTotalExpense,
                         "groupMembers.$[groupMembers].TotalExpense":whoOwe[0].member.currTotalExpense}
                    },
                    {
                        arrayFilters:[
                            {"groupMembers.user_id":whoOwe[0].member.user_id},
                            {"payments.user_id":whoGet[0].member.user_id}
                        ]
                    }
                );
                
                await whoGet[0].member.payments.forEach((user)=>{
                    if(user.user_id===whoOwe[0].member.user_id){
                        whoGet[0].member.currTotalExpense+=whoOwe[0].member.currTotalExpense;
                        whoOwe[0].member.currTotalExpense=0;
                    }
                })
                
                if(whoOwe[0].member.currTotalExpense!==0){
                    await Group.updateOne({_id:Gid,
                        "groupMembers.user_id":whoGet[0].member.user_id},
                        {
                            $push:
                             {"groupMembers.$.payments":{
                                     user_id:whoOwe[0].member.user_id,
                                     user_name:whoOwe[0].member.user_name,
                                     amount:whoOwe[0].member.currTotalExpense}
                             },
                        }     
                );
                await Group.updateOne({_id:Gid,
                        "groupMembers.user_id":whoOwe[0].member.user_id},
                        {
                         $push:
                            {"groupMembers.$.payments":{
                                            user_id:whoGet[0].member.user_id,
                                            user_name:whoGet[0].member.user_name,
                                            amount:-whoOwe[0].member.currTotalExpense} 
                            },
                        }                  
                );
                whoGet[0].member.currTotalExpense+=whoOwe[0].member.currTotalExpense;
                whoOwe[0].member.currTotalExpense=0;
                }
            }else{
                //check if this members are already paying to each other or not 
                await Group.updateOne({_id:Gid},
                        {
                         $inc:
                           {"groupMembers.$[groupMembers].payments.$[payments].amount":-whoGet[0].member.currTotalExpense,
                            "groupMembers.$[groupMembers].currTotalExpense":-whoGet[0].member.currTotalExpense,
                            "groupMembers.$[groupMembers].TotalExpense":whoGet[0].member.currTotalExpense}
                        },
                        {
                           arrayFilters:[
                                 {"groupMembers.user_id": whoGet[0].member.user_id },
                                 {"payments.user_id":whoOwe[0].member.user_id}
                           ] 
                        }
                );
        
                await Group.updateOne({_id:Gid},
                        {
                         $inc:
                           {"groupMembers.$[groupMembers].payments.$[payments].amount":whoGet[0].member.currTotalExpense,
                            "groupMembers.$[groupMembers].currTotalExpense":whoGet[0].member.currTotalExpense,
                            "groupMembers.$[groupMembers].TotalExpense":-whoGet[0].member.currTotalExpense}
                        },
                        { 
                          arrayFilters:[
                              {"groupMembers.user_id": whoOwe[0].member.user_id} ,
                              {"payments.user_id":whoGet[0].member.user_id}
                          ]     
                        }
                );
                
                await whoGet[0].member.payments.forEach((user)=>{
                    if(user.user_id===whoOwe[0].member.user_id){
                        whoOwe[0].member.currTotalExpense+=whoGet[0].member.currTotalExpense;
                        whoGet[0].member.currTotalExpense=0;
                    }
                })
                 
                if(whoGet[0].member.currTotalExpense!==0){
                          
                await Group.updateOne({_id:Gid,
                           "groupMembers.user_id":whoGet[0].member.user_id},
                           {$push:
                              {"groupMembers.$.payments":{
                                   user_id:whoOwe[0].member.user_id,
                                   user_name:whoOwe[0].member.user_name,
                                   amount:-whoGet[0].member.currTotalExpense
                              }},
                           }     
                );

                await Group.updateOne({_id:Gid,
                              "groupMembers.user_id":whoOwe[0].member.user_id},
                              {$push:
                                 {"groupMembers.$.payments":{
                                      user_id:whoGet[0].member.user_id,
                                      user_name:whoGet[0].member.user_name,
                                      amount:whoGet[0].member.currTotalExpense
                                 }},
                              }
                );
                         
                whoOwe[0].member.currTotalExpense+=whoGet[0].member.currTotalExpense;
                whoGet[0].member.currTotalExpense=0;
                         
                }
            }
        }

        return res.status(201).json("Cool Expenses are now distributed among all");
    }
    catch(err){
        console.log(err);
        return res.status(422).json(err);
    }
});

router.get("/group/:id/removeZeroPayments",async(req,res)=>{
 //Now remove all the payments with zeroes;
 const group= await Group.findOne({_id:req.params.id});

 group.groupMembers.forEach((member)=>{
     
     member.payments.forEach((payment)=>{ 
        
         if(payment.amount.toFixed(2)>(-0.99)&&(payment.amount.toFixed(2)<0.01)){
           
             Group.updateOne({_id:req.params.id,"groupMembers.user_id":member.user_id},
                    {
                      $pull:
                       {"groupMembers.$.payments":payment}
                    },
                    ((err,status)=>{
                        if(err)console.error(err);
                    })
                
            )
         }
     })
 });
 return res.status(200).json("Successfully removed zero payments");
});


router.post("/group/:id/settleDebt",async(req,res)=>{
    const {payer,receiver,amount}=req.body;
    
    if(payer.user_id===receiver.user_id){
        return res.status(422).json("Payer and Receiver must not be same");
    }
    if(amount===0){
        return res.status(422).json("Enter a positive amount");
    }

    const group_id=req.params.id;
    console.log(group_id);
    await Group.updateOne({_id:group_id},
        {$inc:
           {
              "groupMembers.$[groupMembers].TotalExpense":-parseFloat(amount).toFixed(2),
              "groupMembers.$[groupMembers].payments.$[payments].amount":parseFloat(amount).toFixed(2)
           },
         $push:
           {
              "recentPayments":{$each:[{
                                     date:new Date(),
                                     payerName:payer.user_name,
                                     receiverName:receiver.user_name,
                                     amount:amount}],
                                $position:0
                               }
           }
        },
        {
            arrayFilters:[
               {"groupMembers.user_id":payer.user_id},
               {"payments.user_id":receiver.user_id}
            ]
        }
    );
    await Group.updateOne({_id:group_id},
        {$inc:
           {
              "groupMembers.$[groupMembers].TotalExpense":parseFloat(amount).toFixed(2),
              "groupMembers.$[groupMembers].payments.$[payments].amount":-parseFloat(amount).toFixed(2)
           }
        },
        {
            arrayFilters:[
               {"groupMembers.user_id":receiver.user_id},
               {"payments.user_id":payer.user_id}
            ]
        }
    );

    return res.status(200).json("Ok settled up");
})

module.exports=router;