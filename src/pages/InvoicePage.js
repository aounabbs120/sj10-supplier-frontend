// src/pages/InvoicePage.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supplierService from '../services/supplierService';
import './InvoicePage.css';

const InvoicePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [supplierProfile, setSupplierProfile] = useState(null);
    
    // The order data passed from the Orders page
    const order = location.state?.order;

    useEffect(() => {
        if (!order) {
            navigate('/orders');
            return;
        }

        // Fetch supplier profile to get Logo, Name, and Supplier Code
        const fetchProfile = async () => {
            try {
                const data = await supplierService.getMyProfile();
                setSupplierProfile(data);
                
                // Automatically trigger print dialog when data is ready (optional, removed for better UX while testing)
                // setTimeout(() => window.print(), 1000); 
            } catch (error) {
                console.error("Failed to load profile for invoice");
            }
        };
        fetchProfile();
    }, [order, navigate]);

    if (!order || !supplierProfile) return <div className="loading-invoice">Generating Invoice...</div>;

    const { order_details, order_items } = order;
    
    // --- 1. FIXED DELIVERY FEE LOGIC ---
    const FIXED_SHIPPING_COST = 220;

    // --- 2. CALCULATE SUBTOTAL (Sum of Product Price * Quantity) ---
    const subtotal = order_items.reduce((acc, item) => {
        // Use the discounted price if it exists, otherwise the normal price
        const price = item.product_details.discounted_price || item.product_details.price || 0;
        return acc + (price * item.quantity);
    }, 0);

    // --- 3. FINAL TOTAL ---
    const total = subtotal + FIXED_SHIPPING_COST;

    // --- 4. SUPPLIER DATA LOGIC ---
    // Fix: Database uses 'profile_pic', not 'profile_picture'
    const supplierLogo = supplierProfile.profile_pic || 'https://via.placeholder.com/60?text=No+Logo';
    // Fix: Show Supplier Code. If missing, show the Supplier ID.
    const supplierDisplayCode = supplierProfile.supplier_code || supplierProfile.id;

    return (
        <div className="invoice-container">
            {/* --- HEADER --- */}
            <div className="invoice-header">
                <div className="invoice-brand-section">
                    <div className="brand-logo-box">
                        <span className="brand-sj10">SJ10</span>
                        <span className="brand-sc">SELLER<span style={{fontWeight:'300'}}>CENTER</span></span>
                    </div>
                    
                    {/* --- UPDATED SUPPLIER INFO SECTION --- */}
                    <div className="supplier-info-strip">
                        <img 
                            src={supplierLogo} 
                            alt="Profile" 
                            className="supplier-invoice-img" 
                            onError={(e) => {e.target.src = 'https://via.placeholder.com/60?text=Brand'}}
                        />
                        <div className="supplier-text-col">
                            <span className="supplier-name">{supplierProfile.brand_name || supplierProfile.full_name || "Brand Store"}</span>
                            {/* Shows Code OR ID */}
                            <span className="supplier-code">{supplierDisplayCode}</span>
                        </div>
                    </div>
                </div>
                
                <div className="invoice-meta">
                    <p><strong>SJ10 Purchase Summary</strong></p>
                    <p className="meta-order-id">{order_details.id}</p>
                    <p className="meta-date">{new Date(order_details.created_at).toLocaleString()}</p>
                </div>
            </div>

            {/* --- ADDRESS TABLE --- */}
            <table className="address-table">
                <tbody>
                    <tr>
                        <td className="table-label">Purchase Summary Number:</td>
                        <td className="table-val">{order_details.id}</td>
                        <td className="table-label">Payment Method:</td>
                        <td className="table-val">COD</td>
                    </tr>
                    <tr>
                        <td className="table-label">Date:</td>
                        <td className="table-val">{new Date(order_details.created_at).toLocaleDateString()}</td>
                        <td className="table-label">Phone:</td>
                        <td className="table-val">{order_details.customer_phone || "N/A"}</td>
                    </tr>
                    <tr className="address-row">
                        <td className="table-label">BILL TO:</td>
                        <td className="table-val address-cell">
                            <strong>{order_details.customer_name}</strong><br/>
                            {order_details.customer_address}<br/>
                            {order_details.customer_city}, Pakistan
                        </td>
                        <td className="table-label">DELIVER TO:</td>
                        <td className="table-val address-cell">
                            <strong>{order_details.customer_name}</strong><br/>
                            {order_details.customer_address}<br/>
                            {order_details.customer_city}, Pakistan
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* --- ITEMS TABLE (UPDATED COLUMNS) --- */}
            <div className="items-section">
                <h3>Your Ordered Items:</h3>
                <table className="items-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Variants</th>
                            {/* Renamed Header */}
                            <th>Product Price</th>
                            {/* New Column */}
                            <th>Delivery Fee</th> 
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order_items.map((item, index) => {
                            const unitPrice = item.product_details.discounted_price || item.product_details.price || 0;
                            const itemTotal = unitPrice * item.quantity;
                            
                            return (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="invoice-item-flex">
                                            <span>{item.product_details.title}</span>
                                        </div>
                                    </td>
                                    <td>{item.product_details.sku || "N/A"}</td>
                                    <td>
                                        {item.selected_size ? `Size: ${item.selected_size}` : ''}
                                        {item.selected_size && item.selected_color ? ', ' : ''}
                                        {item.selected_color ? `Color: ${item.selected_color}` : ''}
                                        {!item.selected_size && !item.selected_color ? 'N/A' : ''}
                                    </td>
                                    
                                    {/* Product Price Column */}
                                    <td>PKR {unitPrice}</td>
                                    
                                    {/* Fixed Delivery Fee Column (Visual Only) */}
                                    <td>PKR {FIXED_SHIPPING_COST}</td>
                                    
                                    {/* Row Total (Just Price * Qty, NOT including delivery fee) */}
                                    <td>PKR {itemTotal}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* --- FOOTER TOTALS --- */}
            <div className="invoice-footer">
                <div className="totals-box">
                    <div className="total-row">
                        <span>Subtotal:</span>
                        <span>{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                        <span>Shipping Cost:</span>
                        {/* Always show 220 here */}
                        <span>{FIXED_SHIPPING_COST.toFixed(2)}</span> 
                    </div>
                    <div className="total-row total-final">
                        <span>Total:</span>
                        {/* Subtotal + 220 */}
                        <span>{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div className="print-btn-container no-print">
                <button onClick={() => window.print()}>Print Invoice</button>
                <button onClick={() => navigate('/orders')}>Back</button>
            </div>
        </div>
    );
};

export default InvoicePage;