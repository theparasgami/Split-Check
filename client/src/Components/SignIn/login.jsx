import React, { useContext, useState ,useEffect } from "react";
import {Grid,Paper, Avatar,TextField} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {Button} from "../Constants/Buttons/Button"
import Logo from  "./Split-Check-black.png"
import loginImg from "./login3.jpg";
import PasswordInput from "../Constants/Inputs/PasswordInput";
import "./style.scss";
import {LottieAnimation3}  from "../Constants/Lotties/lottie";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import env_prod, { backendUrl } from "../../env_prod";


function Login(props)
{
 
  const [loading,setLoading]=useState(true);
  setTimeout(async()=>setLoading(false),4500);

  const [user,setValues]=useState({
    email:"",password:""
  });

  function handleInputs(event){
    const {name,value}=event.target;
    setValues({...user,[name]:value});
  }

  const {dispatch} = useContext(AuthContext);

  const fetchAuthUser = async () => {
    try {
      const res = await axios.get(backendUrl + "/user", { withCredentials: true });
      if(res){
        dispatch({ type: "SUCCESS", payload: res.data });
      }
    } catch (err) {
      dispatch({ type: "SUCCESS", payload: null });
      console.error(err);
    }
  }

  useEffect(()=>{
       fetchAuthUser();
  },[]); // eslint-disable-line react-hooks/exhaustive-deps


  const googleLogin = async (e) => {
    e.preventDefault();
    window.location.href = env_prod.GoogleLoginUrl;
  };

  


  const PostData=async (e)=>{
      
      e.preventDefault();
    axios.post(backendUrl + "/login",{username:user.email,password:user.password})
        .then((res)=>{
           if(res){
             window.alert('Login Success')
             dispatch({type:"SUCCESS",payload:res.data.user});
           }
        }).catch((err)=>{
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
          <div >

            <Paper elevation={0}
                   sx={ {paddingRight:10} }
                   className="login paper"
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
                                  &nbsp;Register&nbsp; 
                            </span>
                            here
                        </h3>
                    </div>
                    
                </div>
            </Paper>

          </div>)
          :( 
            <LottieAnimation3/>  
          )
     }
    </>
  );
}

export default Login;