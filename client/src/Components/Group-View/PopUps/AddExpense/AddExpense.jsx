
import React, { useState,useEffect } from "react";
import axios from "axios";
import {Button} from "../../../Constants/Buttons/Button";
import CancelIcon from '@mui/icons-material/Cancel';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import {LottieAnimation2} from "../../../Constants/Lotties/lottie"
import HowMuchPaid from "./HowMuchPaid";
import HowMuchSplits from "./HowMuchSplits";
import "../popups.scss";
import { backendUrl } from "../../../../env_prod";

const AddExpense=(props)=>{
    
    
    const [loading,setLoading]=useState(false);

    const [expense,setExpense]=useState({descr:"",amount:0});
    const [TotalCurrPaidBy,setTotalCurrPaidBy]=useState(0);
    const [singlePayer,setsinglePayer]=useState(1);
    const [TotalCurrPaidTo,setTotalCurrPaidTo]=useState(0);
    const [equally,setequally]=useState(props.members.map((member)=>({
                                              id: member.user_id,
                                              included: true,
                                              name: member.user_name
                                             })
                                        ));
    const [Isequally,setIsequally]=useState(1);
    const [countOfequallySplitting,setcntState]=useState(props.members.length);

    const [paidBy,setpaidBy]=useState(props.members.map((member)=>({
                                            id:member.user_id,
                                            name:member.user_name,
                                            amount:0
                                          })
                                      ));
    const [paidTo,setpaidTo]=useState(props.members.map((member)=>({
                                            id:member.user_id,
                                            name:member.user_name,
                                            amount:0
                                          })
                                      ));

    const [paidByPopup,setpaidByPopup]=useState(false);
    const [paidToPopup,setpaidToPopup]=useState(false);


    useEffect(()=>{
      setLoading(true);
      setTimeout(() =>setLoading(false), 1500);
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
  
    const handlePaidByChange=async(e)=>{
       e.preventDefault();
       setpaidBy(
         paidBy.map((member)=>{
           return member.name===e.target.name?({
             ...member,amount:(e.target.value).toFixed(2)
           }):member
         })
      )
    }
    useEffect(() => { 
      setTotalCurrPaidBy(
        paidBy.reduce((total, currentValue) => 
                          total = total + parseFloat(currentValue.amount),0)
       );
    }, [paidBy]);// eslint-disable-line react-hooks/exhaustive-deps
    

    const handlePaidToChange=(e)=>{
      e.preventDefault();
      setpaidTo( 
         paidTo.map((member)=>(
           member.name===e.target.name?({
             ...member,amount:(e.target.value).toFixed(2)
           }):member
         ))
      )
    }
    useEffect(() => { 
      setTotalCurrPaidTo(
        paidTo.reduce((total, currentValue) => 
                          total = total + parseFloat(currentValue.amount),0)
       );
    }, [paidTo]); // eslint-disable-line react-hooks/exhaustive-deps

    
    const handleEquallyChange=(id)=>{ 
      setequally(()=> equally.map((member)=>(
                 (member.id===id)?(
                      {...member,
                       included:!member.included}):
                      member
            ))
      )
    }
    const handleCountOfEquallySplitting=()=>{
        setcntState(equally.reduce((tot,curr)=>
                          tot=tot+curr.included,0)
        );
    }
    
    const handleChange=(e)=>{
      e.preventDefault();
      const {name,value}=e.target;
      setExpense({...expense,[name]:value});
    }
    
    
    const PostData=()=>{
        const user_name=props.user_name;
        axios.post(backendUrl+"/group/"+props.group_id+"/addExpense",{expense,
                                                           paidBy,
                                                           paidTo,
                                                           TotalCurrPaidBy,
                                                           TotalCurrPaidTo,
                                                           singlePayer,
                                                           Isequally,
                                                           equally,
                                                           countOfequallySplitting,
                                                           user_name
                  }).then((res)=>{
                     window.alert(res.data);
                     window.location.reload();
                  }).catch((err)=>{
                     window.alert(err.response.data);
                  })
    }





   return (
     <div className="popup-box popupAddExpense">
         
         <div className="box" >
 
             <CancelIcon className="close-icon" onClick={props.cross} />
            {loading?<LottieAnimation2/> :<>
             <div className="head">
               Add an Expense
             </div>
  
             <div className="description">
                <div className="billImg">
                    <ReceiptLongIcon className="billIcon"/>
                 </div>
                <input type="text" 
                       className="inputDescr" 
                       placeholder="Enter a description"
                       name="descr"
                       value={expense.descr}
                       onChange={handleChange}
                 /> 
             </div>
 
             <div className="description">
                <div>
                  <CurrencyRupeeIcon className="billIcon"/>
                 </div>
                <input type="number" 
                       className="inputDescr" 
                       placeholder="0.00"
                       name="amount"
                       value={expense.amount}
                       onChange={handleChange}
                 /> 
             </div>
 
             <div className="payment">
 
               <span className="text">Paid by </span>
               <div className="accords"
                     onClick={()=>setpaidByPopup(true)}>
                     {!singlePayer?"multiple"
                                 :(singlePayer===1?"you":
                                     props.members[singlePayer-1].user_name.substring(0,6))}  
               </div>
               <span className="text"> and splits </span>
            
               <div className="accords"
                     onClick={()=>setpaidToPopup(true)}>
                     {Isequally?"equally":"uneqaually"}
               </div>
             </div>
              
             {(singlePayer===0&&parseFloat(expense.amount)!==parseFloat(TotalCurrPaidBy))
                     ?<>Please Add Correct amount of payers</>:""
             }
             <br/>
             {(!Isequally&&parseFloat(expense.amount)!==parseFloat(TotalCurrPaidTo))
                     ?<>Please Add Correct Splitting</>:""
             }
             {(Isequally&&parseInt(countOfequallySplitting)===0)
                    ?<>Please Select atlease one member to split with</>:""
             }
             <br/>

             <Button className="AddBtn"
                     bgColor="green"
                     onClick={PostData}>
                     Add
             </Button>
          </>}
         </div>
         {paidByPopup&&<HowMuchPaid key={1}
                                    cross={()=>setpaidByPopup(false)}
                                    handleChange={(e)=>handlePaidByChange(e)}
                                    membersContro={paidBy}
                                    totAmnt={expense.amount}
                                    totCurrAmnt={TotalCurrPaidBy}
                                    singlePayer={singlePayer}
                                    handleSinglePayerClick={(ind)=>setsinglePayer(ind)}
                                    multiPayer={()=>setsinglePayer(0)}
                       />
         }
         {paidToPopup&&<HowMuchSplits key={"unique"}
                                      cross={()=>setpaidToPopup(false)}
                                      totAmnt={expense.amount}
                                      equally={equally}
                                      handleEquallyChange={(id)=>handleEquallyChange(id)}
                                      Isequally={Isequally}
                                      changeType={(v)=>{setIsequally(v)}}
                                      countOfSplitting={countOfequallySplitting}
                                      setcntEqually={handleCountOfEquallySplitting}
                                      membersContro={paidTo}
                                      handleChange={(e)=>handlePaidToChange(e)}
                                      totCurrAmnt={TotalCurrPaidTo}    
                       />
         
         }


     </div>
   )
}

 export default AddExpense;