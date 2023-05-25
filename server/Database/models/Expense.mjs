import mongoose from "mongoose";
import Group from "./Group.mjs";
import User from "./User.mjs";

const expenseSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Group,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  paidTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  ],
  whoUpdated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
