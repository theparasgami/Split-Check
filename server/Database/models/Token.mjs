import mongoose from "mongoose";
import User from "./User.mjs";

const tokenSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60,
  },
});

const Token = new mongoose.model("Token", tokenSchema);

export default Token;
