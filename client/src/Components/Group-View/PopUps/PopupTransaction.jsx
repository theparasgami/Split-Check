import React from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import "./popups.scss"

const sampleArr=[1,1,1,1]

const PopupTransaction=(props)=>{
    
    return (
      <div className="popup-box popupTransaction">
            <div className="box">
                <CancelIcon className="close-icon" 
                            onClick={props.cross} 
                />
                <div className="head">
                     Canteen
                </div>
                <div className="amount">
                     ₹ 200
                </div>
                <div className="description">
                     Added by Mark Wood on June 8, 2022
                </div>
                <div className="payers">
                    {
                        sampleArr.map(()=><>
                          <div className="payerdetail">
                            Stark paid ₹ 10
                          </div>
                        </>)
                     }
                </div>
                <div className="allSplitting">
                     {
                        sampleArr.map(()=><>
                          <div className="splittedDetails">
                               Steve owe ₹ 10
                          </div>
                        </>)
                     }
                </div>
            </div>
       </div>
    )
}
export default PopupTransaction;