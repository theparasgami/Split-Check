import React, { useState, useEffect, useContext } from "react";
import axios from "axios"
import { Link } from "react-router-dom";
import {List,ListItem,Divider,ListItemText,ListItemAvatar,Avatar,Typography} from '@mui/material';
import "./groupList.scss"

import { AuthContext } from "../../Context/AuthContext";

const Backend="https://split-check.herokuapp.com"

const AllGroup = ()=>{
   
   const {user}=useContext(AuthContext);    
   console.log(user);
    // Groups
    const [groups,setGroups]=useState([]);

    const getGroups=()=>{
      
      axios.get(Backend+"/getGroups/"+user._id)
           .then(res=>setGroups(res.data))
           .catch((err)=>{
               window.alert(err);   
           });
       
    }
    useEffect(()=>{getGroups()},[]);// eslint-disable-line react-hooks/exhaustive-deps
    
    
  
  return(

       <div className="Allgroups">

            
            <List className="List">
                
                {groups.map((gdata,index)=>(
                <div key={index}>
                    <ListItem alignItems="flex-start">
                        
                        <ListItemAvatar>
                        <Link to={"../group/"+gdata.group._id}>
                            <Avatar alt="GG" 
                                    src={gdata.group.groupImage} 
                            />
                        </Link>
                        </ListItemAvatar>

                        <ListItemText
                        primary={gdata.group.groupName}
                        secondary={
                            <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                color="text.primary"
                            >
                                ₹ {Math.abs(gdata.totAmnt).toFixed(2)} 
                            </Typography>
                            <div className="oweDatail">
                                {gdata.totAmnt===0&&"All Settle up"}
                                {gdata.totAmnt<0&&"You Owe Money from others"}
                                {gdata.totAmnt>0&&"Yow Should pay"}
                            </div>
                            </React.Fragment>
                        }
                        />
                    </ListItem>
                    <Divider className="Divider" 
                            variant="inset" 
                            component="div" 
                    />
                </div>
                ))
                }
                
            </List>

        </div>
   )
}

export default AllGroup;