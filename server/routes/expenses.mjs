import { Router } from "express";
const router = Router();

import Group from "../Database/models/Group.mjs";
import Expense from "../Database/models/Expense.mjs";
import isValidObjectId  from "../Utils/checkObjectId.mjs";

router.post("/group/:group_id/addExpense", AddExpense);
router.get("/group/:group_id/distributeAmount", DistributeAmount);
router.get("/group/:id/removeZeroPayments", RemoveZeroPayments);
router.post("/group/:id/settleDebt", SettleDebts);

async function AddExpense(req, res) {
  try {
    const {
      expense,
      paidBy,
      paidTo,
      TotalCurrPaidBy,
      TotalCurrPaidTo,
      singlePayer,
      Isequally,
      equally,
      countOfequallySplitting,
      user_name,
    } = req.body;
    const groupID = req.params.group_id;

    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group ID is not valid" });
    }
    if (expense.descr.length < 3) {
      return res
        .status(400)
        .json("Please Give a name of atleast length 3 to your expense..");
    }
    if (parseFloat(expense.amount) <= 0) {
      return res
        .status(400)
        .json("Please add a Positive Amount to you expense.");
    }
    if (
      singlePayer === 0 &&
      parseFloat(expense.amount) !== parseFloat(TotalCurrPaidBy)
    ) {
      return res.status(400).json("Please Assign Correct Amounts to Payer");
    }
    if (
      !Isequally &&
      parseFloat(expense.amount) !== parseFloat(TotalCurrPaidTo)
    ) {
      return res.status(400).json("Please Correct Your Unequal Splitting");
    }
    if (Isequally && countOfequallySplitting === 0) {
      return res
        .status(400)
        .json("Please select atleast one member to split with.");
    }

    var transaction = {
      groupId: groupID,
      date: new Date(),
      name: expense.descr,
      amount: expense.amount,
      paidBy: [],
      paidTo: [],
      whoUpdated: user_name,
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
            amount: member.amount.toFixed(2),
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
            amount: member.amount.toFixed(2),
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
        { _id: groupID, "groupMembers.user": member.id },
        {
          $inc: {
            "groupMembers.$.currTotalExpense": -member.amount,
            "groupMembers.$.TotalYouPaid": member.amount,
          },
        }
      );
    });

    const paidToPromises = transaction.paidTo.map(async (member) => {
      await Group.updateOne(
        { _id: groupID, "groupMembers.user": member.id },
        {
          $inc: {
            "groupMembers.$.currTotalExpense": member.amount,
            "groupMembers.$.TotalAllTimeExpense": member.amount,
          },
        }
      );
    });

    await Promise.all([...paidByPromises, ...paidToPromises]);
    //Promise.all to handle the promises returned by the update operations on Group model.
    // By using Promise.all, all the updates can be executed concurrently, improving performance.

    //Now  we only have to arrange the payments which is done in //distributeAmount

    return res.status(201).json("Added Succesfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
}

