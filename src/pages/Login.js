// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import authService from '../services/authService';

// Beautiful Icons
import { 
  FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaIdBadge, 
  FaStore, FaShoppingBag, FaChartLine, FaShieldAlt, FaShippingFast
} from 'react-icons/fa';

// Reuse the identical CSS from Register for consistent beautiful layout
import './Register.css'; 

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('email'); 
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- 🧠 SMART SOCIAL HANDLER ---
  const handleSocialResponse = (res) => {
    if (res.action === 'complete_profile' && res.tempToken) {
        localStorage.setItem('tempAuthToken', res.tempToken);
        Swal.fire({
            icon: 'info',
            title: 'Complete Your Profile',
            text: 'You must set your Brand Name and City to continue.',
            confirmButtonText: 'Setup Now',
            confirmButtonColor: '#2563eb',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) navigate('/complete-profile');
        });
        return;
    }

    if (res.token) {
        localStorage.setItem('supplierToken', res.token);
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Redirecting to your dashboard...',
          timer: 1500,
          showConfirmButton: false
        });
        setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  // --- 🛑 ERROR HANDLER ---
  const handleAuthError = (err) => {
      setLoading(false);
      const msg = err.response?.data?.message || 'Login Failed';
      const icon = msg.includes('review') || msg.includes('Pending') ? 'warning' : 'error';
      const title = msg.includes('review') || msg.includes('Pending') ? 'Under Review' : 
                    msg.includes('suspended') || msg.includes('banned') ? 'Account Suspended' : 'Login Failed';

      Swal.fire({ icon, title, text: msg, confirmButtonColor: '#2563eb' });
  };

  const handleGoogleClick = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await authService.googleLogin(tokenResponse.access_token);
        handleSocialResponse(res);
      } catch (err) { handleAuthError(err); }
    },
    onError: () => Swal.fire('Error', 'Google Login Failed', 'error'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if(!identifier.trim() || !password.trim()){
      return Swal.fire('Error', 'Please fill in all fields.', 'error');
    }
    setLoading(true);
    try {
      const res = await authService.login({ identifier, password });
      handleSocialResponse(res); 
    } catch (err) { handleAuthError(err); } 
  };

  return (
    <>
      <style>{`
        /* Custom Animations for Header Icons */
        @keyframes floatLogin { 
          0% { transform: translateY(0px); } 
          50% { transform: translateY(-8px); } 
          100% { transform: translateY(0px); } 
        }
        .float-1 { animation: floatLogin 3s ease-in-out infinite; }
        .float-2 { animation: floatLogin 3s ease-in-out infinite 0.4s; }
        .float-3 { animation: floatLogin 3s ease-in-out infinite 0.8s; }

        /* Premium Google Button Styling */
        .google-btn-premium {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          width: 100%; padding: 14px; margin-bottom: 25px;
          background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px;
          font-size: 1rem; font-weight: 600; color: #374151;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;
        }
        .google-btn-premium:hover:not(:disabled) {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
          border-color: #d1d5db;
          background: #f9fafb;
        }
        .google-btn-premium:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Gradient Text for Title */
        .hero-gradient-text {
          background: linear-gradient(to right, #1e3a8a, #ea580c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 2rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 8px;
        }
      `}</style>

      <div className="register-wrapper">
        
        {/* 🟦 LEFT DESKTOP PANEL */}
        <div className="register-left">
          <h1 className="panel-title">Welcome Back to SJ10</h1>
          <p className="panel-subtitle">Manage your store, track orders, and grow your business seamlessly.</p>
          
          <div className="feature-item">
            <div className="feature-icon"><FaStore /></div>
            <div className="feature-text">
              <h3>Manage Your Storefront</h3>
              <p>Update products, inventory, and pricing in real-time.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><FaShoppingBag /></div>
            <div className="feature-text">
              <h3>Fulfill Orders Faster</h3>
              <p>View pending orders and process shipments easily.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><FaChartLine /></div>
            <div className="feature-text">
              <h3>Track Performance</h3>
              <p>Analyze your sales and monitor your store's growth.</p>
            </div>
          </div>
        </div>

        {/* ⬜ RIGHT FORM PANEL */}
        <div className="register-right">
          <motion.div 
            className="register-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            
            {/* ─── ANIMATED HEADER SECTION ─── */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginBottom: '15px' }}>
                  <FaShoppingBag size={34} color="#f97316" className="float-1" />
                  <FaShieldAlt size={34} color="#2563eb" className="float-2" />
                  <FaShippingFast size={34} color="#10b981" className="float-3" />
              </div>
              <h1 className="hero-gradient-text">SJ10 Supplier Portal</h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Manage your store, orders, and growth.</p>
            </div>

            {/* ─── PREMIUM GOOGLE BUTTON ─── */}
            <button type="button" className="google-btn-premium" onClick={() => handleGoogleClick()} disabled={loading}>
              <svg width="22" height="22" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </button>

            <div className="or-divider">Or continue with</div>

            {/* ─── LOGIN FORM ─── */}
            <form onSubmit={handleSubmit}>
              
              {/* Custom Method Toggler */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                {['email', 'phone', 'code'].map((method) => (
                  <span
                    key={method}
                    onClick={() => { setLoginMethod(method); setIdentifier(''); }}
                    style={{
                      cursor: 'pointer', fontSize: '14px', textTransform: 'capitalize',
                      fontWeight: loginMethod === method ? '700' : '500',
                      color: loginMethod === method ? 'var(--primary)' : 'var(--text-muted)',
                      borderBottom: loginMethod === method ? '2px solid var(--primary)' : '2px solid transparent',
                      paddingBottom: '4px', transition: 'all 0.3s'
                    }}
                  >
                    {method}
                  </span>
                ))}
              </div>

              {/* Identifier Input */}
              <div className="input-group">
                <label>
                  {loginMethod === 'email' ? 'Email Address' : loginMethod === 'phone' ? 'Phone Number' : 'Supplier Code'}
                </label>
                <div className="input-icon-wrap">
                  <span className="input-icon">
                    {loginMethod === 'email' && <FaEnvelope />}
                    {loginMethod === 'phone' && <FaPhone />}
                    {loginMethod === 'code' && <FaIdBadge />}
                  </span>
                  <input 
                    type={loginMethod === 'email' ? 'email' : 'text'}
                    name="identifier"
                    className="reg-input"
                    placeholder={
                        loginMethod === 'email' ? 'e.g. your@email.com' : 
                        loginMethod === 'phone' ? 'e.g. 03xx-xxxxxxx' : 
                        'Enter your unique code'
                    } 
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0 }}>Password</label>
                  <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
                    Forgot Password?
                  </Link>
                </div>
                <div className="input-icon-wrap pw-wrap">
                  <FaLock className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="reg-input"
                    placeholder="Enter your password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required 
                  />
                  <span className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
                {loading ? 'Authenticating...' : 'Sign In Securely'}
              </button>

            </form>

            {/* Footer Link */}
            <p style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-muted)', fontSize: '14px' }}>
               New Supplier? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Register your Shop</Link>
            </p>

          </motion.div>
        </div>
      </div>
    </>
  );
}