import React, { useState,useEffect } from "react";
import axios from "axios";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Mbutton from "@mui/material/Button/Button";
import {List,ListItem,Divider,Typography} from '@mui/material';
import { Accordion,AccordionSummary,AccordionDetails } from "@mui/material";
import PopupSettleUp  from "./PopUps/PopupSettleUp";
import {LottieAnimation1} from "../Constants/Lotties/lottie";
const Backend="https://split-check.herokuapp.com"

const AllBalances=(props)=>{
    
    
    const [popUpsettleUp,setPopupSettleUp]=useState({receiver:null,payer:null});
    const [groupMembers,setGroupmembers]=useState([]);
    const [loading,setLoading]=useState(false);

    useEffect(()=>{
        setLoading(true);
        axios.get(Backend+"/group/"+props.group_id+"/getGroupMembers")
                  .then(res=>setGroupmembers(res.data))
                  .catch((err)=>{
                      console.log(err);
                  }) 
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    },[])//eslint-disable-line react-hooks/exhaustive-deps

    const RemindUser=(e)=>{
        axios.get("/remindPayment",{ params: {
                                         payer_id:e.payer.user_id,
                                         receiver_id:e.receiver.user_id,
                                         amount:e.amount}
                                     })
             .then((res)=>window.alert(res.data))
             .catch((err)=>window.alert(err.response.data));
    }
    
    return(
      loading? <div style={{height:"30vh"}}><LottieAnimation1/></div>
      :<>
       <h1 className="heading">All Balances</h1>
       <List>
             {
              groupMembers.map((member,ind)=><div key={ind}>
                 <ListItem className="AllBalances">
                     <Accordion className="accordion">
                         <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                         >
                            <Typography >
                                 {(member.TotalExpense>(-0.99)&&member.TotalExpense<0.01)&&(<>
                                      <b>{member.user_name}</b>
                                      &nbsp;is all settled Up.
                                 </>)}
                                 {(member.TotalExpense<=(-0.99))&&(<>
                                         <b>{member.user_name}</b> 
                                         &nbsp;gets back 
                                         <b className="priceg0">
                                             &nbsp; ₹ {-member.TotalExpense.toFixed(2)} &nbsp;
                                         </b> in Total.
                                 </>)}
                                 {(member.TotalExpense>=0.01)&&(<>
                                             <b>{member.user_name}</b> owes
                                             <b className="pricel0">
                                                 &nbsp; ₹ {member.TotalExpense.toFixed(2)} &nbsp;
                                             </b> in Total.
                                 </>)}
                            </Typography>
                         </AccordionSummary>

                         <AccordionDetails className="AccordionDetails">
                              {member.payments.map((payment,ind)=><div key={ind}>
                                  <Typography className="typography">
                                   
                                      {payment.amount<0&&(<>
                                         <b>{member.user_name}</b>
                                         &nbsp; owes ₹&nbsp; 
                                         {Math.abs(payment.amount).toFixed(2)} 
                                         &nbsp; to &nbsp; 
                                         <b>{payment.user_name}</b>
                                         <Mbutton className="SettleUpBtn" 
                                               onClick={()=>setPopupSettleUp({payer:member,receiver:payment})} >
                                               Settle Up
                                          </Mbutton>
                                          <Mbutton className="SettleUpBtn" 
                                               onClick={()=>RemindUser({payer:member,
                                                                              receiver:payment,
                                                                              amount:Math.abs(payment.amount).toFixed(2)})} >
                                               Remind
                                          </Mbutton>
                                      </>)} 
                                      {payment.amount>0&&(<>
                                         <b>{payment.user_name}</b>
                                         &nbsp; owes ₹ &nbsp; 
                                         {Math.abs(payment.amount).toFixed(2)}
                                         &nbsp;to &nbsp; 
                                         <b> {member.user_name}</b>
                                         <Mbutton className="SettleUpBtn" 
                                               onClick={()=>setPopupSettleUp({payer:payment,receiver:member})} >
                                               Settle Up
                                         </Mbutton>
                                         <Mbutton className="SettleUpBtn" 
                                               onClick={()=>RemindUser({payer:payment,
                                                                              receiver:member,
                                                                              amount:Math.abs(payment.amount).toFixed(2)})} >
                                               Remind
                                         </Mbutton>
                                      </>)} 
                                      
                                      <Divider className="Divider" component="li" />
                                  </Typography>
                              </div>)}
                              {popUpsettleUp.payer&&
                                        <PopupSettleUp cross={()=>setPopupSettleUp({payer:null,receiver:null})}
                                                       payer={popUpsettleUp.payer} 
                                                       receiver={popUpsettleUp.receiver} 
                                                       group_id={props.group_id}
                                        />
                              }
                         </AccordionDetails>
                     </Accordion>
                 </ListItem>
                 <Divider className="Divider" />
              </div>)
             }
        </List>
    </>)
}

export default AllBalances;