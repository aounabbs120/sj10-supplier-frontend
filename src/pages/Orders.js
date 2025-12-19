// src/pages/Orders.js

import React, { useState, useEffect, useCallback } from 'react';
import supplierService from '../services/supplierService';
import OrderCard from '../components/OrderCard';
import OrderDetailModal from '../components/OrderDetailModal';
import './Orders.css';

const Orders = ({ setIsLoading }) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('processing'); // Default tab
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Define Tabs
    const tabs = [
        { id: 'processing', label: 'To Ship', statusKey: ['processing'] },
        { id: 'shipped', label: 'Shipping', statusKey: ['tracking_added', 'in_transit'] },
        { id: 'delivered', label: 'Delivered', statusKey: ['delivered'] },
        { id: 'failed', label: 'Failed Delivery', statusKey: ['failed', 'returned'] },
        { id: 'cancelled', label: 'Cancellation', statusKey: ['cancelled'] },
    ];

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await supplierService.getMyOrders();
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Filter Logic based on active tab
    useEffect(() => {
        const currentTabDef = tabs.find(t => t.id === activeTab);
        if (currentTabDef && orders.length > 0) {
            const filtered = orders.filter(order => 
                currentTabDef.statusKey.includes(order.shipment_details.current_status)
            );
            // Sort by newest first
            filtered.sort((a, b) => new Date(b.order_details.created_at) - new Date(a.order_details.created_at));
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders([]);
        }
    }, [activeTab, orders]);

    return (
        <div className="orders-page-container">
            {/* TABS HEADER */}
            <div className="orders-tabs">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                        {/* Optional: Add counters if you have logic for them */}
                    </button>
                ))}
            </div>

            <div className="orders-list-content">
                {filteredOrders.length === 0 ? (
                    <div className="empty-state">
                        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" alt="Empty" width="80" />
                        <p>No orders found in this section.</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <OrderCard 
                            key={order.shipment_details.id} 
                            order={order} 
                            onViewDetails={() => setSelectedOrder(order)}
                        />
                    ))
                )}
            </div>

            {selectedOrder && (
                <OrderDetailModal 
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={fetchOrders}
                />
            )}
        </div>
    );
};

export default Orders;