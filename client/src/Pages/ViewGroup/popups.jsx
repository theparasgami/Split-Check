import React, { useState } from "react";
import { Accordion,AccordionSummary,AccordionDetails,Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CancelIcon from '@mui/icons-material/Cancel';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SaveIcon from '@mui/icons-material/CheckCircle';
import {Button}  from "../../Components/Constants/Buttons/Button";
import "./viewGroup.scss";
import bottomImg from "./art.png"

const sampleArr=[1,1,1,1,];

const PopupTransaction=(props)=>{
    
    return (
      <div className="popup-box popupTransaction">
            <div className="box">
                <CancelIcon className="close-icon" onClick={props.cross} />
                <div className="head">Canteen</div>
                <div className="amount">₹ 200</div>
                <div className="description">Added by Mark Wood on June 8, 2022</div>
                <div className="payers">
                    {
                        sampleArr.map(()=><>
                          <div className="payerdetail">Stark paid ₹ 10</div>
                        </>)
                     }
                </div>
                <div className="allSplitting">
                     {
                        sampleArr.map(()=><>
                          <div className="splittedDetails">Steve owe ₹ 10</div>
                        </>)
                     }
                </div>
            </div>
       </div>
    )
}

const PopupSettleUp=(props)=>{
  // const {user}=useContext(AuthContext);

  return (
    <div className="popup-box popupSettleUp">
        <div className="box">

            <CancelIcon className="close-icon" onClick={props.cross} />
            <div className="head">Settle Up</div>

            <div className="payer">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&w=1000&q=80" alt="Hi" className="payerImg"/>  
                <div className="payerName"> A Star</div>
            </div>
             paid
            <div className="howMuch">
                 ₹
                <input type="number" placeholder="0.00" name="paidMoney" className="InputMoney" />
            </div>
             to
             <div className="receiver">Mr. Wann</div>
             <Button bgColor="green" className="submitBtn">Settle Up</Button>
        </div>
    </div>
  )
}



const AddExpense=(props)=>{
   const [paidBy,setpaidBy]=useState(props.members.map((member)=>(
                                      {name:member.user_name,amount:0})
                                    ));
   const [splitting,setSplitting]=useState(props.members.map((member)=>(
                                               {name:member.user_name,amount:0})
                                          ));
   const [paidByPopup,setpaidByPopup]=useState(false);
   const [splittingPopUp,setSplittingPopUp]=useState(false);

   const HowMuchPaid=()=>{
    return (
        <div className="popup-box popUpHowMuchPaid">
          <div className="box">
                <CancelIcon className="close-icon" onClick={setpaidByPopup(false)} />
          </div>
        </div>
         
    )
   }

  return (
    <div className="popup-box popupAddExpense">
        <div className="box">

            <CancelIcon className="close-icon" onClick={props.cross} />
            <SaveIcon className="save-icon"  />

            <div className="head">Add an Expense</div>

            <div className="description">
               <div className="billImg"><ReceiptLongIcon className="billIcon"/></div>
               <input type="text" className="inputDescr" placeholder="Enter a description"/> 
            </div>

            <div className="description">
               <div><CurrencyRupeeIcon className="billIcon"/></div>
               <input type="number" className="inputDescr" placeholder="0.00"/> 
            </div>

            <div className="payment">

              <span className="text">Paid by </span>
              <Accordion className="accords">
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    onClick={setpaidByPopup(true)}>
                    you
                </AccordionSummary>
              </Accordion>
              <span className="text"> and splits </span>
           
              <Accordion className="accords">
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}>
                    Equally 
                </AccordionSummary>
              </Accordion>
            </div>
        </div>
    </div>
  )
}

const AddMember=(props)=>{
  
  const [email,setEmail]=useState("");


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
          
          <Button onClick={()=>props.save(email)} >Add</Button>

          <img src={bottomImg} className="bottomImg"/>
        </div>
    </div>
  )
}

export {PopupTransaction,PopupSettleUp,AddExpense,AddMember};