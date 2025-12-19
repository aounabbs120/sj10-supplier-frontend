// src/components/NotificationBanner.js
import React from 'react';
import { motion } from 'framer-motion';
import { BellRing, X, ShieldCheck } from 'lucide-react';
import './NotificationBanner.css';

const NotificationBanner = ({ onEnable, onDismiss }) => {
    return (
        <motion.div
            className="notif-banner-container"
            initial={{ y: -150, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -150, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
            {/* Glow Effect Background */}
            <div className="notif-glow"></div>

            <div className="notif-content-wrapper">
                <div className="notif-icon-box">
                    <BellRing size={28} className="animate-ring" />
                </div>
                
                <div className="notif-text-group">
                    <h4>Enable Notifications?</h4>
                    <p>Get instant alerts for <strong>New Orders</strong>, <strong>Payouts</strong>, and <strong>Account Updates</strong> directly to your device.</p>
                </div>

                <div className="notif-actions">
                    <motion.button
                        className="btn-enable"
                        onClick={onEnable}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ShieldCheck size={16} style={{marginRight: '6px'}}/>
                        Turn On
                    </motion.button>
                    
                    <button className="btn-dismiss" onClick={onDismiss} aria-label="Dismiss">
                        <X size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default NotificationBanner;