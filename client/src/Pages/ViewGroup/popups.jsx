import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import {Button}  from "../../Components/Constants/Buttons/Button";
import "./viewGroup.scss";

const sampleArr=[1,1,1,1,];

const PopupTransaction=(props)=>{

    return (
      <div className="popup-box popupTransaction">
            <div className="box">
                <div className="close-icon" >x</div>
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
  const {user}=useContext(AuthContext);

  return (
    <div className="popup-box popupSettleUp">
        <div className="box">
            <div className="close-icon" >x</div>
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

export {PopupTransaction,PopupSettleUp};