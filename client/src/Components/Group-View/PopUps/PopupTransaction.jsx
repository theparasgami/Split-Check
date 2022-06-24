import React from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import "./popups.scss"
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const PopupTransaction=(props)=>{
    
    return (
      <div className="popup-box popupTransaction">
            <div className="box">
                <CancelIcon className="close-icon" 
                            onClick={props.cross} 
                />
                <div className="head">
                    {props.expense.name}
                </div>
                <div className="amount">
                    ₹ {props.expense.amount}
                </div>
                <div className="description">
                     Added by {props.expense.whoUpdated} on &nbsp;
                     {months[((new Date(props.expense.date)).getMonth())]}&nbsp;
                     {((new Date(props.expense.date)).getDate())}&nbsp;,&nbsp; 
                     {((new Date(props.expense.date)).getFullYear())}&nbsp;
                </div>
                <hr/>     
                <div className="payers">
                    {
                        props.expense.paidBy.map((payer,ind)=><div key={ind}>
                          <div className="payerdetail">
                            {payer.name}&nbsp;paid ₹&nbsp;{payer.amount}
                          </div>
                        </div>)
                     }
                </div>
                <hr/>
                <div className="allSplitting">
                     {
                        props.expense.paidTo.map((taker,ind)=><div key={ind}>
                          <div className="splittedDetails">
                               {taker.name}&nbsp;owe ₹&nbsp;{taker.amount}
                          </div>
                        </div>)
                     }
                </div>
                <hr/>
            </div>
       </div>
    )
}
export default PopupTransaction;