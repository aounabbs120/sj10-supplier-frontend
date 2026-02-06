import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion'; // ✅ <--- THIS IS THE FIX
import authService from '../services/authService';
import { 
  FaGoogle, FaFacebook, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShoppingBag, 
  FaShippingFast, FaShieldAlt, FaPhone, FaIdBadge, FaCheckCircle
} from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('email'); 
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) navigate('/complete-profile');
        });
        return;
    }

    if (res.token) {
        localStorage.setItem('supplierToken', res.token);
        setIsSuccess(true);
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

  const onFacebookSuccess = async (response) => {
    if (response.accessToken) {
        setLoading(true);
        try {
           const res = await authService.facebookLogin(response.accessToken, response.userID);
           handleSocialResponse(res);
        } catch (err) { handleAuthError(err); }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      const res = await authService.login({ identifier, password });
      handleSocialResponse(res); 
    } catch (err) { handleAuthError(err); } 
  };

  // --- STYLES ---
  const styles = {
    container: { 
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', 
      background: 'radial-gradient(at 0% 0%, hsla(213,94%,88%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(27,100%,92%,1) 0, transparent 50%), #ffffff',
      fontFamily: "'Poppins', sans-serif", padding: '20px', position: 'relative', overflow: 'hidden'
    },
    header: {
      textAlign: 'center', marginBottom: '35px', zIndex: 2
    },
    iconsContainer: {
      display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '15px'
    },
    heroTitle: {
      fontSize: '2.5rem', fontWeight: '800', margin: '0 0 5px 0',
      background: 'linear-gradient(to right, #1e3a8a, #ea580c)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
    },
    card: { 
      backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(15px)',
      padding: '45px', borderRadius: '32px', 
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', 
      width: '100%', maxWidth: '460px', textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.6)', position: 'relative', zIndex: 10
    },
    title: { fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '8px' },
    subtitle: { fontSize: '0.95rem', color: '#6b7280', marginBottom: '30px' },
    inputGroup: { position: 'relative', marginBottom: '20px', textAlign: 'left' },
    inputIcon: { position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '18px', zIndex: 2 },
    eyeIcon: { position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', color: '#9ca3af', cursor: 'pointer', zIndex: 2 },
    input: { 
      width: '100%', padding: '16px 55px', borderRadius: '16px', border: '2px solid #e5e7eb', 
      fontSize: '1rem', outline: 'none', backgroundColor: '#f9fafb', transition: 'all 0.3s',
      color: '#1f2937', fontWeight: '500', boxSizing:'border-box'
    },
    toggleContainer: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px', fontSize: '0.85rem' },
    toggleLink: (active) => ({ cursor: 'pointer', color: active ? '#2563eb' : '#6b7280', fontWeight: active ? '700' : '500', textDecoration: active ? 'underline' : 'none' }),
    button: { 
      width: '100%', padding: '18px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
      color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '600', 
      cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)', transition: 'transform 0.2s'
    },
    divider: { display: 'flex', alignItems: 'center', margin: '30px 0', color: '#9ca3af', fontSize: '13px', fontWeight: '500' },
    line: { flex: 1, height: '1px', backgroundColor: '#e5e7eb' },
    socialGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    socialBtn: (color) => ({ 
      width: '100%', padding: '15px', border: '1px solid #e5e7eb', backgroundColor: color || '#fff', 
      borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      gap: '10px', color: color ? '#fff' : '#374151', fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' 
    }),
    popupOverlay: { position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
    popupCard: { backgroundColor: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', textAlign: 'center', border: '2px solid #22c55e' },
  };

  return (
    <>
      <style>{`
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { translateY(0px); } }
        .float-anim-1 { animation: float 6s ease-in-out infinite; }
        .float-anim-2 { animation: float 6s ease-in-out infinite 2s; }
        .float-anim-3 { animation: float 6s ease-in-out infinite 4s; }
        .input-focus:focus { border-color: #2563eb !important; background-color: #fff !important; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
      `}</style>

      <div style={styles.container}>

        {isSuccess && (
          <div style={styles.popupOverlay}>
            <div style={styles.popupCard}>
              <FaCheckCircle size={65} color="#22c55e" />
              <h2>Login Successful!</h2>
              <p>Redirecting to dashboard...</p>
            </div>
          </div>
        )}
        
        <div style={styles.header}>
            <div style={styles.iconsContainer}>
                <FaShoppingBag size={32} color="#f97316" className="float-anim-1" />
                <FaShieldAlt size={32} color="#2563eb" className="float-anim-2" />
                <FaShippingFast size={32} color="#10b981" className="float-anim-3" />
            </div>
            <h1 style={styles.heroTitle}>SJ10 Supplier Portal</h1>
            <p style={{color: '#64748b'}}>Manage your store, orders, and growth.</p>
        </div>

        <motion.div 
            style={styles.card}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter your details to access your shop.</p>

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>
                  {loginMethod === 'email' && <FaEnvelope />}
                  {loginMethod === 'phone' && <FaPhone />}
                  {loginMethod === 'code' && <FaIdBadge />}
              </span>
              <input 
                type={loginMethod === 'email' ? 'email' : 'text'}
                placeholder={
                    loginMethod === 'email' ? 'Enter Email Address' : 
                    loginMethod === 'phone' ? 'Enter Phone (e.g. 0300...)' : 
                    'Enter Supplier Code'
                } 
                style={styles.input} 
                className="input-focus"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required 
              />
            </div>

            <div style={styles.toggleContainer}>
               <span style={styles.toggleLink(loginMethod === 'email')} onClick={() => {setLoginMethod('email'); setIdentifier('');}}>Email</span>
               <span>|</span>
               <span style={styles.toggleLink(loginMethod === 'phone')} onClick={() => {setLoginMethod('phone'); setIdentifier('');}}>Phone</span>
               <span>|</span>
               <span style={styles.toggleLink(loginMethod === 'code')} onClick={() => {setLoginMethod('code'); setIdentifier('');}}>Code</span>
            </div>

            <div style={styles.inputGroup}>
              <FaLock style={styles.inputIcon} />
              <input 
                type={showPassword ? "text" : "password"} 
                style={styles.input} 
                className="input-focus"
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
              />
              <div style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div style={{textAlign:'right', marginBottom:'20px'}}>
               <Link to="/forgot-password" style={{color:'#f97316', fontWeight:600, fontSize:'0.9rem'}}>Forgot Password?</Link>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In Securely'}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.line}></div><span style={{padding:'0 10px'}}>Or Continue With</span><div style={styles.line}></div>
          </div>

          <div style={styles.socialGrid}>
             <button style={styles.socialBtn(null)} onClick={() => handleGoogleClick()} disabled={loading}>
                <FaGoogle color="#DB4437" size={20}/> Google
             </button>
             
             <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID || ''}
                onSuccess={onFacebookSuccess}
                onFail={() => Swal.fire('Error', 'Facebook Login Failed', 'error')}
                render={({ onClick }) => (
                  <button style={styles.socialBtn('#1877F2')} onClick={onClick} disabled={loading}>
                     <FaFacebook color="#fff" size={20}/> <span style={{color:'white'}}>Facebook</span>
                  </button>
                )}
             />
          </div>

          <p style={{marginTop:'25px', color:'#6b7280', fontSize:'0.9rem'}}>
             New Supplier? <Link to="/register" style={{color:'#2563eb', fontWeight:700}}>Register Shop</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}