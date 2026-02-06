// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import * as THREE from 'three';
import Waves from 'vanta/dist/vanta.waves.min';
import { AnimatePresence } from 'framer-motion';
// --- 1. IMPORT THE PROVIDER ---
import { GoogleOAuthProvider } from '@react-oauth/google'; 

import supplierService from './services/supplierService';
import MainLayout from './layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationBanner from './components/NotificationBanner';
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
import InvoicePage from './pages/InvoicePage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import TrackOrderPage from './pages/TrackOrderPage';
import FollowersPage from './pages/FollowersPage';
import CreatePromotion from './pages/CreatePromotion';
import CompleteProfile from './pages/CompleteProfile'; // <-- Import the new page
import TermsConditions from './pages/TermsConditions'; // <-- 1. IMPORT THIS
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
  
  // You need to get this ID from Google Cloud Console
  // If you don't have one yet, put a placeholder string like "test" to stop the crash temporarily
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    // --- 2. WRAP THE APP WITH THE PROVIDER ---
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <AppLayout isLoading={isLoading} setIsLoading={setIsLoading} />
      </Router>
    </GoogleOAuthProvider>
  );
}

const AppLayout = ({ isLoading, setIsLoading }) => {
    const location = useLocation();
    const [showNotificationBanner, setShowNotificationBanner] = useState(false);

    const isAuthPage = ['/login', '/register', '/forgot-password', '/verify-email']
        .includes(location.pathname) || location.pathname.startsWith('/reset-password');

    useEffect(() => {
        const token = localStorage.getItem('supplierToken');
        if (!token || isAuthPage) {
            setShowNotificationBanner(false);
            return; 
        }

        const checkNotificationPermission = () => {
            const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
            if (!isSupported) return;
            const hasBeenDismissed = sessionStorage.getItem('notificationBannerDismissed');
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/complete-profile" element={<CompleteProfile />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
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
                            <Route path="/orders/:orderId" element={<OrderDetailsPage setIsLoading={setIsLoading} />} />
                            <Route path="/orders/invoice" element={<InvoicePage />} />
                            <Route path="/account" element={<AccountPage />} />
                            <Route path="/account-settings" element={<AccountSettingsPage />} />
                            <Route path="/feedback" element={<Feedback setIsLoading={setIsLoading} />} />
                            <Route path="/shipping-policy" element={<ShippingPolicy setIsLoading={setIsLoading} />} />
                            <Route path="/terms-conditions" element={<TermsConditions setIsLoading={setIsLoading} />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy setIsLoading={setIsLoading} />} />
                            <Route path="/about-us" element={<AboutUs setIsLoading={setIsLoading} />} />
                            <Route path="/verification-center" element={<VerificationCenter setIsLoading={setIsLoading} />} />
                            <Route path="/sj10-university" element={<SJ10University setIsLoading={setIsLoading} />} />
                            <Route path="/orders/track/:orderId" element={<TrackOrderPage setIsLoading={setIsLoading} />} />
                             <Route path="/followers" element={<FollowersPage />} />
                           <Route path="/promotions/create" element={<CreatePromotion />} />
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