import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './VerifyEmail.css';

const VerifyEmail = () => {
    const [status, setStatus] = useState('pending'); // pending, success, error
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        console.log("🚀 ~ useEffect ~ token:", token)

        if (token) {
            axios.get(`http://localhost:3000/verify-email?token=${token}`)
                .then(response => {
                    setStatus('success');
                })
                .catch(error => {
                    setStatus('error');
                });
        } else {
            setStatus('error');
        }
    }, [location.search]);

    const renderContent = () => {
        if (status === 'pending') {
            return <p>Verifying your email...</p>;
        }

        if (status === 'success') {
            return (
                <>
                    <h1 className="verify-email-title">Email Verified Successfully!</h1>
                    <p className="verify-email-message">
                        Your email has been verified. You can now <a href="/" className="login-link">log in</a> to your account.
                    </p>
                </>
            );
        }

        if (status === 'error') {
            return (
                <>
                    <h1 className="verify-email-title">Verification Failed</h1>
                    <p className="verify-email-message">
                        The verification link is invalid or expired. Please try verifying again or <a href="/resend-verification" className="resend-link">resend the verification email</a>.
                    </p>
                </>
            );
        }
    };

    return (
        <div className="verify-email-container">
            <div className="verify-email-card">
                {renderContent()}
            </div>
        </div>
    );
};

export default VerifyEmail;