async function DistributeAmount(req, res) {
  const groupId = req.params.group_id;
  if (!isValidObjectId(groupId)) {
    return res.status(400).json({ error: "Group ID is not valid" });
  }

  const group = await Group.findOne(
    { _id: groupId },
    { _id: 1, groupMembers: 1 }
  );
  if (!group) {
    return res.status(422).json("No such group");
  }

  while (true) {
    let flag = false;

    // if someone who is currently getting but overall he has to pay then we will decrease from his payments first
    for (let index = 0; index < group.groupMembers.length; index++) {
      const moneyOwner = group.groupMembers[index];
      if (moneyOwner.currTotalExpense.toFixed(2) <= -0.99) {
        for (let jindex = 0; jindex < moneyOwner.payments.length; jindex++) {
          if (moneyOwner.currTotalExpense === 0) break;
          const user = moneyOwner.payments[jindex];

          if (user.amount.toFixed(2) <= -0.99) {
            let howMuchcangive = moneyOwner.currTotalExpense;
            let howMuchcantake = user.amount;
            let givenAmount = Math.max(howMuchcangive, howMuchcantake);

            flag = true;
            console.log("1:givenAmount:", givenAmount);
            await Group.updateOne(
              { _id: groupId },
              {
                $inc: {
                  "groupMembers.$[groupMembers].currTotalExpense": -givenAmount,
                  "groupMembers.$[groupMembers].TotalExpense": givenAmount,
                  "groupMembers.$[groupMembers].payments.$[payments].amount":
                    -givenAmount,
                },
              },
              {
                arrayFilters: [
                  { "groupMembers.user_id": moneyOwner.user_id },
                  { "payments.user_id": user.user_id },
                ],
              }
            );
            await Group.updateOne(
              { _id: groupId },
              {
                $inc: {
                  "groupMembers.$[groupMembers].currTotalExpense": givenAmount,
                  "groupMembers.$[groupMembers].TotalExpense": -givenAmount,
                  "groupMembers.$[groupMembers].payments.$[payments].amount":
                    givenAmount,
                },
              },
              {
                arrayFilters: [
                  { "groupMembers.user_id": user.user_id },
                  { "payments.user_id": moneyOwner.user_id },
                ],
              }
            );
            if (flag) break;
          }
        }
      }
      if (flag) break;
    }

    // if someone who is currently paying but overall he will get then we will decrease from his payments first

    for (let index = 0; index < group.groupMembers.length; index++) {
      const moneyTaker = group.groupMembers[index];
      if (moneyTaker.currTotalExpense >= 0.01) {
        for (let jindex = 0; jindex < moneyTaker.payments.length; jindex++) {
          if (moneyTaker.currTotalExpense === 0) break;
          const user = moneyTaker.payments[jindex];

          if (user.amount >= 0.01) {
            let howMuchcantake = moneyTaker.currTotalExpense;
            let howMuchcangive = user.amount;
            let takenAmount = Math.min(howMuchcangive, howMuchcantake);
            flag = true;
            console.log("2:takenAmount:", takenAmount);
            await Group.updateOne(
              { _id: groupId },
              {
                $inc: {
                  "groupMembers.$[groupMembers].currTotalExpense": -takenAmount,
                  "groupMembers.$[groupMembers].TotalExpense": takenAmount,
                  "groupMembers.$[groupMembers].payments.$[payments].amount":
                    -takenAmount,
                },
              },
              {
                arrayFilters: [
                  { "groupMembers.user_id": moneyTaker.user_id },
                  { "payments.user_id": user.user_id },
                ],
              }
            );
            await Group.updateOne(
              { _id: groupId },
              {
                $inc: {
                  "groupMembers.$[groupMembers].currTotalExpense": takenAmount,
                  "groupMembers.$[groupMembers].TotalExpense": -takenAmount,
                  "groupMembers.$[groupMembers].payments.$[payments].amount":
                    takenAmount,
                },
              },
              {
                arrayFilters: [
                  { "groupMembers.user_id": user.user_id },
                  { "payments.user_id": moneyTaker.user_id },
                ],
              }
            );
            if (flag) break;
          }
        }
      }
      if (flag) break;
    }
    //flag=false;
    if (!flag) break;
  }

  try {
    var whoGet = [],
      whoOwe = [];
    await group.groupMembers.forEach((member, ind) => {
      if (member.currTotalExpense <= -0.99) {
        whoGet.push({ member, ind });
      }
    });
    await group.groupMembers.forEach((member, ind) => {
      if (member.currTotalExpense >= 0.01) {
        whoOwe.push({ member, ind });
      }
    });

    while (true) {
      if (whoGet.length === 0 || whoOwe.length === 0) break;
      if (whoGet.length > 1)
        whoGet.sort(
          (a, b) => a.member.currTotalExpense - b.member.currTotalExpense
        );
      if (whoOwe.length > 1)
        whoOwe.sort(
          (a, b) => b.member.currTotalExpense - a.member.currTotalExpense
        );
      if (whoOwe[0].member.currTotalExpense.toFixed(2) < 0.01) break;
      if (whoGet[0].member.currTotalExpense.toFixed(2) > -0.99) break;

      if (
        Math.abs(whoGet[0].member.currTotalExpense) >
        whoOwe[0].member.currTotalExpense
      ) {
        //check if this members are already paying to each other or not

        await Group.updateOne(
          { _id: groupId },
          {
            $inc: {
              "groupMembers.$[groupMembers].payments.$[payments].amount":
                whoOwe[0].member.currTotalExpense,
              "groupMembers.$[groupMembers].currTotalExpense":
                whoOwe[0].member.currTotalExpense,
              "groupMembers.$[groupMembers].TotalExpense":
                -whoOwe[0].member.currTotalExpense,
            },
          },
          {
            arrayFilters: [
              { "groupMembers.user_id": whoGet[0].member.user_id },
              { "payments.user_id": whoOwe[0].member.user_id },
            ],
          }
        );
        await Group.updateOne(
          { _id: groupId },
          {
            $inc: {
              "groupMembers.$[groupMembers].payments.$[payments].amount":
                -whoOwe[0].member.currTotalExpense,
              "groupMembers.$[groupMembers].currTotalExpense":
                -whoOwe[0].member.currTotalExpense,
              "groupMembers.$[groupMembers].TotalExpense":
                whoOwe[0].member.currTotalExpense,
            },
          },
          {
            arrayFilters: [
              { "groupMembers.user_id": whoOwe[0].member.user_id },
              { "payments.user_id": whoGet[0].member.user_id },
            ],
          }
        );

        await whoGet[0].member.payments.forEach((user) => {
          if (user.user_id === whoOwe[0].member.user_id) {
            whoGet[0].member.currTotalExpense +=
              whoOwe[0].member.currTotalExpense;
            whoOwe[0].member.currTotalExpense = 0;
          }
        });

        if (whoOwe[0].member.currTotalExpense !== 0) {
          await Group.updateOne(
            { _id: groupId, "groupMembers.user_id": whoGet[0].member.user_id },
            {
              $push: {
                "groupMembers.$.payments": {
                  user_id: whoOwe[0].member.user_id,
                  user_name: whoOwe[0].member.user_name,
                  amount: whoOwe[0].member.currTotalExpense,
                },
              },
            }
          );
          await Group.updateOne(
            { _id: groupId, "groupMembers.user_id": whoOwe[0].member.user_id },
            {
              $push: {
                "groupMembers.$.payments": {
                  user_id: whoGet[0].member.user_id,
                  user_name: whoGet[0].member.user_name,
                  amount: -whoOwe[0].member.currTotalExpense,
                },
              },
            }
          );
          whoGet[0].member.currTotalExpense +=
            whoOwe[0].member.currTotalExpense;
          whoOwe[0].member.currTotalExpense = 0;
        }
      } else {
        //check if this members are already paying to each other or not
        await Group.updateOne(
          { _id: groupId },
          {
            $inc: {
              "groupMembers.$[groupMembers].payments.$[payments].amount":
                -whoGet[0].member.currTotalExpense,
              "groupMembers.$[groupMembers].currTotalExpense":
                -whoGet[0].member.currTotalExpense,
              "groupMembers.$[groupMembers].TotalExpense":
                whoGet[0].member.currTotalExpense,
            },
          },
          {
            arrayFilters: [
              { "groupMembers.user_id": whoGet[0].member.user_id },
              { "payments.user_id": whoOwe[0].member.user_id },
            ],
          }
        );

        await Group.updateOne(
          { _id: groupId },
          {
            $inc: {
              "groupMembers.$[groupMembers].payments.$[payments].amount":
                whoGet[0].member.currTotalExpense,
              "groupMembers.$[groupMembers].currTotalExpense":
                whoGet[0].member.currTotalExpense,
              "groupMembers.$[groupMembers].TotalExpense":
                -whoGet[0].member.currTotalExpense,
            },
          },
          {
            arrayFilters: [
              { "groupMembers.user_id": whoOwe[0].member.user_id },
              { "payments.user_id": whoGet[0].member.user_id },
            ],
          }
        );

        await whoGet[0].member.payments.forEach((user) => {
          if (user.user_id === whoOwe[0].member.user_id) {
            whoOwe[0].member.currTotalExpense +=
              whoGet[0].member.currTotalExpense;
            whoGet[0].member.currTotalExpense = 0;
          }
        });

        if (whoGet[0].member.currTotalExpense !== 0) {
          await Group.updateOne(
            { _id: groupId, "groupMembers.user_id": whoGet[0].member.user_id },
            {
              $push: {
                "groupMembers.$.payments": {
                  user_id: whoOwe[0].member.user_id,
                  user_name: whoOwe[0].member.user_name,
                  amount: -whoGet[0].member.currTotalExpense,
                },
              },
            }
          );

          await Group.updateOne(
            { _id: groupId, "groupMembers.user_id": whoOwe[0].member.user_id },
            {
              $push: {
                "groupMembers.$.payments": {
                  user_id: whoGet[0].member.user_id,
                  user_name: whoGet[0].member.user_name,
                  amount: whoGet[0].member.currTotalExpense,
                },
              },
            }
          );

          whoOwe[0].member.currTotalExpense +=
            whoGet[0].member.currTotalExpense;
          whoGet[0].member.currTotalExpense = 0;
        }
      }
    }

    return res.status(201).json("Cool Expenses are now distributed among all");
  } catch (err) {
    console.log(err);
    return res.status(422).json(err);
  }
}

