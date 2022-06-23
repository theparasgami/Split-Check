import React, {useState } from "react";

import Mbutton from "@mui/material/Button/Button";
import {List,ListItem,Divider,ListItemText,ListItemAvatar,Avatar} from '@mui/material';

import PopupSettleUp  from "./PopUps/PopupSettleUp";

import money from "./money.jpg"

const sampleArr=[1,1,1,1,1,1,1];
   

const AllPayments=()=>{
       const [popUpPayment,setPopUpPayment]=useState(false);
       return (<>
           <h1 className="heading">Settle Debts</h1>         
           <List>
                {
                 (sampleArr.length!==0)?(
                    sampleArr.map((val,ind)=><div key={ind}>

                        <ListItem className="AllPayments" >
                            <ListItemAvatar>
                            <Avatar alt="GG" 
                                    src={money} 
                                    variant="square"
                            />
                            </ListItemAvatar>
                            <ListItemText className="statement">
                                Paras Gami owes
                                <span className="amount"> 
                                   &nbsp;  ₹ 100 &nbsp;
                                </span>
                                to This user  
                            </ListItemText>
                            <Mbutton onClick={()=>(setPopUpPayment(true))}>
                                Settle Up..
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
           {popUpPayment&&(<PopupSettleUp key={1} cross={()=>setPopUpPayment(false)}/>)}
       </>)
}

export default AllPayments;
   