import React, { useContext, useState, useEffect } from "react";
import { Switch } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import Collapse from '@mui/material/Collapse';
import BootstrapTooltip from "../../Components/Constants/ToolTip/tooltip"
import {AuthContext} from "../../Context/AuthContext"
import "./newGroup.scss";
import ImageUpload from "../../Components/Constants/Buttons/ImageUpload";
import NewMember from "../../Components/NewMember/NewMember";
import axios from "axios";
import NavBar from "../../Components/Navbar/NavBar";
import { backendUrl } from "../../env_prod";
import groupImage from "./group.jpg"
import {getImageInBinary } from "../../Components/Constants/getImageInBinary";
const toolTipText="This setting automatically combines debts to reduce the total number of repayments between group members. \n For example,\n if you owe Anna $10 and Anna owes Bob $10, a group with simplified debts will tell you to pay Bob $10 directly."


function NewGroup(){
  
  const { user }= useContext(AuthContext);

  // For Adding  a Member
  const [member, setMember] = useState([{ userd: user, named: user.username }]);

     //check the input of member name
  const memberInputChange = (e, ind) => {
    setMember((prevMember) => prevMember.map((data, index) => (index === ind ? { ...data, named: e.target.value } :data )));
  };
  
  const removeMember = (ind) => {
    setMember((prevMember) => prevMember.filter((_, index) => index !== ind));
  };

  const addMember = () => {
    setMember((prevMember) => [...prevMember, { userd: null, named: "" }]);
  };
     // Now if a valid mail id found the it will update the member array by that user
  const updateMember=(ind,val)=>{ 
    var ourCurrMember={userd:val,named:val.username};

    const isMemberAlreadyPresent = member.some(
      (data, index) => index !== ind && JSON.stringify(ourCurrMember) === JSON.stringify(data)
    );
    if (isMemberAlreadyPresent) {
      ourCurrMember.userd = null;
      ourCurrMember.named = "";
      window.alert("Member Already Present");
    }
    setMember((prevMember) =>
      prevMember.map((data, index) => (index === ind ? ourCurrMember : data))
    );
  }
 
  /*----------------------------------------------------------------*/
 

  // Simplify Debts
  const [simpledebts,setsimpledebts]=useState(false);
  const handleDebts=()=>{
    setsimpledebts(!simpledebts);
  }

  /*----------------------------------------------------------------*/

  const [group,setGroupData]=useState({
      groupImage: null,
      groupName:"",
      simplifyDebts:false,
      groupMembers:[]
  });

  //if a entry is there for a groupName then the hidden attribute will be removed 
  useEffect(() => {
    group.groupName.length && document.querySelector(".hiddenDiv").removeAttribute("hidden");
  },[group.groupName]);// eslint-disable-line react-hooks/exhaustive-deps
 
  
  const handleChange=(event)=>{
    const {name,value}=event.target;
    setGroupData({...group,[name]:value});
  }
  
  // if save button is pressed
  const handleSave = () => {
    const updatedGroupMembers = member
      .filter((data) => data.userd)
      .map((data) => ({
        userID: data.userd._id,
        userName: data.userd.name,
      }));

    const updatedGroup = {
      ...group,
      simplifyDebts: simpledebts,
      groupMembers: updatedGroupMembers,
    };

    setGroupData(updatedGroup);

    if (updatedGroup.groupMembers.length) {
      axios
        .post(backendUrl + "/group/saveGroup", { group: updatedGroup, user })
        .then((res) => {
          window.alert("Group Saved");
          window.location.href = "/group/" + res.data.id;
        })
        .catch((err) => {
          window.alert(err);
          window.location.reload();
        });
    }
  };
/*----------------------------------------------------------------*/
 
  //Image Setting

  const [imgSrc, setImgSrc] = useState(groupImage);
  
  const handleImageChange = async (event) => {
    setImgSrc(() => URL.createObjectURL(event.target.files[0]));
    const imageInBlob = await getImageInBinary(event.target.files[0]);
    setGroupData(() => ({ ...group, groupImage:imageInBlob}));
  }

  // useEffect(()=>{
  //   setGroupData(() => ({ ...group, groupImage:imgSrc}));
  // },[imgSrc])// eslint-disable-line react-hooks/exhaustive-deps
  
  /*----------------------------------------------------------------*/



  return (
    <>
      <NavBar />

      <div className="newGroup">
        
          <div className="imageSection">
            <ImageUpload imgSrc={imgSrc} 
                         imageChange={handleImageChange} 
            />
          </div>

          <div className="detailSection">
             
              <p className="simpleHead"> Start a New Group </p>
              <p className="nameLabel"> By What name Your group called ? </p>

              <input type="text"
                     name="groupName"
                     className="groupNameInput" 
                     placeholder={"The BreakFast Club"} 
                     onChange={handleChange} 
                     value={group.groupName} 
              />
              <hr className="hr"/>
              
              <div className="hiddenDiv"> 
                <Collapse in={group.groupName.length>0} 
                          timeout={1000}
                >             
                 
                  <p className="simpleHead">
                     Group Members
                  </p>
                  {
                    member.map((data,index)=> < NewMember
                                                 key={index} 
                                                 userr={data.userd} 
                                                 username={data.named} 
                                                 onmemberInput={memberInputChange}
                                                 id={index} 
                                                 oncancel={removeMember} 
                                                 onVerified={updateMember}
                                             />)
                  }
                  <button onClick={addMember} 
                          className="addBtn" > 
                          + Add a Person
                  </button>
                  <hr className="hr" />
                
                  <div className="simpleHead debts" >
                     Simplify Group Debts 
                     <Switch checked={simpledebts} 
                             onChange={handleDebts}
                      />
                     <BootstrapTooltip 
                            className="tooltip" 
                            title={toolTipText} >
                            <HelpIcon className="HelpIcon" />
                     </BootstrapTooltip>
                  </div>
                  <hr className="hr" />

                </Collapse>
              </div>
             
              <button onClick={handleSave} className="saveBtn">Save</button>
  
          </div>
      </div>
      
    </>
  );
}
export default NewGroup;
