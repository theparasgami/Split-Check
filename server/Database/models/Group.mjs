import mongoose from "mongoose";

const memberSchema = {
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  payments: {
    type: [
      {
        userID: {
          type: String,
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          default:0
        },
      },
    ],
    default: [],
  },
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
    type: Buffer
  },
  simplifyDebts: {
    type: Boolean,
    default: false,
  },
  totalGroupExpense: {
    type: Number,
    default: 0,
  },
  recentPayments: {
    type: [
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
        whoAdded:{
          type: String,
          trim: true
        }
      },
    ],
    default: [],
  },
});

const Group = mongoose.model("Group", groupSchema);
export default Group;
