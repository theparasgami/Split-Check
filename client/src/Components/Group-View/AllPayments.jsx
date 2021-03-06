import React, {useState ,useEffect} from "react";
import axios from "axios";

import {List,ListItem,Divider,ListItemText,ListItemAvatar,Avatar} from '@mui/material';
import Mbutton from "@mui/material/Button/Button";

import {LottieAnimation1} from "../Constants/Lotties/lottie";
import PopupSettleUp  from "./PopUps/PopupSettleUp";

import money from "./money.jpg"
const Backend="https://split-check.herokuapp.com"


const AllPayments=(props)=>{
       const [popUpPayment,setPopUpPayment]=useState({payer:null,receiver:null});
       const [loading,setLoading]=useState(false);
       const [payments,setPayments]=useState([]);

       useEffect(() => {
            setLoading(true);
            axios.get(Backend+"/group/"+props.group_id+"/"+props.ourUser.user_id+"/getPaymentsofUser")
                 .then((res)=>{
                     setPayments(res.data);
                }
            );
            setTimeout(() => {
                setLoading(false);
            }, 1500);

       }, []) // eslint-disable-line react-hooks/exhaustive-deps
      
       const RemindUser=(e)=>{
           axios.get(Backend+"/remindPayment",{ params: {
                                            payer_id:e.payer.user_id,
                                            receiver_id:e.receiver.user_id,
                                            amount:e.amount}
                                        })
                .then((res)=>window.alert(res.data))
                .catch((err)=>window.alert(err.response.data));
       }
      
       return (
        loading? <div style={{height:"30vh"}}><LottieAnimation1/></div>
        :<>
           <h1 className="heading">Settle Debts</h1>         
           <List>
                {
                 (payments.length!==0)?(
                    payments.map((payment,ind)=><div key={ind}>

                        <ListItem className="AllPayments" >
                            <ListItemAvatar>
                            <Avatar alt="GG" 
                                    src={money} 
                                    variant="square"
                            />
                            </ListItemAvatar>
                            <ListItemText className="statement">
                               {payment.amount>0?<> 
                                  {payment.user_name} owes
                                  <span className="amount"> 
                                     &nbsp;  ??? {payment.amount.toFixed(2)} &nbsp;
                                  </span>
                                  to {props.ourUser.user_name} 
                                </>:<>
                                  {props.ourUser.user_name} owes
                                  <span className="amount"> 
                                     &nbsp;  ??? {-payment.amount.toFixed(2)} &nbsp;
                                  </span>
                                  to {payment.user_name}
                                </>} 
                            </ListItemText>
                            <Mbutton onClick={()=>(setPopUpPayment(()=>payment.amount>0?
                                                              {payer:payment,receiver:props.ourUser}:
                                                              {payer:props.ourUser,receiver:payment}
                                                   ))}>
                                Settle Up..
                            </Mbutton>
                            <Mbutton onClick={()=>(RemindUser(payment.amount>0?
                                                              {payer:payment,receiver:props.ourUser,amount:payment.amount}:
                                                              {payer:props.ourUser,receiver:payment,amount:-payment.amount}
                                                   ))}>
                                Remind
                            </Mbutton>
                        </ListItem>
                        <Divider className="Divider" component="li" />

                    </div>)):(
                        <div className="SettledUp">
                            You are all settled Up..
                        </div>
                    )
                }
           </List>
           {popUpPayment.receiver&&
                        (<PopupSettleUp cross={()=>setPopUpPayment({payer:null,receiver:null})}
                                        payer={popUpPayment.payer}
                                        receiver={popUpPayment.receiver}
                                        group_id={props.group_id}
                        />)
            }
       </>)
}

export default AllPayments;
   