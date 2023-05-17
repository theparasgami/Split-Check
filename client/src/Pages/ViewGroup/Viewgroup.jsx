import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {  Tab, Tabs, Paper, Collapse } from '@mui/material';

import BootstrapTooltip from "../../Components/Constants/ToolTip/tooltip"
import { Button } from "../../Components/Constants/Buttons/Button";
import NavBar from "../../Components/Navbar/NavBar";
import "./viewGroup.scss";
import { AuthContext } from "../../Context/AuthContext";

import RandomSettleUp from "../../Components/Group-View/PopUps/RandomSettleUp"
import AddExpense from "../../Components/Group-View/PopUps/AddExpense/AddExpense"
import AddMember from "../../Components/Group-View/PopUps/AddMember"
import AllExpenses from "../../Components/Group-View/AllExpenses";
import AllPayments from "../../Components/Group-View/AllPayments";
import AllBalances from "../../Components/Group-View/AllBalances";
import RecentPayment from "../../Components/Group-View/RecentPayment";
import { backendUrl } from "../../env_prod";

const toolTipText = "This setting automatically combines debts to reduce the total number of repayments between group members. \n For example,\n if you owe Anna $10 and Anna owes Bob $10, a group with simplified debts will tell you to pay Bob $10 directly."



const ViewGroup = () => {


    const params = useParams();
    const [Data, setData] = useState({ group: null, user: null });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        axios.get(backendUrl + "/group/" + params.id + "/distributeAmount")
            .then((response) => {
                axios.get(backendUrl + "/group/" + params.id + "/removeZeroPayments")
                    .then(() => {
                        axios.get(backendUrl + "/getGroup/" + params.id + "/" + user._id)
                            .then((res) => {
                                setData({ group: res.data.group, user: res.data.userData });
                                if (!res.data.group) {
                                    window.location.href = "/";
                                }
                            })
                            .catch((err) => {
                                window.alert("No Such Group");
                                window.location.href = "/";
                            });
                    });
            })
            .catch((err) => {
                window.location.href = "/";
            });


    }, [])// eslint-disable-line react-hooks/exhaustive-deps



    const [addExpense, setAddExpense] = useState([]);
    const [settleUp, setSettleUp] = useState([]);
    const [addMember, setAddMember] = useState(false);

    const getGroupMembers = () => {

        axios.get(backendUrl + "/group/" + params.id + "/getGroupMembers")
            .then((res) => setAddExpense(res.data));

    }
    const getGroupMembersForSettleUp = () => {

        axios.get(backendUrl + "/group/" + params.id + "/getGroupMembers")
            .then((res) => {
                setSettleUp(res.data.map((member) => ({
                    user_id: member.user_id,
                    user_name: member.user_name
                })
                ));
            });
    }

    //For Tabs
    const [currList, setcurrList] = useState("Balances")
    const handlelinksChange = (e, value) => {
        setcurrList(() => value);
    }

    return (
        <>
            <NavBar />
            {
                Data.group &&
                (<div className="ViewGroup">
                    
                    <section className="detailsSection">
                        <div className="infoContainer">
                            <div className="groupInfo">
                                <img className="groupImg"
                                    src={Data.group.groupImage}
                                    alt="grp"
                                />
                                <div className="groupName">
                                    {Data.group.groupName}
                                </div>
                                {/* <p className="simplifydebts" >
                                    Simplify  Debts
                                    <Switch checked={Data.group.simplifyDebts}
                                    disabled
                                    />
                                    <BootstrapTooltip className="tooltip"
                                    title={toolTipText} >
                                    <HelpIcon className="HelpIcon" />
                                    </BootstrapTooltip>
                                </p> */}
                            </div>
                        </div>
                        <div className="ourDetails">
                            {Data.user.TotalExpense === 0 && "You are settled up"}
                            {Data.user.TotalExpense < 0 && "You Get ₹ " + Math.abs(Data.user.TotalExpense).toFixed(2)}
                            {Data.user.TotalExpense > 0 && "Yow Shoud Pay ₹ " + Math.abs(Data.user.TotalExpense).toFixed(2)}
                            {/* {userAndGroupspend && (<>
                                <div className="totalgSpend">Total Group Spendings</div>
                                <div className="gamount"> ₹ {Data.group.totalGroupExpense.toFixed(2)}</div>
                                <div className="totalgSpend">Total Your Spendings</div>
                                <div className="gamount"> ₹ {Data.user.TotalAllTimeExpense.toFixed(2)}</div>
                                <div className="totalgSpend">Total You Paid</div>
                                <div className="gamount"> ₹ {Data.user.TotalYouPaid.toFixed(2)}</div>
                            </>)} */}
                        </div>
                        <div className="buttons">
                            <Button onClick={getGroupMembersForSettleUp}>
                                Settle Up
                            </Button>
                            <br />
                            <Button onClick={getGroupMembers}>
                                Add Expense
                            </Button>
                            <br />
                            <Button onClick={() => setAddMember(true)}>
                                Manage Member
                            </Button>
                            <Button onClick={() => setAddMember(true)}>
                                Stats
                            </Button>
                        </div>
                    </section>
                    <div className="separator"></div>
                    <div className="ListofLinks">
                        <Tabs value={currList}
                            onChange={handlelinksChange}
                            aria-label="Tabs"
                            indicatorColor="secondary"
                            centered
                            sx={{ mx: 2 }}
                        >
                            <Tab className="Tab" label="Expenses" value="Expenses" />
                            <Tab className="Tab" label="Your Payments" value="yourPayments" />
                            <Tab className="Tab" label="Balances" value="Balances" />
                            <Tab className="Tab" label="Recent Payments" value="Recent" />
                        </Tabs>
                    </div>
                    <section className="RequiredList">
                        <Paper elevation={10} className="paper">
                            <Collapse in={currList === "Expenses"} timeout={2000}>
                                {currList === "Expenses" &&
                                    <AllExpenses group_id={params.id}
                                        user_id={user._id}
                                    />
                                }
                            </Collapse>
                            <Collapse in={currList === "yourPayments"} timeout={2000}>
                                {currList === "yourPayments" &&
                                    <AllPayments group_id={params.id}
                                        ourUser={{ user_id: user._id, user_name: user.name }}
                                    />
                                }
                            </Collapse>
                            <Collapse in={currList === "Balances"} timeout={2000}>
                                {currList === "Balances" &&
                                    <AllBalances group_id={params.id}
                                    />
                                }
                            </Collapse>
                            <Collapse in={currList === "Recent"} timeout={2000}>
                                {currList === "Recent" && <RecentPayment group_id={params.id} />}
                            </Collapse>
                        </Paper>
                    </section>

                    {addExpense.length !== 0 && (
                        <AddExpense
                            cross={() => setAddExpense([])}
                            group_id={params.id}
                            user_name={user.name}
                            members={addExpense}
                        />
                    )}
                    {settleUp.length !== 0 && (
                        <RandomSettleUp
                            cross={() => setSettleUp([])}
                            group_id={params.id}
                            members={settleUp}
                        />
                    )}
                    {addMember && (
                        <AddMember
                            cross={() => setAddMember(false)}
                            group_id={params.id}
                        />
                    )}

                </div>)
            }
        </>
    )
}

export default (ViewGroup);