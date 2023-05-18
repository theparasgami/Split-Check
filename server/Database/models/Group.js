const mongoose =require("mongoose");
const User = require("./User");

const memberSchema = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  payments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  totalExpense: {
    //It will include all the payments which are splitted currently
    type: Number,
    default: 0,
  },
  currTotalExpense: {
    //This will store the current payments which are not splitted
    type: Number,
    default: 0,
  },
  totalAllTimeExpense: {
    type: Number,
    default: 0,
  },
  totalYouPaid: {
    type: Number,
    default: 0,
  },
};

   

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true,
  },
  groupMembers: {
    type: [memberSchema],
    default: [],
  },
  groupImage: {
    type: String,
    default: "https://wc.wallpaperuse.com/wallp/77-777508_s.jpg",
  },
  simplifyDebts: {
    type: Boolean,
    default: false,
  },
  totalGroupExpense: {
    type: Number,
    default: 0,
  },
  recentPayments: [
    {
      date: {
        type: Date,
        required: true,
      },
      payerName: {
        type: String,
        required: true,
        trim: true,
      },
      receiverName: {
        type: String,
        required: true,
        trim: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;