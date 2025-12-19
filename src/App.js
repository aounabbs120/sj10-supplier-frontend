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
import Loader from './components/Loader';

// --- PAGE IMPORTS ---
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';

// --- DASHBOARD & TOOLS ---
import Dashboard from './pages/Dashboard';
import Tools from './pages/Tools';
import SJ10University from './pages/SJ10University';
import VideoPlayer from './pages/VideoPlayer';
import VerificationCenter from './pages/VerificationCenter';

// --- PRODUCT & ORDER MANAGEMENT ---
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import Orders from './pages/Orders';
import OrderDetailsPage from './pages/OrderDetailsPage'; // <--- NEW IMPORT
import InvoicePage from './pages/InvoicePage';           // <--- NEW IMPORT

// --- MARKETING & REVIEWS ---
import Promotions from './pages/Promotions';
import PromotionDetail from './pages/PromotionDetail';
import Reviews from './pages/Reviews';

// --- ACCOUNT & POLICIES ---
import AccountPage from './pages/AccountPage';
import AccountSettingsPage from './components/AccountSettingsPage';
import Feedback from './pages/Feedback';
import ShippingPolicy from './pages/ShippingPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';

// Global CSS
import './App.css';

// --- VANTA BACKGROUND COMPONENT ---
const VantaBackground = () => {
    const vantaRef = React.useRef(null);
    React.useEffect(() => {
        let effect = Waves({ 
            el: vantaRef.current, 
            THREE: THREE, 
            mouseControls: true, 
            touchControls: true, 
            gyroControls: false, 
            minHeight: 200.00, 
            minWidth: 200.00, 
            scale: 1.00, 
            scaleMobile: 1.00, 
            color: 0x3f3d70 
        });
        return () => { if (effect) effect.destroy(); };
    }, []);
    return <div ref={vantaRef} className="vanta-background"></div>;
};

// --- MAIN APP WRAPPER ---
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
// === APP LAYOUT & ROUTING LOGIC ===
// =========================================================================
const AppLayout = ({ isLoading, setIsLoading }) => {
    const location = useLocation();
    const [showNotificationBanner, setShowNotificationBanner] = useState(false);

    // Define strictly what an "Auth Page" is (No sidebar, Vanta background)
    const isAuthPage = ['/login', '/register', '/forgot-password', '/verify-email']
        .includes(location.pathname) || location.pathname.startsWith('/reset-password');

    // --- NOTIFICATION LOGIC ---
    useEffect(() => {
        const token = localStorage.getItem('supplierToken');

        // If no token or on an Auth Page, HIDE banner immediately.
        if (!token || isAuthPage) {
            setShowNotificationBanner(false);
            return; 
        }

        // Only proceed if logged in and inside the dashboard area
        const checkNotificationPermission = () => {
            const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
            if (!isSupported) return;

            const hasBeenDismissed = sessionStorage.getItem('notificationBannerDismissed');
            
            // Only show if permission is 'default' and not dismissed
            if (Notification.permission === 'default' && !hasBeenDismissed) {
                const timer = setTimeout(() => setShowNotificationBanner(true), 2000);
                return () => clearTimeout(timer);
            }
        };

        checkNotificationPermission();
    }, [isAuthPage, location.pathname]);

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
                {showNotificationBanner && (
                    <NotificationBanner 
                        onEnable={handleEnableNotifications}
                        onDismiss={handleDismissBanner}
                    />
                )}
            </AnimatePresence>
            
            <div className={isAuthPage ? "auth-content-wrapper" : "main-content-wrapper"}>
                <Routes>
                    {/* === PUBLIC ROUTES === */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    {/* Corrected Reset Password Route (No /:token) */}
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* === PROTECTED DASHBOARD ROUTES === */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/dashboard" element={<Dashboard setIsLoading={setIsLoading} />} />
                            
                            {/* Tools & Resources */}
                            <Route path="/tools" element={<Tools setIsLoading={setIsLoading} />} />
                            <Route path="/verification-center" element={<VerificationCenter setIsLoading={setIsLoading} />} />
                            <Route path="/sj10-university" element={<SJ10University setIsLoading={setIsLoading} />} />
                            <Route path="/sj10-university/:videoId" element={<VideoPlayer setIsLoading={setIsLoading} />} />

                            {/* Products */}
                            <Route path="/products" element={<ProductList setIsLoading={setIsLoading} />} />
                            <Route path="/products/add" element={<ProductForm setIsLoading={setIsLoading} />} />
                            <Route path="/products/edit/:productId" element={<ProductForm setIsLoading={setIsLoading} />} />
                            
                            {/* Orders & Invoices */}
                            <Route path="/orders" element={<Orders setIsLoading={setIsLoading} />} />
                            {/* ✅ NEW: Dedicated Order Details Page */}
                            <Route path="/orders/:orderId" element={<OrderDetailsPage setIsLoading={setIsLoading} />} />
                            {/* ✅ NEW: Printable Invoice Page */}
                            <Route path="/orders/invoice" element={<InvoicePage />} />

                            {/* Marketing */}
                            <Route path="/reviews" element={<Reviews setIsLoading={setIsLoading} />} />
                            <Route path="/promotions" element={<Promotions setIsLoading={setIsLoading} />} />
                            <Route path="/promotions/:promotionId" element={<PromotionDetail setIsLoading={setIsLoading} />} />
                            
                            {/* Account & Info */}
                            <Route path="/account" element={<AccountPage />} />
                            <Route path="/account-settings" element={<AccountSettingsPage />} />
                            <Route path="/feedback" element={<Feedback setIsLoading={setIsLoading} />} />
                            <Route path="/shipping-policy" element={<ShippingPolicy setIsLoading={setIsLoading} />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy setIsLoading={setIsLoading} />} />
                            <Route path="/about-us" element={<AboutUs setIsLoading={setIsLoading} />} />
                        </Route>
                    </Route>
                    
                    {/* Catch-all redirect */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </>
    );
};

export default App;