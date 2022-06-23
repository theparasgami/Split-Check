import React from "react";
import {List,ListItem,Divider,ListItemText,ListItemAvatar,Avatar} from '@mui/material';
import bill from "./billl.jpg"

const sampleArr=[1,1,1,1,1,1,1];

const RecentPayment=()=>{
    return (<>
        <h1 className="heading">Recent Payment</h1>         
        <List>
             {
              sampleArr.map((val,ind)=><div key={ind}>
                 <ListItem className="Recents">
                        <div className="payDate">
                           Jun <br/>10
                        </div>
                       <ListItemAvatar>
                           <Avatar alt="GG" src={bill} variant="square"/>
                       </ListItemAvatar>
                     <ListItemText className="statement">
                         This User Paid ₹ 100 to This User 
                     </ListItemText>
        
                 </ListItem>
                 <Divider className="Divider" component="li" />
              </div>)
            }
        </List>
    </>)
}

export default RecentPayment;