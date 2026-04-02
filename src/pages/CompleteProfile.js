// src/pages/CompleteProfile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import authService from '../services/authService';

// Icons
import { FaPhone, FaCity, FaMapMarkerAlt, FaStore } from 'react-icons/fa';
import './Register.css'; // Reusing the identical layout

const CATEGORIES = ["Women's Fashion", "Men's Fashion", "Electronics", "Home Decor", "Watches", "Jewelry", "Health & Beauty", "Automotive", "Sports", "Groceries", "Furniture"];
const BUSINESS_TYPES = ["Wholesaler", "Retailer", "Shop"];
const STOCK_RANGES = ["1 – 100", "100 – 200", "200 – 500", "500 – 1000", "10,000+"];
const GENDERS = ["Man", "Woman", "Not Specified"];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    businessType: 'Retailer', stockRange: '1 – 100', category: '',
    contactNumber: '', gender: 'Not Specified', age: '', city: '', address: '',
  });

  useEffect(() => {
    if (!localStorage.getItem('tempAuthToken')) navigate('/login');
  }, [navigate]);

  const updateField = (field, val) => setForm(prev => ({ ...prev, [field]: val }));
  const handleInput = e => updateField(e.target.name, e.target.value);

  const validate = () => {
    if (!form.category) return Swal.fire('Error', 'Please select a business category', 'error'), false;
    if (!form.contactNumber.trim()) return Swal.fire('Error', 'Contact number is required', 'error'), false;
    if (!form.city.trim() || !form.address.trim()) return Swal.fire('Error', 'Full address is required', 'error'), false;
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authService.completeProfile(form);
      localStorage.removeItem('tempAuthToken');
      
      Swal.fire({
        icon: 'success',
        title: 'Profile Saved!',
        text: 'SJ10 Team will review your shop shortly.',
        confirmButtonColor: '#2563eb'
      }).then(() => navigate('/login'));

    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to save profile.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper" style={{ justifyContent: 'center' }}>
      {/* Centered layout without the left blue panel */}
      <div className="register-right" style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'center' }}>
        
        <motion.div className="register-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
             <div className="avatar-ring" style={{ width: 80, height: 80, border: 'none', background: '#eff6ff' }}>
               <FaStore size={35} color="#2563eb" />
             </div>
          </div>

          <div className="brand-label">SJ10 Seller Center</div>
          <h1 className="reg-title">Finish Your Setup</h1>
          <p className="reg-subtitle">Provide a few final details to get your shop ready.</p>

          <form onSubmit={handleSubmit} noValidate>
            
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
              <input className="reg-input" name="contactNumber" value={form.contactNumber} onChange={handleInput} placeholder="03xx-xxxxxxx" type="tel" />
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
              {loading ? 'Saving Profile...' : 'Finish Setup'}
            </button>
            
          </form>
        </motion.div>

      </div>
    </div>
  );
}