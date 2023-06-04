
import React from "react";
import Checkbox from '@mui/material/Checkbox';
import CancelIcon from '@mui/icons-material/Cancel';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SaveIcon from '@mui/icons-material/CheckCircle';

import "../popups.scss";

const HowMuchPaid=(propss)=>{
  //console.log(propss.singlePayer);

  return (
      <div className="popup-box popupHowMuchPaid">
        <div className="box" >
              <CancelIcon className="close-icon" onClick={propss.cross} />
              <SaveIcon className="save-icon" onClick={propss.cross} />
              <div className="heading">
                {propss.singlePayer?"Who Paid"
                                :"Enter paid Amounts"
                }
              </div>

              <div className="members">
                {  
                   propss.membersContro.map((member,ind)=>(<div key={ind}>
                     <div className="member" key={member.id}>
                       <div className="userName">
                         {member.name} 
                       </div>
                       {!propss.singlePayer?(<>
                          <CurrencyRupeeIcon/>
                          <input type="number"
                           onChange={(e) => propss.handleChange(e,ind)}
                                  value={member.amount}
                                  name={member.name}
                                  placeholder="0.00"
                          />
                       </>):(
                          <Checkbox checked={
                                   (ind+1)===(propss.singlePayer)}
                                   onClick={()=>propss.handleSinglePayerClick(ind+1)}
                                   className="checkbox"
                           />
                       )}
                     </div>
                     <hr/>
                   </div>))
                }
              </div>

              {propss.singlePayer?(<>
                <div onClick={propss.multiPayer}
                     className="multiplePayer">
                     Multiple Payer 
                </div>
              </>):(<>
                <div className="multiplePayer"
                     style={{color:parseFloat(propss.totAmnt)!==
                                   parseFloat(propss.totCurrAmnt)
                                  &&"red"}}>
                  ₹ {propss.totCurrAmnt} of  ₹ {propss.totAmnt}
                </div>

              </>)}
             
        </div>
      </div>
  )
}

 export default HowMuchPaid;