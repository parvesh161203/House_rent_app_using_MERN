import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { message } from 'antd';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Form Validation
    if (!data.email || !data.password) {
      return message.error('Please fill all fields');
    }

    console.log('Submitting Login Data:', data);

    // API Call to Login
    axios
      .post('http://localhost:8000/api/user/login', data)
      .then((res) => {
        console.log('API Response:', res);

        if (res.data.success) {
          message.success(res.data.message);

          // Store token and user data
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));

          const loggedInUser = res.data.user;
          console.log('Logged-in User:', loggedInUser);

          // Navigate based on user type
          switch (loggedInUser.type) {
            case 'Admin':
              navigate('/adminhome');
              break;
            case 'Renter':
              navigate('/renterhome');
              break;
            case 'Owner':
              if (loggedInUser.granted === 'ungranted') {
                message.error('Your account is not yet confirmed by the admin');
              } else {
                navigate('/ownerhome');
              }
              break;
            default:
              message.error('Invalid account type. Redirecting...');
              navigate('/login');
              break;
          }
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error('API Error Details:', err);

        if (err.response) {
          console.log('Response Status:', err.response.status);
          console.log('Response Data:', err.response.data);
          message.error(err.response.data.message || 'Error occurred');
        } else if (err.request) {
          console.log('No Response Received:', err.request);
          message.error('No response from the server');
        } else {
          console.log('Unexpected Error:', err.message);
          message.error('An unexpected error occurred');
        }
      });
  };

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>
            <h2>RentEase</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll />
            <Nav>
              <Link to={'/'}>Home</Link>
              <Link to={'/login'}>Login</Link>
              <Link to={'/register'}>Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Form */}
      <Container component="main">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={data.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              value={data.password}
              onChange={handleChange}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Box mt={2}>
              <Button type="submit" variant="contained" style={{ width: '200px' }}>
                Sign In
              </Button>
            </Box>
            <Grid container>
              <Grid item>
                Forgot password?{' '}
                <Link style={{ color: 'red' }} to={'/forgotpassword'} variant="body2">
                  Click here
                </Link>
              </Grid>
              <Grid item>
                Don’t have an account?{' '}
                <Link style={{ color: 'blue' }} to={'/register'} variant="body2">
                  Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
