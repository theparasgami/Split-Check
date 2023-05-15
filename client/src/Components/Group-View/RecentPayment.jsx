import React, {useState ,useEffect} from "react";
import axios from "axios";
import {List,ListItem,Divider,ListItemText,ListItemAvatar,Avatar} from '@mui/material';
import {LottieAnimation1} from "../Constants/Lotties/lottie";
import bill from "./billl.jpg"
import { backendUrl } from "../../env_prod";

const months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];



const RecentPayment=(props)=>{
    
    const [recents,setRecents]=useState([]);
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(backendUrl+"/group/"+props.group_id+"/recentPayments")
             .then(res=>setRecents(res.data));
        setTimeout(()=>setLoading(false),1500);
    }, [])// eslint-disable-line react-hooks/exhaustive-deps
    
     
    return (loading?<div style={{height:"30vh"}}><LottieAnimation1/></div>
        :<>
        <h1 className="heading">Recent Payment</h1>         
        <List>
             {
              recents.map((payment,ind)=><div key={ind}>
                 <ListItem className="Recents">
                        <div className="payDate">
                           {((new Date(payment.date)).getDate())} <br/>
                           {months[((new Date(payment.date)).getMonth())]}
                        </div>
                       <ListItemAvatar>
                           <Avatar alt="GG" src={bill} variant="square"/>
                       </ListItemAvatar>
                     <ListItemText className="statement">
                        <b> {payment.payerName} </b>
                        &nbsp;paid ₹  <b>{parseFloat(payment.amount).toFixed(2)}</b> 
                        &nbsp;to <b>{payment.receiverName} .</b>
                     </ListItemText>
        
                 </ListItem>
                 <Divider className="Divider" component="li" />
              </div>)
            }
        </List>
    </>)
}

export default RecentPayment;