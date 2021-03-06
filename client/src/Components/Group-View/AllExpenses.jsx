import React, {  useState, useEffect } from "react";
import axios from "axios";
import {List,ListItem,Divider,ListItemText,ListItemAvatar,Avatar,Typography} from '@mui/material';

import PopupTransaction  from "./PopUps/PopupTransaction";
import {LottieAnimation1} from "../Constants/Lotties/lottie";

import bill from "./billl.jpg"
const months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Backend="https://split-check.herokuapp.com"


const AllExpenses=(props)=>{
    
    const [expenses,setExpenses]=useState([]);
    const [loading,setLoading]=useState(false)
    const [popUpTrans,setPopUpTrans]=useState(null);
    
    useEffect(()=>{
        setLoading(true);
        axios.get(Backend+"/group/"+props.group_id+"/getExpenses")
                  .then(res=>setExpenses(res.data))
                  .catch((err)=>{
                      console.log(err);
                  }) 
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    },[])//eslint-disable-line react-hooks/exhaustive-deps
    
    let youPaid=[],youLent=[];
    expenses.forEach((expense)=>{
        let amount1=0,amount2=0;
          expense.paidBy.forEach((payer)=>{
              if(payer.id===props.user_id)amount1+=parseFloat(payer.amount);
          })
          expense.paidTo.forEach((taker)=>{
              if(taker.id===props.user_id)amount2+=parseFloat(taker.amount);
          })
        youPaid.push(amount1.toFixed(2));
        youLent.push(amount2.toFixed(2));
    })
   

    return (
        loading? <div style={{height:"30vh"}}><LottieAnimation1/></div>
        :<>
        <h1 className="heading">Expenses</h1>
        <List>
         {
          expenses.map((expense,ind)=><div key={ind}>
                    <ListItem alignItems="flex-start" 
                              className="transaction" 
                              onClick={()=>(setPopUpTrans(expense))} >
                       
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
                                {(parseInt(youPaid[ind])===0&&parseInt(youLent[ind])===0)?
                                               ("You are not involved in this expense.")
                                :""}
                                {youPaid[ind]>0?<div style={{color:"green"}}>
                                     You Paid ??? {youPaid[ind]} </div>
                                :""}
                                {youLent[ind]>0?<div style={{color:"red"}}>
                                    Your Expense ??? {youLent[ind]}</div>
                                :""}
                               </Typography>
                           </React.Fragment>
                           }
                           className="transDetail"
                        />
                        <ListItemText className="OurPart">
                            <b> ??? {expense.amount}</b>
                        </ListItemText>
                      
                   </ListItem>
                   <Divider component="li" />
         </div>)
         }
       </List>
       {popUpTrans&&(<PopupTransaction cross={()=>setPopUpTrans(null)}
                                       expense={popUpTrans}
                    />)}
       
    </>)
}

export default AllExpenses;