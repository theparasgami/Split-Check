import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import HelpIcon from "@mui/icons-material/Help";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {Switch,Tab,Tabs,Paper,Collapse} from '@mui/material';

import BootstrapTooltip from "../../Components/Constants/ToolTip/tooltip"
import {Button}  from "../../Components/Constants/Buttons/Button";
import NavBar from "../../Components/Navbar/NavBar";
import "./viewGroup.scss";
import { AuthContext } from "../../Context/AuthContext";

import AddExpense  from "../../Components/Group-View/PopUps/AddExpense/AddExpense"
import AddMember from "../../Components/Group-View/PopUps/AddMember"
import AllExpenses from "../../Components/Group-View/AllExpenses";
import AllPayments from "../../Components/Group-View/AllPayments";
import AllBalances from "../../Components/Group-View/AllBalances";
import RecentPayment from "../../Components/Group-View/RecentPayment";

const toolTipText="This setting automatically combines debts to reduce the total number of repayments between group members. \n For example,\n if you owe Anna $10 and Anna owes Bob $10, a group with simplified debts will tell you to pay Bob $10 directly."


const ViewGroup=()=>{


   const params=useParams();
   const [Data,setData]=useState({group:null,user:null});
   const {user}=useContext(AuthContext);
   const [userAndGroupspend,setUserandGroupSpend]=useState(false);

   useEffect(()=>{
       axios.get(("/getGroup/"+params.id+"/"+user._id))
       .then((res)=>{
           setData({group:res.data.group,user:res.data.userData});
        })
        .catch((err)=>{
            window.alert("No Such Group");
            window.location.href="/";
        });
    },[])// eslint-disable-line react-hooks/exhaustive-deps
    
    

   const [addExpense,setAddExpense]=useState(false);
   const [addMember,setAddMember]=useState(false);
  

    //For Tabs
    const [currList,setcurrList]=useState("Expenses")
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
                                                <Switch checked={Data.group.simplifyDebts} 
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
                                           ₹ {Math.abs(Data.user.currTotalExpense).toFixed(2)}
                                      </div>
                                      <div className="status"> 
                                              {Data.user.currTotalExpense===0&&"All Settle up"}
                                              {Data.user.currTotalExpense<0&&"You Get "}
                                              {Data.user.currTotalExpense>0&&"Yow Shoud Pay"}
                                      </div>
                                  </>)}
                                  {userAndGroupspend&&(<>
                                      <div className="totalgSpend">Total Group Spendings</div>
                                      <div className="gamount"> ₹ {Data.group.totalGroupExpense.toFixed(2)}</div>
                                      <div className="totalgSpend">Total Your Spendings</div>
                                      <div className="gamount"> ₹ {Data.user.TotalAllTimeExpense.toFixed(2)}</div>
                                      <div className="totalgSpend">Total You Paid</div>
                                      <div className="gamount"> ₹ {Data.user.TotalYouPaid.toFixed(2)}</div>
                                      
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
                                    <Tab className="Tab" label="Expenses" value="Expenses"  />
                                    <Tab className="Tab" label="Your Payments" value="yourPayments" />
                                    <Tab className="Tab" label="Balances" value="Balances" />
                                    <Tab className="Tab" label="Recent Payments" value="Recent" />
                                </Tabs>
                        </div>
                       
                        <section className="RequiredList">
                              <Paper elevation={10} className="paper">
                                 <Collapse in={currList==="Expenses"} timeout={2000}>
                                    {currList==="Expenses"&&<AllExpenses gid={params.id}/>}
                                 </Collapse>    
                                <Collapse in={currList==="yourPayments"} timeout={2000}>
                                    {currList==="yourPayments"&&<AllPayments key={1}/>}
                                </Collapse>
                                <Collapse in={currList==="Balances"} timeout={2000}>
                                    {currList==="Balances"&&<AllBalances key={1} Data={Data}/>}
                                </Collapse>
                                <Collapse in={currList==="Recent"} timeout={2000}>
                                    {currList==="Recent"&&<RecentPayment key={1}/>}
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
                             <AddExpense 
                                         cross={()=>setAddExpense(false)}
                                         group_id={params.id} 
                                         members={Data.group.groupMembers}
                                         user_name={user.name}
                             />
                        )}
                        {addMember&&(
                             <AddMember
                                        cross={()=>setAddMember(false)}
                                        group_id={params.id}
                             />
                        )}

                 </div> )
        }
       </>
   )
}

export default (ViewGroup);