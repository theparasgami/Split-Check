import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import Group from "./Group.mjs"; // Import the GroupSchema


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 40,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  phone: {
    type: String,
    trim: true,
  },
  profilePicture: {
    type: Buffer
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Group,
    },
  ],
  googleId: {
    type: String,
    default: "No-GoogleID",
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;
