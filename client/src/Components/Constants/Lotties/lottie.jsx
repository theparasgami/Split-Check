import React from "react";
import Lottie from "lottie-react"
import animationData1 from "./144368-loading.json";
import animationData2 from "./4945-three-eyed-alien.json";
import animationData3 from "./97611-smartphone-money-green.json"
import "./style.scss"


const LottieAnimation1=()=>{
    const styles={
        height:150,
        width:150
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
       <div className="lottie2">
        <Lottie  loop={true} animationData={animationData2} style={styles} />
       </div>
    )
}
const LottieAnimation3=()=>{
    const styles={
        height:500,
        width:500,
        marginTop:"10%"
    }
    return (
       <div className="lottie3">
        <Lottie  loop={true} animationData={animationData3} style={styles} />
       </div>
    )
}


export  {LottieAnimation1,LottieAnimation2,LottieAnimation3}