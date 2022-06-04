import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import { Switch } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";

import BootstrapTooltip from "../../Components/Constants/ToolTip/tooltip"
import NavBar from "../../Components/Navbar/NavBar";
import "./viewGroup.scss";
import { AuthContext } from "../../Context/AuthContext";

const toolTipText="This setting automatically combines debts to reduce the total number of repayments between group members. \n For example,\n if you owe Anna $10 and Anna owes Bob $10, a group with simplified debts will tell you to pay Bob $10 directly."


const ViewGroup=()=>{
   const params=useParams();
   const [Data,setData]=useState({group:null,user:null});
   const {user}=useContext(AuthContext);

   useEffect(()=>{
       axios.get(("/group/"+params.id+"/"+user._id))
       .then((res)=>{
           console.log(res.data);
           setData({group:res.data.group,user:res.data.userData});
        })
        .catch((err)=>{
            window.alert("No Such Group");
            window.location.href="/";
        });
    },[])// eslint-disable-line react-hooks/exhaustive-deps
    

   return(
       <>
        <NavBar />
        {
          Data.group&&
                (<div className="ViewGroup">
                        <section className="userSection">
                           
                           <div className="groupdetails">
                                <img className="groupImg" src={Data.group.groupImage} alt="grp" />
                                <div className="groupInfo">
                                    <div className="groupName">{Data.group.groupName} </div>
                                    <p className="simplifydebts" >Simplify  Debts 
                                        <Switch checked={!Data.group.simplifyDebts} disabled />
                                        <BootstrapTooltip className="tooltip" title={toolTipText} >
                                        <HelpIcon className="HelpIcon" />
                                        </BootstrapTooltip>
                                    </p>
                                </div>
                           </div>

                           <div className="divider"></div>

                           <div className="ourdetails">
                               <div className="name">{user.name}</div>
                               <div className="amount"> ₹ {Data.user.currTotalExpense}</div>
                               <div className="status"> 
                                      {Data.user.currTotalExpense===0&&"All Settle up"}
                                      {Data.user.currTotalExpense>0&&"You Owe Money"}
                                      {Data.user.currTotalExpense<0&&"Yow Shoud Pay"}
                               </div>
                           </div>

                        </section>

                 </div> )
        }
       </>
   )
}

export default (ViewGroup);