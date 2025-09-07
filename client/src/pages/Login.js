import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../store/authSlice';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (userData) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'content-type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      alert('Not able to login, Please Enter valid Credentials');
      console.log('could not login');
      return;
    }

    // set the auth token.
    Cookies.set('auth-token', responseData.authToken);
    dispatch(authActions.loginSuccess({ user: responseData.user }));
    navigate('/');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const formFields = {
      email: data.get('email'),
      password: data.get('password'),
    };

    await loginUser(formFields);
  };

  // Guest login handler
  const handleGuestLogin = async () => {
    const guestCredentials = {
      email: 'guest@example.com',
      password: 'guest123',
    };
    await loginUser(guestCredentials);
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

          {/* Normal Login */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 1 }}
          >
            Sign In
          </Button>

          {/* Guest Login */}
          <Button
            onClick={handleGuestLogin}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Continue as Guest
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                Don't have an account?
              </Typography>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}