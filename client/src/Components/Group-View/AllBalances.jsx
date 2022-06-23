import React, { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Mbutton from "@mui/material/Button/Button";
import {List,ListItem,Divider,Typography} from '@mui/material';
import { Accordion,AccordionSummary,AccordionDetails } from "@mui/material";
import PopupSettleUp  from "./PopUps/PopupSettleUp";


const AllBalances=(props)=>{
    
    
    const [popUpsettleUp,setPopupSettleUp]=useState(null);
    const groupMembers=props.Data.group.groupMembers;
    
    return(<>
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
                                 {(member.currTotalExpense===0)&&(<>
                                      <b>{member.user_name}</b>
                                      &nbsp;is all settled Up.
                                 </>)}
                                 {(member.currTotalExpense>0)&&(<>
                                         <b>{member.user_name}</b> 
                                         &nbsp;gets back 
                                         <b className="priceg0">
                                             &nbsp; ₹ {member.currTotalExpense} &nbsp;
                                         </b> in Total.
                                 </>)}
                                 {(member.currTotalExpense<0)&&(<>
                                             <b>{member.user_name}</b> owes
                                             <b className="pricel0">
                                                 &nbsp; ₹ {-member.currTotalExpense} &nbsp;
                                             </b> in Total.
                                 </>)}
                             </Typography>
                         
                         </AccordionSummary>
                         <AccordionDetails className="AccordionDetails">
                              {member.payments.map((expense_detail,ind)=><div key={ind}>
                                  <Typography>

                                      {expense_detail.amount<0&&(<>
                                         <b>{member.user_name}</b>
                                         &nbsp; owes ₹&nbsp; 
                                         {Math.abs(expense_detail.amount).toFixed(2)} 
                                         &nbsp; to &nbsp; 
                                         <b>{expense_detail.user_name}</b>
                                      </>)} 
                                      {expense_detail.amount>0&&(<>
                                         <b>{expense_detail.user_name}</b>
                                         &nbsp; owes ₹ &nbsp; 
                                         {Math.abs(expense_detail.amount).toFixed(2)}
                                         &nbsp;to &nbsp; 
                                         <b> {member.user_name}</b>
                                      </>)} 
                                      <Mbutton className="SettleUpBtn" 
                                               onClick={()=>setPopupSettleUp(null)} >
                                               SettleUp
                                      </Mbutton>
                                      <Divider className="Divider" component="li" />
                                  </Typography>
                              </div>)}
                              {popUpsettleUp&&<PopupSettleUp cross={()=>setPopupSettleUp(null)} />}
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