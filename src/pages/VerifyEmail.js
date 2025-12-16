import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Verifying...');

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            authService.verifyEmail(token)
                .then(() => {
                    setStatus('✅ Email Verified! Redirecting to login...');
                    setTimeout(() => navigate('/login'), 3000);
                })
                .catch(() => setStatus('❌ Verification Failed or Expired.'));
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>{status}</h2>
        </div>
    );
};
export default VerifyEmail;