import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


function PasswordInput(props)
{
    const [showPassword, changeShowPassword] = React.useState(0);
      
    const handleClickShowPassword = () => {
        changeShowPassword(showPassword^1);
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    return (
      <FormControl  required label="Password" variant="standard" fullWidth>
          <InputLabel >{props.placeholder}</InputLabel>
          <Input
            id="standard-adornment-password"
            type={ showPassword ? "text" : "password"}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  style={{backgroundColor:(showPassword===1)&&("antiquewhite")}}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
    )
}

export default PasswordInput;