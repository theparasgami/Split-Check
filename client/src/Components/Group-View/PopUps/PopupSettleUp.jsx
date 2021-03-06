import React, { useState ,useEffect} from "react";
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';
import {Button}  from "../../Constants/Buttons/Button";
import "./popups.scss";
import ImgSrc from "./Split-Check.png"
import {LottieAnimation2} from "../../Constants/Lotties/lottie"
const Backend="https://split-check.herokuapp.com"

const PopupSettleUp=(props)=>{

    const [loading,setLoading]=useState(false);
    const [payment,setPayment]=useState({
                             payer:props.payer,
                             receiver:props.receiver,
                             amount:Math.abs(!props.payer.amount?props.receiver.amount:props.payer.amount).toFixed(2)
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
          axios.post(Backend+"/group/"+props.group_id+"/settleDebt",payment)
               .then((res)=>{
                   axios.get(Backend+"/group/"+props.group_id+"/removeZeroPayments");
                   window.alert(res.data);
                   window.location.reload();
               })
               .catch((err)=>{
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
                        {props.payer.user_name}
                  </div>
              </div>
              paid
              <div className="howMuch">
                   ???
                  <input type="number" 
                         placeholder={0.00}
                         value={payment.amount}
                         onChange={handleChange} 
                         className="InputMoney" />
              </div>
              to
              <div className="receiver">
                   {props.receiver.user_name}
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
export default PopupSettleUp;