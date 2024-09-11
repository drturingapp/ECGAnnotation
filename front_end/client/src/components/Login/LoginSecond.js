import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import { Button, TextField, InputAdornment, IconButton, Typography, Container, CssBaseline } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { withRouter } from 'react-router';
import axios from 'axios';

const serverURL = "http://localhost:3000/";

class LoginSecond extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            showPassword: false,
            errorMessage: '',
        };

        this.submitClicked = this.submitClicked.bind(this);
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
        this.registerClicked = this.registerClicked.bind(this);
    }

    submitClicked = () => {
        const { username, password } = this.state;
        axios.post(serverURL + 'authenticate', { username, password })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    Cookies.set('authToken', response.data.token, {
                        expires: 7,
                        secure: true,
                        sameSite: 'Strict'
                    });
                }
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
                if (err.response) {
                    const { data, status } = err.response;
                    if (status === 403 && data === "Please verify your account before login") {
                        this.setState({ errorMessage: 'Please verify your account before login.' });
                    } else {
                        this.setState({ errorMessage: data || "Sign-in Failed!" });
                    }
                } else {
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
        const { errorMessage } = this.state;

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
                        {errorMessage && (
                            <Typography color="error" variant="body2" style={{ marginTop: '16px' }}>
                                {errorMessage}
                            </Typography>
                        )}
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
