import { Router } from "express";
const router = Router();

import Group from "../Database/models/Group.mjs";
import Expense from "../Database/models/Expense.mjs";
import isValidObjectId from "../Utils/checkObjectId.mjs";
import { distributeAmount,removeZeroPayments,updatePayment } from "../helpers/expenses.mjs";

router.post("/expense/:group_id/addExpense", AddExpense);
router.post("/expense/:group_id/settleDebt", SettleDebts);
router.get("/expense/:group_id/getExpenses", GetExpenses);

async function AddExpense(req, res) {
  try {
    const {expense,paidBy,paidTo,TotalCurrPaidBy,TotalCurrPaidTo,singlePayer,Isequally,equally,countOfequallySplitting,userName} = req.body;
    const groupID = req.params.group_id;

    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group ID is not valid" });
    }
    if (expense.descr.length < 3) {
      return res.status(400).json({  error: "Please Give a name of atleast length 3 to your expense..",});
    }
    if (parseFloat(expense.amount) <= 0) {
      return res.status(400).json({ error: "Please add a Positive Amount to you expense." });
    }
    if (singlePayer === 0 &&parseFloat(expense.amount) !== parseFloat(TotalCurrPaidBy)){
      return res.status(400).json({ error: "Please Assign Correct Amounts to Payer" });
    }
    if (!Isequally &&parseFloat(expense.amount) !== parseFloat(TotalCurrPaidTo)) {
      return res.status(400).json({ error: "Please Correct Your Unequal Splitting" });
    }
    if (Isequally && countOfequallySplitting === 0) {
      return res.status(400).json({ error: "Please select atleast one member to split with." });
    }
    
    var transaction = {
      groupId: groupID,
      date: new Date(),
      name: expense.descr,
      amount: expense.amount,
      paidBy: [],
      paidTo: [],
      whoUpdated: userName,
    };

    if (Isequally) {
      equally.forEach((member, ind) => {
        if (member.included) {
          transaction.paidTo.push({
            ...paidTo[ind],
            amount: (expense.amount / countOfequallySplitting).toFixed(2),
          });
        }
      });
    } else {
      paidTo.forEach((member, ind) => {
        if (member.amount > 0) {
          transaction.paidTo.push({
            ...member,
            amount: parseFloat(member.amount).toFixed(2),
          });
        }
      });
    }

    if (singlePayer > 0) {
      transaction.paidBy.push({
        ...paidBy[singlePayer - 1],
        amount: expense.amount,
      });
    } else {
      paidBy.forEach((member, ind) => {
        if (member.amount > 0)
          transaction.paidBy.push({
            ...member,
            amount: parseFloat(member.amount).toFixed(2),
          });
      });
    }

    const new_expense = new Expense(transaction);
    await new_expense.save();
    await Group.findOneAndUpdate(
      { _id: groupID },
      {
        $inc: { totalGroupExpense: expense.amount },
      }
    );

    const paidByPromises = transaction.paidBy.map(async (member) => {
      await Group.updateOne(
        { _id: groupID, "groupMembers.userID": member.id },
        {
          $inc: {
            "groupMembers.$.currTotalExpense": -member.amount,
            "groupMembers.$.totalYouPaid": member.amount,
          },
        }
      );
    });

    const paidToPromises = transaction.paidTo.map(async (member) => {
      await Group.updateOne(
        { _id: groupID, "groupMembers.userID": member.id },
        {
          $inc: {
            "groupMembers.$.currTotalExpense": member.amount,
            "groupMembers.$.totalAllTimeExpense": member.amount,
          },
        }
      );
    });

    await Promise.all([...paidByPromises, ...paidToPromises]);
    //Promise.all to handle the promises returned by the update operations on Group model.
    // By using Promise.all, all the updates can be executed concurrently, improving performance.

    //Now  we only have to arrange the payments which is done in //distributeAmount
    await distributeAmount(groupID);
    await removeZeroPayments(groupID);

    return res.status(201).json("Added Succesfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


async function SettleDebts(req, res) {
  try {
    const { payer, receiver, amount, adder } = req.body;

    const groupID = req.params.group_id;
    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group ID is not valid" });
    }
    if (payer.userID === receiver.userID) {
      return res.status(400).json({ error: "Payer and Receiver must not be same" });
    }
    if (amount === 0) {
      return res.status(400).json({ error: "Enter a positive amount" });
    }
    await updatePayment(groupID, payer, receiver, parseFloat(amount).toFixed(2),adder);
    
    // //Now  we only have to arrange the payments which is done in //distributeAmount
    await removeZeroPayments(groupID);
    return res.status(200).json("Settlement successful");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function GetExpenses(req, res) {
  try {
     const groupID = req.params.group_id;
     if (!isValidObjectId(groupID)) {
       return res.status(400).json({ error: "Group ID is not valid" });
     }
    const expenses = await Expense.find({ groupId: groupID }).sort({date:-1});
    return res.status(200).json(expenses);
  } catch(err) {
     console.error(err);
     return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default router;
