import React, { useContext }  from "react";
import {BrowserRouter,Route,Routes} from "react-router-dom";

import AuthenticationPage from "./Pages/SignUp/AuthenticationPage";
import Verified from  "./Pages/SignUp/Verified";
import Home from "./Pages/Home/Home";
import NewGroup from "./Pages/AddGroup/NewGroup"
import { AuthContext } from "./Context/AuthContext";
import Profile from "./Pages/Profile/profile";
import ViewGroup from "./Pages/ViewGroup/Viewgroup";


function App() {
  const {user}=useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
           <Route  path="/"         element= { (user) ? < Home />      : < AuthenticationPage />  }/> 
           <Route  path="new-group" element= { (user) ? < NewGroup />  : < AuthenticationPage />  }/>
           <Route  path="profile"   element= { (user) ? < Profile />   : < AuthenticationPage />  }/>
           <Route  path="group/:id" element= { (user) ? < ViewGroup /> : < AuthenticationPage />  }/>
           <Route  path="users/:id/verify/:token" element={<Verified/>} />
      </Routes>
     </BrowserRouter>
    
  );
}

export default App;
