const express=require("express");
const router =express.Router();
const Token = require("../Database/models/Token");
const crypto = require("crypto");
const sendEmail = require("../Utils/sendEmail");
const User  = require("../Database/models/User");

function emailCheck(email){
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
} 


router.post("/register",async(req,res)=>{
    
    console.log("Register ");
    const {name,email,phone,password,cpassword}=req.body;
    
    if(!emailCheck(email)){
      return res.status(400).json({error:"Invalid Email ID"});
    }
    if(password!==cpassword){
      return res.status(400).json({error:"Confirm your password"});
    } 
    const user = new User({username: email, phone:phone,name:name });
 
    await User.register(user, password, (err, user) => {
     if (err) {
       console.log(err); 
       return res.status(422).json({error:Object.values(err)[0] });
     } else {
       //generate token and send email to verify 
        const token =  new Token({
                                user_id: user._id,
                                token: crypto.randomBytes(32).toString("hex"),
        });
       const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
       sendEmail(email, 
                       "Verify Email to contiue with Split-Check.", 
                       " This link will expired after 5 minutes. Click on the link to verify your email."+url);
       return  res.status(201).json({message:"An email is sent to verify your email. Please verify it."});
     }
   });
});

router.post("/updateprofile",(req,res)=>{

    const {name,username,phone,password,profilePicture}=req.body;
    const updateValues={name,
                        username,
                        profilePicture
                       };
    if(phone!=="XXXXXXXXXX")updateValues["phone"]=phone;
    
    User.updateOne({_id:req.body.user_id},  
        updateValues,  (err, userv)=> { 
        if (err){ 
            console.log(err);
            return res.status(422).json(err); 
        } 
        else{ 
            // console.log("Updated Profile : ", userv);
            User.findOne({_id:req.body.user_id},(err,user)=>{
              if(err){
                console.log(err);
                return res.statusMessage(422).json(err);
              }
              if(password!=="") {
                      user.setPassword(password,async(err)=>{
                        if(err){console.log(err);return res.status(422).json(err);}
                        user.save();
                        console.log(user);
                        return res.status(200).json(user);
                    });
              }
              else return res.status(200).json(user);
            });
        } 
    }); 
}); 

  
router.get("/users/:id/verify/:token", async (req, res) => {
	try {
   
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			user_id: user._id,
			token: req.params.token,
		});
		if(!token) return res.status(400).send({ message: "Invalid link" });
    
		await User.updateOne({ _id: user._id},{verified: true });
    console.log(token);
		await token.remove();
     console.log("success");
		return res.status(200).json("Email verified successfully" );
	} catch (error) {
		return res.status(500).josn( "Internal Server Error" );
	}
});


router.get("/remindPayment",async(req,res)=>{
     try{
          const payer = await User.findOne({_id:req.query.payer_id});
          const receiver = await User.findOne({_id:req.query.receiver_id});
          
          sendEmail(payer.username, 
            "Hello "+payer.name+" from "+receiver.name, 
            "This is a remider that you owes "+receiver.name+" ₹ "+req.query.amount+" for expenses in your"+
            "Split-Check group. Please complete the payment and Settle Up."
          );
          
            return  res.status(201).json("Email Reminder sent successfully.");
     }
     catch(err){
       console.log(err);
       return res.status(500).json("Internal Server error");
     }
})
module.exports=router