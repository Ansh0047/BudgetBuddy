import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useDispatch } from 'react-redux'
import {useNavigate} from 'react-router-dom';
import { authActions } from '../store/authSlice';
import Cookies from 'js-cookie';

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const loginUser = async (userData) =>{  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "content-type": "application/json",
        },
      });
  
      const responseData = await response.json();
      
      if(!response.ok) {
        console.log('could not login')
        return ;
      }
  
      // else set the auth token.
      Cookies.set('auth-token', responseData.authToken);
      dispatch(authActions.loginSuccess({user: responseData.user}));
      navigate('/');
    }


  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
 
    const formFields = {
      email: data.get('email'),
      password: data.get('password'),
    }

    await loginUser(formFields);
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
         
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}