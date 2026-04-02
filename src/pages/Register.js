// src/pages/Register.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';
import authService from '../services/authService';

// Beautiful Icons
import { 
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, 
  FaCity, FaMapMarkerAlt, FaCamera, FaGoogle, FaStore, 
  FaShoppingBag, FaChartLine, FaMailBulk
} from 'react-icons/fa';

import './Register.css';

const CATEGORIES = ["Women's Fashion", "Men's Fashion", "Electronics", "Home Decor", "Watches", "Jewelry", "Health & Beauty", "Automotive", "Sports", "Groceries", "Furniture"];
const BUSINESS_TYPES = ["Wholesaler", "Retailer", "Shop"];
const STOCK_RANGES = ["1 – 100", "100 – 200", "200 – 500", "500 – 1000", "10,000+"];
const GENDERS = ["Man", "Woman", "Not Specified"];

const STEP_LABELS = { 1: "Account", 2: "Business", 3: "Location", 4: "Profile" };

const stepVariants = {
  enterForward: { x: 50, opacity: 0 },
  enterBackward: { x: -50, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitForward: { x: -50, opacity: 0 },
  exitBackward: { x: 50, opacity: 0 },
};

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [loading, setLoading] = useState(false);
  
  // OTP States
  const [showOTP, setShowOTP] = useState(false);
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const otpRefs = useRef(Array(6).fill(null).map(() => React.createRef()));
  
  // Form States
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPW, setShowPW] = useState(false);
  const [showConfirmPW, setShowConfirmPW] = useState(false);
  
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    businessType: 'Retailer', stockRange: '1 – 100', category: '',
    contactNumber: '', gender: 'Not Specified', age: '', city: '', address: '', profilePic: null,
  });

  const updateField = (field, val) => setForm(prev => ({ ...prev, [field]: val }));
  const handleInput = e => updateField(e.target.name, e.target.value);

  // --- 🧠 GOOGLE SIGNUP HANDLER (Exactly like Login.js) ---
  const handleSocialResponse = (res) => {
    setLoading(false);
    if (res.action === 'complete_profile' && res.tempToken) {
        localStorage.setItem('tempAuthToken', res.tempToken);
        Swal.fire({
            icon: 'info', title: 'Almost Done!',
            text: 'We just need a few more details to set up your shop.',
            confirmButtonColor: '#2563eb'
        }).then(() => navigate('/complete-profile'));
    } else if (res.token) {
        localStorage.setItem('supplierToken', res.token);
        Swal.fire({ icon: 'success', title: 'Welcome Back!', text: 'Logged in successfully.', timer: 1500, showConfirmButton: false });
        setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  const handleGoogleClick = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await authService.googleLogin(tokenResponse.access_token);
        handleSocialResponse(res);
      } catch (err) { 
        setLoading(false);
        Swal.fire('Error', err.response?.data?.message || 'Google Registration Failed', 'error'); 
      }
    },
    onError: () => Swal.fire('Error', 'Google Connection Failed', 'error'),
  });

  // --- VALIDATION & NAVIGATION ---
  const validate = () => {
    if (step === 1) {
      if (!form.fullName.trim()) return Swal.fire('Error', 'Full name is required', 'error'), false;
      if (!form.email.includes('@')) return Swal.fire('Error', 'Valid email required', 'error'), false;
      if (form.password.length < 6) return Swal.fire('Error', 'Password min 6 characters', 'error'), false;
      if (form.password !== form.confirmPassword) return Swal.fire('Error', 'Passwords do not match', 'error'), false;
    }
    if (step === 2) {
      if (!form.category) return Swal.fire('Error', 'Select business category', 'error'), false;
      if (!form.contactNumber.trim()) return Swal.fire('Error', 'Contact number is required', 'error'), false;
    }
    if (step === 3) {
      if (!form.city.trim() || !form.address.trim()) return Swal.fire('Error', 'Full location required', 'error'), false;
    }
    return true;
  };

  const goNext = () => { if (validate()) { setDirection('forward'); setStep(s => s + 1); } };
  const goBack = () => { setDirection('backward'); setStep(s => s - 1); };

  const handlePic = e => {
    const file = e.target.files[0];
    if (file) { updateField('profilePic', file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== null && k !== 'confirmPassword') formData.append(k, v); });
      await authService.register(formData);
      setShowOTP(true); 
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Registration failed', 'error');
    } finally { setLoading(false); }
  };

  // --- OTP HANDLERS ---
  const handleOTPChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpValues]; next[idx] = val; setOtpValues(next);
    if (val && idx < 5) otpRefs.current[idx + 1].current?.focus();
  };

  const handleOTPKey = (idx, e) => {
    if (e.key === 'Backspace' && !otpValues[idx] && idx > 0) otpRefs.current[idx - 1].current?.focus();
  };
  
  const verifyOTP = async () => {
    const code = otpValues.join('');
    if (code.length !== 6) return Swal.fire('Warning', 'Enter all 6 digits', 'warning');
    setLoading(true);
    try {
      await authService.verifyEmail(form.email, code);
      Swal.fire({
        icon: 'success', title: 'Verified!',
        text: 'Your email is verified. Redirecting to login...',
        timer: 2000, showConfirmButton: false
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      Swal.fire('Error', 'Invalid verification code.', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="register-wrapper">
      {/* 🟦 LEFT DESKTOP PANEL */}
      <div className="register-left">
        <h1 className="panel-title">Join SJ10 Seller Center</h1>
        <p className="panel-subtitle">Create your seller account in minutes and reach millions of buyers nationwide.</p>
        
        <div className="feature-item">
          <div className="feature-icon"><FaStore /></div>
          <div className="feature-text"><h3>Set up your Digital Shop</h3><p>Customize your storefront easily.</p></div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><FaShoppingBag /></div>
          <div className="feature-text"><h3>Manage Orders Seamlessly</h3><p>Track sales and manage inventory on the go.</p></div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><FaChartLine /></div>
          <div className="feature-text"><h3>Grow Your Business</h3><p>Use premium tools to scale your sales exponentially.</p></div>
        </div>
      </div>

      {/* ⬜ RIGHT FORM PANEL */}
      <div className="register-right">
        <div className="register-card">
          {!showOTP && (
            <>
              <div className="brand-label">SJ10 Platform</div>
              <h1 className="reg-title">Register as a Seller</h1>
              <p className="reg-subtitle">Follow the steps to configure your shop.</p>
              
              <div className="stepper">
                {[1, 2, 3, 4].map(s => (
                  <React.Fragment key={s}>
                    <div className={`step-node ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                      <div className="step-circle">{s}</div>
                      <div className="step-label">{STEP_LABELS[s]}</div>
                    </div>
                    {s < 4 && <div className={`step-line-wrap ${step > s ? 'filled' : ''}`}><div className="step-line-fill" /></div>}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}

          {!showOTP ? (
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <motion.div key="step1" custom={direction} variants={stepVariants} initial={direction === 'forward' ? "enterForward" : "enterBackward"} animate="center" exit={direction === 'forward' ? "exitForward" : "exitBackward"} transition={{duration: 0.3}}>
                  
                  <button type="button" className="social-btn" onClick={() => handleGoogleClick()} disabled={loading}>
                    <FaGoogle color="#DB4437" size={20} /> Continue with Google
                  </button>
                  
                  <div className="or-divider">Or register with email</div>

                  <div className="input-group">
                    <FaUser className="input-icon" />
                    <input className="reg-input" name="fullName" value={form.fullName} onChange={handleInput} placeholder="Full Name (e.g. Ahmed Raza)" />
                  </div>

                  <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input className="reg-input" type="email" name="email" value={form.email} onChange={handleInput} placeholder="Email Address" />
                  </div>

                  <div className="input-group pw-wrap">
                    <FaLock className="input-icon" />
                    <input className="reg-input" type={showPW ? 'text' : 'password'} name="password" value={form.password} onChange={handleInput} placeholder="Password (Min. 6 chars)" />
                    <span className="pw-toggle" onClick={() => setShowPW(!showPW)}>{showPW ? <FaEyeSlash /> : <FaEye />}</span>
                  </div>

                  <div className="input-group pw-wrap">
                    <FaLock className="input-icon" />
                    <input className="reg-input" type={showConfirmPW ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleInput} placeholder="Confirm Password" />
                    <span className="pw-toggle" onClick={() => setShowConfirmPW(!showConfirmPW)}>{showConfirmPW ? <FaEyeSlash /> : <FaEye />}</span>
                  </div>

                  <button className="btn-primary" onClick={goNext}>Continue Setup</button>
                  <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280'}}>
                    Already a seller? <Link to="/login" style={{color: '#2563eb', fontWeight: 600}}>Sign in</Link>
                  </p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={stepVariants} initial={direction === 'forward' ? "enterForward" : "enterBackward"} animate="center" exit={direction === 'forward' ? "exitForward" : "exitBackward"} transition={{duration: 0.3}}>
                  <div className="input-group">
                    <label>Business Type</label>
                    <select className="reg-input" style={{paddingLeft: '16px'}} name="businessType" value={form.businessType} onChange={handleInput}>
                      {BUSINESS_TYPES.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Main Category</label>
                    <select className="reg-input" style={{paddingLeft: '16px'}} name="category" value={form.category} onChange={handleInput}>
                      <option value="">Select Category</option>
                      {CATEGORIES.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Contact Number <span className="required-star">*</span></label>
                    <FaPhone className="input-icon" />
                    <input className="reg-input" name="contactNumber" value={form.contactNumber} onChange={handleInput} placeholder="03xx-xxxxxxx" type="tel" />
                  </div>
                  <div className="btn-row"><button className="btn-secondary" onClick={goBack}>Back</button><button className="btn-primary" onClick={goNext}>Next</button></div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={stepVariants} initial={direction === 'forward' ? "enterForward" : "enterBackward"} animate="center" exit={direction === 'forward' ? "exitForward" : "exitBackward"} transition={{duration: 0.3}}>
                  <div className="two-col">
                    <div className="input-group">
                      <label>Gender</label>
                      <select className="reg-input" style={{paddingLeft: '16px'}} name="gender" value={form.gender} onChange={handleInput}>
                        {GENDERS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="input-group"><label>Age</label><input className="reg-input" style={{paddingLeft:'16px'}} name="age" type="number" value={form.age} onChange={handleInput} placeholder="Years" /></div>
                  </div>
                  <div className="input-group">
                    <label>City <span className="required-star">*</span></label>
                    <FaCity className="input-icon" />
                    <input className="reg-input" name="city" value={form.city} onChange={handleInput} placeholder="Lahore, Karachi..." />
                  </div>
                  <div className="input-group">
                    <label>Shop / Warehouse Address <span className="required-star">*</span></label>
                    <FaMapMarkerAlt className="input-icon" />
                    <input className="reg-input" name="address" value={form.address} onChange={handleInput} placeholder="Street, Sector..." />
                  </div>
                  <div className="btn-row"><button className="btn-secondary" onClick={goBack}>Back</button><button className="btn-primary" onClick={goNext}>Next</button></div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" variants={stepVariants} initial={direction === 'forward' ? "enterForward" : "enterBackward"} animate="center" exit={direction === 'forward' ? "exitForward" : "exitBackward"} transition={{duration: 0.3}}>
                  <div className="avatar-wrap">
                    <div className="avatar-ring" onClick={() => document.getElementById('picInput').click()}>
                      {previewUrl ? <img src={previewUrl} alt="Profile" /> : <FaCamera />}
                    </div>
                    <input id="picInput" type="file" accept="image/*" hidden onChange={handlePic} />
                    <p style={{marginTop: '10px', fontSize: '14px', color: '#6b7280', fontWeight: 500}}>Upload shop logo (Optional)</p>
                  </div>
                  <div className="btn-row">
                    <button className="btn-secondary" onClick={goBack}>Back</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Creating Account...' : 'Complete Sign-up'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            /* ─── OTP VERIFICATION (Fully Fixed Layout) ─── */
            <motion.div className="otp-container" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <FaMailBulk className="otp-icon" />
              <h2 className="reg-title">Check your Email</h2>
              <p className="reg-subtitle">Enter the 6-digit verification code sent to<br/><strong style={{color: '#111827'}}>{form.email}</strong></p>

              <div className="otp-fields">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx} ref={otpRefs.current[idx]}
                    className="otp-digit" maxLength={1} inputMode="numeric" value={val}
                    onChange={e => handleOTPChange(idx, e.target.value)}
                    onKeyDown={e => handleOTPKey(idx, e)}
                  />
                ))}
              </div>

              <button className="btn-primary" onClick={verifyOTP} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Finish'}
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}