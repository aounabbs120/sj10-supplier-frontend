import React, { useState } from 'react'; // ✅ CORRECTED THIS LINE
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Swal from 'sweetalert2';
import authService from '../services/authService';
import { 
  FaUser, FaEnvelope, FaLock, FaStore, FaEye, FaEyeSlash, 
  FaCheckCircle, FaMapMarkerAlt, FaShoppingBag, FaShippingFast, FaShieldAlt
} from 'react-icons/fa';

export default function Register() {
  const navigate = useNavigate();

  // ✅ CORRECTED all instances of 'aoun.useState' to just 'useState'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    brandName: '',
    city: '',
    address: ''
  });
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateAndSubmit = async (e) => {
    e.preventDefault();

    // --- Client-Side Validation ---
    if (formData.password !== confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Passwords do not match.' });
      return;
    }
    if (formData.password.length < 6) {
      Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Password must be at least 6 characters long.' });
      return;
    }
    const forbidden = ['sj10', 'sj10 official', 'admin'];
    if (forbidden.some(name => formData.brandName.toLowerCase().includes(name))) {
      Swal.fire({ icon: 'error', title: 'Reserved Name', text: 'This brand name is reserved. Please choose another.' });
      return;
    }

    setLoading(true);
    try {
      await authService.register({
          ...formData,
          contactNumber: `+${phone}`
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Registration Submitted!',
        text: 'Please check your email to verify your account. Your application is now under review.',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#2563eb',
        allowOutsideClick: false
      }).then(() => navigate('/login'));

    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      Swal.fire({ icon: 'error', title: 'Registration Failed', text: msg });
    } finally {
      setLoading(false);
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
  };

  // --- STYLES ---
  const styles = {
    container: { 
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', 
      background: 'radial-gradient(at 0% 100%, hsla(213,94%,88%,1) 0, transparent 50%), radial-gradient(at 100% 100%, hsla(27,100%,92%,1) 0, transparent 50%), #ffffff',
      fontFamily: "'Poppins', sans-serif", padding: '40px 20px'
    },
    header: { textAlign: 'center', marginBottom: '30px', zIndex: 2 },
    iconsContainer: { display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '15px' },
    heroTitle: {
      fontSize: '2.5rem', fontWeight: '800', margin: '0 0 5px 0',
      background: 'linear-gradient(to right, #1e3a8a, #ea580c)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
    },
    card: { 
      backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(15px)',
      padding: '40px', borderRadius: '32px', 
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', 
      width: '100%', maxWidth: '480px', textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.6)', zIndex: 10
    },
    title: { fontSize: '1.8rem', fontWeight: '700', color: '#111827', marginBottom: '5px' },
    subtitle: { fontSize: '1rem', color: '#6b7280', marginBottom: '25px' },
    inputGroup: { position: 'relative', marginBottom: '18px' },
    inputIcon: { position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', color: '#9ca3af' },
    eyeIcon: { position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', color: '#9ca3af', cursor: 'pointer' },
    input: { 
      width: '100%', padding: '15px 50px', borderRadius: '16px', border: '2px solid #e5e7eb', 
      fontSize: '1rem', outline: 'none', backgroundColor: '#f9fafb', boxSizing: 'border-box', 
      transition: 'all 0.2s ease', color: '#1f2937'
    },
    button: { 
      width: '100%', padding: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none', 
      borderRadius: '16px', fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer', marginTop: '10px', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', 
      transition: 'all 0.2s ease', boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.3)'
    },
    footerText: { marginTop: '25px', color: '#6b7280', fontSize: '0.9rem' },
    link: { color: '#2563eb', fontWeight: 700, textDecoration: 'none' },
    spinner: { width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  };

  return (
    <>
      <style>{`
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .float-anim-1 { animation: float 6s ease-in-out infinite; }
        .float-anim-2 { animation: float 6s ease-in-out infinite 2s; }
        .float-anim-3 { animation: float 6s ease-in-out infinite 4s; }
        .input-focus:focus { border-color: #2563eb !important; background-color: #fff !important; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        .button-hover:hover:not(:disabled) { background-color: #1d4ed8; transform: translateY(-2px); box-shadow: 0 12px 25px -5px rgba(37, 99, 235, 0.4); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={styles.container}>
        
        <div style={styles.header}>
            <div style={styles.iconsContainer}>
                <FaShoppingBag size={32} color="#f97316" className="float-anim-1" />
                <FaShieldAlt size={32} color="#2563eb" className="float-anim-2" />
                <FaShippingFast size={32} color="#10b981" className="float-anim-3" />
            </div>
            <h1 style={styles.heroTitle}>Become a Supplier</h1>
            <p style={{color: '#64748b'}}>Join Pakistan's Fastest Growing B2B Platform.</p>
        </div>

        <motion.div 
          style={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div style={{marginBottom: '25px'}}>
            <h1 style={styles.title}>Create Your Account</h1>
            <p style={styles.subtitle}>Fill in the details to get started.</p>
          </div>
          
          <motion.form 
            onSubmit={validateAndSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div style={styles.inputGroup} variants={itemVariants}>
              <FaUser style={styles.inputIcon} />
              <input name="fullName" placeholder="Full Name" style={styles.input} className="input-focus" value={formData.fullName} onChange={handleChange} required />
            </motion.div>

            <motion.div style={styles.inputGroup} variants={itemVariants}>
              <FaEnvelope style={styles.inputIcon} />
              <input name="email" type="email" placeholder="Email Address" style={styles.input} className="input-focus" value={formData.email} onChange={handleChange} required />
            </motion.div>
            
            <motion.div variants={itemVariants} style={{marginBottom: '18px'}}>
                <PhoneInput 
                    country={'pk'} 
                    value={phone} 
                    onChange={setPhone} 
                    inputStyle={{...styles.input, paddingLeft: '58px', width: '100%', height: '54px'}} 
                    placeholder="Enter phone number"
                    inputProps={{ required: true }}
                />
            </motion.div>

            <motion.div style={styles.inputGroup} variants={itemVariants}>
              <FaLock style={styles.inputIcon} />
              <input name="password" type={showPass ? 'text' : 'password'} placeholder="Password (min. 6 characters)" style={styles.input} className="input-focus" value={formData.password} onChange={handleChange} required />
              <div style={styles.eyeIcon} onClick={() => setShowPass(!showPass)}>{showPass ? <FaEyeSlash /> : <FaEye />}</div>
            </motion.div>

            <motion.div style={styles.inputGroup} variants={itemVariants}>
              <FaLock style={styles.inputIcon} />
              <input type={showConfirmPass ? 'text' : 'password'} placeholder="Confirm Password" style={styles.input} className="input-focus" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
               <div style={styles.eyeIcon} onClick={() => setShowConfirmPass(!showConfirmPass)}>{showConfirmPass ? <FaEyeSlash /> : <FaEye />}</div>
            </motion.div>
            
            <motion.div style={styles.inputGroup} variants={itemVariants}>
              <FaStore style={styles.inputIcon} />
              <input name="brandName" placeholder="Brand / Shop Name" style={styles.input} className="input-focus" value={formData.brandName} onChange={handleChange} required />
            </motion.div>

            <motion.div style={styles.inputGroup} variants={itemVariants}>
              <FaMapMarkerAlt style={styles.inputIcon} />
              <input name="city" placeholder="City" style={styles.input} className="input-focus" value={formData.city} onChange={handleChange} required />
            </motion.div>
            
            <motion.button 
              type="submit" 
              style={styles.button} 
              className="button-hover" 
              disabled={loading}
              variants={itemVariants}
            >
              {loading ? (
                <div style={styles.spinner}></div>
              ) : (
                <>
                  <FaCheckCircle />
                  <span>Submit Application</span>
                </>
              )}
            </motion.button>
          </motion.form>
          
          <p style={styles.footerText}>
             Already have an account? <Link to="/login" style={styles.link}>Login Here</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}