import React, { useState ,useEffect} from "react";
import { FormControl,InputLabel,Select,MenuItem } from "@mui/material";
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';
import {Button}  from "../../Constants/Buttons/Button";
import "./popups.scss";
import ImgSrc from "./Split-Check.png"
import {LottieAnimation2} from "../../Constants/Lotties/lottie"
import { backendUrl } from "../../../env_prod";

const RandomSettleUp=(props)=>{

    const [loading,setLoading]=useState(false);
    const [payment,setPayment]=useState({
                             payer:0,
                             receiver:0,
                             amount:0
                          });

    useEffect(()=>{
      setLoading(true);
      setTimeout(() =>setLoading(false), 1500);
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange=(e)=>{
        e.preventDefault();
        setPayment({...payment,amount:e.target.value});
    }
    
    const PostData=()=>{
          console.log(props.group_id);
          axios.post(backendUrl+"/group/"+props.group_id+"/settleDebt",
                                            {payer:props.members[payment.payer],
                                             receiver:props.members[payment.receiver],
                                             amount:payment.amount})
               .then((res)=>{
                   axios.get(backendUrl+"/group/"+props.group_id+"/removeZeroPayments");
                   window.alert(res.data);
                   window.location.reload();
               })
               .catch((err)=>{
                   window.alert(err.response.data);
                   console.error(err);
               })
    }


    return (
      <div className="popup-box popupSettleUp">
          <div className="box">
          {loading?<LottieAnimation2/> :<>
              <CancelIcon className="close-icon" 
                          onClick={props.cross} 
              />
              <div className="head">
                   Settle Up
              </div>
  
              <div className="payer">
                  <img src={ImgSrc} 
                       alt="Hi" 
                       className="payerImg"
                  />  
                  <div className="payerName">
                    <FormControl >
                      <InputLabel id="demo-simple-select-label" sx={{color:"white"}}>Payer</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        value={payment.payer}
                        sx={{color:"white"}}
                        label="Payer"
                        onChange={(e)=>setPayment({...payment,payer:e.target.value})}
                      >
                        {
                            props.members.map((member,ind)=>
                                <MenuItem value={ind}>
                                     {member.user_name}
                                </MenuItem>
                            )
                        }
                      </Select>
                    </FormControl>
                  </div>
              </div>
              <div className="howMuch">
                   ₹
                  <input type="number" 
                         placeholder={0.00}
                         value={payment.amount}
                         onChange={handleChange} 
                         className="InputMoney" />
              </div>
              <div className="receiver">
                  <FormControl >
                      <InputLabel id="demo-simple-select-label" sx={{color:"white"}}>Receiver</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        value={payment.receiver}
                        sx={{color:"white"}}
                        label="Payer"
                        onChange={(e)=>setPayment({...payment,receiver:e.target.value})}
                      >
                        {
                            props.members.map((member,ind)=>
                                <MenuItem value={ind}>
                                     {member.user_name}
                                </MenuItem>
                            )
                        }
                      </Select>
                  </FormControl>
              </div>
              <Button bgColor="green" 
                      className="submitBtn"
                      onClick={PostData}
              >
                      Settle Up
              </Button>
          </>}
          </div>
      </div>
    )
}
export default RandomSettleUp;