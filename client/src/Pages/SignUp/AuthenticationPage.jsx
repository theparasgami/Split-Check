import React, { useState } from "react";

import Login from "./login";
import Register from "./register";

const AuthenticationPage =()=>{
    
    const [currPageLogin,changePage]=useState(true);
    
    const handleChangePage=()=>{
        changePage(!currPageLogin);
    }

    return (
       <> 
         {currPageLogin ? <Login Register={handleChangePage}/>
                        : <Register Login={handleChangePage} openpage={currPageLogin} />}
       </>
    );
}

export default AuthenticationPage;