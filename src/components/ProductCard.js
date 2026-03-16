// src/components/ProductCard.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCount } from '../utils/formatCount'; 

const ProductCard = ({ 
    product, 
    onDelete, 
    isSelectionMode, 
    isSelected, 
    onToggleSelect, 
    onLongPress 
}) => {
    const navigate = useNavigate();
    const [isImgLoaded, setIsImgLoaded] = useState(false);
    
    const timerRef = useRef(null);
    const isLongPress = useRef(false);

    const imageUrl = product.image_urls?.length > 0 ? product.image_urls[0] : 'https://via.placeholder.com/80';

    // --- WHATSAPP-STYLE LONG PRESS (1.2 Seconds) ---
    const handleStart = () => {
        isLongPress.current = false;
        
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            // Haptic Feedback for premium mobile feel
            if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
            onLongPress(product.id);
        }, 1200); // 1.2s delay prevents accidental triggers
    };

    // Cancels hold if user lifts finger or starts scrolling (TouchMove)
    const handleCancel = () => { 
        if (timerRef.current) clearTimeout(timerRef.current); 
    };

    const handleClick = () => {
        if (isLongPress.current) { 
            isLongPress.current = false; 
            return; 
        }
        if (isSelectionMode) { 
            onToggleSelect(product.id); 
        } else { 
            navigate(`/products/edit/${product.id}`); 
        }
    };

    return (
        <div 
            className={`premium-product-card ${isSelected ? 'selected' : ''} ${isSelectionMode ? 'selection-mode' : ''}`}
            onMouseDown={handleStart} 
            onMouseUp={handleCancel} 
            onMouseLeave={handleCancel}
            onTouchStart={handleStart} 
            onTouchEnd={handleCancel} 
            onTouchMove={handleCancel} /* CRITICAL: Cancels long-press while scrolling */
            onClick={handleClick}
        >
            {/* WhatsApp Style Tick */}
            <div className={`whatsapp-tick ${isSelected ? 'visible' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>

            <div className="product-image-container">
                {/* Instant Shimmer until image loads */}
                {!isImgLoaded && <div className="shimmer-img-overlay shimmer-bg"></div>}
                <img 
                    src={imageUrl} 
                    alt={product.title} 
                    className="product-image" 
                    onLoad={() => setIsImgLoaded(true)} 
                    onError={() => setIsImgLoaded(true)} // Prevents infinite shimmer on broken images
                    style={{ opacity: isImgLoaded ? 1 : 0 }}
                />
            </div>

            <div className="product-details">
                <h3 className="product-title" title={product.title}>{product.title}</h3>
                <p className="product-sku">SKU: {product.sku}</p>
                
                <div className="product-meta">
                    <div className="price-wrapper">
                        {product.discounted_price && parseFloat(product.discounted_price) > 0 ? (
                            <>
                                <span className="product-price-discounted">Rs. {parseFloat(product.discounted_price).toLocaleString()}</span>
                                <s className="product-price-original">{parseFloat(product.price).toLocaleString()}</s>
                            </>
                        ) : ( 
                            <span className="product-price">Rs. {parseFloat(product.price).toLocaleString()}</span> 
                        )}
                    </div>
                    
                    <span className={`stock-badge ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                    </span>
                </div>

                <div className="product-stats-row">
                    <span className="stat-item">👁️ {formatCount(product.views)}</span>
                    <span className="stat-item">🛒 {formatCount(product.cart_count)}</span>
                    <span className="stat-item">❤️ {formatCount(product.favorite_count)}</span>
                </div>
            </div>

            {!isSelectionMode && (
                <div className="product-actions-menu">
                    <button className="btn-icon-soft" onClick={(e) => { e.stopPropagation(); navigate(`/products/edit/${product.id}`); }}>✏️</button>
                    <button className="btn-icon-soft text-red" onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}>🗑️</button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;