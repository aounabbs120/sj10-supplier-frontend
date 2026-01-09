import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Package, CheckCircle, Clock, MapPin, 
    Truck, Home, Box, AlertCircle, Calendar, User, FileText,
    Activity, ChevronRight, Anchor
} from 'lucide-react';
import supplierService from '../services/supplierService';
import './TrackOrderPage.css';

const TrackOrderPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [shipment, setShipment] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchDetails = useCallback(async () => {
        try {
            const data = await supplierService.getMyOrderDetails(orderId);
            setShipment(data.shipment_details);
        } catch (err) {
            setError("Could not load tracking details.");
        } finally {
            setIsLoading(false);
        }
    }, [orderId]);

    useEffect(() => { fetchDetails(); }, [fetchDetails]);

    // --- HELPER: Date Formatter (December 23, 2026 | 10:30 AM) ---
    const formatEventDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // If date parsing fails (invalid format), return original string
        if (isNaN(date.getTime())) return dateString; 

        return new Intl.DateTimeFormat('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date).replace(' at ', ' | ');
    };

    // --- HELPER: Dynamic Icons ---
    const getEventIcon = (description) => {
        const text = description?.toLowerCase() || '';
        if (text.includes('delivered')) return <Home size={20} />;
        if (text.includes('out for delivery')) return <Truck size={20} />;
        if (text.includes('transit') || text.includes('way')) return <Anchor size={20} />;
        if (text.includes('packed') || text.includes('warehouse')) return <Box size={20} />;
        if (text.includes('ordered') || text.includes('placed')) return <FileText size={20} />;
        if (text.includes('processing')) return <Activity size={20} />;
        if (text.includes('fail') || text.includes('exception')) return <AlertCircle size={20} />;
        return <CheckCircle size={20} />;
    };

    if (isLoading) return (
        <div className="loading-container">
            <div className="loader-logo"><img src="/logo.gif" alt="Loading..." /></div>
            <p>Syncing logistics data...</p>
        </div>
    );
    
    if (error) return <div className="error-state">{error}</div>;
    if (!shipment) return <div className="error-state">No shipment data found.</div>;

    const meta = shipment.meta_data || {};

    return (
        <div className="track-order-page">
            
            {/* --- TOP BAR: Back Btn + SJ10 Logo --- */}
            <div className="top-navigation">
                <button className="back-btn-modern" onClick={() => navigate(`/orders/${orderId}`)}>
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
                <div className="brand-logo-container">
                    {/* Ensure logo.gif exists in your public folder */}
                    <img src="/logo.gif" alt="SJ10 Supplier Panel" className="brand-logo" />
                </div>
            </div>

            {/* --- HERO STATUS CARD --- */}
            <motion.div 
                className="status-hero"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="hero-left">
                    <div className="icon-pulse-wrapper">
                        <Package size={28} color="white" />
                        <div className="ripple"></div>
                    </div>
                    <div className="hero-details">
                        <span className="hero-label">Tracking Number</span>
                        <h2 className="tracking-code">{shipment.tracking_number}</h2>
                    </div>
                </div>
                <div className={`status-pill-large ${shipment.current_status.toLowerCase().replace(' ', '-')}`}>
                    <span className="live-dot"></span>
                    {shipment.current_status}
                </div>
            </motion.div>

            {/* --- INFO GRID (Metadata) --- */}
            {(meta.customer_name || meta.order_date) && (
                <motion.div 
                    className="info-grid"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="info-card">
                        <div className="info-icon"><User size={20} /></div>
                        <div>
                            <span className="label">Customer</span>
                            <p className="val">{meta.customer_name || "N/A"}</p>
                        </div>
                    </div>
                    <div className="info-card">
                        <div className="info-icon"><Calendar size={20} /></div>
                        <div>
                            <span className="label">Order Date</span>
                            <p className="val">{meta.order_date || "N/A"}</p>
                        </div>
                    </div>
                    <div className="info-card">
                        <div className="info-icon"><MapPin size={20} /></div>
                        <div>
                            <span className="label">Destination</span>
                            <p className="val">Shipping Address</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* --- ANIMATED TIMELINE --- */}
            <div className="timeline-section">
                <div className="timeline-header">
                    <h3>Shipment Progress</h3>
                </div>

                <div className="timeline-container">
                    {/* The Infinite Loop Line */}
                    <div className="timeline-line"></div>

                    {shipment.events && shipment.events.length > 0 ? (
                        shipment.events.map((event, index) => (
                            <motion.div 
                                key={index} 
                                className={`timeline-item ${index === 0 ? 'current' : ''}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                {/* Left: Icon Node */}
                                <div className="timeline-marker">
                                    <div className="icon-node">
                                        {getEventIcon(event.description || event.event)}
                                    </div>
                                </div>

                                {/* Right: Content Card */}
                                <div className="timeline-content">
                                    <div className="event-card">
                                        <div className="event-header">
                                            <h4 className="event-title">{event.description || event.event}</h4>
                                            {index === 0 && <span className="now-badge">LATEST</span>}
                                        </div>
                                        <div className="event-time-row">
                                            <Clock size={14} />
                                            {/* Formatted Date: December 23, 2026 | 10:30 AM */}
                                            <span>{formatEventDate(event.time || event.date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <Box size={40} />
                            <p>Information received. Waiting for updates.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="secure-footer">
                <p>Powered by <strong>SJ10 Supplier Network</strong> &copy; 2026</p>
            </div>
        </div>
    );
};

export default TrackOrderPage;