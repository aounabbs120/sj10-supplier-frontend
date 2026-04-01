// src/components/ProductCard.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Copy, Check, Eye, ShoppingCart, Heart } from 'lucide-react';
import { formatCount } from '../utils/formatCount';

const ProductCard = ({ product, onDelete, isSelectionMode, isSelected, onToggleSelect, onLongPress }) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(null);
    const timerRef = useRef(null);
    const longPressActive = useRef(false);
    
    // Detect mobile accurately
    const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 500);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const imageUrl = product.image_urls?.[0] || 'https://via.placeholder.com/150';

    const handleCopy = (e, text, id) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 1500);
    };

    const handleStart = () => {
        longPressActive.current = false;
        timerRef.current = setTimeout(() => {
            longPressActive.current = true;
            if (window.navigator.vibrate) window.navigator.vibrate(50);
            onLongPress(product.id);
        }, 800); 
    };

    const handleEnd = () => { if (timerRef.current) clearTimeout(timerRef.current); };

    const handleCardClick = () => {
        if (longPressActive.current) return;
        if (isSelectionMode) onToggleSelect(product.id);
        else navigate(`/products/edit/${product.id}`);
    };

    // --- PREMIUM STYLES ---
    const styles = {
        card: {
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: isSelected ? '2px solid #4f46e5' : '1px solid #eef2f6',
            position: 'relative',
            marginBottom: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            userSelect: 'none',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden', // Ensures nothing bleeds out
        },
        selectionTick: {
            position: 'absolute',
            top: '8px',
            left: '8px',
            width: '20px',
            height: '20px',
            backgroundColor: '#4f46e5',
            borderRadius: '50%',
            display: isSelected ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            border: '2px solid white'
        },
        container: {
            display: 'flex',
            padding: isMobile ? '8px' : '12px',
            gap: isMobile ? '10px' : '15px',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box'
        },
        imageWrapper: {
            width: isMobile ? '85px' : '110px',
            height: isMobile ? '85px' : '110px',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0, // Prevents image from squishing
            backgroundColor: '#f8fafc'
        },
        stockBadge: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            fontSize: '8px',
            fontWeight: '900',
            textAlign: 'center',
            padding: '3px 0',
            color: 'white',
            textTransform: 'uppercase',
            backgroundColor: product.quantity > 0 ? '#10b981' : '#ef4444'
        },
        infoBox: {
            flex: 1, // Takes all available space
            minWidth: 0, // 🔥 CRITICAL: Allows child text to truncate
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
        },
        title: {
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis', // Adds "..."
            width: '100%'
        },
        skuRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10px',
            color: '#94a3b8',
            fontFamily: 'monospace'
        },
        price: {
            fontSize: isMobile ? '15px' : '18px',
            fontWeight: '800',
            color: '#0f172a',
            margin: '2px 0'
        },
        statsRow: {
            display: 'flex',
            gap: '8px',
            marginTop: '4px'
        },
        statPill: {
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '10px',
            fontWeight: '700',
            color: '#64748b',
            backgroundColor: '#f1f5f9',
            padding: '2px 6px',
            borderRadius: '5px'
        },
        actionColumn: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingLeft: '5px',
            borderLeft: '1px solid #f1f5f9',
            flexShrink: 0 // Keeps buttons from moving
        },
        btn: {
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: '#f8fafc',
            color: '#64748b'
        }
    };

    return (
        <div 
            style={styles.card}
            onMouseDown={handleStart} onMouseUp={handleEnd} onTouchStart={handleStart} onTouchEnd={handleEnd}
            onClick={handleCardClick}
        >
            <div style={styles.selectionTick}><Check size={12} color="white" strokeWidth={4}/></div>

            <div style={styles.container}>
                {/* 1. Image */}
                <div style={styles.imageWrapper}>
                    <img src={imageUrl} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="" loading="lazy" />
                    <div style={styles.stockBadge}>{product.quantity > 0 ? 'INSTOCK' : 'OUT'}</div>
                </div>

                {/* 2. Info */}
                <div style={styles.infoBox}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <h3 style={styles.title}>{product.title}</h3>
                        <button style={{background:'none', border:'none', padding:2, color:'#cbd5e1'}} onClick={(e)=>handleCopy(e, product.title, 't')}>
                            {copied === 't' ? <Check size={12} color="#10b981"/> : <Copy size={12}/>}
                        </button>
                    </div>
                    
                    <div style={styles.skuRow}>
                        <span>SKU: {product.sku}</span>
                        <button style={{background:'none', border:'none', padding:0, color:'#cbd5e1'}} onClick={(e)=>handleCopy(e, product.sku, 's')}>
                            {copied === 's' ? <Check size={12} color="#10b981"/> : <Copy size={12}/>}
                        </button>
                    </div>

                    <div style={styles.price}>Rs. {product.discounted_price?.toLocaleString()}</div>

                    <div style={styles.statsRow}>
                        <div style={styles.statPill}><Eye size={12}/> {formatCount(product.views)}</div>
                        <div style={styles.statPill}><ShoppingCart size={12}/> {formatCount(product.cart_count)}</div>
                        <div style={styles.statPill}><Heart size={12}/> {formatCount(product.favorite_count)}</div>
                    </div>
                </div>

                {/* 3. Actions */}
                <div style={styles.actionColumn}>
                    <button style={styles.btn} onClick={(e) => { e.stopPropagation(); navigate(`/products/edit/${product.id}`); }}>
                        <Edit size={16}/>
                    </button>
                    <button style={{...styles.btn, color:'#ef4444'}} onClick={(e) => { e.stopPropagation(); onDelete(product.id, product._shardKey); }}>
                        <Trash2 size={16}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;