
import React, {  useState , useEffect } from "react";
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';
import {Button}  from "../../Constants/Buttons/Button";
import "./popups.scss";
import {LottieAnimation2} from "../../Constants/Lotties/lottie"
// const Backend="https://split-check.herokuapp.com"
const Backend = "http://localhost:8000"

const AddMember=(props)=>{
  
    const [email,setEmail]=useState("");
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
      setLoading(true);
      setTimeout(() =>setLoading(false), 1500);
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    const saveMember=async()=>{
      await axios.get (Backend+"/verifyMember/"+email)
      .then(async(res)=>{
            await axios.post(Backend+"/group/"+props.group_id+"/addMember",
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
          {loading?<LottieAnimation2/> :<>
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
           </>}
            
          </div>
      </div>
    )
}
export default AddMember;