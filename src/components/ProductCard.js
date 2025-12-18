// src/components/ProductCard.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// NOTE: This component is restored to its original horizontal list layout.
// The ONLY change is the price display logic.

const ProductCard = ({ product, cartCount = 0, onDelete }) => {
    const navigate = useNavigate();
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);

    const safeImageUrls = typeof product.image_urls === 'string' ? JSON.parse(product.image_urls) : (product.image_urls || []);
    const imageUrl = safeImageUrls.length > 0 ? safeImageUrls[0] : 'https://via.placeholder.com/80';

    const handleCopySku = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(product.sku).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                {/* This shimmer logic is from your original file */}
                {!isImageLoading && <div className="shimmer-wrapper"></div>}
                <img src={imageUrl} alt={product.title} className={`product-image ${isImageLoading ? 'loading' : 'loaded'}`} onLoad={() => setIsImageLoading(false)} />
            </div>
            <div className="product-details">
                <h3 className="product-title">{product.title}</h3>
                <div className="product-id-container">
                    <p className="product-sku">SKU: {product.sku}</p>
                    <button className="copy-id-btn" onClick={handleCopySku} title="Copy SKU">
                        {isCopied ? '✅' : '📋'}
                    </button>
                </div>
                <div className="product-meta">
                    {/* --- THIS IS THE ONLY MODIFIED PART --- */}
                    {product.discounted_price && product.discounted_price > 0 ? (
                        <>
                            <span className="product-price-discounted">PKR {product.discounted_price.toLocaleString()}</span>
                            <s className="product-price-original">PKR {product.price.toLocaleString()}</s>
                        </>
                    ) : (
                        <span className="product-price">PKR {product.price.toLocaleString()}</span>
                    )}
                    {/* --- END OF MODIFICATION --- */}
                    
                    <span className="product-stock">Stock: {product.quantity}</span>
                    <span className="product-views">👁️ {product.views || 0}</span>
                    <span className="product-carts">🛒 {cartCount}</span>
                </div>
            </div>
            <div className="product-actions">
                <button className="btn-icon btn-edit" onClick={() => navigate(`/products/edit/${product.id}`)} title="Edit Product">✏️</button>
                <button className="btn-icon btn-delete" onClick={() => onDelete(product.id)} title="Delete Product">🗑️</button>
            </div>
        </div>
    );
};

export default ProductCard;