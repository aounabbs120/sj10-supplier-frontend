import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Coffee, RefreshCw } from 'lucide-react';
import supplierService from '../services/supplierService';
import OrderCard from '../components/OrderCard';
import './Orders.css';

const Orders = ({ setIsLoading }) => {
    // 🟢 SWR CACHING: Memory/LocalStorage se instant initial load
    const [allOrders, setAllOrders] = useState(() => {
        const cached = localStorage.getItem('swr_all_orders');
        return cached ? JSON.parse(cached) : [];
    });
    
    // Agar cache mein data majood hai, to page-level spinner nahi chalega (SWR strategy)
    const [isLoadingPage, setIsLoadingPage] = useState(!allOrders.length);
    const [isSilentRefreshing, setIsSilentRefreshing] = useState(false);
    const [isAccountLocked, setIsAccountLocked] = useState(false);
    const [lockDetails, setLockDetails] = useState({ unpaid_amount: 0 });
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('Processing');
    const [newOrderIds, setNewOrderIds] = useState(new Set());

    const fetchOrders = async (isSilent = false) => {
        if (!isSilent) {
            if (setIsLoading) setIsLoading(true);
            setIsLoadingPage(true);
        } else {
            setIsSilentRefreshing(true);
        }
        
        try {
            const data = await supplierService.getMyOrders();
            setAllOrders(data);
            
            // Cache save for next instant load
            localStorage.setItem('swr_all_orders', JSON.stringify(data));

            if (data.length > 0) {
                const firstOrder = data[0];
                if (firstOrder.is_locked) {
                    setIsAccountLocked(true);
                    setLockDetails({ unpaid_amount: parseFloat(firstOrder.unpaid_commission) || 0 });
                } else {
                    setIsAccountLocked(false);
                }
                const newIds = new Set(data.filter(o => o.shipment_details.is_new).map(o => o.order_details.id));
                setNewOrderIds(newIds);
            }
        } catch (err) {
            console.error("Orders sync failed:", err);
            if (!allOrders.length) setError('Failed to fetch orders. Please refresh.');
        } finally {
            setIsLoadingPage(false);
            setIsSilentRefreshing(false);
            if (setIsLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        // First initial load (will be silent if cache is present)
        fetchOrders(allOrders.length > 0);
    }, [setIsLoading]);

    const categorizedOrders = useMemo(() => {
        if (!allOrders.length) return { Processing: [], Shipping: [], Delivered: [], Cancelled: [], Returned: [] };

        const getStatus = (o) => (o.shipment_details.current_status || '').toLowerCase();

        const Processing = allOrders.filter(o => getStatus(o) === 'processing');
        const Delivered = allOrders.filter(o => getStatus(o) === 'delivered');
        const Returned = allOrders.filter(o => getStatus(o) === 'returned');
        const Cancelled = allOrders.filter(o => ['cancelled', 'refused', 'failedattempt', 'exception'].includes(getStatus(o)));

        const Shipping = allOrders.filter(o => {
            const s = getStatus(o);
            return s !== 'processing' && s !== 'delivered' && s !== 'returned' && !['cancelled', 'refused', 'failedattempt', 'exception'].includes(s);
        });

        return { Processing, Shipping, Delivered, Cancelled, Returned };
    }, [allOrders]);

    const tabs = ['Processing', 'Shipping', 'Delivered', 'Cancelled', 'Returned'];

    // Animations Config
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { staggerChildren: 0.05 } 
        }
    };

    const cardMotionVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
    };

    if (error && !allOrders.length) return <div className="error-state">{error}</div>;

    return (
        <div className="orders-page-container">
            {isAccountLocked && (
                <motion.div 
                    className="account-lock-banner"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <AlertTriangle size={24} color="white" fill="#ef4444" style={{flexShrink: 0}} />
                    <span>
                        CRITICAL ALERT: Your Processing or new incoming orders is <strong>Restricted</strong>. Overdue: 
                        <strong> PKR {(lockDetails.unpaid_amount).toFixed(2)}</strong>. Pay immediately to unlock.
                    </span>
                </motion.div>
            )}

            {/* Header displaying SWR status silently */}
            <div className="orders-list-meta-row">
                <h2>Manage Orders</h2>
                {isSilentRefreshing && (
                    <span className="silent-loader">
                        <RefreshCw size={14} className="spin-icon" /> Syncing data...
                    </span>
                )}
            </div>

            <div className="orders-tabs">
                {tabs.map(tab => (
                    <button 
                        key={tab} 
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`} 
                        onClick={() => setActiveTab(tab)}
                    >
                        {activeTab === tab && (
                            <motion.div 
                                className="active-tab-bg" 
                                layoutId="activeTab" 
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span style={{ position: 'relative', zIndex: 2 }}>{tab}</span>
                        <span className="tab-count" style={{ position: 'relative', zIndex: 2 }}>
                            {categorizedOrders[tab]?.length || 0}
                        </span>
                    </button>
                ))}
            </div>

            <div className="orders-list-content">
                {isLoadingPage ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Fetching Orders...</p>
                    </div>
                ) : (
                    <AnimatePresence mode='wait'>
                        {categorizedOrders[activeTab]?.length > 0 ? (
                            <motion.div
                                key={activeTab}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: 10 }}
                            >
                                {categorizedOrders[activeTab].map(order => (
                                    <motion.div key={order.shipment_details.id} variants={cardMotionVariants}>
                                        <OrderCard 
                                            order={order}
                                            isAccountLocked={isAccountLocked} 
                                            unpaidAmount={lockDetails.unpaid_amount || 0}
                                            isNew={newOrderIds.has(order.order_details.id)}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="empty-state"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Coffee size={48} color="#94a3b8" style={{ marginBottom: 15 }} />
                                <p>No orders found in {activeTab}.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Orders;