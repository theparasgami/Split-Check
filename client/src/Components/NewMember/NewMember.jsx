import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import { AuthContext } from "../../Context/AuthContext";
const defaultProfile="https://wc.wallpaperuse.com/wallp/77-777508_s.jpg";


function emailCheck(email){
   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(String(email).toLowerCase());
}
const Backend="https://split-check.herokuapp.com"

const NewMember=(props)=>{
  
   const {user}=useContext(AuthContext);
   const [verifiedUser,setVerified]=useState(null);

   const verifyUsername=async()=>{
         if(emailCheck(props.username)){
            axios.get(Backend+"/verifyMember/"+props.username)
            .then((res)=>{
               console.log("Email Verified", props.username);
               setVerified(res);
            })
        }
   }

   useEffect(()=>{
      verifiedUser&&(props.onVerified(props.id,verifiedUser.data));
   },[verifiedUser]);

   useEffect(()=>{
      verifyUsername();
   },[props.username]);
   
   

    return (
       <div className="NewMember">

          <img src={props.userr?props.userr.profilePicture
                               :defaultProfile
                   }
               className="memberphoto" 
               alt="member" 
          />

          <div className="rightPart">

             <div className="InputAndName"> 
                {props.userr?
                    <p className="VerfiedName" >
                       {props.userr.username}
                    </p>:
                    <input type="email"
                           placeholder="Email Address"
                           name="username" 
                           onChange={(e)=>{props.onmemberInput(e,props.id)}} 
                           value={props.username} 
                           className="inputSection"
                   />
                }
             </div>

             <div className="CrossIcon">
                {(user.username!==props.username)&&(
                     <ClearIcon className="clearIcon" 
                                onClick={()=>{props.oncancel(props.id)}}
                     />)
                }
            </div>

          </div>

       </div>

   )
}

export default NewMember;