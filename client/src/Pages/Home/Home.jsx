import React from "react";
import Logout from "../../Components/SignIn/logout";
import { Button } from "../../Components/Constants/Buttons/Button";
import NavBar from "../../Components/Navbar/NavBar";
import "./Home.scss"


function Home()
{
  // const {user}=useContext(AuthContext);
  
  const HandleAddGroup=()=>{
       window.location.href="http://localhost:3000/new-group";
  };



  return (
    <>
      <NavBar />

      <div className="Home">
        <h1>Welcome to Home</h1>
        <Button onClick={HandleAddGroup}>Add Group</Button> 
        <br/>                   
        <Logout />
      </div>
      
    </>
  );
}

export default Home;