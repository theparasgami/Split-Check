import React, { useContext } from "react";
import {Button} from "../Constants/Buttons/Button"
import axios from "axios"
import { backendUrl } from "../../env_prod";
import { AuthContext } from "../../Context/AuthContext";
    

const { dispatch } = useContext(AuthContext);

function Logout(){                  

    const postData=async(e)=>{
      e.preventDefault();
      try {
        localStorage.removeItem("user");
        await axios.post(backendUrl + "/logout",{}, { withCredentials: true }).then(() => {
          window.alert("Logout Success");
          window.location.href = "/";
        })
      }
      catch (err) {
        console.error(err);
        window.alert(err);
      }
    }
    

    return (
        <Button onClick={postData} style={{backgroundColor:"red"}} >LogOut</Button>
    );
}

export default Logout;