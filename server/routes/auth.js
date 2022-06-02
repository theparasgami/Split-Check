const express=require("express");
const router =express.Router();
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const Group = require("../Database/models/GroupSchema");
const User  = require("../Database/models/UserSchema");

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const GOOGLE_CLIENT_ID=process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET=process.env.CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID , 
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/split-check",
    passReqToCallback:true
  },
  async (request,accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    User.findOne({googleId: profile.id},
        function (err, user){
            if (err) {
                console.log("Error in Finding uSer");
                return done(err);
            }
            if (!user) {
                user = new User({
                    username: profile.emails[0].value,
                    name: profile.displayName,
                    googleId: profile.id,
                    profilePicture: profile.photos[0].value,
                });
                console.log("Registering ",user);
                user.save(function (err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
               console.log(" User is already present , signing in...");
               return done(err, user);
            }
        }  
    );
  }

));


router.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/split-check", 
                  passport.authenticate("google",
                                        { failureRedirect: "http://localhost:3000/" }
                                       ),
                  (req, res) =>{
                      // Successful authentication, redirect home.
                      res.redirect("http://localhost:3000/");
                  }
);

router.post("/login", function(req, res, next) {
    
    console.log(req.body);

    passport.authenticate("local", function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.status(422).json({error:"User Not Found"}); }
  
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.status(201).json({message:" Login Success",user});
      })
    })(req, res, next);
});

router.post("/register",async(req,res)=>{
    
   console.log("Register ");
   const {name,email,phone,password,cpassword}=req.body;
   const user = new User({username: email, phone:phone,name:name });

   User.register(user, password, (err, user) => {
    if (err) {
      console.log(err); 
      return res.status(422).json({error:Object.values(err)[0] });
    } else {
      return  res.status(201).json({message:"Successfully Registered",user});
    }
  });
    
});

router.post("/logout",(req,res)=>{
   console.log("Bye-Bye");
   req.logOut();
   res.clearCookie("connect.sid");
   res.status(201).json({message: "User logged out successfully" });
   
});

router.post("/updateprofile",(req,res)=>{

  const {name,username,phone,password,profilePicture}=req.body;
  const updateValues={name:name,username:username,profilePicture:profilePicture};
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

router.get("/user", (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(422).send("You must login first");
  }
}, (req, res) => {
  res.json(req.user);
});


module.exports=router;