import React from 'react';
import { withRouter } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import axios from "axios";
import './Register.css';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const serverURL = "http://localhost:3000/";

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            showPassword: false,
            showConfirmPassword: false, // For confirming password field
            emailError: '',
            usernameError: '',
            passwordError: '',
            confirmPasswordError: '',
            generalError: '', // General error message for overall registration,
            successMessage: '' // Add this line
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleLoginRedirect = this.handleLoginRedirect.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            errorMessage: '' // Clear error message on input change
        });
    }

    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };
    
    handleClickShowConfirmPassword = () => {
        this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
    };
    
    handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    
    handleRegister() {
        const { username, email, password, confirmPassword } = this.state;

        // Reset error messages
        this.setState({
            emailError: '',
            usernameError: '',
            passwordError: '',
            confirmPasswordError: '',
            generalError: '',
            successMessage: '' // Clear success message
        });

        // Validate fields
        if (!email) {
            this.setState({ emailError: "Email is required." });
            return;
        }
        if (!username) {
            this.setState({ usernameError: "Username is required." });
            return;
        }
        if (!password) {
            this.setState({ passwordError: "Password is required." });
            return;
        }
        if (!confirmPassword) {
            this.setState({ confirmPasswordError: "Confirm Password is required." });
            return;
        }
        if (password !== confirmPassword) {
            this.setState({ confirmPasswordError: "Passwords do not match!" });
            return;
        }

        axios.post(serverURL + 'register', { username, email, password })
            .then(response => {
                console.log("🚀 ~ Register ~ handleRegister ~ response:", response)

                if (response.data.status===200) {
                    this.setState({ successMessage: 'Registration successful!' }); // Set success message
                    this.props.history.push('/');
                } else {
                    // Set specific errors based on the message
                    if (response.data.msg.includes("Email already exists.")) {
                        this.setState({ emailError: response.data.msg });
                    } else if (response.data.msgincludes("Username already exists.")) {
                        this.setState({ usernameError: response.data.msg });
                    } else {
                        this.setState({ generalError: response.data.msg });
                    }
                }
            })
            .catch(err => {
                // Handle error properly
                if (err.response && err.response.data && err.response.data.msg) {
                    if (err.response.data.msg.includes("Email already exists.")) {
                        this.setState({ emailError: err.response.data.msg });
                    } else if (err.response.data.msg.includes("Username already exists.")) {
                        this.setState({ usernameError: err.response.data.msg });
                    } else {
                        this.setState({ generalError: err.response.data.msg });
                    }
                } else {
                    this.setState({ generalError: "Registration Failed!" });
                }
            });
    }

    handleLoginRedirect() {
        this.props.history.push('/');
    }

    render() {
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className="register-container">
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <form noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            onChange={this.handleChange}
                            autoFocus
                            error={!!this.state.emailError}
                            helperText={this.state.emailError}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            onChange={this.handleChange}
                            error={!!this.state.usernameError}
                            helperText={this.state.usernameError}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={this.state.showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            onChange={this.handleChange}
                            error={!!this.state.passwordError}
                            helperText={this.state.passwordError}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={this.handleClickShowPassword}
                                            onMouseDown={this.handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type={this.state.showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            onChange={this.handleChange}
                            error={!!this.state.confirmPasswordError}
                            helperText={this.state.confirmPasswordError}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={this.handleClickShowConfirmPassword}
                                            onMouseDown={this.handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {this.state.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.handleRegister}
                        >
                            Register
                        </Button>
                        {this.state.successMessage && (
                        <Typography variant="body2" color="textSecondary" className="success-message">
                            {this.state.successMessage}
                        </Typography>
                       )}
                        <div className="login-link">
                            <Typography variant="body2" color="textSecondary">
                                Already have an account?{' '}
                                <Button className='login-button'
                                    color="primary"
                                    onClick={this.handleLoginRedirect}
                                >
                                Login
                                </Button>
                            </Typography>
                        </div>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withRouter(Register);
