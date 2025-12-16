// src/pages/Orders.js

import React, { useState, useEffect, useCallback } from 'react';
import supplierService from '../services/supplierService';
import OrderCard from '../components/OrderCard';
import OrderDetailModal from '../components/OrderDetailModal';
import './Orders.css';

const Orders = ({ setIsLoading }) => {
    const [orders, setOrders] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            const data = await supplierService.getMyOrders();
            // Define a priority for sorting
            const statusPriority = { 'processing': 1, 'tracking_added': 2, 'in_transit': 3 };

            data.sort((a, b) => {
                const priorityA = statusPriority[a.shipment_details.current_status] || 99;
                const priorityB = statusPriority[b.shipment_details.current_status] || 99;
                if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                }
                return new Date(b.order_details.created_at) - new Date(a.order_details.created_at);
            });
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError('Could not load your orders. Please try again later.');
        } finally {
            const timer = setTimeout(() => {
                setIsLoading(false);
                setPageLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [setIsLoading]);

    useEffect(() => {
        setIsLoading(true);
        fetchOrders();
    }, [fetchOrders, setIsLoading]);

    const handleOrderUpdate = () => {
        fetchOrders();
    };
    
    if (pageLoading) {
        return null;
    }

    return (
        <div className="orders-container">
            <div className="orders-header-wrapper">
                <h1 className="orders-header">Your Orders</h1>
                <p className="orders-subheader">Manage shipments and track deliveries</p>
            </div>
            
            {error && <p className="orders-error">{error}</p>}

            {!error && orders.length === 0 && (
                <div className="no-orders-card">
                    <span className="no-orders-icon">📦</span>
                    <h2>No Orders Yet</h2>
                    <p>New orders from customers will appear here.</p>
                </div>
            )}

            <div className="orders-grid">
                {orders.map((order, index) => (
                    <OrderCard 
                        key={order.shipment_details.id} 
                        order={order} 
                        onSelect={() => setSelectedOrder(order)}
                        style={{ animationDelay: `${index * 50}ms` }}
                    />
                ))}
            </div>

            {selectedOrder && (
                <OrderDetailModal 
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={handleOrderUpdate}
                />
            )}
        </div>
    );
};

export default Orders;