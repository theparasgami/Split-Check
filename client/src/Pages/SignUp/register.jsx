import React, {  useState } from "react";
import {Grid,Paper, Avatar, TextField} from '@mui/material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Logo from  "./Split-Check-black.png"
import {Button} from '../../Components/Constants/Buttons/Button'
import PasswordInput from "../../Components/Constants/Inputs/PasswordInput"
import regImg from "./register.jpg";
import "./style.scss";
import axios from "axios";


function emailCheck(email){
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const avatarStyle={backgroundColor:"#49a6bf"}
const paperStyle={padding:50,paddingTop:0 ,paddingBottom:0}

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
    const LoginUrl = "http://localhost:8000/auth/google";
    window.location.href = LoginUrl;
  };

   
  const PostDatas= (e)=>{
    
    e.preventDefault();
    if(!emailCheck(user.email))
    {
      window.alert("Invalid Email ID");
      return;
    }
    if(user.password!==user.cpassword){
      window.alert("Confirm Your Password");
      return;
    }

    ( axios.post("/register",user))
    .then((res)=>{
      console.log(res);
      if(res){
        window.alert(res.data.message);
      }
      window.location.reload();
    })
    .catch((err)=>{
      console.log(err);
      if(err.response){
        window.alert(err.response.data.error);
      }
      window.location.reload();
    });
  }

  
  return (
    <div className="register">
      <Paper elevation={10} style={paperStyle} className="paper">
        <div className="blocks">
            <div className="form">
              <Grid align="center">
                  <img src={Logo} className="Logo"/>
                  <Avatar style={avatarStyle}><AppRegistrationIcon /></Avatar>
                  <h2>Register</h2>
              </Grid>
              <form>
                  <TextField label="Full Name" required type="text" name="name"  value={user.name} onChange={handleInputs} placeholder="Fname Lname" variant="standard" fullWidth />
                  <TextField label="Username/Email" required type="email" name="email"  value={user.email} onChange={handleInputs} placeholder="for eg: abc@gmail.com" variant="standard" fullWidth/>
                  <TextField label="Phone No" required type="number" name="phone" value={user.phone} onChange={handleInputs} placeholder="+91- XXXXXXXXXX" variant="standard" fullWidth/>  
                  <PasswordInput name="password"  value={user.password} onChange={handleInputs} placeholder="Password"/>   
                  <PasswordInput name="cpassword" value={user.cpassword} onChange={handleInputs} placeholder="Confirm Password"/>   
                  <Button onClick={PostDatas} ><span>Register</span></Button>
              </form>
              <div className="orGoogle">Or</div>
              <button type="button" onClick={googleLogin} className="login-with-google-btn" >Sign in with Google</button>
              <h3> Already Registered <span onClick={props.Login} className="link"> Login here </span></h3> 
            </div>
            <div className="pic">
                <img className="loginImg" src={regImg} alt="register"></img>
            </div>
        </div>    
      </Paper>
    </div>
  );
}

export default Register;