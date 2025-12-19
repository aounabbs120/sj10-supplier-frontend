// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import * as THREE from 'three';
import Waves from 'vanta/dist/vanta.waves.min';
import { AnimatePresence } from 'framer-motion';

// --- SERVICE & COMPONENT IMPORTS ---
import supplierService from './services/supplierService';
import MainLayout from './layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationBanner from './components/NotificationBanner';

// --- PAGE IMPORTS ---
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
import ResetPassword from './pages/ResetPassword';
import InvoicePage from './pages/InvoicePage'; // Import at top
import OrderDetailsPage from './pages/OrderDetailsPage'; // <--- IMPORT THIS

// Global CSS
import './App.css';

const VantaBackground = () => {
    const vantaRef = React.useRef(null);
    React.useEffect(() => {
        let effect = Waves({ el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true, gyroControls: false, minHeight: 200.00, minWidth: 200.00, scale: 1.00, scaleMobile: 1.00, color: 0x3f3d70 });
        return () => { if (effect) effect.destroy(); };
    }, []);
    return <div ref={vantaRef} className="vanta-background"></div>;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Router>
      <AppLayout isLoading={isLoading} setIsLoading={setIsLoading} />
    </Router>
  );
}

// =========================================================================
// === APP LAYOUT - FIXED NOTIFICATION LOGIC ===
// =========================================================================
const AppLayout = ({ isLoading, setIsLoading }) => {
    const location = useLocation();
    const [showNotificationBanner, setShowNotificationBanner] = useState(false);

    // 1. Define strictly what an "Auth Page" is
    const isAuthPage = ['/login', '/register', '/forgot-password', '/verify-email']
        .includes(location.pathname) || location.pathname.startsWith('/reset-password');

    useEffect(() => {
        const token = localStorage.getItem('supplierToken');

        // 2. CRITICAL FIX: If no token OR if we are on an Auth Page, HIDE banner immediately.
        if (!token || isAuthPage) {
            setShowNotificationBanner(false);
            return; 
        }

        // 3. Only proceed if logged in and inside the dashboard area
        const checkNotificationPermission = () => {
            const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
            if (!isSupported) return;

            const hasBeenDismissed = sessionStorage.getItem('notificationBannerDismissed');
            
            // Only show if permission is 'default' (not yet granted or denied) and not dismissed
            if (Notification.permission === 'default' && !hasBeenDismissed) {
                // Small delay for smooth UX
                const timer = setTimeout(() => setShowNotificationBanner(true), 2000);
                return () => clearTimeout(timer);
            }
        };

        checkNotificationPermission();
    }, [isAuthPage, location.pathname]); // Re-run whenever path changes

    const handleDismissBanner = () => {
        sessionStorage.setItem('notificationBannerDismissed', 'true');
        setShowNotificationBanner(false);
    };
    
    const handleEnableNotifications = async () => {
        setShowNotificationBanner(false);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('Notification permission was denied.');
                return;
            }
            const vapidPublicKey = await supplierService.getVapidPublicKey();
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey
            });
            await supplierService.saveSubscription(subscription);
            alert('✅ Notifications Enabled!');
        } catch (error) {
            console.error("Notification Setup Failed:", error);
            alert('Could not enable notifications. Check console.');
        }
    };

    return (
        <>
            {isLoading && (<div className="loader-overlay"><Loader /></div>)}
            {isAuthPage && <VantaBackground />}
            
            <AnimatePresence>
                {/* 4. Ensure it renders conditionally based on state */}
                {showNotificationBanner && (
                    <NotificationBanner 
                        onEnable={handleEnableNotifications}
                        onDismiss={handleDismissBanner}
                    />
                )}
            </AnimatePresence>
            
            <div className={isAuthPage ? "auth-content-wrapper" : "main-content-wrapper"}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    
                    {/* ✅ Corrected Reset Password Route (No /:token) */}
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                        <Route path="/orders/invoice" element={<InvoicePage />} />
                            <Route path="/dashboard" element={<Dashboard setIsLoading={setIsLoading} />} />
                            <Route path="/tools" element={<Tools setIsLoading={setIsLoading} />} />
                            <Route path="/reviews" element={<Reviews setIsLoading={setIsLoading} />} />
                            <Route path="/promotions" element={<Promotions setIsLoading={setIsLoading} />} />
                            <Route path="/promotions/:promotionId" element={<PromotionDetail setIsLoading={setIsLoading} />} />
                            <Route path="/products" element={<ProductList setIsLoading={setIsLoading} />} />
                            <Route path="/products/add" element={<ProductForm setIsLoading={setIsLoading} />} />
                            <Route path="/products/edit/:productId" element={<ProductForm setIsLoading={setIsLoading} />} />
                              
                            <Route path="/orders" element={<Orders setIsLoading={setIsLoading} />} />
                            <Route path="/orders/:orderId" element={<OrderDetailsPage setIsLoading={setIsLoading} />} />
                            <Route path="/orders/invoice" element={<InvoicePage />} />

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
                    
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </>
    );
};

export default App;