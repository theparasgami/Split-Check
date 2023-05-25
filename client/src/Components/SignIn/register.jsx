import React, {  useState } from "react";
import {Grid,Paper, Avatar, TextField} from '@mui/material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Logo from  "./Split-Check-black.png"
import {Button} from "../Constants/Buttons/Button"
import PasswordInput from "../Constants/Inputs/PasswordInput"
import regImg from "./register.jpg";
import "./style.scss";
import axios from "axios";
import env_prod, { backendUrl } from "../../env_prod";



function Register(props)
{
   

  const [user,setUser]=useState({
    name:"",email:"",phone:"",password:"",cpassword:""
  });


  
  const handleInputs=(event)=>{
    const {name,value}=event.target;
    setUser({...user,[name]:value});
  }
  
  const googleLogin = async (e) => {
    e.preventDefault();
    window.location.href = env_prod.GoogleLoginUrl;
  };

   
  const triggerRegister = async (e) => {
    e.preventDefault();
    if (user.password !== user.cpassword) {
      window.alert("Confirm your password.")
    }
    else if (user.password && user.password.length < 5) {
      window.alert("Password should be of atleast 5 length");
    }
    else {
      try {
        const res = await axios.post(backendUrl + "/register", user);
        if (res) {
          window.alert(res.data.message);
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      catch (err) {
        console.error(err);
        if (err.response) {
          window.alert(err.response.data.error);
        }
      }
    }
  }

  
  return (
    <div>
      <Paper elevation={10} 
            sx={ { paddingRight:5} }
        className="register paper"
      >
        <div className="blocks">

            <div className="form">

              <Grid align="center">

                  <img src={Logo} 
                       className="Logo" 
                       alt="logo"
                   />
                  <Avatar sx={{backgroundColor:"#49a6bf"}} >
                          <AppRegistrationIcon />
                  </Avatar>
                  <h2>Register</h2>

              </Grid>

              <form>
                  <TextField  label="Full Name" 
                              required type="text" 
                              name="name"  
                              value={user.name} 
                              onChange={handleInputs} 
                              placeholder="Fname Lname" 
                              variant="standard" 
                              fullWidth 
                  />
                  <TextField label="Username/Email" 
                             required 
                             type="email" 
                             name="email"  
                             value={user.email} 
                             onChange={handleInputs} 
                             placeholder="for eg: abc@gmail.com" 
                             variant="standard" 
                             fullWidth
                  />
                  <TextField label="Phone No" 
                             required 
                             type="number" 
                             name="phone" 
                             value={user.phone} 
                             onChange={handleInputs} 
                             placeholder="+91- XXXXXXXXXX" 
                             variant="standard" 
                             fullWidth
                  />  
                  <PasswordInput name="password"  
                                 value={user.password} 
                                 onChange={handleInputs} 
                                 placeholder="Password"
                  />   
                  <PasswordInput name="cpassword" 
                                 value={user.cpassword} 
                                 onChange={handleInputs} 
                                 placeholder="Confirm Password"
                  />   
              <Button onClick={triggerRegister} >
                          <span>Register</span>
                  </Button>
              </form>

              <div className="orGoogle">Or</div>

              <button type="button" 
                      onClick={googleLogin} 
                      className="login-with-google-btn" >
                      Sign in with Google
              </button>

              <h3> Already Registered 
                   <span onClick={props.Login} 
                         className="link">    
                         &nbsp;Login here
                   </span>
              </h3> 

            </div>

            <div className="pic">
                <img className="loginImg" 
                     src={regImg}
                     alt="register"
                />
            </div>
            
        </div>    
      </Paper>
    </div>
  );
}

export default Register;