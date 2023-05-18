const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Group = require("./Group"); // Import the GroupSchema

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
  password: {
    type: String,
    required: function () {
      return this.googleId === "No-GoogleID"; // Require password if not using Google authentication
    },
  },
  profilePicture: {
    type: String,
    default:
      "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
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

module.exports = User;
