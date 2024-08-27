import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const history = useHistory(); // Hook to navigate programmatically

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage('');
    setError('');

    // Send POST request to the server
    axios.post('http://localhost:3000/forgot-password', { email })
      .then(response => {
        if (response.data.status === 200) {
          setMessage(response.data.msg); // Show success message
          setTimeout(() => {
            history.push(`/reset-password?token=${response.data.token}`);
        }, 2000);
        } else {
          setError(response.data.msg); // Show error message
        }
      })
      .catch(err => {
        console.error('Error sending password reset request:', err);
        setError('An error occurred while sending the password reset request.');
      });
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        <p>Please enter your email address to request a password reset link.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Send Reset Link
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
