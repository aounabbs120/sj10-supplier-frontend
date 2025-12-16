// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import * as THREE from 'three';
import Waves from 'vanta/dist/vanta.waves.min';

// --- Page and Component Imports ---
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tools from './pages/Tools';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import AccountPage from './pages/AccountPage';
import AccountSettingsPage from './components/AccountSettingsPage';
import SJ10University from './pages/SJ10University';
import VideoPlayer from './pages/VideoPlayer';
import Loader from './components/Loader';
import Orders from './pages/Orders';
import Promotions from './pages/Promotions';
import Reviews from './pages/Reviews';
import PromotionDetail from './pages/PromotionDetail';
import Feedback from './pages/Feedback';
import ShippingPolicy from './pages/ShippingPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import VerificationCenter from './pages/VerificationCenter';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword'; // Make sure you have this page created!

// Layout and Security Components
import MainLayout from './layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Global CSS
import './App.css';

// VantaBackground component
const VantaBackground = () => {
    const vantaRef = React.useRef(null);
    React.useEffect(() => {
        let effect = Waves({ el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true, gyroControls: false, minHeight: 200.00, minWidth: 200.00, scale: 1.00, scaleMobile: 1.00, color: 0x3f3d70 });
        return () => {
            if (effect) effect.destroy();
        };
    }, []);
    return <div ref={vantaRef} className="vanta-background"></div>;
};

// The main root component
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AppLayout isLoading={isLoading} setIsLoading={setIsLoading} />
    </Router>
  );
}

// The layout and router component
const AppLayout = ({ isLoading, setIsLoading }) => {
    const location = useLocation();

    // 1. UPDATE: We verify if the current page is an "Auth Page" (Public)
    // This ensures Forgot Password gets the cool background too.
    const isAuthPage = [
        '/login', 
        '/register', 
        '/forgot-password', 
        '/verify-email'
    ].includes(location.pathname) || location.pathname.startsWith('/reset-password');

    return (
        <>
            {isLoading && (
              <div className="loader-overlay">
                <Loader />
              </div>
            )}

            {/* Show background only on auth pages */}
            {isAuthPage && <VantaBackground />}
            
            <div className={isAuthPage ? "auth-content-wrapper" : "main-content-wrapper"}>
                <Routes>
                    {/* --- PUBLIC ROUTES (No Login Required) --- */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* 👇 THESE ROUTES ARE NOW PUBLIC 👇 */}
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/reset-password" element={<ResetPassword />} /> 

                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* --- PROTECTED ROUTES (Login Required) --- */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/dashboard" element={<Dashboard setIsLoading={setIsLoading} />} />
                            <Route path="/tools" element={<Tools setIsLoading={setIsLoading} />} />
                            
                            <Route path="/reviews" element={<Reviews setIsLoading={setIsLoading} />} />
                            <Route path="/promotions" element={<Promotions setIsLoading={setIsLoading} />} />
                            <Route path="/promotions/:promotionId" element={<PromotionDetail setIsLoading={setIsLoading} />} />
                            
                            <Route path="/products" element={<ProductList setIsLoading={setIsLoading} />} />
                            <Route path="/products/add" element={<ProductForm setIsLoading={setIsLoading} />} />
                            <Route path="/products/edit/:productId" element={<ProductForm setIsLoading={setIsLoading} />} />
                            
                            <Route path="/orders" element={<Orders setIsLoading={setIsLoading} />} />
                            
                            <Route path="/account" element={<AccountPage />} />
                            <Route path="/account-settings" element={<AccountSettingsPage />} />
                            <Route path="/feedback" element={<Feedback setIsLoading={setIsLoading} />} />
                            <Route path="/shipping-policy" element={<ShippingPolicy setIsLoading={setIsLoading} />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy setIsLoading={setIsLoading} />} />
                            <Route path="/about-us" element={<AboutUs setIsLoading={setIsLoading} />} />
                            
                            <Route path="/verification-center" element={<VerificationCenter setIsLoading={setIsLoading} />} />

                            <Route path="/sj10-university" element={<SJ10University setIsLoading={setIsLoading} />} />
                            <Route path="/sj10-university/:videoId" element={<VideoPlayer setIsLoading={setIsLoading} />} />
                        </Route>
                    </Route>
                </Routes>
            </div>
        </>
    );
};

export default App;