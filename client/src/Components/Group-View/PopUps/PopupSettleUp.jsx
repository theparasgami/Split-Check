import React, { useState ,useEffect, useContext} from "react";
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';
import {Button}  from "../../Constants/Buttons/Button";
import "./popups.scss";
import { AuthContext } from "../../../Context/AuthContext"
import ImgSrc from "./Split-Check.png"
import {LottieAnimation2} from "../../Constants/Lotties/lottie"
import { backendUrl } from "../../../env_prod";

const PopupSettleUp=(props)=>{
    const user = useContext(AuthContext);
    const [loading,setLoading]=useState(false);
    const [payment,setPayment]=useState({payer:props.payer,receiver:props.receiver,
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
    
    const PostData = async () => {
        try {
            const res = await axios.post(backendUrl + "/expense/" + props.group_id + "/settleDebt",
                {
                    payer: payment.payer,
                    receiver: payment.receiver,
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
                        {props.payer.userName}
                  </div>
              </div>
              paid
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
              to
              <div className="receiver">
                   {props.receiver.userName}
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