import React from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import {Button}  from "../../Constants/Buttons/Button";
import "./popups.scss";

const PopupSettleUp=(props)=>{
    return (
      <div className="popup-box popupSettleUp">
          <div className="box">
  
              <CancelIcon className="close-icon" 
                          onClick={props.cross} 
              />
              <div className="head">
                   Settle Up
              </div>
  
              <div className="payer">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&w=1000&q=80" 
                       alt="Hi" 
                       className="payerImg"
                  />  
                  <div className="payerName">
                        A Star
                  </div>
              </div>
              paid
              <div className="howMuch">
                   ₹
                  <input type="number" 
                         placeholder="0.00" 
                         name="paidMoney" 
                         className="InputMoney" />
              </div>
              to
              <div className="receiver">
                   Mr. Wann
              </div>
              <Button bgColor="green" 
                       className="submitBtn">
                       Settle Up
              </Button>
          </div>
      </div>
    )
}
export default PopupSettleUp;