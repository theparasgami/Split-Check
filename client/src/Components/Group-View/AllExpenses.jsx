import React, {  useState, useEffect } from "react";
import {List,ListItem,Divider,ListItemText,ListItemAvatar,Avatar,Typography} from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

import PopupTransaction  from "./PopUps/PopupTransaction";
import LottieAnimation from "../Constants/Lotties/lottie";

import bill from "./billl.jpg"
import axios from "axios";
const months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];



const AllExpenses=(props)=>{
    
    const [expenses,setExpenses]=useState([]);
    const [loading,setLoading]=useState(false)
    useEffect(()=>{
        console.log("hi");
        setLoading(true);
        axios.get("/group/"+props.gid+"/getExpenses")
                  .then(res=>setExpenses(res.data))
                  .catch((err)=>{
                      console.log(err);
                  }) 
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    },[])//eslint-disable-line react-hooks/exhaustive-deps
    console.log(expenses);

    const [popUpTrans,setPopUpTrans]=useState(false);
    return (
        loading? <LottieAnimation/>
        :<>
        <h1 className="heading">Expenses</h1>
        <List>
         {
          expenses.map((expense,ind)=><div key={ind}>
                    <ListItem alignItems="flex-start" 
                              className="transaction" 
                              onClick={()=>(setPopUpTrans(true))} >
                       
                       <div className="transactionDate">
                           {((new Date(expense.date)).getDate())} <br/>
                           {months[((new Date(expense.date)).getMonth())]}
                       </div>
                
                       <ListItemAvatar>
                           <Avatar alt="GG" src={bill} variant="square"/>
                       </ListItemAvatar>

                       <ListItemText
                           primary={<div className="name">{expense.name} </div>}
                           secondary={
                           <React.Fragment>
                               <Typography
                                   sx={{ display: 'inline' }}
                                   component="span"
                                   variant="body2"
                                   color="text.primary"
                               >
                                   You are not involed
                               </Typography>
                           </React.Fragment>
                           }
                           className="transDetail"
                        />
                        <ListItemText className="OurPart">
                            <CurrencyRupeeIcon/>
                            <b>{expense.amount}</b>
                        </ListItemText>
                      
                   </ListItem>
                   <Divider component="li" />
         </div>)
         }
       </List>
       {popUpTrans&&(<PopupTransaction cross={()=>setPopUpTrans(false)}/>)}
       
    </>)
}

export default AllExpenses;