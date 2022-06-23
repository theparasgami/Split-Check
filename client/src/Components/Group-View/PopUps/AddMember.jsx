
import React, {  useState } from "react";
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';
import {Button}  from "../../Constants/Buttons/Button";
import "./popups.scss";
import bottomImg from "./art.png"


const AddMember=(props)=>{
  
    const [email,setEmail]=useState("");
    
    const saveMember=async()=>{
      await axios.get ("/verifyMember/"+email)
      .then(async(res)=>{
            await axios.post("/group/"+props.group_id+"/addMember",
                           {user:res.data}
                 ).then((res)=>{
                     window.alert(res.data);
                     window.location.reload();
                 }).catch((err)=>{
                     window.alert("Member Already Exist");
                 })

      }).catch((err)=>{
          window.alert(err.response.data);
      });
    }
  
  
    return (
      <div className="popup-box popupAddMember">
          <div className="box">
  
            <CancelIcon className="close-icon" onClick={props.cross} />
            
            <div className="head">Add a Member</div>
  
            <input type="email" 
                   value={email} 
                   onChange={(e)=>setEmail(e.target.value)} 
                   required 
                   placeholder="Email Address"
                   className="emailAddress"
            />
            <br/>
            
            <Button onClick={saveMember} >
                    Add
            </Button>
  
            <img src={bottomImg} 
                 className="bottomImg"
                 alt="hi"
            />
          </div>
      </div>
    )
}
export default AddMember;