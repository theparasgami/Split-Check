import { Router } from "express";
import Group from "../Database/models/Group.mjs";
import User from "../Database/models/User.mjs";
import isValidObjectId  from "../Utils/checkObjectId.mjs";
import emailCheck from "../Utils/checkEmail.mjs";
import {
  convertBlobToBinary,
  convertBinaryToBlob,
  convertImageToBinary,
} from "../Utils/imageConversion.mjs";

const router = Router();

//routes
router.get("/group/verifyMember/:email", VerifyMember);
router.post("/group/saveGroup", SaveGroup);
router.get("/group/user/:userId", GroupsListForUser);
router.get("/group/:group_id/user/:userID/details", DetailsForAGroup);
router.post("/group/:group_id/addMember", AddMemberInGroup);
router.delete("/group/:group_id/deleteMember/:userID", DeleteMember);
router.get("/group/:group_id/user/:user_id/payments", PaymentsOfUser);
router.get("/group/:group_id/members", GetGroupMembers);
router.get("/group/:group_id/recentPayments", GetRecentPayments);


async function VerifyMember(req, res) {
  try {
    const userName = req.params.email;
    if (!emailCheck(userName)) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    const user1= await User.findOne(
      { username: userName },
      { _id: 1, username: 1,name:1, profilePicture: 1 }
    );

    if (user1) {
      const blobProifle = await convertBinaryToBlob(user1.profilePicture);
      const user = {
        _id: user1._id,
        name:user1.name,
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
    if (!group.groupImage) {
      group.groupImage = await convertImageToBinary("../public/images/group.jpg");
    } else {
      group.groupImage =await convertBlobToBinary(group.groupImage);
    }
    const newGroup = new Group(group);
    await newGroup.save();

    const userIDs = newGroup.groupMembers.map((data) => data.userID);

    await User.updateMany(
      { _id: { $in: userIDs } },
      { $push: { groups: { $each: [newGroup._id], $position: 0 } } }
    );
    return res.status(201).json({ id: newGroup._id });
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
        'groupMembers.$': 1,
      }; 
      const group = await Group.findOne({ _id: group_id, 'groupMembers.userID': userID }, projection);
      if (group && group.groupMembers.length > 0) {
        response.push({
          _id: group._id,
          groupName: group.groupName,
          groupImage: await convertBinaryToBlob(group.groupImage),
          totAmnt: group.groupMembers[0].totalExpense,
        });
      }
    }
    return res.status(201).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
}

async function DetailsForAGroup(req, res) {
  const groupID = req.params.group_id;
  const uID = req.params.userID;

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
      'groupMembers.$':1,
    };
    
    const group = await Group.findOne({ _id: groupID, 'groupMembers.userID': uID }, projection);
    if (group && group.groupMembers.length > 0) {
      const groupImage = await convertBinaryToBlob(group.groupImage);
      const response = {
        group: {
          groupName: group.groupName,
          groupImage: groupImage,
          simplifyDebts: group.simplifyDebts,
          totalGroupExpense: group.totalGroupExpense,
        },
        userData: {
          TotalExpense: group.groupMembers[0].totalExpense,
          TotalAllTimeExpense: group.groupMembers[0].totalAllTimeExpense,
          TotalYouPaid: group.groupMembers[0].totalYouPaid,
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
   
    const group = await Group.findOne(
      { _id: groupID, "groupMembers.userID": user._id },
      {"groupMembers.userID": 1}
    );
    if (group) {
      return res.status(422).json({ error: "Already a Group Member" });
    }
    const newMember = {
      userID: user._id,
      userName: user.name,
    };

    const updateGroup = await Group.updateOne(
      { _id: groupID },
      { $push: { groupMembers: newMember } }
    );
    const updateUser = await User.updateOne(
      { _id: user._id },
      { $push: { groups: groupID } }
    );

    return res.status(200).json("Successfully added member");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function DeleteMember(req, res) {
  const groupID = req.params.group_id;
  const userID = req.params.userID;

  try {
    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group ID is not valid" });
    }
    if (!isValidObjectId(userID)) {
      return res.status(400).json({ error: "User ID is not valid" });
    }

    const group = await Group.findOne(
      { _id: groupID, "groupMembers.userID": userID },
      { _id: 1 }
    );
    if (!group) {
      return res.status(404).json({ error: "Member not found" });
    }
   
    await Group.updateOne(  
      { _id: groupID },
      { $pull: { groupMembers: { user: userID } } }
    );
    await User.updateOne(
      { _id: userID },
      { $pull: { groups: groupID } }
    );

    return res.status(200).json({ message: "Member successfully deleted" });
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
      'groupMembers.$':1
    };
    const group = await Group.findOne({ _id: groupID,'groupMembers.userID':userID}, projection);
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
    const groupID = req.params.group_id;
    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group ID is not valid" });
    }
    const group = await Group.findOne(
      { _id: groupID },
      { groupMembers: 1 }
    );

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
    const groupID = req.params.group_id;
    if (!isValidObjectId(groupID)) {
      return res.status(400).json({ error: "Group ID is not valid" });
    }
    const group = await Group.findOne({ _id: groupID }, { recentPayments: 1 });

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
