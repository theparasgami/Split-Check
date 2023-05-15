import React, { useState } from "react";
import ParticlesBg from "particles-bg"  

import Login from "../../Components/SignIn/login";
import Register from "../../Components/SignIn/register";

const AuthenticationPage =()=>{
    
    const [currPageLogin,changePage]=useState(true);
    
    const handleChangePage=()=>{
        changePage(!currPageLogin);
    }

    return (
       <> 
         {currPageLogin ? <Login Register={handleChangePage}/>
                        : <Register Login={handleChangePage} 
                                    openpage={currPageLogin} 
                          />
         }
       </>
    );
}

export default AuthenticationPage;