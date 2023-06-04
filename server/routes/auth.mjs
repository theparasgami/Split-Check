import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import crypto from "crypto";
import sendEmail from "../Utils/sendEmail.mjs";

import User from "../Database/models/User.mjs";
import Token from "../Database/models/Token.mjs";
import { convertBinaryToBlob, convertBlobToBinary } from "../Utils/imageConversion.mjs";

const router = Router();



//routes
router.post("/login", Login);
router.post("/logout", LogOut);
router.get("/user", SetUser);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;
const redirectURL = process.env.FRONTEND_URL;
//Check if user is authenticated

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const profilePictureBlob = await convertBlobToBinary(profile.photos[0].value);
          user = new User({
            username: profile.emails[0].value,
            name: profile.displayName,
            googleId: profile.id,
            profilePicture: profilePictureBlob,
            verified: true,
          });

          await user.save();
        }
        return done(null, user);
      } catch (err) {
        console.error("Error in finding or saving user:", err);
        return done(err);
      }
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/split-check",
  passport.authenticate("google", {
    failureRedirect: redirectURL,
  }),
  (req, res) => {
    // Redirect the user to the desired page or send a response
    return res.redirect(redirectURL);
  }
);

function Login(req, res, next) {
  passport.authenticate("local",async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      } else if (!user) {
        return res.status(422).json({ error: "Wrong Credentials" });
      } else if (!user.verified) {
        let token = await Token.findOne({ userID: user._id });

        if (!token) {
          const newToken = new Token({
            userID: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          });

          await newToken.save();

          const url = `${process.env.BASE_URL}users/${user._id}/verify/${newToken.token}`;
          sendEmail(
            user.username,
            "Verify Email to continue with Split-Check.",
            "This link will expire after 5 minutes. Click on the link to verify your email: " +
              url
          );
        }

        return res.status(400).json({
          error:
            "An email has been sent to your account. Please verify your email.",
        });
      } else {
        req.logIn(user,async (err) => {
          if (err) {
            return next(err);
          }
          const profilePicture = await convertBinaryToBlob(user.profilePicture);
          const newUser = {
            _id: user._id,
            username: user.username,
            phone: user.phone,
            name: user.name,
            profilePicture: profilePicture,
            googleId:user.googleId
          };
          return res.status(200).json({ message: "Login Success", user:newUser });
        });
      }
    } catch (err) {
      console.error("Error in login route:", err);
      return next(err);
    }
  })(req, res, next);
}

async function LogOut(req, res) {
  await req.logout(); // Log out the user
  await req.session.destroy(function (err) {});
  await res.clearCookie("connect.sid"); // Clear the session cookie
  res.status(200).json({ success: true, message: "User logged out successfully" });
}

async function SetUser(req, res) {
  if (req.isAuthenticated()) {
    const profilePicture = await convertBinaryToBlob(req.user.profilePicture);
    const user = {
      _id: req.user._id,
      username: req.user.username,
      phone: req.user.phone,
      name: req.user.name,
      profilePicture: profilePicture,
    };
    return res.json(user);
  } else {
    res.status(476).json({error:"You must login first"});
  }
}

export default  router;
