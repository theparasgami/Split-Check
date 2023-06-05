import { Router } from "express";
import Token from "../Database/models/Token.mjs";
import crypto from "crypto";
import sendEmail from "../Utils/sendEmail.mjs";
import emailCheck from "../Utils/checkEmail.mjs";
import User from "../Database/models/User.mjs";
import { requestMoneyMessage } from "../Utils/emailMessage.mjs";
import {
  convertBlobToBinary,
  convertBinaryToBlob,
  convertImageToBinary,
} from "../Utils/imageConversion.mjs";

const router = Router();

//routs
router.post("/register", Register);
router.post("/updateprofile", UpdateProfile);
router.get("/users/:id/verify/:token", ValidateToken);
router.get("/remindPayment", PaymentReminder);

async function Register(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!emailCheck(email)) {
      return res.status(400).json({ error: "Invalid Email ID" });
    }

    const existingUser = await User.findOne({ username: email }, { _id: 1 });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const profileInBinary = await convertImageToBinary('../public/images/pic.png');
    const user = new User({
      username: email,
      phone: phone,
      name: name,
      profilePicture: profileInBinary,
    });
    await user.setPassword(password);
    await user.save();
    const token = new Token({
      userID: user._id,
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
}

async function UpdateProfile(req, res) {
  try {
    let {updateValues,userID} = req.body;
    if ( !userID||!updateValues) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    if ('profilePicture' in updateValues) {
      updateValues.profilePicture = await convertBlobToBinary(updateValues.profilePicture);
    }
    let newPassword=null;
    if ("password" in updateValues) {
      newPassword = updateValues.password;
      delete updateValues.password;
    }
    await User.updateOne({ _id: userID }, updateValues);

    const user1 = await User.findOne({ _id: userID });
    if (!user1) return res.status(400).send({ message: "Invalid User id" });

    if (newPassword) {
      await user1.setPassword(newPassword);
      await user1.save();
    }
    const profilePicture = await convertBinaryToBlob(user1.profilePicture);
    const user = {
      _id: user1._id,
      username: user1.username,
      phone: user1.phone,
      name: user1.name,
      profilePicture: profilePicture,
    };

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(422).json({error:"Internal Server Error."});
  }
}

async function ValidateToken(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id }, { _id: 1 });
    if (!user) return res.status(400).send({ error: "Invalid User Id" });

    const token = await Token.findOne({
      userID: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ error: "Invalid link" });

    await User.updateOne({ _id: user._id }, { verified: true });
    await token.remove();

    res.redirect(process.env.FRONTEND_URL);
  } catch (error) {
    console.error(error);
    return res.status(500).josn({error:"Internal Server Error"});
  }
}

async function PaymentReminder(req, res) {
  try {
    const projection = {
      username: 1,
      name: 1,
    };
    const payer = await User.findOne({ _id: req.query.payer_id }, projection);
    const receiver = await User.findOne({ _id: req.query.receiver_id },projection);

    if (!payer) return res.status(400).send({ error: "Invalid Payer Id" });
    if (!receiver)return res.status(400).send({ message: "Invalid Receiver Id" });
    
    const emailMessage = requestMoneyMessage(
      payer.name,
      receiver.name,
      req.query.amount
    );

    await sendEmail(payer.username,"Split-Check Payment Remider", emailMessage);

    return res.status(201).json("Email Reminder sent successfully.");
  } catch (err) {
    console.error(err);
    return res.status(500).json({error:"Internal Server error"});
  }
}

export default router;
