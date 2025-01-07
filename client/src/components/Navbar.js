import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/authSlice';
import Cookies from 'js-cookie';

export default function Navbar() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const navigate = useNavigate()

  const logoutHandler = ()=>{
    Cookies.remove('auth-token')
    dispatch(authActions.logoutSuccess())
    navigate('/login')
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Expensor
          </Typography>
          {!isAuthenticated && <Button color="inherit"><Link to="/login" style={{color: 'inherit', textDecoration: 'inherit'}}>Login</Link></Button>}
          {!isAuthenticated && <Button color="inherit"><Link to="/signup" style={{color: 'inherit', textDecoration: 'inherit'}}>Signup</Link></Button>}
          {isAuthenticated && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
