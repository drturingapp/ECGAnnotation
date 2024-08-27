import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css';
import { useHistory, useLocation } from 'react-router-dom'; // Import useHistory and useLocation from react-router-dom

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get('token'); // Extract token from query params

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Send POST request to the server
    axios.post('http://localhost:3000/reset-password', { token, newPassword })
        .then(response => {
            if (response.data.status === 200) {
            setMessage(response.data.msg); // Show success message
            setTimeout(() => {
                history.push('/'); // Redirect to home or login page after a short delay
            }, 2000);
            } else {
            setError(response.data.msg); // Show error message
            }
        })
      .catch(err => {
        console.error('Error resetting password:', err);
        setError('An error occurred while resetting the password.');
      });
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Reset Password</h2>
        <p>Please enter your new password.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Reset Password
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
