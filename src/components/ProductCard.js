// src/components/ProductCard.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCount } from '../utils/formatCount'; // Import the formatter

const ProductCard = ({ 
    product, 
    onDelete, 
    isSelectionMode, 
    isSelected, 
    onToggleSelect, 
    onLongPress 
}) => {
    const navigate = useNavigate();
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    
    const timerRef = useRef(null);
    const isLongPress = useRef(false);

    const safeImageUrls = typeof product.image_urls === 'string' ? JSON.parse(product.image_urls) : (product.image_urls || []);
    const imageUrl = safeImageUrls.length > 0 ? safeImageUrls[0] : 'https://via.placeholder.com/80';

    const handleCopySku = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(product.sku).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const handleStart = () => {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            onLongPress(product.id);
        }, 500); 
    };

    const handleEnd = () => { if (timerRef.current) clearTimeout(timerRef.current); };

    const handleClick = () => {
        if (isLongPress.current) { isLongPress.current = false; return; }
        if (isSelectionMode) { onToggleSelect(product.id); } 
        else { navigate(`/products/edit/${product.id}`); }
    };

    return (
        <div 
            className={`product-card ${isSelected ? 'selected' : ''} ${isSelectionMode ? 'selection-mode' : ''}`}
            onMouseDown={handleStart} onMouseUp={handleEnd} onMouseLeave={handleEnd}
            onTouchStart={handleStart} onTouchEnd={handleEnd} onClick={handleClick}
        >
            <div className={`selection-overlay ${isSelected ? 'visible' : ''}`}><div className="checkmark-circle">✓</div></div>

            <div className="product-image-container">
                {isImageLoading && <div className="shimmer-wrapper"></div>}
                <img src={imageUrl} alt={product.title} className="product-image" onLoad={() => setIsImageLoading(false)} />
            </div>

            <div className="product-details">
                <h3 className="product-title">{product.title}</h3>
                <div className="product-id-container">
                    <p className="product-sku">SKU: {product.sku}</p>
                    <button className="copy-id-btn" onClick={handleCopySku} title="Copy SKU">{isCopied ? '✅' : '📋'}</button>
                </div>
                
                <div className="product-meta">
                    <div className="price-wrapper">
                        {product.discounted_price && parseFloat(product.discounted_price) > 0 ? (
                            <>
                                <span className="product-price-discounted">Rs. {parseFloat(product.discounted_price).toLocaleString()}</span>
                                <s className="product-price-original">{parseFloat(product.price).toLocaleString()}</s>
                            </>
                        ) : ( <span className="product-price">Rs. {parseFloat(product.price).toLocaleString()}</span> )}
                    </div>
                    
                    <div className="stock-wrapper">
                        <span className={`stock-badge ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {product.quantity > 0 ? `Stock: ${product.quantity}` : 'Out of Stock'}
                        </span>
                    </div>
                </div>

                {/* --- STATS ROW WITH FORMATTING --- */}
                <div className="product-stats-row">
                    <span className="stat-item">👁️ {formatCount(product.views)}</span>
                    <span className="stat-item">🛒 {formatCount(product.cart_count)}</span>
                    <span className="stat-item">❤️ {formatCount(product.favorite_count)}</span>
                </div>
            </div>

            {!isSelectionMode && (
                <div className="product-actions">
                    <button className="btn-icon btn-edit" onClick={(e) => { e.stopPropagation(); navigate(`/products/edit/${product.id}`); }}>✏️</button>
                    <button className="btn-icon btn-delete" onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}>🗑️</button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;