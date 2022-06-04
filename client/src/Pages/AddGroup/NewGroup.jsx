import React, { useContext, useState, useEffect } from "react";
import { Switch } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import Collapse from '@mui/material/Collapse';
import BootstrapTooltip from "../../Components/Constants/ToolTip/tooltip"
import {AuthContext} from "../../Context/AuthContext"
import "./newGroup.scss";
import ImageUpload from "../../Components/Constants/Buttons/ImageUpload";
import NewMember from "./NewMember";
import axios from "axios";
import NavBar from "../../Components/Navbar/NavBar";

const toolTipText="This setting automatically combines debts to reduce the total number of repayments between group members. \n For example,\n if you owe Anna $10 and Anna owes Bob $10, a group with simplified debts will tell you to pay Bob $10 directly."


function NewGroup(){
  
  const {user}=useContext(AuthContext);

  // For Adding  a Member
  const [member,setMember]=useState([{userd:user,named:user.username},
                                     {userd:null,named:""},
                                     {userd:null,named:""},
                                     {userd:null,named:""}
                                    ]);
     //check the input of member name
  const memberInputChnage=(e,ind)=>{
        setMember(member.map((data,index)=>{
           return ind===index?{userd:data.userd,named:e.target.value}:data;
        }))
  }
  const removeMember=(ind)=>{
         setMember(member.filter((data,index)=>(index!==ind)));
  }
  const addMember=()=>{
         setMember([...member,{userd:null,named:""}]);
  }
     // Now if a valid mail id found the it will update the member array by that user
  const updateMember=(ind,val)=>{ 
    var ourCurrMember={userd:val,named:val.username};

    // check if user is already present in member before adding it to member
    const foundedMember=(member.filter((dataa,index)=>(
                               index!==ind&&JSON.stringify(ourCurrMember) === JSON.stringify(dataa)
                               ))
                        ).length;
    foundedMember&&(ourCurrMember={userd:null,named:""});
    foundedMember&&window.alert("Member Already Present");

    setMember(member.map((data,index)=>(ind===index)?ourCurrMember:(data)));
    
  }
 
  /*----------------------------------------------------------------*/
 

  // Simplify Debts
  const [simpledebts,setsimpledebts]=useState(false);
  const handleDebts=()=>{
    setsimpledebts(!simpledebts);
  }

  /*----------------------------------------------------------------*/

  
  const [group,setGroupData]=useState({
      image:"https://wc.wallpaperuse.com/wallp/77-777508_s.jpg",
      groupName:"",
      simplifyDebts:false,
      groupMembers:[]
  });

  //if a entry is there for a groupName then the hidden attribute will be removed 
  useEffect(()=>{
    group.groupName.length&&document.querySelector(".hiddenDiv").removeAttribute("hidden");
  },[group.groupName]);// eslint-disable-line react-hooks/exhaustive-deps
 

  const handleChange=(event)=>{
    const {name,value}=event.target;
    setGroupData({...group,[name]:value});
  }
  
  // if save button is pressed
  const handleSave=()=>{
        setGroupData({...group,
                       ["simplifyDebts"]:simpledebts,
                       ["groupMembers"]:(member.filter((dataa)=>(dataa.userd))
                                               .map((data)=>({user_id:data.userd._id,expenses:[]})))
                     });
        console.log(group);
  }
  
  //Now if save button is pressed then post request {useEffect worl because 
  //if save button is pressed the group member should update}
  
  const {dispatch}=useContext(AuthContext);
  
  useEffect(()=>{
      if(group.groupMembers.length){
               axios.post("/saveGroup",group)
               .then((res)=>{
                   window.alert("Group Saved");
                   dispatch({type:"SUCCESS",payload:res.data.ouruser});
                   window.location.href="/";
               })
               .catch((err)=>{
                    window.alert(err);
                    window.location.reload();
               })
      }
  },[group.groupMembers])// eslint-disable-line react-hooks/exhaustive-deps
  
/*----------------------------------------------------------------*/
 
  //Image Setting

  const [imgSrc,setImgSrc]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTUZ6_CLreN4emDjtpBDgKw-HPTDxvQBBVKQ&usqp=CAU");
  const handleImageChange=(event)=>{
    setImgSrc(()=>URL.createObjectURL(event.target.files[0]));
  }

  useEffect(()=>{
    setGroupData(()=>({...group,image:imgSrc}));
  },[imgSrc])// eslint-disable-line react-hooks/exhaustive-deps
  
  /*----------------------------------------------------------------*/




  return (
    <>
      <NavBar />

      <div className="newGroup">
          <div className="imageSection">
            <ImageUpload imgSrc={imgSrc} imageChange={handleImageChange} />
          </div>

          <div className="detailSection">
             
              <p className="simpleHead"> Start a New Group</p>
             
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
                <Collapse in={group.groupName.length} timeout={1000} >             
                 
                  <p className="simpleHead">Group Members</p>
                  {
                    member.map((data,index)=> < NewMember 
                                                 userr={data.userd} 
                                                 username={data.named} 
                                                 onmemberInput={memberInputChnage}
                                                 id={index} 
                                                 oncancel={removeMember} 
                                                 onVerified={updateMember}
                                             />)
                  }
                  <button onClick={addMember} className="addBtn" > + Add a Person</button>
                  <hr className="hr" />
                
                  <p className="simpleHead" >Simplify Group Debts 
                     <Switch checked={simpledebts} onChange={handleDebts}/>
                     <BootstrapTooltip className="tooltip" title={toolTipText} >
                       <HelpIcon className="HelpIcon" />
                     </BootstrapTooltip>
                  </p>
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
