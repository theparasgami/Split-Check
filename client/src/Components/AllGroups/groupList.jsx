import React, { useState, useEffect, useContext } from "react";
import { backendUrl } from "../../env_prod"
import axios from "axios"
import { Link } from "react-router-dom";
import { List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material';
import "./groupList.scss"
import { LottieAnimation1 } from "../Constants/Lotties/lottie";
import { AuthContext } from "../../Context/AuthContext";


const AllGroup = () => {

    const { user } = useContext(AuthContext);
    // Groups
    const [groups, setGroups] = useState([]);
    const [loadingGroup, setGroupLoading] = useState(true);

    const getGroups = async () => {
        try {
            const groupList = await axios.get(backendUrl + "/group/user/" + user._id);
            setGroups(() => groupList.data);
            setGroupLoading(false)
        }
        catch (err) {
            console.error(err);
            window.alert(err);
        }
    }
    useEffect(() => { getGroups() }, []);// eslint-disable-line react-hooks/exhaustive-deps

    function handleClickHere() {
        window.location.href = ("/new-group");
    }

    return (

        <div className="Allgroups">

            {!loadingGroup ? (
                groups.length === 0 ? (
                    <div>
                        <h2>Oops!</h2>
                        <h3>You are not present in any group</h3>
                        <h2 onClick={handleClickHere} className="new-group">Click Here </h2>
                        to Create a new Group
                    </div>
                ) : (
                    < List className="List">

                        {groups.map((gdata, index) => (
                            <div key={index}>
                                <ListItem>

                                    <ListItemAvatar >
                                        <Link to={"../group/" + gdata._id}>
                                            <Avatar alt="GG"
                                                src={gdata.groupImage}
                                            />
                                        </Link>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={gdata.groupName}
                                        secondary={
                                            <React.Fragment >
                                                    {gdata.totAmnt === 0 && "All Settle up"}
                                                    {gdata.totAmnt < 0 && "You Owe Money from others"}
                                                    {gdata.totAmnt > 0 && "Yow Should pay"}
                                            </React.Fragment>
                                        }
                                    />
                                    <Typography
                                        sx={{ display: 'inline', margin: "auto" }}
                                        color="text.primary"
                                    >
                                        ₹ {Math.abs(gdata.totAmnt).toFixed(2)}
                                    </Typography>
                                </ListItem>
                                <Divider className="Divider"
                                    variant="inset"
                                    component="div"
                                />
                            </div>
                        ))
                        }

                    </List>
                )
            ) : (
                <LottieAnimation1 />
            )
            }
        </div>
    )
}

export default AllGroup;