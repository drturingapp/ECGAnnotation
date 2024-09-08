import React from 'react';
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import Button from "@material-ui/core/Button";
import { Route , withRouter1} from 'react-router-dom';
import {Router} from 'react-router-dom';
import { withRouter } from "react-router";
import Cookies from 'js-cookie';

import { createHashHistory } from 'history';

//"proxy": "http://128.4.30.6:5000"

//import MainContainer from "./components/MainContainer/MainContainer";


import MainContainer from '../MainContainer/MainContainer';
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import { IconButton, InputAdornment } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import axios from "axios";

var selectedTab;

let serverURL = "http://localhost:3000/";

export const history = createHashHistory();

class LoginSecond extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            showPassword: false,
            errorMessage: '', // To store error messages like email verification
        };

        this.submitClicked = this.submitClicked.bind(this);
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
        this.registerClicked = this.registerClicked.bind(this);
    }

    submitClicked = () => {
        let { username, password } = this.state;
    
        axios.post(serverURL + 'authenticate', { username, password })
            .then(response => {
                console.log('Here', response.data);
    
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    Cookies.set('authToken', response.data.token, {
                        expires: 7,
                        secure: true,
                        sameSite: 'Strict'
                    });
                }
    
                // Delay for token setting
            setTimeout(() => {
                if (response.data.data.status === 403 && response.data.data.isVerified === 0) {
                    this.setState({ errorMessage: 'Please verify your account before login.' });
                    console.log(this.state.errorMessage); // Check the error message
                } else if (response.data.data === 5) {
                    this.props.history.push({ pathname: '/mainContainerAdmin', search: '?query=abc', state: { detail: response.data } });
                } else if (response.data.data === 6 || response.data.data === 7) {
                    this.props.history.push({ pathname: '/mainContainerAnnChecker', search: '?query=abc', state: { detail: response.data } });
                } else if (response.data.data === 8) {
                    this.props.history.push({ pathname: '/mainContainerReadOnly', search: '?query=abc', state: { detail: response.data } });
                } else {
                    this.props.history.push({ pathname: '/mainContainer', search: '?query=abc', state: { detail: response.data } });
                }
            }, 100); // Delay in milliseconds (100ms in this example)
            })
            .catch(err => {
                console.log('err: ', err); // Log the entire error object to inspect
            
                // Check if we received an error response from the server
                if (err.response) {
                    const { data, status } = err.response;
            
                    // Check for status code 403 and specific error message
                    if (status === 403 && data === "Please verify your account before login") {
                        this.setState({ errorMessage: 'Please verify your account before login.' });
                    } else {
                        this.setState({ errorMessage: data || "Sign-in Failed!" });
                    }
                } else {
                    // If there's no response data (e.g., network error), set a general error message
                    this.setState({ errorMessage: "Sign-in Failed!" });
                }
            });
            
    };
    

    registerClicked = () => {
        this.props.history.push('/register');
    };

    setUsername(value) {
        this.setState({ username: value });
    }

    setPassword(value) {
        this.setState({ password: value });
    }

    toggleShowPassword() {
        this.setState(prevState => ({ showPassword: !prevState.showPassword }));
    }

    render() {
        const { errorMessage } = this.state; // Destructure errorMessage from state

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            onChange={e => this.setUsername(e.target.value)}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={this.state.showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            onChange={e => this.setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={this.toggleShowPassword}
                                        >
                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* Error message display */}
                        {errorMessage && (
                            <Typography color="error" variant="body2" style={{ marginTop: '16px' }}>
                                {errorMessage}
                            </Typography>
                        )}
                        {/* "Forgot Password?" link after email field */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px', marginBottom: '8px' }}>
                            <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#3f51b5' }}>
                                Forgot password?
                            </Link>
                        </div>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.submitClicked}
                        >
                            Sign In
                        </Button>
                        {/* "Create an Account" button */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                            <Typography variant="body2" style={{ marginRight: 8 }}>
                                Don't have an account?
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={this.registerClicked}
                            >
                                Register Now
                            </Button>
                        </div>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withRouter(LoginSecond);
