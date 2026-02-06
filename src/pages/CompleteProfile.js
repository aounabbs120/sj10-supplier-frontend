import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { 
  FaStore, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaBuilding, 
  FaBoxOpen, 
  FaExclamationTriangle 
} from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  
  const [formData, setFormData] = useState({
    brandName: '',
    city: '',
    address: '',
    businessType: 'Retailer' // Default
  });

  const tempToken = localStorage.getItem('tempAuthToken');

  useEffect(() => {
    // Security Check: If no temp token, kick them out
    if (!tempToken) {
        navigate('/login');
    }
  }, [navigate, tempToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (error) setError('');
  };

  const handleBusinessType = (type) => {
    setFormData({ ...formData, businessType: type });
  };

  const validateForm = () => {
    const brand = formData.brandName.toLowerCase();
    const forbidden = ['sj10', 'sj10 official', 'admin', 'moderator'];

    // 1. Check Brand Name
    if (forbidden.some(word => brand.includes(word))) {
        setError('⚠️ "SJ10" and "Admin" are reserved brand names. Please choose another.');
        return false;
    }

    // 2. Check Empty Fields
    if (!formData.brandName || !formData.city || !formData.address || !phone) {
        setError('Please fill in all required fields.');
        return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await axios.post(
          `${API_BASE_URL}/auth/complete-profile`, 
          { 
              ...formData, 
              contactNumber: `+${phone}` 
          }, 
          { headers: { 'Authorization': `Bearer ${tempToken}` } }
      );
      
      localStorage.removeItem('tempAuthToken');

      // ✅ SUCCESS!
      Swal.fire({
          icon: 'success',
          title: 'Setup Complete! 🎉',
          text: 'Your account is now pending approval. Please log in to track your status.',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#2563eb',
          backdrop: `rgba(0,0,0,0.4) left top no-repeat`,
          allowOutsideClick: false
      }).then(() => {
          navigate('/login');
      });

    } catch (err) {
      // ✅ HANDLE SPECIFIC ERRORS (Phone duplicate, etc)
      const msg = err.response?.data?.message || "Something went wrong.";
      
      if (msg.toLowerCase().includes('phone') || msg.toLowerCase().includes('already in use')) {
          setError(`⛔ The phone number (+${phone}) is already registered with another shop.`);
      } else {
          setError(`⚠️ ${msg}`);
      }
      
      // Shake animation effect for error
      const form = document.getElementById('profile-form');
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      
    } finally {
      setLoading(false);
    }
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  // --- STYLES ---
  const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%)',
        padding: '20px',
        fontFamily: "'Poppins', sans-serif"
    },
    card: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '550px',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
    },
    header: { textAlign: 'center', marginBottom: '30px' },
    title: { fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '5px' },
    subtitle: { color: '#64748b', fontSize: '0.95rem' },
    inputGroup: { position: 'relative', marginBottom: '20px' },
    inputIcon: { 
        position: 'absolute', top: '50%', left: '18px', transform: 'translateY(-50%)', 
        color: '#94a3b8', fontSize: '18px', zIndex: 10 
    },
    input: {
        width: '100%', padding: '16px 16px 16px 50px', borderRadius: '14px',
        border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none',
        transition: 'all 0.3s ease', backgroundColor: '#f8fafc', color: '#334155',
        boxSizing: 'border-box'
    },
    radioGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' },
    radioCard: (active) => ({
        padding: '15px', borderRadius: '12px', border: active ? '2px solid #2563eb' : '2px solid #e2e8f0',
        backgroundColor: active ? '#eff6ff' : '#fff', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        color: active ? '#1d4ed8' : '#64748b', transition: 'all 0.2s', fontWeight: '600'
    }),
    button: {
        width: '100%', padding: '18px', background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
        color: 'white', border: 'none', borderRadius: '14px', fontSize: '1.1rem',
        fontWeight: '600', cursor: 'pointer', marginTop: '10px',
        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)', transition: 'transform 0.2s'
    },
    errorBox: {
        backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c',
        padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem',
        display: 'flex', alignItems: 'center', gap: '10px'
    }
  };

  return (
    <div style={styles.container}>
        <style>{`
            .custom-input:focus { border-color: #2563eb !important; background: #fff !important; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
            .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
            @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        `}</style>

        <motion.div 
            style={styles.card}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            id="profile-form"
        >
            <div style={styles.header}>
                <motion.div variants={itemVariants}>
                    <h1 style={styles.title}>Finish Setting Up</h1>
                    <p style={styles.subtitle}>Complete your profile to start selling on SJ10.</p>
                </motion.div>
            </div>

            {error && (
                <motion.div style={styles.errorBox} initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}}>
                    <FaExclamationTriangle />
                    <span>{error}</span>
                </motion.div>
            )}

            <form onSubmit={handleSubmit}>
                
                {/* Brand Name */}
                <motion.div style={styles.inputGroup} variants={itemVariants}>
                    <FaStore style={styles.inputIcon} />
                    <input 
                        name="brandName" 
                        placeholder="Brand / Shop Name" 
                        style={styles.input} 
                        className="custom-input"
                        value={formData.brandName} 
                        onChange={handleChange} 
                    />
                </motion.div>

                {/* Business Type Selector */}
                <motion.div style={styles.radioGrid} variants={itemVariants}>
                    <div style={styles.radioCard(formData.businessType === 'Retailer')} onClick={() => handleBusinessType('Retailer')}>
                        <FaStore size={24} />
                        <span>Retailer</span>
                    </div>
                    <div style={styles.radioCard(formData.businessType === 'Wholesaler')} onClick={() => handleBusinessType('Wholesaler')}>
                        <FaBuilding size={24} />
                        <span>Wholesaler</span>
                    </div>
                </motion.div>

                {/* Phone Number */}
                <motion.div variants={itemVariants} style={{marginBottom: '20px'}}>
                    <PhoneInput 
                        country={'pk'} 
                        value={phone} 
                        onChange={setPhone} 
                        containerStyle={{ width: '100%' }}
                        inputStyle={{
                            width: '100%', height: '54px', paddingLeft: '50px',
                            borderRadius: '14px', border: '2px solid #e2e8f0',
                            backgroundColor: '#f8fafc', fontSize: '1rem', color: '#334155'
                        }}
                        buttonStyle={{ borderRadius: '14px 0 0 14px', border: '2px solid #e2e8f0', borderRight: 'none', backgroundColor: '#e2e8f0' }}
                        placeholder="Enter Phone Number"
                    />
                </motion.div>

                {/* City */}
                <motion.div style={styles.inputGroup} variants={itemVariants}>
                    <FaMapMarkerAlt style={styles.inputIcon} />
                    <input 
                        name="city" 
                        placeholder="City" 
                        style={styles.input} 
                        className="custom-input"
                        value={formData.city} 
                        onChange={handleChange} 
                    />
                </motion.div>

                {/* Address */}
                <motion.div style={styles.inputGroup} variants={itemVariants}>
                    <FaBoxOpen style={styles.inputIcon} />
                    <input 
                        name="address" 
                        placeholder="Full Business Address" 
                        style={styles.input} 
                        className="custom-input"
                        value={formData.address} 
                        onChange={handleChange} 
                    />
                </motion.div>

                <motion.button 
                    type="submit" 
                    style={styles.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                >
                    {loading ? 'Saving Details...' : 'Complete Registration'}
                </motion.button>

            </form>
        </motion.div>
    </div>
  );
}