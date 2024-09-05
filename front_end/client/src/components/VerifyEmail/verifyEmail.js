import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const VerifyEmail = () => {
    const [status, setStatus] = useState('pending'); // Initially pending until verification is done
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            // Save token and authToken first
            localStorage.setItem('token', token);
            Cookies.set('authToken', token, {
                expires: 7,
                secure: true,
                sameSite: 'Strict'
            });

            // Call the API to verify the token
            axios.get(`http://localhost:3000/verify-email?token=${token}`)
                .then(response => {
                    if (response.status === 200) {
                        setStatus('success');
                    } else {
                        setStatus('error');
                    }
                })
                .catch(() => {
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
