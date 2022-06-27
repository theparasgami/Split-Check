import React, { useState,useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { LottieAnimation1 } from "../../Components/Constants/Lotties/lottie";
import  axios from "axios";
import EditIcon from '@mui/icons-material/Edit';

import ImageUpload from "../../Components/Constants/Buttons/ImageUpload";
import NavBar from "../../Components/Navbar/NavBar";
import { AuthContext } from "../../Context/AuthContext";
import "./profile.scss"
import {Button} from "../../Components/Constants/Buttons/Button"
import AllGroups from "../../Components/AllGroups/groupList"

const Backend="https://split-check.herokuapp.com"

var cnfPswrdD={display:"none"};



const Profile=()=>{

    const {user}=useContext(AuthContext);
   
    //Image Setting
    const [imgSrc,setImgSrc]=useState(user.profilePicture);
    const handleImageChange=(event)=>{
        setImgSrc(URL.createObjectURL(event.target.files[0]));
    }

    const InitalProfileValues={
            name:user.name,
            username:user.username,
            phone:user.phone?user.phone:"XXXXXXXXXX",
            password:"",
            cnfpasswrd:""
    }
    
    const [profileValues,setProfileValues]=useState(InitalProfileValues);
     
    const [editICon,setEdit]=useState({
                                  name:false,
                                  phone:false,
                                  password:false
                                  });


    const OnEditClick=(name)=>{
        setEdit({...editICon,[name]:true});
    }

    const handlevalueChange=(e)=>{
       const {name,value}=e.target;
       setProfileValues({...profileValues,[name]:value});
    }

    useEffect(()=>{
      if(editICon.password===true)cnfPswrdD={display:""};
    },[editICon]); // eslint-disable-line react-hooks/exhaustive-deps
    
    const {dispatch} = useContext(AuthContext);

    const updateChange=(e)=>{
               
         e.preventDefault();
         
         if(profileValues.password!==profileValues.cnfpasswrd){
             window.alert("Password Not Matched");
             return;
          }
         const sendingValue={
                            name:profileValues.name,
                            username:profileValues.username,
                            phone:profileValues.phone,
                            password:profileValues.password,
                            profilePicture:imgSrc,
                            user_id:user._id
                           }
         axios.post(Backend+"/updateprofile",sendingValue)
         .then((res)=>{
           
            window.alert("User Value Updated Successfully");
            dispatch({type:"SUCCESS",payload:res.data});
            
            window.location.reload();
         })
         .catch((err)=>{
            console.log(err);
            window.alert(err.response.data);
         })

    }



    const [loading,setLoading]=useState(true);
    useEffect(()=>{setTimeout(()=>setLoading(false),1500)},[]);// eslint-disable-line react-hooks/exhaustive-deps
  


    return (
      <>
        <NavBar/>
  
        <div className="profile">
           
           <div className="AccountSection">

                <h3 className="heading">Hi,{user.name}</h3>
         
                <div className="generalSettings">
                     
                     <div className="imageSection">
                        <ImageUpload imgSrc={imgSrc} 
                                     imageChange={handleImageChange} 
                        />
                     </div>
                     
                     <div className="details">

                         <ul className="ulistcontents">
                          
                           <li className="listrows">
                             <div className="listHeads">Name</div>
                             <div className="listContentData">
                               {editICon.name?
                                   <input type="text" 
                                          className="inputData" 
                                          onChange={handlevalueChange} 
                                          value={profileValues.name} 
                                          name="name" 
                                    />:
                                   <>
                                     <div >{user.name}</div>
                                     <EditIcon onClick={()=>OnEditClick("name") } 
                                             className="EditIcon
                                     "/>
                                   </>
                               }
                             </div>
                           </li>

                           <li className="listrows">
                             <div className="listHeads">Email</div>
                             <div className="listContentData">
                               
                                  <div >{user.username}</div>
                                  
                             </div>
                           </li>

                           <li className="listrows">
                             <div className="listHeads">Phone</div>
                             <div className="listContentData">
                                    {editICon.phone ?
                                       <input type="number" 
                                              className="inputData" 
                                              onChange={handlevalueChange} 
                                              value={profileValues.phone} 
                                              name="phone" 
                                       /> :
                                       <>
                                          <div >{user.phone?user.phone:"XXXXXXXXXX"}</div>
                                          <EditIcon onClick={() => OnEditClick("phone")} 
                                                    className="EditIcon" />
                                       </>
                                    }
                             </div>
                           </li>

                           <li className="listrows">
                             <div className="listHeads">Password</div>
                             <div className="listContentData">
                                {
                                    user.googleId==="No-GoogleID"?
                                                (editICon.password?
                                                   <input type="password" 
                                                          className="inputData" 
                                                          onChange={handlevalueChange} 
                                                          value={profileValues.password} 
                                                          name="password"
                                                   />:
                                                   <>*******
                                                     <EditIcon onClick={()=>OnEditClick("password") } 
                                                     className="EditIcon"/>
                                                   </>
                                                ):
                                                "LoggedIn through Google"
                                }     
                             </div>
                           </li>

                           <li className="listrows" style={cnfPswrdD}>
                             <div className="listHeads">Confirm</div>
                             <div className="listContentData">
                                 <input type="password" 
                                        className="inputData" 
                                        onChange={handlevalueChange} 
                                        value={profileValues.cnfpasswrd} 
                                        name="cnfpasswrd" 
                                 />
                             </div>
                           </li>

                         </ul>

                         <div className="saveBtn">
                            <Button bgColor={"rgb(232, 39, 39)"} 
                                    onClick={updateChange}>
                                    Save
                            </Button>
                         </div>

                     </div>


                </div>
           </div>
            <div className="Viewgroups">
              <h3 className="heading">Your Groups</h3>
              {loading?<LottieAnimation1/>:<>
                <AllGroups/>
                <Link to="/new-group">
                    <Button bgColor="#bf2d9a" className="create-grp-btn">
                    Create-Group
                    </Button>
                </Link>
              </>}
            </div>
         
        </div>
     </>
    )
}


export default Profile;