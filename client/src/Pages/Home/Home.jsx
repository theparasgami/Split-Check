import { React, useContext, useState } from "react";
import { Button } from "../../Components/Constants/Buttons/Button";
import NavBar from "../../Components/Navbar/NavBar";
import "./Home.scss"

import AllGroup from "../../Components/AllGroups/groupList";
import { AuthContext } from "../../Context/AuthContext";


function Home()
{
  const { user } = useContext(AuthContext);
  
  return (
    <>
      <NavBar />

      <div className="Home">
        <h1 className="welcome">Hi, {user.name.toUpperCase()}</h1>
        <div className="yourGroups">
            <h1 >Your Groups</h1>

            <div className="groupList">
              <AllGroup />
            </div>
        </div>
        <br/>                   
      </div>
      
    </>
  );
}

export default Home;