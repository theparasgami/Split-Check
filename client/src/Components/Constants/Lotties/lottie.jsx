import React from "react";
import Lottie from "lottie-react"
import animationData from "./94412-gsa-node-transparent.json";
import "./style.scss"





function LottieAnimation()
{
    const styles={
        height:300,
        width:300
    }
    return (
       <div className="lottie">
        <Lottie  loop={true} animationData={animationData} style={styles} />
       </div>
    )
}
export default LottieAnimation