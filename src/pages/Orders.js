// src/pages/Orders.js
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Coffee, RefreshCw, Clock, PackageCheck, Truck, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import supplierService from '../services/supplierService';
import OrderCard from '../components/OrderCard';
import './Orders.css';

const TAB_CONFIG = [
    { key: 'Unconfirmed', label: 'Unconfirmed', icon: Clock, color: 'amber' },
    { key: 'Processing', label: 'Processing', icon: PackageCheck, color: 'blue' },
    { key: 'Shipping', label: 'Shipping', icon: Truck, color: 'indigo' },
    { key: 'Delivered', label: 'Delivered', icon: CheckCircle2, color: 'emerald' },
    { key: 'Cancelled', label: 'Cancelled', icon: XCircle, color: 'red' },
    { key: 'Returned', label: 'Returned', icon: RotateCcw, color: 'slate' }
];

const Orders = ({ setIsLoading }) => {
    // SWR CACHING
    const [allOrders, setAllOrders] = useState(() => {
        const cached = localStorage.getItem('swr_all_orders');
        return cached ? JSON.parse(cached) : [];
    });
    
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
            localStorage.setItem('swr_all_orders', JSON.stringify(data));

            if (data.length > 0) {
                const firstOrder = data[0];
                if (firstOrder.is_locked) {
                    setIsAccountLocked(true);
                    setLockDetails({ unpaid_amount: parseFloat(firstOrder.unpaid_commission) || 0 });
                } else {
                    setIsAccountLocked(false);
                }
                const newIds = new Set(data.filter(o => o.shipment_details?.is_new).map(o => o.order_details.id));
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
        fetchOrders(allOrders.length > 0);
    }, [setIsLoading]);

    // 🟢 🟢 🟢 ACCURATE FILTERING ENGINE (FIXES SHIPPING TAB LEAK)
    const categorizedOrders = useMemo(() => {
        if (!allOrders.length) return { 
            Unconfirmed: [], 
            Processing: [], 
            Shipping: [], 
            Delivered: [], 
            Cancelled: [], 
            Returned: [] 
        };

        const getShipmentStatus = (o) => (o.shipment_details?.current_status || '').toLowerCase().replace(/\s/g, '');
        const getConfirmStatus = (o) => (o.order_details?.confirmation_status || '').toLowerCase();
        
        const isPendingWA = (o) => 
            o.order_details?.is_pending_whatsapp || 
            getConfirmStatus(o) === 'pending_whatsapp' || 
            getShipmentStatus(o) === 'pending_confirmation';

        // 1. Unconfirmed (Awaiting WhatsApp Customer Reply)
        const Unconfirmed = allOrders.filter(o => 
            isPendingWA(o) && 
            !['cancelled', 'auto_cancelled'].includes(getConfirmStatus(o)) &&
            !['cancelled', 'returned'].includes(getShipmentStatus(o))
        );

        // 2. Processing (Confirmed by customer, ready for supplier to pack/dispatch)
        const Processing = allOrders.filter(o => 
            !isPendingWA(o) && 
            (getShipmentStatus(o) === 'processing' || (getConfirmStatus(o) === 'confirmed' && getShipmentStatus(o) === 'pending_confirmation'))
        );

        // 3. Delivered
        const Delivered = allOrders.filter(o => getShipmentStatus(o) === 'delivered');

        // 4. Returned / RTO
        const Returned = allOrders.filter(o => getShipmentStatus(o).includes('return') || getShipmentStatus(o) === 'rto');

        // 5. Cancelled (Either by Supplier, Customer, or Auto-Expired)
        const Cancelled = allOrders.filter(o => 
            ['cancelled', 'auto_cancelled', 'refused', 'failedattempt', 'exception'].includes(getShipmentStatus(o)) ||
            ['cancelled', 'auto_cancelled'].includes(getConfirmStatus(o)) ||
            (o.order_details?.status || '').toLowerCase() === 'cancelled'
        );

        // 6. Shipping (Strictly Dispatched / In-Transit courier packages)
        const shippingStatuses = ['orderdispatched', 'intransit', 'outfordelivery', 'shipped', 'booked', 'arrivalatdestination', 'arrivalatorigin'];
        const Shipping = allOrders.filter(o => 
            !isPendingWA(o) && 
            shippingStatuses.includes(getShipmentStatus(o)) && 
            !Cancelled.includes(o) && 
            !Delivered.includes(o) && 
            !Returned.includes(o)
        );

        return { Unconfirmed, Processing, Shipping, Delivered, Cancelled, Returned };
    }, [allOrders]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
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
                        CRITICAL ALERT: Your Processing orders are <strong>Restricted</strong>. Overdue Debt: 
                        <strong> PKR {(lockDetails.unpaid_amount).toFixed(2)}</strong>. Please pay to continue dispatching.
                    </span>
                </motion.div>
            )}

            {/* Top Bar */}
            <div className="orders-list-meta-row">
                <h2>Manage Orders</h2>
                {isSilentRefreshing && (
                    <span className="silent-loader">
                        <RefreshCw size={14} className="spin-icon" /> Syncing data...
                    </span>
                )}
            </div>

            {/* 🟢 6 BEAUTIFUL HORIZONTAL SCROLLABLE TABS */}
            <div className="orders-tabs">
                {TAB_CONFIG.map(({ key, label, icon: Icon, color }) => {
                    const count = categorizedOrders[key]?.length || 0;
                    const isActive = activeTab === key;

                    return (
                        <button 
                            key={key} 
                            className={`tab-btn ${isActive ? 'active' : ''} tab-color-${color}`} 
                            onClick={() => setActiveTab(key)}
                        >
                            {isActive && (
                                <motion.div 
                                    className="active-tab-bg" 
                                    layoutId="activeTab" 
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="tab-label-flex">
                                <Icon size={14} />
                                {label}
                            </span>
                            <span className={`tab-count ${count > 0 && key === 'Unconfirmed' ? 'count-unconfirmed' : ''}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
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
                                    <motion.div key={order.shipment_details?.id || order.order_details?.id} variants={cardMotionVariants}>
                                        <OrderCard 
                                            order={order}
                                            isAccountLocked={isAccountLocked} 
                                            unpaidAmount={lockDetails.unpaid_amount || 0}
                                            isNew={newOrderIds.has(order.order_details?.id)}
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