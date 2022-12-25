const express=require("express");
const router =express.Router();
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require("crypto");

const sendEmail = require("../Utils/sendEmail");

const Token = require("../Database/models/Token");
const User  = require("../Database/models/User");



let UserProfile=null;
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const GOOGLE_CLIENT_ID=process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET=process.env.CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID , 
    clientSecret: GOOGLE_CLIENT_SECRET,
    // callbackURL: "http://localhost:8000/auth/google/split-check",
    callbackURL:"http://split-check-vhbp.vercel.app/auth/google/split-check",
    passReqToCallback:true
  },
  async (request,accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    User.findOne({googleId: profile.id},
         (err, user)=>{
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
                    verified:true
                });
                console.log("Registering ",user);
                user.save( (err)=> {
                    if (err) console.log(err);
                    UserProfile=user;
                    return done(err, user);
                });
            } else {
               console.log("User is already present , signing in...");
               UserProfile=user;
               return done(err, user);
            }
        }  
    );
  }

));


router.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/split-check",
  passport.authenticate("google", {
    failureRedirect: "https://split-check.netlify.app/",
  }),
  (req, res) => {
    //  console.log(res);
    // Successful authentication, redirect home.
    res.redirect("https://split-check.netlify.app/");
    // res.redirect("http://localhost:3000/");
  }
);

router.post("/login", function(req, res, next) {
    
    console.log(req.body);

    passport.authenticate("local", async(err, user, info)=> {
      if (err) { return next(err); }
      else if (!user) { return res.status(422).json({error:"Wrong Credentials"}); }
      else if (!(user.verified)) {
      
        let token = await Token.findOne({ user_id: user._id });
       
        if (!token) {
          const token =  new Token({
            user_id: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          });
          await token.save(()=>{
            const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
            sendEmail(user.username, 
              "Verify Email to contiue with Split-Check.", 
              " This link will expired after 5 minutes. Click on the link to verify your email."+url);
          });
        } 

        return res.status(400)
          .json({ error: "An Email sent to your account please verify" });
      }
      else{
        console.log(user);
        req.logIn(user, (err)=> {
          if (err) { return next(err); }
          console.log(user);
          return res.status(201).json({message:" Login Success",user});
        })
      } 
    })(req, res, next);
});




router.post("/logout",(req,res)=>{
   console.log("Bye-Bye");
   UserProfile=null;
   req.logOut();
   res.clearCookie("connect.sid");
   res.status(201).json({message: "User logged out successfully" });
   
});


router.get("/user", (req, res) => {
  if (UserProfile) {
    return res.json(UserProfile);
  } else {
    res.status(422).send("You must login first");
  }
});




module.exports=router;