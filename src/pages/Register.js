// src/pages/Register.js
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';
import authService from '../services/authService';

// Beautiful & Modern Icons
import { 
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, 
  FaCity, FaMapMarkerAlt, FaCamera, FaGoogle, FaStore, 
  FaShoppingBag, FaChartLine, FaShieldAlt, FaWhatsapp, 
  FaExclamationTriangle, FaCheckCircle
} from 'react-icons/fa';

import './Register.css';

const CATEGORIES = [
  "Women's Fashion", "Men's Fashion", "Electronics", "Home Decor", 
  "Watches", "Jewelry", "Health & Beauty", "Automotive", 
  "Sports", "Groceries", "Furniture"
];
const BUSINESS_TYPES = ["Wholesaler", "Retailer", "Shop"];
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
  
  // 🟢 DUAL OTP STATES
  const [showOTP, setShowOTP] = useState(false);
  const [hasWhatsApp, setHasWhatsApp] = useState(true);
  const [emailOtpValues, setEmailOtpValues] = useState(Array(6).fill(''));
  const [whatsappOtpValues, setWhatsappOtpValues] = useState(Array(6).fill(''));
  
  const emailOtpRefs = useRef(Array(6).fill(null).map(() => React.createRef()));
  const whatsappOtpRefs = useRef(Array(6).fill(null).map(() => React.createRef()));
  
  // Form States
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPW, setShowPW] = useState(false);
  const [showConfirmPW, setShowConfirmPW] = useState(false);
  
  const [form, setForm] = useState({
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    businessType: 'Retailer', 
    stockRange: '1 – 100', 
    category: '',
    contactNumber: '', 
    gender: 'Not Specified', 
    age: '', 
    city: '', 
    address: '', 
    profilePic: null,
  });

  const updateField = (field, val) => setForm(prev => ({ ...prev, [field]: val }));
  const handleInput = e => updateField(e.target.name, e.target.value);

  // --- 🧠 GOOGLE SIGNUP HANDLER ---
  const handleSocialResponse = (res) => {
    setLoading(false);
    if (res.action === 'complete_profile' && res.tempToken) {
        localStorage.setItem('tempAuthToken', res.tempToken);
        Swal.fire({
            icon: 'info', 
            title: 'Almost Done! 🎉',
            text: 'We just need your shop & WhatsApp details to activate your seller account.',
            confirmButtonColor: '#2563eb'
        }).then(() => navigate('/complete-profile'));
    } else if (res.token) {
        localStorage.setItem('supplierToken', res.token);
        Swal.fire({ 
          icon: 'success', 
          title: 'Welcome Back!', 
          text: 'Logged in successfully.', 
          timer: 1500, 
          showConfirmButton: false 
        });
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

  // --- VALIDATIONS ---
  const validate = () => {
    if (step === 1) {
      if (!form.fullName.trim()) return Swal.fire('Error', 'Full name is required', 'error'), false;
      if (!form.email.includes('@')) return Swal.fire('Error', 'Valid email required', 'error'), false;
      if (form.password.length < 6) return Swal.fire('Error', 'Password must be at least 6 characters', 'error'), false;
      if (form.password !== form.confirmPassword) return Swal.fire('Error', 'Passwords do not match', 'error'), false;
    }
    if (step === 2) {
      if (!form.category) return Swal.fire('Error', 'Please select a business category', 'error'), false;
      
      const cleanPhone = form.contactNumber.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        return Swal.fire('Error', 'Please enter a valid Pakistani WhatsApp number (e.g. 03357765489)', 'error'), false;
      }
    }
    if (step === 3) {
      if (!form.city.trim() || !form.address.trim()) return Swal.fire('Error', 'City and warehouse address are required', 'error'), false;
    }
    return true;
  };

  const goNext = () => { if (validate()) { setDirection('forward'); setStep(s => s + 1); } };
  const goBack = () => { setDirection('backward'); setStep(s => s - 1); };

  const handlePic = e => {
    const file = e.target.files[0];
    if (file) { updateField('profilePic', file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  // --- 🟢 FORM SUBMIT: TRIGGERS DUAL OTP DISPATCH ---
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { 
        if (v !== null && k !== 'confirmPassword') formData.append(k, v); 
      });

      const res = await authService.register(formData);
      
      // Check if WhatsApp exists from response
      setHasWhatsApp(res.hasWhatsApp ?? true);
      setShowOTP(true); 

    } catch (err) {
      Swal.fire('Registration Error', err.response?.data?.message || 'Registration failed. Please check your data.', 'error');
    } finally { 
      setLoading(false); 
    }
  };

  // --- OTP INPUT HANDLERS ---
  const handleOTPChange = (type, idx, val) => {
    if (!/^\d?$/.test(val)) return;
    if (type === 'email') {
      const next = [...emailOtpValues]; next[idx] = val; setEmailOtpValues(next);
      if (val && idx < 5) emailOtpRefs.current[idx + 1].current?.focus();
    } else {
      const next = [...whatsappOtpValues]; next[idx] = val; setWhatsappOtpValues(next);
      if (val && idx < 5) whatsappOtpRefs.current[idx + 1].current?.focus();
    }
  };

  const handleOTPKey = (type, idx, e) => {
    if (e.key === 'Backspace') {
      if (type === 'email' && !emailOtpValues[idx] && idx > 0) {
        emailOtpRefs.current[idx - 1].current?.focus();
      } else if (type === 'whatsapp' && !whatsappOtpValues[idx] && idx > 0) {
        whatsappOtpRefs.current[idx - 1].current?.focus();
      }
    }
  };
  
  // --- 🟢 VERIFY DUAL OTP CODES ---
  const verifyOTP = async () => {
    const emailCode = emailOtpValues.join('');
    const whatsappCode = whatsappOtpValues.join('');

    if (emailCode.length !== 6) {
      return Swal.fire('Warning', 'Please enter the complete 6-digit Email verification code.', 'warning');
    }

    if (hasWhatsApp && whatsappCode.length !== 6) {
      return Swal.fire('Warning', 'Please enter the complete 6-digit WhatsApp verification code.', 'warning');
    }

    setLoading(true);
    try {
      await authService.verifyEmail(form.email, emailCode, hasWhatsApp ? whatsappCode : null);
      
      Swal.fire({
        icon: 'success', 
        title: 'Account Verified! 🎉',
        text: 'Your email and phone have been verified successfully. Redirecting to login...',
        timer: 2200, 
        showConfirmButton: false
      });
      setTimeout(() => navigate('/login'), 2200);

    } catch (err) {
      Swal.fire('Verification Failed', err.response?.data?.message || 'Incorrect verification code. Please try again.', 'error');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="register-wrapper">
      {/* 🟦 LEFT DESKTOP PANEL */}
      <div className="register-left">
        <h1 className="panel-title">Join SJ10 Seller Center</h1>
        <p className="panel-subtitle">Create your verified wholesale shop in minutes and start receiving bulk orders nationwide.</p>
        
        <div className="feature-item">
          <div className="feature-icon"><FaStore /></div>
          <div className="feature-text">
            <h3>Set up your Digital Shop</h3>
            <p>Customize your catalog and list products with zero upfront investment.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><FaShoppingBag /></div>
          <div className="feature-text">
            <h3>Automated Order Processing</h3>
            <p>1-Click courier tracking with TCS, PostEx, Leopards, and Trax.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><FaChartLine /></div>
          <div className="feature-text">
            <h3>Scale with 100,000+ Resellers</h3>
            <p>Our dropshippers market your catalog on TikTok & WhatsApp 24/7.</p>
          </div>
        </div>
      </div>

      {/* ⬜ RIGHT FORM PANEL */}
      <div className="register-right">
        <div className="register-card">
          {!showOTP && (
            <>
              <div className="brand-label">SJ10 Marketplace</div>
              <h1 className="reg-title">Register as a Supplier</h1>
              <p className="reg-subtitle">Follow the steps below to configure your seller profile.</p>
              
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
              
              {/* STEP 1: ACCOUNT CREDENTIALS */}
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  custom={direction} 
                  variants={stepVariants} 
                  initial={direction === 'forward' ? "enterForward" : "enterBackward"} 
                  animate="center" 
                  exit={direction === 'forward' ? "exitForward" : "exitBackward"} 
                  transition={{duration: 0.3}}
                >
                  <button type="button" className="social-btn" onClick={() => handleGoogleClick()} disabled={loading}>
                    <FaGoogle color="#DB4437" size={20} /> Continue with Google
                  </button>
                  
                  <div className="or-divider">Or register with email</div>

                  <div className="input-group">
                    <label>Full Name <span className="required-star">*</span></label>
                    <div className="input-icon-wrap">
                      <FaUser className="input-icon" />
                      <input className="reg-input" name="fullName" value={form.fullName} onChange={handleInput} placeholder="e.g. Ahmed Raza" required />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Email Address <span className="required-star">*</span></label>
                    <div className="input-icon-wrap">
                      <FaEnvelope className="input-icon" />
                      <input className="reg-input" type="email" name="email" value={form.email} onChange={handleInput} placeholder="e.g. seller@yourstore.com" required />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Password <span className="required-star">*</span></label>
                    <div className="input-icon-wrap pw-wrap">
                      <FaLock className="input-icon" />
                      <input className="reg-input" type={showPW ? 'text' : 'password'} name="password" value={form.password} onChange={handleInput} placeholder="Min. 6 characters" required />
                      <span className="pw-toggle" onClick={() => setShowPW(!showPW)}>{showPW ? <FaEyeSlash /> : <FaEye />}</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Confirm Password <span className="required-star">*</span></label>
                    <div className="input-icon-wrap pw-wrap">
                      <FaLock className="input-icon" />
                      <input className="reg-input" type={showConfirmPW ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleInput} placeholder="Re-enter password" required />
                      <span className="pw-toggle" onClick={() => setShowConfirmPW(!showConfirmPW)}>{showConfirmPW ? <FaEyeSlash /> : <FaEye />}</span>
                    </div>
                  </div>

                  <button className="btn-primary" onClick={goNext} style={{ marginTop: '10px' }}>Continue Setup</button>
                  <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280'}}>
                    Already a seller? <Link to="/login" style={{color: '#2563eb', fontWeight: 600}}>Sign in</Link>
                  </p>
                </motion.div>
              )}

              {/* STEP 2: BUSINESS & WHATSAPP NUMBER */}
              {step === 2 && (
                <motion.div 
                  key="step2" 
                  variants={stepVariants} 
                  initial={direction === 'forward' ? "enterForward" : "enterBackward"} 
                  animate="center" 
                  exit={direction === 'forward' ? "exitForward" : "exitBackward"} 
                  transition={{duration: 0.3}}
                >
                  <div className="input-group">
                    <label>Business Type</label>
                    <select className="reg-input" style={{paddingLeft: '16px'}} name="businessType" value={form.businessType} onChange={handleInput}>
                      {BUSINESS_TYPES.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Main Category <span className="required-star">*</span></label>
                    <select className="reg-input" style={{paddingLeft: '16px'}} name="category" value={form.category} onChange={handleInput}>
                      <option value="">Select Category</option>
                      {CATEGORIES.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* 🟢 WHATSAPP / CONTACT NUMBER INPUT */}
                  <div className="input-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaWhatsapp color="#16a34a" size={16} />
                      <span>WhatsApp Number <span className="required-star">*</span></span>
                      <small style={{ color: '#6b7280', fontWeight: 500 }}>(For Order Alerts & OTP)</small>
                    </label>
                    <div className="input-icon-wrap">
                      <FaWhatsapp className="input-icon" style={{ color: '#16a34a' }} />
                      <input 
                        className="reg-input" 
                        name="contactNumber" 
                        value={form.contactNumber} 
                        onChange={handleInput} 
                        placeholder="03XXXXXXXXX" 
                        type="tel"
                        style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '15px' }}
                        required 
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                      ℹ️ Hum is number par aapko verification code aur live order updates bhejenge.
                    </span>
                  </div>

                  <div className="btn-row">
                    <button className="btn-secondary" onClick={goBack}>Back</button>
                    <button className="btn-primary" onClick={goNext}>Next</button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: LOCATION & DETAILS */}
              {step === 3 && (
                <motion.div 
                  key="step3" 
                  variants={stepVariants} 
                  initial={direction === 'forward' ? "enterForward" : "enterBackward"} 
                  animate="center" 
                  exit={direction === 'forward' ? "exitForward" : "exitBackward"} 
                  transition={{duration: 0.3}}
                >
                  <div className="two-col">
                    <div className="input-group">
                      <label>Gender</label>
                      <select className="reg-input" style={{paddingLeft: '16px'}} name="gender" value={form.gender} onChange={handleInput}>
                        {GENDERS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Age <small style={{ color: '#9ca3af' }}>(Optional)</small></label>
                      <input className="reg-input" style={{paddingLeft:'16px'}} name="age" type="number" value={form.age} onChange={handleInput} placeholder="e.g. 28" />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>City <span className="required-star">*</span></label>
                    <div className="input-icon-wrap">
                      <FaCity className="input-icon" />
                      <input className="reg-input" name="city" value={form.city} onChange={handleInput} placeholder="Lahore, Karachi, Rawalpindi..." required />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Shop / Warehouse Address <span className="required-star">*</span></label>
                    <div className="input-icon-wrap">
                      <FaMapMarkerAlt className="input-icon" />
                      <input className="reg-input" name="address" value={form.address} onChange={handleInput} placeholder="Street, Sector, Shop/Plot No..." required />
                    </div>
                  </div>

                  <div className="btn-row">
                    <button className="btn-secondary" onClick={goBack}>Back</button>
                    <button className="btn-primary" onClick={goNext}>Next</button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: LOGO & SIGNUP SUBMIT */}
              {step === 4 && (
                <motion.div 
                  key="step4" 
                  variants={stepVariants} 
                  initial={direction === 'forward' ? "enterForward" : "enterBackward"} 
                  animate="center" 
                  exit={direction === 'forward' ? "exitForward" : "exitBackward"} 
                  transition={{duration: 0.3}}
                >
                  <div className="avatar-wrap">
                    <div className="avatar-ring" onClick={() => document.getElementById('picInput').click()}>
                      {previewUrl ? <img src={previewUrl} alt="Profile" /> : <FaCamera />}
                    </div>
                    <input id="picInput" type="file" accept="image/*" hidden onChange={handlePic} />
                    <p style={{marginTop: '10px', fontSize: '14px', color: '#6b7280', fontWeight: 500}}>
                      Upload shop logo / profile pic <span style={{ color: '#9ca3af' }}>(Optional)</span>
                    </p>
                  </div>

                  <div className="btn-row">
                    <button className="btn-secondary" onClick={goBack}>Back</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Sending OTP Codes...' : 'Complete Sign-up'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            
            /* ─── 🟢 DUAL SECURITY OTP VERIFICATION SCREEN ─── */
            <motion.div className="otp-container" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="otp-shield-icon-wrapper">
                  <FaShieldAlt className="otp-icon" />
              </div>
              <h2 className="reg-title">Security Verification</h2>
              <p className="reg-subtitle">
                {hasWhatsApp 
                  ? "Enter the 6-digit codes sent to your Email & WhatsApp." 
                  : "We sent a 6-digit verification code to your Email."}
              </p>

              {/* ⚠️ Notice if WhatsApp was not found */}
              {!hasWhatsApp && (
                <div className="otp-no-whatsapp-banner">
                  <FaExclamationTriangle size={18} color="#d97706" style={{ flexShrink: 0 }} />
                  <span>WhatsApp was not detected on <strong>{form.contactNumber}</strong>. Please verify using your Email code only.</span>
                </div>
              )}

              {/* 1. EMAIL OTP SECTION */}
              <div className="otp-section-card">
                <div className="otp-section-header">
                  <FaEnvelope color="#2563eb" />
                  <span>Email Verification Code <small>({form.email})</small></span>
                </div>
                <div className="otp-fields">
                  {emailOtpValues.map((val, idx) => (
                    <input
                      key={idx} 
                      ref={emailOtpRefs.current[idx]}
                      className="otp-digit" 
                      maxLength={1} 
                      inputMode="numeric" 
                      value={val}
                      onChange={e => handleOTPChange('email', idx, e.target.value)}
                      onKeyDown={e => handleOTPKey('email', idx, e)}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>

              {/* 2. WHATSAPP OTP SECTION (ONLY IF WHATSAPP FOUND) */}
              {hasWhatsApp && (
                <div className="otp-section-card">
                  <div className="otp-section-header">
                    <FaWhatsapp color="#16a34a" size={16} />
                    <span>WhatsApp Verification Code <small>({form.contactNumber})</small></span>
                  </div>
                  <div className="otp-fields">
                    {whatsappOtpValues.map((val, idx) => (
                      <input
                        key={idx} 
                        ref={whatsappOtpRefs.current[idx]}
                        className="otp-digit" 
                        maxLength={1} 
                        inputMode="numeric" 
                        value={val}
                        onChange={e => handleOTPChange('whatsapp', idx, e.target.value)}
                        onKeyDown={e => handleOTPKey('whatsapp', idx, e)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <button className="btn-primary" onClick={verifyOTP} disabled={loading} style={{ marginTop: '20px' }}>
                {loading ? 'Verifying Codes...' : 'Verify & Finish Registration'}
              </button>

              <p style={{ marginTop: '15px', fontSize: '13px', color: '#64748b' }}>
                Entered wrong details? <span style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 600 }} onClick={() => setShowOTP(false)}>Change Info</span>
              </p>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}