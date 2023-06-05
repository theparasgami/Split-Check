import Group from "../Database/models/Group.mjs";

async function distributeAmount(groupId) {
  await clearCurrPayments(groupId);
  await clearPayments(groupId);
}

async function clearPayments(groupId) {
  const group = await Group.findOne({ _id: groupId }, { groupMembers: 1 });
  var whoGet = group.groupMembers.filter(
    (member) => member.currTotalExpense <= -0.99
  );
  var whoOwe = group.groupMembers.filter(
    (member) => member.currTotalExpense >= 0.01
  );

  while (whoGet.length > 0 && whoOwe.length > 0) {
    whoGet.sort((a, b) => a.currTotalExpense - b.currTotalExpense);
    whoOwe.sort((a, b) => b.currTotalExpense - a.currTotalExpense);

    if (
      whoOwe[0].currTotalExpense.toFixed(2) < 0.01 ||
      whoGet[0].currTotalExpense.toFixed(2) > -0.99
    ) {
      break;
    }

    const amountToTransfer = Math.min(
      Math.abs(whoGet[0].currTotalExpense),
      whoOwe[0].currTotalExpense
    );

    if (! await alreadyPaying(whoGet[0], whoOwe[0])) {
      await addMemberinPayments(groupId, whoGet[0], whoOwe[0]);
    }
    await updateExpense(
      groupId,
      whoGet[0].userID,
      whoOwe[0].userID,
      amountToTransfer
    );
    whoOwe[0].currTotalExpense -= amountToTransfer;
    whoGet[0].currTotalExpense += amountToTransfer;
  }
}

async function alreadyPaying(member1, member2) {
  for (let i = 0; i < member1.payments.length; i++) {
    if (member2.userID === member1.payments[i].userID) return true;
  }
  return false;
}

async function addMemberinPayments(groupId, member1, member2) {
  await Group.updateOne(
    { _id: groupId, "groupMembers.userID": member1.userID },
    {
      $push: {
        "groupMembers.$.payments": {
          userID: member2.userID,
          userName: member2.userName,
          amount: 0,
        },
      },
    }
  );
  await Group.updateOne(
    { _id: groupId, "groupMembers.userID": member2.userID },
    {
      $push: {
        "groupMembers.$.payments": {
          userID: member1.userID,
          userName: member1.userName,
          amount: 0,
        },
      },
    }
  );
}

async function clearCurrPayments(groupId) {
  //remove currTotalExpense from themselves.
  let flag = true;
  while (flag) {
    flag = false;
    let group = await Group.findOne(
      {
        _id: groupId,
        "groupMembers.currTotalExpense": { $lte: -0.99 },
        "groupMembers.totalExpense": { $gte: 0.01 },
      },
      { "groupMembers.$": 1 }
    );
    for (let i = 0; group && !flag && i < group.groupMembers.length; i++) {
      let giver = group.groupMembers[i];
      for (let j = 0; !flag && j < giver.payments.length; j++) {
        let taker = giver.payments[j];
        if (taker.amount.toFixed(2) <= -0.99) {
          const givenAmount = Math.max(giver.currTotalExpense, taker.amount);
          flag = true;
          await updateExpense(
            groupId,
            giver.userID,
            taker.userID,
            -givenAmount
          );
        }
      }
    }
  }

  flag = true;
  while (flag) {
    flag = false;
    let group = await Group.findOne(
      {
        _id: groupId,
        "groupMembers.currTotalExpense": { $gte: 0.01 },
        "groupMembers.totalExpense": { $lte: -0.99 },
      },
      { "groupMembers.$": 1 }
    );
    for (let i = 0; group && !flag && i < group.groupMembers.length; i++) {
      let taker = group.groupMembers[i];
      for (let j = 0; !flag && j < taker.payments.length; j++) {
        let giver = taker.payments[j];
        if (giver.amount.toFixed(2) >= 0.01) {
          const takenAmount = Math.min(taker.currTotalExpense, giver.amount);
          flag = true;
          await updateExpense(groupId, giver.userID, taker.userID, takenAmount);
        }
      }
    }
  }
  return true;
}

async function updateExpense(groupId, fromUserId, toUserId, amount) {
  await Group.updateOne(
    { _id: groupId },
    {
      $inc: {
        "groupMembers.$[fromMember].currTotalExpense": amount,
        "groupMembers.$[fromMember].totalExpense": -amount,
        "groupMembers.$[fromMember].payments.$[fromPayment].amount": amount,
        "groupMembers.$[toMember].currTotalExpense": -amount,
        "groupMembers.$[toMember].totalExpense": amount,
        "groupMembers.$[toMember].payments.$[toPayment].amount": -amount,
      },
    },
    {
      arrayFilters: [
        { "fromMember.userID": fromUserId },
        { "fromPayment.userID": toUserId },
        { "toMember.userID": toUserId },
        { "toPayment.userID": fromUserId },
      ],
    }
  );
}

async function removeZeroPayments(groupID) {
  Group.updateOne(
    { _id: groupID },
    {
      $pull: {
        "groupMembers.$[].payments": { amount: { $gte: -0.99, $lte: 0.01 } },
      },
    }
  );
}

async function updatePayment(groupId, payer, receiver, amount, adder) {
  const group = await Group.findOne(
    {
      _id: groupId,
      "groupMembers.userID": payer.userID
    },
    {
      "groupMembers.$":1
    }
  );
  let alreadyPaying=false
  for (let i = 0; i < group.groupMembers[0].payments.length; i++)
  {
    if (receiver.userID === group.groupMembers[0].payments[i].userID) {
      alreadyPaying = true;
    }
  }
  if (!alreadyPaying) {
   await addMemberinPayments(groupId,payer, receiver);
  }
  await Group.updateOne(
    { _id: groupId },
    {
      $inc: {
        "groupMembers.$[fromMember].totalExpense": -amount,
        "groupMembers.$[fromMember].payments.$[fromPayment].amount": amount,
        "groupMembers.$[toMember].totalExpense": amount,
        "groupMembers.$[toMember].payments.$[toPayment].amount": -amount,
      },
      $push: {
        recentPayments: {
          $each: [
            {
              date: new Date(),
              payerName: payer.userName,
              receiverName: receiver.userName,
              amount: amount,
              whoAdded: adder
            },
          ],
          $position: 0,
        },
      },
    },
    {
      arrayFilters: [
        { "fromMember.userID": payer.userID },
        { "fromPayment.userID": receiver.userID },
        { "toMember.userID": receiver.userID },
        { "toPayment.userID": payer.userID },
      ],
    }
  );
}

export { distributeAmount, removeZeroPayments, updatePayment };
