import React, { useState,useEffect } from "react";
import axios from "axios";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Mbutton from "@mui/material/Button/Button";
import {List,ListItem,Divider,Typography} from '@mui/material';
import { Accordion,AccordionSummary,AccordionDetails } from "@mui/material";
import PopupSettleUp  from "./PopUps/PopupSettleUp";
import { LottieAnimation1 } from "../Constants/Lotties/lottie";
import { backendUrl } from "../../env_prod";



const AllBalances=(props)=>{
    
    
    const [popUpsettleUp,setPopupSettleUp]=useState({receiver:null,payer:null});
    const [groupMembers,setGroupmembers]=useState([]);
    const [loading,setLoading]=useState(false);

    useEffect(async()=>{
        setLoading(true);
        try {
            const res = await axios.get(backendUrl + "/group/" + props.group_id + "/members");
            setGroupmembers(res.data);
            console.log(res.data);
            setLoading(false);
        }
        catch (err) {
            console.error(err);
            window.alert(err.response.data.error);
        }
    },[])//eslint-disable-line react-hooks/exhaustive-deps

    const RemindUser = async(e) => {
        try {
            const res = await axios.get(backendUrl + "/remindPayment", {
                params: {
                    payer_id: e.payer.userID,
                    receiver_id: e.receiver.userID,
                    amount: e.amount
                }
            });
            window.alert(res.data);
        } catch (err) {
            console.error(err);
            window.alert(err.response.data.error);
        }
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
                                 {(member.totalExpense>(-0.99)&&member.totalExpense<0.01)&&(<>
                                      <b>{member.userName}</b>
                                      &nbsp;is all settled Up.
                                 </>)}
                                 {(member.totalExpense<=(-0.99))&&(<>
                                         <b>{member.userName}</b> 
                                         &nbsp;gets back 
                                         <b className="priceg0">
                                             &nbsp; ₹ {-member.totalExpense.toFixed(2)} &nbsp;
                                         </b> in Total.
                                 </>)}
                                 {(member.totalExpense>=0.01)&&(<>
                                             <b>{member.userName}</b> owes
                                             <b className="pricel0">
                                                 &nbsp; ₹ {member.totalExpense.toFixed(2)} &nbsp;
                                             </b> in Total.
                                 </>)}
                            </Typography>
                         </AccordionSummary>

                         <AccordionDetails className="AccordionDetails">
                              {member.payments.map((payment,ind)=><div key={ind}>
                                  <Typography className="typography">
                                   
                                      {payment.amount<0&&(<>
                                         <b>{member.userName}</b>
                                         &nbsp; owes ₹&nbsp; 
                                         {Math.abs(payment.amount).toFixed(2)} 
                                         &nbsp; to &nbsp; 
                                         <b>{payment.userName}</b>
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
                                         <b>{payment.userName}</b>
                                         &nbsp; owes ₹ &nbsp; 
                                         {Math.abs(payment.amount).toFixed(2)}
                                         &nbsp;to &nbsp; 
                                         <b> {member.userName}</b>
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