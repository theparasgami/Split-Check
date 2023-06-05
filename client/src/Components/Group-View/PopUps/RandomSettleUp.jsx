import React, { useState ,useEffect, useContext} from "react";
import { FormControl,InputLabel,Select,MenuItem } from "@mui/material";
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';
import {Button}  from "../../Constants/Buttons/Button";
import "./popups.scss";
import ImgSrc from "./Split-Check.png"
import {LottieAnimation2} from "../../Constants/Lotties/lottie"
import { backendUrl } from "../../../env_prod";
import { AuthContext } from "../../../Context/AuthContext";

const RandomSettleUp=(props)=>{

  const user = useContext(AuthContext);
    const [loading,setLoading]=useState(false);
    const [payment,setPayment]=useState({payer:0,receiver:0,amount:0});

    useEffect(()=>{
      setLoading(true);
      setTimeout(() =>setLoading(false), 1500);
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange=(e)=>{
    e.preventDefault();
    setPayment({...payment,amount:e.target.value});
  }
    
  const PostData =async() => {
    try {
      const res=await axios.post(backendUrl + "/expense/" + props.group_id + "/settleDebt",
        {
          payer: props.members[payment.payer],
          receiver: props.members[payment.receiver],
          amount: payment.amount,
          adder: user.name
        });
      window.alert(res.data);
      window.location.reload();
    }
    catch (err) {
      console.error(err);
      window.alert(err.response.data.error);
    }
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
                                <MenuItem value={ind} key={ind}>
                                     {member.userName}
                                </MenuItem>
                            )
                        }
                      </Select>
                    </FormControl>
                  </div>
              </div>
              <div className="howMuch">
                  <img src={ImgSrc}
                    alt="Hi"
                    className="splitImg"
                  />  
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
                                <MenuItem value={ind} key={ind}>
                                     {member.userName}
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