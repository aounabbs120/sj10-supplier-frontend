// src/pages/CompleteProfile.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import authService from '../services/authService';

// Icons
import { FaPhone, FaCity, FaMapMarkerAlt, FaStore, FaWhatsapp, FaShieldAlt } from 'react-icons/fa';
import './Register.css';

const CATEGORIES = ["Women's Fashion", "Men's Fashion", "Electronics", "Home Decor", "Watches", "Jewelry", "Health & Beauty", "Automotive", "Sports", "Groceries", "Furniture"];
const BUSINESS_TYPES = ["Wholesaler", "Retailer", "Shop"];
const STOCK_RANGES = ["1 – 100", "100 – 200", "200 – 500", "500 – 1000", "10,000+"];
const GENDERS = ["Man", "Woman", "Not Specified"];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // View state: 'form' | 'phone_otp'
  const [viewState, setViewState] = useState('form');
  const [phoneOtpValues, setPhoneOtpValues] = useState(Array(6).fill(''));
  const phoneOtpRefs = useRef(Array(6).fill(null).map(() => React.createRef()));

  const [form, setForm] = useState({
    businessType: 'Retailer', stockRange: '1 – 100', category: '',
    contactNumber: '', gender: 'Not Specified', age: '', city: '', address: '', brandName: ''
  });

  useEffect(() => {
    if (!localStorage.getItem('tempAuthToken')) navigate('/login');
  }, [navigate]);

  const updateField = (field, val) => setForm(prev => ({ ...prev, [field]: val }));
  const handleInput = e => updateField(e.target.name, e.target.value);

  const validate = () => {
    if (!form.brandName?.trim()) return Swal.fire('Error', 'Brand Name is required', 'error'), false;
    if (!form.category) return Swal.fire('Error', 'Please select a business category', 'error'), false;
    if (!form.contactNumber.trim()) return Swal.fire('Error', 'Contact number is required', 'error'), false;
    if (!form.city.trim() || !form.address.trim()) return Swal.fire('Error', 'Full address is required', 'error'), false;
    return true;
  };

  // 1. Submit Profile Form
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await authService.completeProfile(form);

      // 🟢 If Backend detected WhatsApp, switch to OTP view
      if (res.action === 'verify_phone_otp') {
        setLoading(false);
        setViewState('phone_otp');
        Swal.fire({
          icon: 'info',
          title: 'WhatsApp Code Sent!',
          text: `We sent a 6-digit verification code to your WhatsApp (${res.contactNumber}).`,
          confirmButtonColor: '#2563eb'
        });
        return;
      }

      // If no WhatsApp (direct approval)
      localStorage.removeItem('tempAuthToken');
      Swal.fire({
        icon: 'success',
        title: 'Profile Completed!',
        text: 'Your shop setup is complete. Please log in to access your dashboard.',
        confirmButtonColor: '#2563eb'
      }).then(() => navigate('/login'));

    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to save profile.', 'error');
      setLoading(false);
    }
  };

  // 2. OTP Change Handlers
  const handleOTPChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...phoneOtpValues]; next[idx] = val; setPhoneOtpValues(next);
    if (val && idx < 5) phoneOtpRefs.current[idx + 1].current?.focus();
  };

  const handleOTPKey = (idx, e) => {
    if (e.key === 'Backspace' && !phoneOtpValues[idx] && idx > 0) {
      phoneOtpRefs.current[idx - 1].current?.focus();
    }
  };

  // 3. Verify Phone OTP
  const handleVerifyPhoneOtp = async () => {
    const code = phoneOtpValues.join('');
    if (code.length !== 6) return Swal.fire('Warning', 'Please enter all 6 digits.', 'warning');

    setLoading(true);
    try {
      await authService.verifyPhoneOtp(code);
      localStorage.removeItem('tempAuthToken');

      Swal.fire({
        icon: 'success',
        title: 'Phone Verified & Profile Complete! 🎉',
        text: 'Redirecting to your dashboard...',
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Incorrect verification code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper" style={{ justifyContent: 'center' }}>
      <div className="register-right" style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'center' }}>
        
        <motion.div className="register-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          
          {viewState === 'form' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div className="avatar-ring" style={{ width: 80, height: 80, border: 'none', background: '#eff6ff' }}>
                  <FaStore size={35} color="#2563eb" />
                </div>
              </div>

              <div className="brand-label">SJ10 Seller Center</div>
              <h1 className="reg-title">Finish Your Setup</h1>
              <p className="reg-subtitle">Provide your shop & WhatsApp details to get started.</p>

              <form onSubmit={handleSubmit} noValidate>
                
                <div className="input-group">
                  <label>Brand Name <span className="required-star">*</span></label>
                  <input className="reg-input" style={{paddingLeft: '16px'}} name="brandName" value={form.brandName} onChange={handleInput} placeholder="e.g. Lahore Cloth Store" />
                </div>

                <div className="input-group">
                  <label>Business Type</label>
                  <select className="reg-input" style={{paddingLeft: '16px'}} name="businessType" value={form.businessType} onChange={handleInput}>
                    {BUSINESS_TYPES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                <div className="input-group">
                  <label>Business Category <span className="required-star">*</span></label>
                  <select className="reg-input" style={{paddingLeft: '16px'}} name="category" value={form.category} onChange={handleInput}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                <div className="input-group">
                  <label>WhatsApp / Contact Number <span className="required-star">*</span></label>
                  <FaPhone className="input-icon" />
                  <input className="reg-input" name="contactNumber" value={form.contactNumber} onChange={handleInput} placeholder="03XXXXXXXXX" type="tel" />
                </div>

                <div className="two-col">
                  <div className="input-group">
                    <label>Gender</label>
                    <select className="reg-input" style={{paddingLeft: '16px'}} name="gender" value={form.gender} onChange={handleInput}>
                      {GENDERS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Age</label>
                    <input className="reg-input" style={{paddingLeft:'16px'}} name="age" type="number" value={form.age} onChange={handleInput} placeholder="Years" />
                  </div>
                </div>

                <div className="input-group">
                  <label>City <span className="required-star">*</span></label>
                  <FaCity className="input-icon" />
                  <input className="reg-input" name="city" value={form.city} onChange={handleInput} placeholder="Enter your city" />
                </div>

                <div className="input-group">
                  <label>Full Shop Address <span className="required-star">*</span></label>
                  <FaMapMarkerAlt className="input-icon" />
                  <input className="reg-input" name="address" value={form.address} onChange={handleInput} placeholder="Street, Area, Shop No..." />
                </div>

                <button className="btn-primary" type="submit" disabled={loading} style={{marginTop: '20px'}}>
                  {loading ? 'Processing...' : 'Continue & Verify Phone'}
                </button>
                
              </form>
            </>
          ) : (
            /* ─── 🟢 GOOGLE PHONE OTP VERIFICATION SCREEN ─── */
            <div className="otp-container">
              <div className="otp-shield-icon-wrapper" style={{ background: '#f0fdf4' }}>
                  <FaWhatsapp size={35} color="#16a34a" />
              </div>
              <h2 className="reg-title">Verify Your WhatsApp</h2>
              <p className="reg-subtitle">
                Enter the 6-digit code sent to your WhatsApp<br/>
                <strong style={{color: '#111827'}}>{form.contactNumber}</strong>
              </p>

              <div className="otp-section-card">
                <div className="otp-fields">
                  {phoneOtpValues.map((val, idx) => (
                    <input
                      key={idx} ref={phoneOtpRefs.current[idx]}
                      className="otp-digit" maxLength={1} inputMode="numeric" value={val}
                      onChange={e => handleOTPChange(idx, e.target.value)}
                      onKeyDown={e => handleOTPKey(idx, e)}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>

              <button className="btn-primary" onClick={handleVerifyPhoneOtp} disabled={loading} style={{ marginTop: '15px' }}>
                {loading ? 'Verifying...' : 'Verify WhatsApp & Go to Dashboard'}
              </button>

              <p style={{ marginTop: '15px', fontSize: '13px', color: '#64748b' }}>
                Wrong number? <span style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 600 }} onClick={() => setViewState('form')}>Change Number</span>
              </p>
            </div>
          )}

        </motion.div>

      </div>
    </div>
  );
}