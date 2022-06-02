import React, { useContext }  from "react";
import {BrowserRouter,Route,Routes} from "react-router-dom";

import AuthenticationPage from "./Pages/SignUp/AuthenticationPage";
import Home from "./Pages/Home/Home";
import NewGroup from "./Pages/AddGroup/NewGroup"
import { AuthContext } from "./Context/AuthContext";
import Profile from "./Pages/Profile/profile";


function App() {
  const {user}=useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
           <Route  path="/" element= { (user) ? < Home /> : < AuthenticationPage /> } /> 
           <Route  path="new-group" element= { (user) ? < NewGroup /> : < AuthenticationPage /> }/>
           <Route  path="profile"   element= { (user) ? < Profile /> : < AuthenticationPage />  }/>
      </Routes>
     </BrowserRouter>
    
  );
}

export default App;
