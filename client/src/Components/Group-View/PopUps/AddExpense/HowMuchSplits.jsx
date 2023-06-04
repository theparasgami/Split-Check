
import React, { useEffect } from "react";
import { Tabs,Tab} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SaveIcon from '@mui/icons-material/CheckCircle';

import "../popups.scss";


const HowMuchSplits=(propss)=>{
  
  
   
   useEffect(() => {
      propss.setcntEqually();
   }, [propss.equally]);// eslint-disable-line react-hooks/exhaustive-deps
   

  return (
    <div className="popup-box popupHowMuchSplits">
      <div className="box" >
            <CancelIcon className="close-icon" onClick={propss.cross} />
            <SaveIcon className="save-icon" onClick={propss.cross} />
           
            <Tabs  value={propss.Isequally}  
                   indicatorColor="secondary"
                   onChange={(e,value)=>propss.changeType(value)}
                   centered
                   sx={{mx:2,mt:5,mb:2}}
            >
                <Tab className="Tab" label="Equally" value={1}  />
                <Tab className="Tab" label="Unequally" value={0} />
            </Tabs>


            <div className="members">
                {  !propss.Isequally&&
                   propss.membersContro.map((member,ind)=>(<div key={ind}>
                     <div className="member" key={ind}>
                       <div className="userName">
                         {member.name} 
                       </div>
                       <CurrencyRupeeIcon/>
                       <input type="number"
                               onChange={(e)=>propss.handleChange(e,ind)}
                               value={member.amount}
                               name={member.name}
                               placeholder="0.00"
                       />
                     </div>
                     <hr/>
                   </div>))
                }
                { 
                   propss.Isequally?
                   propss.equally.map((member,ind)=>(<div key={ind}>
                     <div className="member" >
                       <div className="userName">
                         {member.name}
                       </div>
                       <div className="checkbox">
                           <input 
                              type="checkbox" 
                              checked={member.included}
                              onChange={()=>propss.handleEquallyChange(member.id)}
                          />
                        </div>
                     </div>
                     <hr/>
                   </div>))
                   :""
                }
                
            </div>
            {!propss.Isequally?(
                  <div className="otherDetails"
                      style={{color:parseFloat(propss.totAmnt)!==
                                    parseFloat(propss.totCurrAmnt)
                                    &&"red"}}>
                    ₹ {propss.totCurrAmnt} of  ₹ {propss.totAmnt}
                  </div>
              ):""
            }
            {propss.Isequally?(<>
                  {propss.countOfSplitting===0&&
                    <div className="otherDetails" style={{color:"red"}}>
                      Please Select atleast one Person
                    </div>
                  }
                  {propss.countOfSplitting!==0&&
                     <div className="otherDetails">
                      ~₹ {(propss.totAmnt/propss.countOfSplitting).toFixed(2)}/person 
                      <br/>({propss.countOfSplitting}) people 
                    </div>
                  }
            </>):""}

      </div>
    </div>
  )
}


 export default HowMuchSplits;