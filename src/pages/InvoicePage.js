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
    const [logoBase64, setLogoBase64] = useState(null);
    const [imageError, setImageError] = useState(false);
    
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
                
                if (data.profile_pic) {
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = data.profile_pic + '?t=' + new Date().getTime();
                    
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        canvas.getContext('2d').drawImage(img, 0, 0);
                        setLogoBase64(canvas.toDataURL('image/png'));
                        setImageError(false);
                    };
                    img.onerror = () => {
                        console.error("CORS Image load failed. Triggering fallback.");
                        setImageError(true);
                    };
                } else {
                    setImageError(true);
                }
            } catch (error) { 
                console.error("Profile Fetch Error:", error); 
                setImageError(true);
            }
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
                link.download = `Invoice_${order.order_details.id.substring(0, 8).toUpperCase()}.png`;
                link.click();
            } catch (err) {
                console.error("Download failed", err);
                alert("Could not generate image. Please try 'Print' instead.");
            }
        }
    };

    if (!order || !supplierProfile) return <div className="loading-screen">Generating Invoice...</div>;

    const { order_details, order_items } = order;
    
    // --- CALCULATIONS ---
    const adjustedSubtotal = order_items.reduce((acc, item) => {
        const basePrice = parseFloat(item.price_at_purchase || 0);
        const profit = parseFloat(item.profit || 0);
        return acc + ((basePrice + profit) * item.quantity);
    }, 0);

    const SHIPPING_COST = parseFloat(order_details.total_delivery_charge || 0);
    const COMMISSION_COST = order_items.reduce((acc, item) => {
        return acc + parseFloat(item.system_commission || 0);
    }, 0);

    const dbGrandTotal = parseFloat(order_details.total_price || (adjustedSubtotal + SHIPPING_COST + COMMISSION_COST));

    const supplierName = supplierProfile.brand_name || supplierProfile.full_name || "Brand Store";
    const supplierId = supplierProfile.supplier_code || supplierProfile.id;
    const firstLetter = supplierName.charAt(0).toUpperCase();

    return (
        <div className="invoice-page-wrapper">
            
            {/* ACTIONS */}
            <div className="invoice-actions no-print">
                <button className="btn-action btn-back" onClick={() => navigate(`/orders/${order_details.id}`)}>← Back</button>
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
                        <div className="summary-title">Purchase Invoice</div>
                        <div className="summary-id">#{order_details.id.substring(0, 8).toUpperCase()}</div>
                        <div className="summary-date">{new Date(order_details.created_at).toLocaleString()}</div>
                    </div>
                </div>

                {/* 2. Supplier Section */}
                <div className="inv-supplier-styled">
                    <div className="supplier-blue-bar"></div>
                    <div className="inv-logo-box">
                        {imageError ? (
                            <div className="fallback-avatar-circle">{firstLetter}</div>
                        ) : (
                            <img 
                                src={logoBase64 || supplierProfile.profile_pic} 
                                alt="Logo" 
                                className="inv-logo"
                            />
                        )}
                    </div>
                    <div className="inv-supp-details">
                        <div className="supp-name-tag">{supplierName}</div>
                        <div className="supp-id-tag">Supplier Code: {supplierId}</div>
                    </div>
                </div>

                {/* 3. Shipping Details Grid */}
                <div className="inv-grid-container">
                    <div className="inv-grid-row">
                        <div className="inv-cell label-cell">Order Number:</div>
                        <div className="inv-cell value-cell">#{order_details.id.substring(0, 8).toUpperCase()}</div>
                        <div className="inv-cell label-cell">Payment Method:</div>
                        <div className="inv-cell value-cell">COD (Cash on Delivery)</div>
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

                {/* 4. Items Table (Wrapped in a responsive horizontal scroll div) */}
                <div className="inv-items-container">
                    <div className="items-header">Ordered Items details:</div>
                    <div className="inv-items-table-wrapper">
                        <table className="inv-items-table">
                            <thead>
                                <tr>
                                    <th style={{width: '5%'}}>#</th>
                                    <th style={{width: '25%'}}>Product Name</th>
                                    <th style={{width: '12%'}}>SKU</th>
                                    <th style={{width: '15%'}}>Colors/Sizes</th>
                                    <th style={{width: '6%'}}>Qty</th>
                                    <th style={{width: '11%'}}>Price</th>
                                    <th style={{width: '10%'}}>Delivery</th>
                                    <th style={{width: '10%'}}>Commission</th>
                                    <th style={{width: '11%', textAlign: 'right'}}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order_items.map((item, index) => {
                                    const basePrice = parseFloat(item.price_at_purchase || 0);
                                    const profit = parseFloat(item.profit || 0);
                                    const quantity = Number(item.quantity || 1);
                                    
                                    const finalDisplayPrice = basePrice + profit;
                                    
                                    const itemDelivery = parseFloat(item.delivery_charge || (index === 0 ? SHIPPING_COST : 0));
                                    const itemCommission = parseFloat(item.system_commission || (index === 0 ? COMMISSION_COST : 0));
                                    const rowTotal = (finalDisplayPrice * quantity) + itemDelivery + itemCommission;

                                    let optionsObj = {};
                                    try {
                                        optionsObj = (typeof item.options === 'string') ? JSON.parse(item.options) : (item.options || {});
                                    } catch (e) {
                                        optionsObj = {};
                                    }
                                    const color = optionsObj.color || "Standard";
                                    const size = optionsObj.size || "Standard";

                                    return (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td className="item-name-cell">
                                                {item.product_details.title}
                                            </td>
                                            <td>{item.product_details.sku || "N/A"}</td>
                                            <td>
                                                <div className="inv-variants-box">
                                                    <div><strong>Color:</strong> {color}</div>
                                                    <div style={{marginTop: '3px'}}><strong>Size:</strong> {size}</div>
                                                </div>
                                            </td>
                                            <td>{quantity}</td>
                                            <td>PKR {finalDisplayPrice.toLocaleString()}</td>
                                            <td>PKR {itemDelivery.toLocaleString()}</td>
                                            <td>PKR {itemCommission.toLocaleString()}</td>
                                            <td className="text-right">PKR {rowTotal.toLocaleString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 5. Totals */}
                <div className="inv-totals-section">
                    <div className="inv-totals-box">
                        <div className="t-row">
                            <span>Subtotal (Base + Profit):</span>
                            <span>PKR {adjustedSubtotal.toLocaleString()}</span>
                        </div>
                        <div className="t-row">
                            <span>Shipping Cost:</span>
                            <span>PKR {SHIPPING_COST.toLocaleString()}</span>
                        </div>
                        <div className="t-row">
                            <span>SJ10 Commission Fee:</span>
                            <span>PKR {COMMISSION_COST.toLocaleString()}</span>
                        </div>
                        <div className="t-row grand">
                            <span>Total Payable amount:</span>
                            <span>PKR {dbGrandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="inv-footer-branding">
                    <p>Generated securely via <strong>SJ10 Sellercenter</strong></p>
                    <p>This is a system generated document & does not require manual signature.</p>
                </div>

            </div>
        </div>
    );
};

export default InvoicePage;