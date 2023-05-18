const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");

const sendEmail = require("../Utils/sendEmail");

const Token = require("../Database/models/Token");
const User = require("../Database/models/User");

let UserProfile = null;
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;
const redirectURL = process.env.FRONTEND_URL;

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
          user = new User({
            username: profile.emails[0].value,
            name: profile.displayName,
            googleId: profile.id,
            profilePicture: profile.photos[0].value,
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
    res.redirect(redirectURL);
  }
);

router.post("/login", function (req, res, next) {
  passport.authenticate("local", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      } else if (!user) {
        return res.status(422).json({ error: "Wrong Credentials" });
      } else if (!user.verified) {
        let token = await Token.findOne({ user_id: user._id });

        if (!token) {
          const newToken = new Token({
            user_id: user._id,
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
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.status(200).json({ message: "Login Success", user });
        });
      }
    } catch (err) {
      console.error("Error in login route:", err);
      return next(err);
    }
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  UserProfile = null;
  req.logout();
  res.clearCookie("connect.sid");
  res.status(200).json({ message: "User logged out successfully" });
});

router.get("/user", (req, res) => {
  if (UserProfile) {
    return res.json(UserProfile);
  } else {
    res.status(401).send("You must be logged in to access this resource");
  }
});

module.exports = router;
