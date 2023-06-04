import React,{useEffect} from "react"
import {useParams} from "react-router-dom";
import axios from "axios"
import imgSrc from "./verified.png"
import { backendUrl } from "../../env_prod";


const Verified=()=>{
    const params=useParams();
    useEffect(() => {
       axios.get(backendUrl+"/users/"+params.id+"/verify/"+params.token)
           .catch((err) => { window.alert(err.response.data.error);window.close()}); 
       setTimeout(()=>window.close(),10000);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (<>
        <div style={{margin:"auto",alignItems:"center"}}>
          
              <img src={imgSrc} alt="verified" />
              <h1> <br/>Head back to Split-Check</h1>
           
        </div>
        
    </>)
}

export default Verified;