async function RemoveZeroPayments(req, res) {
  //Now remove all the payments with zeroes;

  try {
    const groupID = req.params.id;
    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group ID is not valid" });
    }

    await Group.updateOne(
      { _id: groupID },
      {
        $pull: {
          "groupMembers.$[].payments": { amount: { $gte: -0.99, $lte: 0.01 } },
        },
      }
    );
    return res.status(200).json("Successfully removed zero payments");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
}

async function SettleDebts(req, res) {
  try {
    const { payer, receiver, amount } = req.body;

    const groupID = req.params.id;
    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group ID is not valid" });
    }
    if (payer.user_id === receiver.user_id) {
      return res.status(400).json("Payer and Receiver must not be same");
    }
    if (amount === 0) {
      return res.status(400).json("Enter a positive amount");
    }

    await Group.updateOne(
      { _id: groupID },
      {
        $inc: {
          "groupMembers.$[groupMembers].TotalExpense":
            -parseFloat(amount).toFixed(2),
          "groupMembers.$[groupMembers].payments.$[payments].amount":
            parseFloat(amount).toFixed(2),
        },
        $push: {
          recentPayments: {
            $each: [
              {
                date: new Date(),
                payerName: payer.user_name,
                receiverName: receiver.user_name,
                amount: amount,
              },
            ],
            $position: 0,
          },
        },
      },
      {
        arrayFilters: [
          { "groupMembers.user_id": payer.user_id },
          { "payments.user_id": receiver.user_id },
        ],
      }
    );
    await Group.updateOne(
      { _id: group_id },
      {
        $inc: {
          "groupMembers.$[groupMembers].TotalExpense":
            parseFloat(amount).toFixed(2),
          "groupMembers.$[groupMembers].payments.$[payments].amount":
            -parseFloat(amount).toFixed(2),
        },
      },
      {
        arrayFilters: [
          { "groupMembers.user_id": receiver.user_id },
          { "payments.user_id": payer.user_id },
        ],
      }
    );

    return res.status(200).json("Settlement successful");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
}

async function updateGroupAndMembers(
  groupId,
  ownerId,
  recipientId,
  ownerUpdateAmount,
  recipientUpdateAmount
) {
  await Group.updateOne(
    { _id: groupId },
    {
      $inc: {
        "groupMembers.$[owner].currTotalExpense": ownerUpdateAmount,
        "groupMembers.$[owner].TotalExpense": ownerUpdateAmount,
        "groupMembers.$[recipient].currTotalExpense": recipientUpdateAmount,
        "groupMembers.$[recipient].TotalExpense": recipientUpdateAmount,
        "groupMembers.$[owner].payments.$[ownerPayment].amount":
          ownerUpdateAmount,
        "groupMembers.$[recipient].payments.$[recipientPayment].amount":
          recipientUpdateAmount,
      },
    },
    {
      arrayFilters: [
        { "owner.user_id": ownerId },
        { "recipient.user_id": recipientId },
        { "ownerPayment.user_id": recipientId },
        { "recipientPayment.user_id": ownerId },
      ],
    }
  );
}

export default router;
