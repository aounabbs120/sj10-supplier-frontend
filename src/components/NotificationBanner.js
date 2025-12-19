// src/components/NotificationBanner.js
import React from 'react';
import { motion } from 'framer-motion';
import './NotificationBanner.css';
import { BellRing, X } from 'lucide-react';

const NotificationBanner = ({ onEnable, onDismiss }) => {
    return (
        <motion.div
            className="notification-banner"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            layout
        >
            <div className="banner-icon">
                <BellRing size={24} />
            </div>
            <div className="banner-content">
                {/* --- NEW, MORE PROFESSIONAL TEXT --- */}
                <strong>Dear Seller, Never Miss an Update!</strong>
                <p>Allow notifications to get instant alerts for New Orders, Approved Promotions, and important System Messages. Stay ahead and manage your business effectively.</p>
            </div>
            <motion.button
                className="enable-button"
                onClick={onEnable}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Allow Notifications
            </motion.button>
            <button className="dismiss-button" onClick={onDismiss}>
                <X size={18} />
            </button>
        </motion.div>
    );
};

export default NotificationBanner;
