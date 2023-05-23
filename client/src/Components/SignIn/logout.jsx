import React, { useContext } from "react";
import {Button} from "../Constants/Buttons/Button"
import axios from "axios"
import { backendUrl } from "../../env_prod";
import { AuthContext } from "../../Context/AuthContext";
    

const { dispatch } = useContext(AuthContext);

function Logout(){                  

    const postData=async(e)=>{
      e.preventDefault();
      await axios.post(backendUrl+"/logout")
      .then((res)=>{
          if(res)window.alert("Logout Success");
          localStorage.removeItem("user");
          console.log(localStorage.getItem("user"));
         dispatch({ type: "SUCCESS", payload:null });
        //   window.location.href="/";
      })
      .catch((err)=>{
          window.alert(err);
        //   window.location.reload();
      })

    }
    

    return (
        <Button onClick={postData} style={{backgroundColor:"red"}} >LogOut</Button>
    );
}

export default Logout;