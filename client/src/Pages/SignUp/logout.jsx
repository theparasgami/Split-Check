import React from "react";
import {Button} from "../../Components/Constants/Buttons/Button"
import axios from "axios"
    


function Logout(){                  

    const postData=async(e)=>{
      e.preventDefault();
      sessionStorage.removeItem("user");
      axios.post("/logout")
      .then((res)=>{
          if(res)
          window.alert("Logout Success");
          window.location.href="/";
      })
      .catch((err)=>{
          window.alert(err);
          window.location.reload();
      })

    }
    

    return (
        <Button onClick={postData} style={{backgroundColor:"red"}} >LogOut</Button>
    );
}

export default Logout;