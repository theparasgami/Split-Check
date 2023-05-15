import React from "react";
import { Button } from "../../Components/Constants/Buttons/Button";
import NavBar from "../../Components/Navbar/NavBar";
import "./Home.scss"

import AllGroup from "../../Components/AllGroups/groupList";


function Home()
{
 
  const HandleAddGroup=()=>{
       window.location.href="https://split-check.netlify.app/new-group";
  };



  return (
    <>
      <NavBar />

      <div className="Home">
        <h1 className="welcome">Welcome to Split-Check</h1>
        <div className="yourGroups">
            <h1 >Your Groups</h1>

            <div className="groupList">
              <AllGroup/>
            </div>
        </div>
        <br/>                   
      </div>
      
    </>
  );
}

export default Home;