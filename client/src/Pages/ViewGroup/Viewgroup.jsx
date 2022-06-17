import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import HelpIcon from "@mui/icons-material/Help";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Mbutton from "@mui/material/Button/Button";
import {Switch,Tab,Tabs,Paper,Collapse} from '@mui/material';
import {List,ListItem,Divider,ListItemText,ListItemAvatar,Avatar,Typography} from '@mui/material';
import { Accordion,AccordionSummary,AccordionDetails } from "@mui/material";

import BootstrapTooltip from "../../Components/Constants/ToolTip/tooltip"
import {Button}  from "../../Components/Constants/Buttons/Button";
import NavBar from "../../Components/Navbar/NavBar";
import { PopupTransaction ,PopupSettleUp,AddExpense, AddMember } from "./popups";
import "./viewGroup.scss";
import { AuthContext } from "../../Context/AuthContext";
import bill from "./billl.jpg"
import money from "./money.jpg"

const toolTipText="This setting automatically combines debts to reduce the total number of repayments between group members. \n For example,\n if you owe Anna $10 and Anna owes Bob $10, a group with simplified debts will tell you to pay Bob $10 directly."


const ViewGroup=()=>{


   const params=useParams();
   const [Data,setData]=useState({group:null,user:null});
   const {user}=useContext(AuthContext);
   const [userAndGroupspend,setUserandGroupSpend]=useState(false);

   useEffect(()=>{
       axios.get(("/group/"+params.id+"/"+user._id))
       .then((res)=>{
        //    console.log(res.data);
           setData({group:res.data.group,user:res.data.userData});
        })
        .catch((err)=>{
            window.alert("No Such Group");
            window.location.href="/";
        });
    },[])// eslint-disable-line react-hooks/exhaustive-deps
    
    
   
   
   const sampleArr=[1,1,1,1,1,1,1];
   
   const [popUpTrans,setPopUpTrans]=useState(false);
   const AllTransactions=()=>{
       return (<>
        <h1 className="heading">Transactions</h1>
        <List>
         {
          sampleArr.map(()=><>
                    <ListItem alignItems="flex-start" 
                              className="transaction" 
                              onClick={()=>(setPopUpTrans(true))} >
                       
                       <div className="transactionDate">
                           Jun <br/>10
                       </div>
                
                       <ListItemAvatar>
                           <Avatar alt="GG" src={bill} variant="square"/>
                       </ListItemAvatar>

                       <ListItemText
                           primary={<div className="name">Canteen </div>}
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
                        <ListItemText className="OurPart"
                           primary={"You Borrowed"}
                           secondary={"₹ 200"}
                           sx={{color:"rgb(189, 77, 37)"}}
                        />
                      
                   </ListItem>
                   <Divider component="li" />
         </>)
         }
       </List>
       {popUpTrans&&(<PopupTransaction cross={()=>setPopUpTrans(false)}/>)}
       </>
       )
   }
   
   const [popUpPayment,setPopUpPayment]=useState(false);
   const AllPayments=()=>{
       return (<>
           <h1 className="heading">Settle Debts</h1>         
           <List>
                {
                 (sampleArr.length!==0)?(
                 sampleArr.map(()=><>
                    <ListItem className="AllPayments" >
                        <ListItemAvatar>
                           <Avatar alt="GG" src={money} variant="square"/>
                        </ListItemAvatar>
                        <ListItemText className="statement">
                          Paras Gami owes
                          <span className="amount"> &nbsp;  ₹ 100 &nbsp;</span>
                          to This user  
                        </ListItemText>
                        <Mbutton onClick={()=>(setPopUpPayment(true))}>
                            Settle Up..
                        </Mbutton>
                    </ListItem>
                    <Divider className="Divider" component="li" />
                 </>)):(
                 <div className="SettledUp">You are all settled Up..</div>)
                 }
           </List>
           {popUpPayment&&(<PopupSettleUp cross={()=>setPopUpPayment(false)}/>)}
       </>)
   }
   
   const [popUpsettleUp,setPopupSettleUp]=useState(null);
   const AllBalances=()=>{
        
       const groupMembers=Data.group.groupMembers;
    
       return(<>
          <h1 className="heading">All Balances</h1>
          <List>
                {
                 groupMembers.map((member)=><>
                    <ListItem className="AllBalances">
                        <Accordion className="accordion">
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography >
                                    {(member.currTotalExpense===0)&&(<>
                                         <b>{member.user_name}</b>
                                         &nbsp;is all settled Up.
                                    </>)}
                                    {(member.currTotalExpense>0)&&(<>
                                            <b>{member.user_name}</b> 
                                            &nbsp;gets back 
                                            <b className="priceg0">
                                                &nbsp; ₹ {member.currTotalExpense} &nbsp;
                                            </b> in Total.
                                    </>)}
                                    {(member.currTotalExpense<0)&&(<>
                                                <b>{member.user_name}</b> owes
                                                <b className="pricel0">
                                                    &nbsp; ₹ {-member.currTotalExpense} &nbsp;
                                                </b> in Total.
                                    </>)}
                                </Typography>
                            
                            </AccordionSummary>
                            <AccordionDetails className="AccordionDetails">
                                 {member.expenses.map((expense_detail)=><>
                                     <Typography>
                                         Mr Smith owes ₹ 100. to Mr Wann 
                                         {expense_detail.amount>0&&(<>
                                            {member.user_name} owes ₹ {expense_detail.amount} to {expense_detail.user_name} 
                                         </>)} 
                                         {expense_detail.amount<0&&(<>
                                            {expense_detail.user_name} owes ₹ {expense_detail.amount} to {member.user_name} 
                                         </>)} 
                                         <Mbutton className="SettleUpBtn" 
                                                  onClick={()=>setPopupSettleUp(null)} >
                                                  SettleUp
                                         </Mbutton>
                                         <Divider className="Divider" component="li" />
                                     </Typography>
                                 </>)}
                                 {popUpsettleUp&&<PopupSettleUp cross={()=>setPopupSettleUp(null)} />}
                            </AccordionDetails>
                        </Accordion>
                    </ListItem>
                    <Divider className="Divider" component="li" />
                 </>)
                }
           </List>
       </>)
   }

   const RecentPayment=()=>{
    return (<>
        <h1 className="heading">Recent Payment</h1>         
        <List>
             {
              sampleArr.map(()=><>
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
              </>)
            }
        </List>
    </>)
    }

   const [addExpense,setAddExpense]=useState(true);
   const [addMember,setAddMember]=useState(false);
   
   const handleAddExpense=async()=>{
         
   }

   const handleAddMember=async(Email)=>{
       await axios.get ("/verifyMember/"+Email)
                  .then(async(res)=>{
                        await axios.post("/group/addMember",
                                       {group:Data.group,
                                        user:res.data}
                             ).then((res)=>{
                                 window.alert(res.data);
                                 setAddMember(false);
                             }).catch((err)=>{
                                 window.alert(err,"User can't be added");
                             })

                  }).catch((err)=>{
                      window.alert("Invalid Usename");
                  });
       await axios.post("/group/"+Data.group._id+"/addMember",{email:Email});
   }

    //For Tabs
    const [currList,setcurrList]=useState("Transaction")
    const handlelinksChange=(e,value)=>{ 
            setcurrList(()=>value);
    }

   return(
       <>
        <NavBar/>
        {
            Data.group&&
            (<div className="ViewGroup">
                        <section className="generalSection">
                           
                           <div className="forFlex">
                                <div className="groupdetails">

                                        <img className="groupImg" 
                                             src={Data.group.groupImage} 
                                             alt="grp" 
                                        />
                                        <div className="groupInfo">
                                            <div className="groupName">
                                                {Data.group.groupName}
                                            </div>
                                            <p className="simplifydebts" >
                                                Simplify  Debts 
                                                <Switch checked={!Data.group.simplifyDebts} 
                                                        disabled 
                                                />
                                                <BootstrapTooltip className="tooltip" 
                                                                  title={toolTipText} >
                                                       <HelpIcon className="HelpIcon" />
                                                </BootstrapTooltip>
                                            </p>
                                        </div>

                                </div>

                                <div className="divider"></div>
                                
                                <div className="ourdetails">
                                  {!userAndGroupspend&&(<>
                                      <div className="name">
                                           {user.name}
                                      </div>
                                      <div className="amount">
                                           ₹ {Data.user.currTotalExpense.toFixed(2)}
                                      </div>
                                      <div className="status"> 
                                              {Data.user.currTotalExpense===0&&"All Settle up"}
                                              {Data.user.currTotalExpense>0&&"You Owe Money"}
                                              {Data.user.currTotalExpense<0&&"Yow Shoud Pay"}
                                      </div>
                                  </>)}
                                  {userAndGroupspend&&(<>
                                      <div className="totalgSpend">Total Group Spendings</div>
                                      <div className="gamount"> ₹ 1000</div>
                                      <div className="totalgSpend">Total Your Spendings</div>
                                      <div className="gamount"> ₹ 1000</div>
                                      
                                  </>)}
                                </div>
                                <ArrowForwardIosIcon onClick={()=>setUserandGroupSpend(!userAndGroupspend)} 
                                                     className="arrowForward"
                                 />
                           </div>

                        </section>

                        <div className="ListofLinks">
                                <Tabs  value={currList} 
                                       onChange={handlelinksChange} 
                                       aria-label="Tabs" 
                                       indicatorColor="secondary"
                                       centered
                                       sx={{mx:2}}
                                >
                                    <Tab className="Tab" label="Transaction" value="Transaction"  />
                                    <Tab className="Tab" label="Your Payments" value="yourPayments" />
                                    <Tab className="Tab" label="Balances" value="Balances" />
                                    <Tab className="Tab" label="Recent Payments" value="Recent" />
                                </Tabs>
                        </div>
                       
                        <section className="RequiredList">
                              <Paper elevation={10} className="paper">
                                 <Collapse in={currList==="Transaction"} timeout={2000}>
                                    {currList==="Transaction"&&AllTransactions()}
                                 </Collapse>
                                <Collapse in={currList==="yourPayments"} timeout={2000}>
                                    {currList==="yourPayments"&&AllPayments()}
                                </Collapse>
                                <Collapse in={currList==="Balances"} timeout={2000}>
                                    {currList==="Balances"&&AllBalances()}
                                </Collapse>
                                <Collapse in={currList==="Recent"} timeout={2000}>
                                    {currList==="Recent"&&RecentPayment()}
                                </Collapse>
                              </Paper>  
                        </section>
                        
                        <div className="LastButton">
                            {currList==="Balances" ?(
                                                    <Button bgColor="#bf2d9a" 
                                                        onClick={()=>setAddMember(true)}>
                                                        Add Member
                                                    </Button>) :(
                                                    <Button bgColor="#bf2d9a" 
                                                            onClick={()=>setAddExpense(true)}>
                                                            Add an Expense
                                                    </Button>
                            )}
                        </div>
                        {addExpense&&(
                             <AddExpense add={()=>handleAddExpense()} 
                                         cross={()=>setAddExpense(false)} 
                                         members={Data.group.groupMembers}
                             />
                        )}
                        {addMember&&(
                             <AddMember save={(e)=>handleAddMember(e)} 
                                        cross={()=>setAddMember(false)}
                            />
                        )}

                 </div> )
        }
       </>
   )
}

export default (ViewGroup);