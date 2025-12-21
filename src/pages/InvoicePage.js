// src/pages/InvoicePage.js
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas'; 
import supplierService from '../services/supplierService';
import './InvoicePage.css';

const InvoicePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const invoiceRef = useRef(null);
    const [supplierProfile, setSupplierProfile] = useState(null);
    
    // State to hold the Base64 image string (Fixes Print/Download missing image)
    const [logoBase64, setLogoBase64] = useState(null);
    
    const order = location.state?.order;

    useEffect(() => {
        if (!order) {
            navigate('/orders');
            return;
        }
        const fetchProfile = async () => {
            try {
                const data = await supplierService.getMyProfile();
                setSupplierProfile(data);
                
                // Convert profile pic to Base64 immediately
                if (data.profile_pic) {
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = data.profile_pic;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        canvas.getContext('2d').drawImage(img, 0, 0);
                        setLogoBase64(canvas.toDataURL('image/png'));
                    };
                    img.onerror = () => {
                        console.error("Image CORS conversion failed");
                        setLogoBase64(null); 
                    };
                }
            } catch (error) { console.error("Profile Error"); }
        };
        fetchProfile();
    }, [order, navigate]);

    const handleDownloadImage = async () => {
        if (invoiceRef.current) {
            try {
                const canvas = await html2canvas(invoiceRef.current, {
                    scale: 2, 
                    useCORS: true, 
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = `Invoice_${order.order_details.id}.png`;
                link.click();
            } catch (err) {
                console.error("Download failed", err);
                alert("Could not generate image. Please try 'Print' instead.");
            }
        }
    };

    if (!order || !supplierProfile) return <div className="loading-screen">Generating Invoice...</div>;

    const { order_details, order_items } = order;
    
    // --- ORIGINAL PRICING LOGIC ---
    // 1. Calculate Grand Total from DB
    const dbGrandTotal = order_items.reduce((acc, item) => {
        const price = Number(item.product_details.discounted_price || item.product_details.price || 0);
        return acc + (price * item.quantity);
    }, 0);

    const SHIPPING_COST = 220;
    
    // 2. Calculate adjusted subtotal (Reverse engineering subtotal from Total - Shipping)
    const adjustedSubtotal = Math.max(0, dbGrandTotal - SHIPPING_COST);
    
    // 3. Ratio to scale down item prices for display
    const adjustmentRatio = dbGrandTotal > 0 ? (adjustedSubtotal / dbGrandTotal) : 1;

    // Display Data
    const supplierName = supplierProfile.brand_name || supplierProfile.full_name || "Brand Store";
    const supplierId = supplierProfile.supplier_code || supplierProfile.id;
    const finalLogoSrc = logoBase64 || supplierProfile.profile_pic || 'https://via.placeholder.com/60?text=Brand';

    return (
        <div className="invoice-page-wrapper">
            
            {/* ACTIONS */}
            <div className="invoice-actions no-print">
                <button className="btn-action btn-back" onClick={() => navigate('/orders')}>← Back</button>
                <div className="action-right">
                    <button className="btn-action btn-download" onClick={handleDownloadImage}>⬇ Download Image</button>
                    <button className="btn-action btn-print" onClick={() => window.print()}>🖨 Print PDF</button>
                </div>
            </div>

            {/* INVOICE PAPER */}
            <div className="invoice-paper" ref={invoiceRef}>
                
                {/* 1. Header Section */}
                <div className="inv-header-row">
                    <div className="header-brand-section">
                        <span className="brand-sj10">SJ10</span> 
                        <span className="brand-center">SELLERCENTER</span>
                    </div>
                    <div className="header-summary-section">
                        <div className="summary-title">SJ10 Purchase Summary</div>
                        <div className="summary-id">{order_details.id}</div>
                        <div className="summary-date">{new Date().toLocaleString()}</div>
                    </div>
                </div>

                {/* 2. Supplier Section */}
                <div className="inv-supplier-styled">
                    <div className="supplier-blue-bar"></div>
                    <div className="inv-logo-box">
                        <img 
                            src={finalLogoSrc} 
                            alt="Logo" 
                            className="inv-logo"
                        />
                    </div>
                    <div className="inv-supp-details">
                        <div className="supp-name-tag">{supplierName}</div>
                        <div className="supp-id-tag">{supplierId}</div>
                    </div>
                </div>

                {/* 3. The Grid Table */}
                <div className="inv-grid-container">
                    <div className="inv-grid-row">
                        <div className="inv-cell label-cell">Purchase Summary Number:</div>
                        <div className="inv-cell value-cell">{order_details.id}</div>
                        <div className="inv-cell label-cell">Payment Method:</div>
                        <div className="inv-cell value-cell">COD</div>
                    </div>
                    <div className="inv-grid-row">
                        <div className="inv-cell label-cell">Date:</div>
                        <div className="inv-cell value-cell">{new Date(order_details.created_at).toLocaleDateString()}</div>
                        <div className="inv-cell label-cell">Phone:</div>
                        <div className="inv-cell value-cell">{order_details.customer_phone}</div>
                    </div>
                    <div className="inv-grid-row address-row-container">
                        <div className="inv-cell label-cell">BILL TO:</div>
                        <div className="inv-cell value-cell address-text">
                            <strong>{order_details.customer_name}</strong><br/>
                            {order_details.customer_address}<br/>
                            {order_details.customer_city}
                        </div>
                        <div className="inv-cell label-cell">DELIVER TO:</div>
                        <div className="inv-cell value-cell address-text">
                            <strong>{order_details.customer_name}</strong><br/>
                            {order_details.customer_address}<br/>
                            {order_details.customer_city}
                        </div>
                    </div>
                </div>

                {/* 4. Items Table */}
                <div className="inv-items-container">
                    <div className="items-header">Your Ordered Items:</div>
                    <table className="inv-items-table">
                        <thead>
                            <tr>
                                <th style={{width: '5%'}}>#</th>
                                <th style={{width: '25%'}}>Product Name</th>
                                <th style={{width: '15%'}}>SKU</th>
                                <th style={{width: '10%'}}>Variants</th>
                                <th style={{width: '15%'}}>Product Price</th>
                                <th style={{width: '15%'}}>Delivery Fee</th>
                                <th style={{width: '15%', textAlign: 'right'}}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order_items.map((item, index) => {
                                const rawPrice = Number(item.product_details.discounted_price || item.product_details.price || 0);
                                const quantity = Number(item.quantity || 1);
                                
                                // Adjust price for display to match subtotal logic
                                const displayPrice = rawPrice * adjustmentRatio;
                                const lineTotal = displayPrice * quantity;

                                return (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td className="item-name-cell">
                                            {item.product_details.title}
                                        </td>
                                        <td>{item.product_details.sku}</td>
                                        <td>
                                            {(item.selected_size || item.selected_color) 
                                                ? `${item.selected_size || ''} ${item.selected_color || ''}`
                                                : 'N/A'
                                            }
                                        </td>
                                        <td>PKR {displayPrice.toFixed(2)}</td>
                                        <td>PKR {SHIPPING_COST}</td>
                                        <td className="text-right">PKR {lineTotal.toFixed(0)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 5. Totals */}
                <div className="inv-totals-section">
                    <div className="inv-totals-box">
                        <div className="t-row">
                            <span>Subtotal:</span>
                            <span>{adjustedSubtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="t-row">
                            <span>Shipping Cost:</span>
                            <span>{SHIPPING_COST.toFixed(2)}</span>
                        </div>
                        <div className="t-row grand">
                            <span>Total:</span>
                            <span>{dbGrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InvoicePage;