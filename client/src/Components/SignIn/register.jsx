import React, {  useState } from "react";
import {Grid,Paper, Avatar, TextField} from '@mui/material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Logo from  "./Split-Check-black.png"
import {Button} from "../Constants/Buttons/Button"
import PasswordInput from "../Constants/Inputs/PasswordInput"
import regImg from "./register.jpg";
import "./style.scss";
import axios from "axios";

const Backend = "https://split-check-vhbp.vercel.app";
// const Backend = "http://localhost:8000"




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
    const LoginUrl = "https://split-check-vhbp.vercel.app/auth/google";
    // const LoginUrl = "http://localhost:8000/auth/google"

    window.location.href = LoginUrl;
  };

   
  const PostDatas= ()=>{

    ( axios.post(Backend+"/register",user))
           .then((res)=>{
                  console.log(res);
                  if(res){
                    window.alert(res.data.message);
                  }
                  window.location.reload();
           }).catch((err)=>{
                  console.log(err);
                  if(err.response){
                     window.alert(err.response.data.error);
                  }
                 
           });
  }

  
  return (
    <div className="register">
      <Paper elevation={10} 
            sx={ { paddingRight:5} }
            className="paper"
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
                  <Button onClick={PostDatas} >
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