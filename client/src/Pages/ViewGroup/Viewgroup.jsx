import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Tab, Tabs, Paper, Collapse } from '@mui/material';

import { Button } from "../../Components/Constants/Buttons/Button";
import NavBar from "../../Components/Navbar/NavBar";
import "./viewGroup.scss";
import { AuthContext } from "../../Context/AuthContext";

import RandomSettleUp from "../../Components/Group-View/PopUps/RandomSettleUp"
import AddExpense from "../../Components/Group-View/PopUps/AddExpense/AddExpense"
import ManageMember from "../../Components/Group-View/PopUps/ManageMember"
import AllExpenses from "../../Components/Group-View/AllExpenses";
import AllPayments from "../../Components/Group-View/AllPayments";
import AllBalances from "../../Components/Group-View/AllBalances";
import RecentPayment from "../../Components/Group-View/RecentPayment";
import { backendUrl } from "../../env_prod";
import PopupStats from "../../Components/Group-View/PopUps/PopupStats";


const ViewGroup = () => {


    const params = useParams();
    const [Data, setData] = useState({ group: null, user: null });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${backendUrl}/group/${params.id}/user/${user._id}/details`);
                const { group, userData } = res.data;
                setData({ group, user: userData });
                if (!group) {
                    window.location.href = "/";
                }
            } catch (error) {
                console.error(error.response.data.error)
                window.alert(error.response.data.error);
                window.location.href = "/";
            }
        };
        fetchData();
    }, [])// eslint-disable-line react-hooks/exhaustive-deps



    const [addExpense, setAddExpense] = useState([]);
    const [settleUp, setSettleUp] = useState([]);
    const [manageMember, setManageMember] = useState(false);
    const [statsPopup, setStatsPopup] = useState(false);
   
    const getGroupMembers = async () => {
        try {
            const groupMembers = await axios.get(backendUrl + "/group/" + params.id + "/members");
            setAddExpense(groupMembers.data.map((member) => ({
                userID: member.userID,
                userName: member.userName
            })
            ));
        }
        catch (err) {
            console.error(err);
            if (err.response) {
                window.alert(err.response.data.error);
            }
        }
    }

    const getGroupMembersForSettleUp = async () => {
        try {
            const groupMembers = await axios.get(backendUrl + "/group/" + params.id + "/members");
            setSettleUp(groupMembers.data.map((member) => ({
                userID: member.userID,
                userName: member.userName
            })
            ));
        }
        catch (err) {
            console.error(err);
            if (err.response) {
                window.alert(err.response.data.error);
            }
        }
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
                            </div>
                        </div>
                        <div className="ourDetails">
                            {Data.user.TotalExpense === 0 && "You are settled up"}
                            {Data.user.TotalExpense < 0 && "You Get ₹ " + Math.abs(Data.user.TotalExpense).toFixed(2)}
                            {Data.user.TotalExpense > 0 && "Yow Shoud Pay ₹ " + Math.abs(Data.user.TotalExpense).toFixed(2)}
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
                            <Button onClick={() => setManageMember(true)}>
                                Manage Member
                            </Button>
                            <Button onClick={() => setStatsPopup(true)}>
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
                        <Paper elevation={2} className="paper">
                            <Collapse in={currList === "Expenses"} timeout={2000}>
                                {currList === "Expenses" &&
                                    <AllExpenses group_id={params.id}
                                        userID={user._id}
                                    />
                                }
                            </Collapse>
                            <Collapse in={currList === "yourPayments"} timeout={2000}>
                                {currList === "yourPayments" &&
                                    <AllPayments group_id={params.id}
                                        ourUser={{ userID: user._id, userName: user.name }}
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
                            userName={user.name}
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
                    {manageMember && (
                        <ManageMember
                            cross={() => setManageMember(false)}
                            group_id={params.id}
                        />
                    )}
                    {statsPopup && (
                        <PopupStats
                            cross={() => setStatsPopup(false)}
                            details={Data.user}
                            totalGroupExpense={Data.group.totalGroupExpense}
                        />
                    )}

                </div>)
            }
        </>
    )
}

export default (ViewGroup);