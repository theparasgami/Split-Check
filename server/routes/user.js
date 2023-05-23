const express = require("express");
const router = express.Router();
const Token = require("../Database/models/Token");
const crypto = require("crypto");
const sendEmail = require("../Utils/sendEmail");
const emailCheck = require("../Utils/checkEmail");


const User = require("../Database/models/User");
const { requestMoneyMessage } = require("../Utils/emailMessage");

//routs
router.post("/register", Register);
router.post("/updateprofile", UpdateProfile);
router.get("/users/:id/verify/:token", ValidateToken);
router.get("/remindPayment", PaymentReminder);

async function Register(req, res){
  try {
    const { name, email, phone, password } = req.body;

    if (!emailCheck(email)) {
      return res.status(400).json({ error: "Invalid Email ID" });
    }

    const existingUser = await User.findOne({ username:email }, { _id: 1 });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = new User({
      username: email,
      phone: phone,
      name: name,
    });
    await user.setPassword(password);
    await user.save();
    const token = new Token({
      user_id: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    await token.save();

    const verificationUrl = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
    sendEmail(
      email,
      "Verify Email to continue with Split-Check.",
      `Click on the link to verify your email: ${verificationUrl}`
    );

    return res.status(201).json({
      message: "An email is sent to verify your email. Please verify it.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function UpdateProfile(req, res){
  try {
    const { name, username, phone, password, profilePicture, user_id } =
      req.body;
    const updateValues = { name, username, profilePicture };

    if (phone !== "XXXXXXXXXX") updateValues["phone"] = phone;

    await User.updateOne({ _id: user_id }, updateValues);

    const user = await User.findOne({ _id: user_id }, { _id: 1 });
    if (!user) return res.status(400).send({ message: "Invalid User id" });

    if (password !== "") {
      await user.setPassword(password);
      await user.save();
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(422).json(err);
  }
};

async function ValidateToken(req, res){
  try {
    const user = await User.findOne({_id:req.params.id}, { _id: 1 });
    if (!user) return res.status(400).send({ message: "Invalid link" });
  
    const token = await Token.findOne({
      user_id: (user._id),
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.updateOne({ _id: user._id }, { verified: true });
    await token.remove();

    return res.status(200).json("Email verified successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).josn("Internal Server Error");
  }
};

async function PaymentReminder(req, res){
  try {
    const projection = {
      username: 1,
      name: 1,
    };
    const payer = await User.findOne({ _id: req.query.payer_id }, projection);
    const receiver = await User.findOne(
      { _id: req.query.receiver_id },
      projection
    );

    if (!payer) return res.status(400).send({ message: "Invalid Payer Id" });
    if (!receiver)
      return res.status(400).send({ message: "Invalid Receiver Id" });
    const emailMessage = requestMoneyMessage(
      payer.name,
      receiver.name,
      req.query.amount
    );

    await sendEmail(payer.username, emailMessage);

    return res.status(201).json("Email Reminder sent successfully.");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server error");
  }
};

module.exports = router;
