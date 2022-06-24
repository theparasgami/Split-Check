import React, { useContext, useState ,useEffect } from "react";
import {Grid,Paper, Avatar,TextField} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {Button} from "../Constants/Buttons/Button"
import Logo from  "./Split-Check-black.png"
import loginImg from "./login3.jpg";
import PasswordInput from "../Constants/Inputs/PasswordInput";
import "./style.scss";
import {LottieAnimation1}  from "../Constants/Lotties/lottie";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

function Login(props)
{
 
  const [loading,setLoading]=useState(true);
  setTimeout(async()=>setLoading(false),100);

  const [user,setValues]=useState({
    email:"",password:""
  });

  function handleInputs(event){
    const {name,value}=event.target;
    setValues({...user,[name]:value});
  }

  const {dispatch} = useContext(AuthContext);

  const fetchAuthUser = async ()=>{
      console.log("Hi fetchAuthUSer");
      await axios.get("/user")
          .then((res)=>{
              console.log(res.data);
              dispatch({type:"SUCCESS",payload:res.data});
          })
          .catch((err)=>{
              console.log(err);
          })
  }

  useEffect(()=>{
       fetchAuthUser();
  },[]); // eslint-disable-line react-hooks/exhaustive-deps


  const googleLogin = async (e) => {
           e.preventDefault();
           const LoginUrl= "http://split-check.herokuapp.com/auth/google"
           // const LoginUrl = "http://localhost:8000/auth/google";
           window.location.href = LoginUrl;
  };

  


  const PostData=async (e)=>{
      
      e.preventDefault();
      axios.post("/login",{username:user.email,password:user.password})
        .then((res)=>{
          console.log(res);
           if(res)
           {
             console.log("Login Succesfull",res.data.user);
             window.alert('Login Success')
             dispatch({type:"SUCCESS",payload:res.data.user});
           }
        }).catch((err)=>{
            console.log(err);
            if(err.response)
            {
              window.alert(err.response.data.error);
            }
        })
  }
  
  return (
    <>
     {!loading?
          (
          <div className="login">

            <Paper elevation={10}
                   sx={ {paddingRight:10} }
                   className="paper"
            >      
                <img src={Logo} 
                     className="Logo" 
                     alt="Logo"
                />
                <div className="blocks">
                    
                    <div className="pic">
                        <img className="loginImg" 
                             src={loginImg} 
                             alt="login" 
                        />
                    </div>

                    <div className="form">
                            
                        <Grid align="center">
                            <Avatar sx={{backgroundColor:"#49a6bf"}}>
                              <LockOutlinedIcon />
                             </Avatar>
                            <h2>Sign In</h2>
                        </Grid>

                        <form method="post">
                           <TextField type="email" 
                                      label="Username" 
                                      name="email" 
                                      value={user.email} 
                                      onChange={handleInputs} 
                                      placeholder="for eg: abc@gmail.comm" 
                                      variant="standard" 
                                      fullWidth
                            />
                           <PasswordInput name="password" 
                                          value={user.password} 
                                          onChange={handleInputs} 
                                          placeholder="Password" 
                           />
                           <Button onClick={PostData}>
                                   <span>Sign in</span>
                           </Button>
                        </form>

                        <div className="orGoogle">
                             Or
                        </div>
                            
                        <button type="button" 
                                onClick={googleLogin} 
                                className="login-with-google-btn">
                                Sign in with Google
                        </button>

                        <h3>New to Split-Check,
                            <span className="link" 
                                  onClick={props.Register}> 
                                  Register 
                            </span>
                            here
                        </h3>
                    </div>
                    
                </div>
            </Paper>

          </div>)
          :( 
            <LottieAnimation1/>  
          )
     }
    </>
  );
}

export default Login;