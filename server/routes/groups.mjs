import { Router } from "express";
import Group from "../Database/models/Group.mjs";
import User from "../Database/models/User.mjs";
import isValidObjectId  from "../Utils/checkObjectId.mjs";
import emailCheck from "../Utils/checkEmail.mjs";
import {
  convertBlobToBinary,
  convertBinaryToBlob,
} from "../Utils/imageConversion.mjs";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

const router = Router();

//routes
router.get("/verifyMember/:email", VerifyMember);
router.post("/saveGroup", SaveGroup);
router.get("/getGroups/:userId", GroupsListForUser);
router.get("/getGroup/:group_id/:user_id", UserDetailsForAGroup);
router.post("/group/:group_id/addMember", AddMemberInGroup);
router.delete("/group/:group_id/deleteMember/:user_id", DeleteMember);
router.get("/group/:group_id/:user_id/getPaymentsofUser", PaymentsOfUser);
router.get("/group/:id/getGroupMembers", GetGroupMembers);
router.get("/group/:id/recentPayments", GetRecentPayments);
// For Groups

async function VerifyMember(req, res) {
  try {
    const userName = req.params.email;
    if (!emailCheck(userName)) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    const user1= await User.findOne(
      { username: userName },
      { _id: 1, username: 1, profilePicture: 1 }
    );

    if (user1) {
      const blobProifle = await convertBinaryToBlob(user1.profilePicture);
      const user = {
        _id: user1._id,
        username: user1.username,
        profilePicture:blobProifle
      }
     
      return res.status(201).json(user);
    } else {
      return res.status(422).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function SaveGroup(req, res) {
  try {
    let { group, user } = req.body;

    // Input validation
    if (!group || !user) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    group.groupImage =await convertBlobToBinary(group.groupImage);
    const newGroup = new Group(group);
    await newGroup.save();

    const userIDs = newGroup.groupMembers.map((data) => data.userID);

    await User.updateMany(
      { _id: { $in: userIDs } },
      { $push: { groups: { $each: [newGroup._id], $position: 0 } } }
    );
    if (ourUser) {
      return res.status(201).json({ id: newGroup._id });
    } else {
      return res.status(422).json({ error: "Failed to retrieve user" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function GroupsListForUser(req, res) {
  try {
    const userID = req.params.userId;
    if (!isValidObjectId(userID)) {
      return res.status(400).json({ error: "User Id is not valid" });
    }

    const user = await User.findOne({ _id: userID }, { groups: 1 });
    if (!user) {
      return res.status(422).json({ error: "Failed to retrieve user" });
    }

    let response = [];

    for (const group_id of user.groups) {
      const projection = {
        groupName: 1,
        groupImage: 1,
        groupMembers: 1,
      };
      const group = await Group.findOne({ _id: group_id }, projection);
      const member = group.groupMembers.filter(
        (member) => String(member.userID) === String(ObjectId(userID))
      );
      if (group) {
        response.push({
          _id: group._id,
          groupName: group.groupName,
          groupImage: await convertBinaryToBlob(group.groupImage),
          totAmnt: member[0].totalExpense,
        });
      }
    }
    return res.status(201).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
}

async function UserDetailsForAGroup(req, res) {
  const groupID = req.params.id;
  const uID = req.params.user_id;

  try {
    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group Id is not valid" });
    }
    if (!isValidObjectId(uID)) {
      return res.status(400).json({ error: "User Id is not valid" });
    }

    const projection = {
      groupName: 1,
      groupImage: 1,
      simplifyDebts: 1,
      totalGroupExpense: 1,
      "groupMembers.$": {
        user: uID,
        TotalExpense: 1,
        TotalAllTimeExpense: 1,
        TotalYouPaid: 1,
      },
    };

    const group = await Group.findById(groupID, projection);
    if (group && group.groupMembers.length > 0) {
      const response = {
        group: {
          groupName: group.groupName,
          groupImage: group.groupImage,
          simplifyDebts: group.simplifyDebts,
          totalGroupExpense: group.totalGroupExpense,
        },
        userData: {
          TotalExpense: group.groupMembers[0].TotalExpense,
          TotalAllTimeExpense: group.groupMembers[0].TotalAllTimeExpense,
          TotalYouPaid: group.groupMembers[0].TotalYouPaid,
        },
      };
      return res.status(200).json(response);
    } else {
      return res.status(404).json({ error: "No such Group user present" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function AddMemberInGroup(req, res) {
  const { user } = req.body;
  const groupID = req.params.group_id;

  try {
    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group Id is not valid" });
    }
    const filter = {
      _id: groupID,
      groupMembers: {
        $elemMatch: {
          userID: user._id,
        },
      },
    };
    const group = await Group.findOne(filter);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.groupMembers.length > 0) {
      return res.status(422).json({ error: "Already a Group Member" });
    }

    const newMember = {
      user: user._id,
      userName: user.name,
    };

    const updateGroup = await Group.updateOne(
      { _id: group._id },
      { $push: { groupMembers: newMember } }
    );
    const updateUser = await User.updateOne(
      { _id: user._id },
      { $push: { groups: group._id } }
    );

    if (updateGroup.ok === 1 && updateUser.ok === 1) {
      return res.status(200).json("Successfully added member");
    } else {
      return res.status(500).json({ error: "Failed to add member" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function DeleteMember(req, res) {
  const groupID = req.params.group_id;
  const userID = req.params.user_id;

  try {
    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group ID is not valid" });
    }
    if (!isValidObjectId(userID)) {
      return res.status(400).json({ error: "User ID is not valid" });
    }

    const group = await Group.findOne({ _id: groupID });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const updateGroup = await Group.updateOne(
      { _id: groupID },
      { $pull: { groupMembers: { user: userID } } }
    );

    const updateUser = await User.updateOne(
      { _id: userID },
      { $pull: { groups: groupID } }
    );

    if (updateGroup.ok === 1 && updateUser.ok === 1) {
      return res.status(200).json({ message: "Member successfully deleted" });
    } else {
      return res.status(500).json({ error: "Failed to delete member" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function PaymentsOfUser(req, res) {
  try {
    const groupID = req.params.group_id;
    const userID = req.params.user_id;

    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group ID is not valid" });
    }
    if (!isValidObjectId(userID)) {
      return res.status(400).json({ error: "User ID is not valid" });
    }
    const projection = {
      "groupMembers.$": {
        user: userID,
        payments: 1,
      },
    };
    const group = await Group.findOne({ _id: groupID }, projection);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    if (!group.groupMembers.length) {
      return res.status(404).json({ error: "Member not found" });
    }
    const payments = group.groupMembers[0].payments || [];
    return res.status(200).json(payments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function GetGroupMembers(req, res) {
  try {
    const groupId = req.params.id;
    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group ID is not valid" });
    }
    const group = await Group.findOne({ _id: groupId }, { groupMembers: 1 });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    return res.status(200).json(group.groupMembers);
  } catch (error) {
    console.error("Error retrieving group members:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function GetRecentPayments(req, res) {
  try {
    const groupId = req.params.id;
    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group ID is not valid" });
    }
    const group = await Group.findOne({ _id: groupId }, { recentPayments: 1 });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    return res.status(200).json(group.recentPayments);
  } catch (error) {
    console.error("Error retrieving group members:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export default router;
