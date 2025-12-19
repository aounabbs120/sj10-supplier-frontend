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

// Global CSS
import './App.css';

// VantaBackground component (unchanged)
const VantaBackground = () => {
    const vantaRef = React.useRef(null);
    React.useEffect(() => {
        let effect = Waves({ el: vantaRef.current, THREE: THREE, mouseControls: true, touchControls: true, gyroControls: false, minHeight: 200.00, minWidth: 200.00, scale: 1.00, scaleMobile: 1.00, color: 0x3f3d70 });
        return () => { if (effect) effect.destroy(); };
    }, []);
    return <div ref={vantaRef} className="vanta-background"></div>;
};

// Main App component (unchanged)
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
// === THE UPGRADED AppLayout COMPONENT WITH DETAILED DEBUGGING LOGIC ===
// =========================================================================
const AppLayout = ({ isLoading, setIsLoading }) => {
    const location = useLocation();
    const [showNotificationBanner, setShowNotificationBanner] = useState(false);

    const isAuthPage = ['/login', '/register', '/forgot-password', '/verify-email']
        .includes(location.pathname) || location.pathname.startsWith('/reset-password');

    // Logic to show the banner (unchanged, and correct)
    useEffect(() => {
        const checkNotificationPermission = () => {
            const isSupported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
            if (!isSupported) return;
            const hasBeenDismissed = sessionStorage.getItem('notificationBannerDismissed');
            if (Notification.permission === 'default' && !hasBeenDismissed) {
                const timer = setTimeout(() => setShowNotificationBanner(true), 5000);
                return () => clearTimeout(timer);
            }
        };
        const token = localStorage.getItem('supplierToken');
        if (token && !isAuthPage) {
            checkNotificationPermission();
        } else {
            setShowNotificationBanner(false);
        }
    }, [isAuthPage, location.pathname]);

    const handleDismissBanner = () => {
        sessionStorage.setItem('notificationBannerDismissed', 'true');
        setShowNotificationBanner(false);
    };
    
    // ===================================================================
    // === THIS IS THE CRITICAL FUNCTION WITH DETAILED LOGGING ADDED ===
    // ===================================================================
    const handleEnableNotifications = async () => {
        setShowNotificationBanner(false);
        try {
            console.log("Step 1: Starting notification process...");

            const permission = await Notification.requestPermission();
            console.log("Step 2: Browser permission status:", permission);
            if (permission !== 'granted') {
                console.error("Process stopped: Permission was not granted.");
                alert('Notification permission was denied.');
                return;
            }

            console.log("Step 3: Requesting VAPID public key from backend...");
            const vapidPublicKey = await supplierService.getVapidPublicKey();
            console.log("Step 4: Successfully received VAPID key.");

            console.log("Step 5: Accessing service worker...");
            const registration = await navigator.serviceWorker.ready;
            console.log("Step 6: Service worker is ready.");

            console.log("Step 7: Creating push subscription...");
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey
            });
            console.log("Step 8: Subscription created successfully.");

            console.log("Step 9: Sending subscription object to backend...");
            await supplierService.saveSubscription(subscription);
            console.log("Step 10: ✅ SUCCESS! Backend confirmed subscription was saved.");
            
            alert('✅ Notifications Enabled!');

        } catch (error) {
            console.error("🔴🔴🔴 NOTIFICATION SETUP FAILED 🔴🔴🔴");
            console.error("The error occurred during one of the steps above. Check the browser's Network tab for failed API calls.", error);
            alert('Could not enable notifications. Please check the browser console (F12) for detailed error messages.');
        }
    };
    // ===================================================================


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
                    {/* --- ALL YOUR ROUTES (UNCHANGED) --- */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} /> 

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
                    
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </>
    );
};

export default App;