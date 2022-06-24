import React from "react";
import Lottie from "lottie-react"
import animationData1 from "./94412-gsa-node-transparent.json";
import animationData2 from "./87508-scanning-background.json";
import "./style.scss"


const LottieAnimation1=()=>{
    const styles={
        height:300,
        width:300
    }
    return (
       <div className="lottie">
        <Lottie  loop={true} animationData={animationData1} style={styles} />
       </div>
    )
}
const LottieAnimation2=()=>{
    const styles={
        height:300,
        width:300
    }
    return (
       <div className="lottie">
        <Lottie  loop={true} animationData={animationData2} style={styles} />
       </div>
    )
}


export  {LottieAnimation1,LottieAnimation2}