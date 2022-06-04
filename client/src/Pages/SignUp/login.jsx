import React, { useContext, useState ,useEffect } from "react";
import {Grid,Paper, Avatar,TextField} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {Button} from "../../Components/Constants/Buttons/Button"
import Logo from  "./Split-Check-black.png"
import loginImg from "./login3.jpg";
import PasswordInput from "../../Components/Constants/Inputs/PasswordInput";
import "./style.scss";
import LottieAnimation  from "../../Components/Constants/Lotties/lottie";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";



const avatarStyle={backgroundColor:"#49a6bf"}
const paperStyle={padding:50 ,paddingTop:0,paddingBottom:0,width:"60%"}


function Login(props)
{
 
  const [loading,setLoading]=useState(1);
  setTimeout(async()=>setLoading(0),100);

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
    const LoginUrl = "http://localhost:8000/auth/google";
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
           window.alert(res.data.message);
           dispatch({type:"SUCCESS",payload:res.data.user});
           window.location.reload();
         }
      }).catch((err)=>{
          console.log(err);
          if(err.response)
          {
            window.alert(err.response.data.error);
          }
          window.location.reload();
      })
    
  }
  
  return (
    <>
     {!loading?
          (
          <div className="login">

            <Paper elevation={10} style={paperStyle} className="paper">
                  
                    <img src={Logo} className="Logo"/>
                    <div className="blocks">
                        
                        <div className="pic">
                            <img className="loginImg" src={loginImg} alt="login" ></img>
                        </div>

                        <div className="form">
                            
                            <Grid align="center">
                                <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
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

                            <div className="orGoogle">Or</div>
                            
                            <button type="button" 
                                    onClick={googleLogin} 
                                    className="login-with-google-btn"
                            >
                               Sign in with Google
                            </button>

                            <h3>New to Split-Check,
                                 <span className="link" onClick={props.Register}> 
                                   Register 
                                 </span>
                                 here
                            </h3>
                        </div>
                    </div>
            </Paper>

          </div>)
          :( 
            <LottieAnimation />  
          )
     }
    </>
  );
}

export default Login;