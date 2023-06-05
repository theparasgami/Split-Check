
import React, { useState, useEffect } from "react";
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';
import { Button } from "../../Constants/Buttons/Button";
import "./popups.scss";
import { LottieAnimation2 } from "../../Constants/Lotties/lottie"
import { backendUrl } from "../../../env_prod";


const ManageMember = (props) => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const saveMember = async () => {
    try {
      const res = await axios.get(`${backendUrl}/group/verifyMember/${email}`);
      const response = await axios.post(`${backendUrl}/group/${props.group_id}/addMember`, { user: res.data });
      window.alert(response.data);
      window.location.reload();
    } catch (error) {
      if (error.response) {
        window.alert(error.response.data.error);
      } else {
        window.alert("Error occurred while adding member");
      }
    }
  }
  const removeMember = async () => {
    try {

    }
    catch (error) {
      if (error.response) {
        window.alert(error.response.data.error);
      } else {
        window.alert("Error occurred while adding member");
      }
    }
  }


    return (
      <div className="popup-box popupAddMember">
        <div className="box">
          {loading ? <LottieAnimation2 /> : <>
            <CancelIcon className="close-icon" onClick={props.cross} />

            <div className="head">Manage Member</div>

            <input type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email Address"
              className="emailAddress"
            />
            <br />
            <div className="buttons">
              <Button onClick={saveMember} >
                Add
              </Button>
              {/* <Button bgColor="#e06060" onClick={removeMember} >
                Remove
              </Button> */}
            </div>
          </>}

        </div>
      </div>
    )
  }
  export default ManageMember;