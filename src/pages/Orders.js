import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Coffee } from 'lucide-react';
import supplierService from '../services/supplierService';
import OrderCard from '../components/OrderCard';
import './Orders.css';

const Orders = ({ setIsLoading }) => {
    const [allOrders, setAllOrders] = useState([]);
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isAccountLocked, setIsAccountLocked] = useState(false);
    const [lockDetails, setLockDetails] = useState({ unpaid_amount: 0 });
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('Processing');
    const [newOrderIds, setNewOrderIds] = useState(new Set());

    useEffect(() => {
        const fetchOrders = async () => {
            if (setIsLoading) setIsLoading(true);
            setIsLoadingPage(true);
            try {
                const data = await supplierService.getMyOrders();
                setAllOrders(data);

                if (data.length > 0) {
                    const firstOrder = data[0];
                    if (firstOrder.is_locked) {
                        setIsAccountLocked(true);
                        setLockDetails({ unpaid_amount: parseFloat(firstOrder.unpaid_commission) || 0 });
                    }
                    const newIds = new Set(data.filter(o => o.shipment_details.is_new).map(o => o.order_details.id));
                    setNewOrderIds(newIds);
                }
            } catch (err) {
                setError('Failed to fetch orders. Please refresh.');
            } finally {
                setIsLoadingPage(false);
                if (setIsLoading) setIsLoading(false);
            }
        };
        fetchOrders();
    }, [setIsLoading]);

    const categorizedOrders = useMemo(() => {
        if (!allOrders.length) return { Processing: [], Shipping: [], Delivered: [], Cancelled: [], Returned: [] };
        const Processing = allOrders.filter(o => o.shipment_details.current_status === 'processing');
        const Shipping = allOrders.filter(o => ['Order Dispatched', 'InTransit', 'OutForDelivery'].includes(o.shipment_details.current_status));
        const Delivered = allOrders.filter(o => o.shipment_details.current_status === 'Delivered');
        const Cancelled = allOrders.filter(o => ['Cancelled', 'Refused', 'Exception'].includes(o.shipment_details.current_status));
        const Returned = allOrders.filter(o => o.shipment_details.current_status === 'Returned');
        return { Processing, Shipping, Delivered, Cancelled, Returned };
    }, [allOrders]);

    const tabs = ['Processing', 'Shipping', 'Delivered', 'Cancelled', 'Returned'];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="orders-page-container">
            {isAccountLocked && (
                <motion.div 
                    className="account-lock-banner"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <AlertTriangle size={24} color="white" fill="#ef4444" style={{flexShrink: 0}} />
                    <span>
                        CRITICAL ALERT: Your Processing or new incoming orders is <strong>Restricted</strong>. Overdue: 
                        <strong> PKR {(lockDetails.unpaid_amount).toFixed(2)}</strong>. Pay immediately to unlock.
                    </span>
                </motion.div>
            )}

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
                    <div className="loading-state">Loading...</div>
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
                                    <OrderCard 
                                        key={order.shipment_details.id} 
                                        order={order}
                                        isAccountLocked={isAccountLocked} 
                                        unpaidAmount={lockDetails.unpaid_amount || 0}
                                        isNew={newOrderIds.has(order.order_details.id)}
                                    />
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