import * as React from 'react';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import "./navbar.scss"
import LogoImg from "./Split-Check-transparent.png"
import { AuthContext } from '../../Context/AuthContext';
import { backendUrl } from '../../env_prod';

const pages = [['Dashboard', ''], ['New Group', 'new-group'], ['Profile', 'profile']];
const settings = [['Profile','profile'],['Create-Group','new-group'], ['Dashboard',''],['Logout','logout']];

const NavBar = () => {
    
  const {user,dispatch}=React.useContext(AuthContext);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const currentButton = window.location.href.split('/')[3];
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleClickMenu =async(link)=>{
      if(link!=="logout"){
          window.location.href=("/"+link);
      }
      else{
          try {
              await axios.post(backendUrl + "/logout",{},{withCredentials:true}).then((res) => {
                  localStorage.removeItem("user");
                  dispatch({ type: "SUCCESS", payload: null });
                  window.alert("Logout Success");
                  window.location.reload();
              })
          }
          catch (err) {
              console.error(err);
              window.alert(err);
          }
      }
  };

  const HandlePageChange=(link)=>{
        window.location.href=("/"+link);
  };


  return (
   <div className="navbar navbar-default ">
          <AppBar  className="appbar" >
              <Container maxWidth="xl">
                  <Toolbar disableGutters>
                      {/* Logo */}
                      {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                      <img src={LogoImg} alt="hello" className="logojpg"/>
                      <Typography
                          className="logoName"
                          variant="h6"
                          noWrap
                          component="a"
                          href="/"
                      >
                          Split-Check
                      </Typography>

                      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                          {pages.map((page) => (
                              <Button
                                  key={page[0]}
                                  sx={{
                                      my: 2, mx: 2, color: page[1] === currentButton ? 'white' : '#a9b5ce', display: 'block', '&:hover': {
                                          color: 'white',
                                      }, }}
                                  onClick={()=>{HandlePageChange(page[1])}}
                              >
                                  {page[0]}
                              </Button>
                          ))}
                      </Box>
                    {/* Image and Menu  */}
                      <Box sx={{ flexGrow: 0 }}>
                          <Tooltip title="Open settings">
                              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                  <Avatar alt="Remy Sharp" src={user.profilePicture} />
                                  <Typography className="userName">{user.name}</Typography>
                              </IconButton>
                          </Tooltip>
                          <Menu
                              sx={{ mt: '45px' }}
                              id="menu-appbar"
                              anchorEl={anchorElUser}
                              anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                              }}
                              keepMounted
                              transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                              }}
                              open={Boolean(anchorElUser)}
                              onClose={handleCloseUserMenu}
                          >
                              {settings.map((setting) => (
                                  <MenuItem key={setting} onClick={()=>{handleClickMenu(setting[1])}}>
                                      <Typography textAlign="center">{setting[0]}</Typography>
                                  </MenuItem>
                              ))}
                          </Menu>
                      </Box>
                  </Toolbar>
              </Container>
          </AppBar>
  </div>
  );
};
export default NavBar;
