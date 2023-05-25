import React from "react";
import "./style.scss";

const ImageUpload=(props)=>{
    
    const handleUploadChange=(e)=>{
            document.querySelector(".button_outer").classList.add("file_uploading");
            setTimeout(async() => {
                // document.querySelector(".button_outer").classList.add("file_uploaded");
                {props.imageChange(e)};
            }, 1000);
            setTimeout(()=>{
                document.querySelector(".button_outer").classList.remove("file_uploaded");
                document.querySelector(".button_outer").classList.remove("file_uploading");
            },2000);
            
    }

    return (
        <div className="ImageUpload">

            <div className="uploaded_file_view show" >
                <img src={props.imgSrc} alt="you" />
            </div>

            <div className="button_outer">
                    <div className="btn_upload">
                         <input type="file" 
                                accept="image/*" 
                                onChange={handleUploadChange} 
                                name="image" 
                        />
                         Upload Image
                    </div>
                    <div className="processing_bar" />
                    <div className="success_box" />
            </div>
        </div>
    )
}

export default ImageUpload;