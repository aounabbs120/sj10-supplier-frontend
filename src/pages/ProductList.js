// src/pages/ProductList.js
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr'; // Using the simpler useSWR hook now
import Papa from 'papaparse'; 
import supplierService from '../services/supplierService';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const ProductCardSkeleton = () => (
    <div className="product-card-skeleton">
        <div className="skeleton-img-box shimmer-bg"></div>
        <div className="skeleton-details">
            <div className="skeleton-line title shimmer-bg"></div>
            <div className="skeleton-line meta shimmer-bg"></div>
            <div className="skeleton-line short shimmer-bg"></div>
        </div>
    </div>
);

// SWR Fetcher now points to our new, fast backend endpoint
const fetcher = async () => {
    return await supplierService.genericGet('/supplier/products/all-light');
};

const ProductList = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const loaderRef = useRef(null); // For IntersectionObserver

    // --- SWR CACHING ---
    const { data: allProducts = [], error, isLoading, mutate } = useSWR('sj10_all_light_products', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 60000, 
    });

    // --- UI STATES ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [visibleCount, setVisibleCount] = useState(40);

    // --- FRONTEND FILTERING (Lightning Fast) ---
    const filteredProducts = useMemo(() => {
        if (!allProducts) return [];
        return allProducts.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
            let matchesStatus = true;
            if (filterStatus === 'in_stock') matchesStatus = p.quantity > 0;
            else if (filterStatus === 'out_of_stock') matchesStatus = p.quantity === 0;
            return matchesSearch && matchesStatus;
        });
    }, [allProducts, searchTerm, filterStatus]);

    // Reset chunks when filters change
    useEffect(() => {
        setVisibleCount(40);
        window.scrollTo(0, 0);
    }, [searchTerm, filterStatus]);

    // --- Intersection Observer for Infinite Scroll ---
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
                    setVisibleCount(prev => Math.min(prev + 40, filteredProducts.length));
                }
            },
            { rootMargin: '400px' }
        );
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [visibleCount, filteredProducts.length]);

    const displayedProducts = useMemo(() => {
        return filteredProducts.slice(0, visibleCount);
    }, [filteredProducts, visibleCount]);

    const isReachingEnd = visibleCount >= filteredProducts.length;

    // --- SELECTION & ACTIONS (No changes needed here) ---
    const handleLongPress = (productId) => { /* ... same as before ... */ setIsSelectionMode(true); toggleSelection(productId); };
    const toggleSelection = (productId) => { /* ... same as before ... */ setSelectedIds(prev => { const newSet = new Set(prev); if (newSet.has(productId)) newSet.delete(productId); else newSet.add(productId); if (newSet.size === 0) setIsSelectionMode(false); return newSet; }); };
    const handleSelectAll = () => { /* ... same as before ... */ if (selectedIds.size === filteredProducts.length) { setSelectedIds(new Set()); setIsSelectionMode(false); } else { setSelectedIds(new Set(filteredProducts.map(p => p.id))); setIsSelectionMode(true); } };
    const handleCancelSelection = () => { /* ... same as before ... */ setSelectedIds(new Set()); setIsSelectionMode(false); };
    const handleDelete = async (productId) => { if (window.confirm('Permanently delete?')) { try { await supplierService.deleteProduct(productId); mutate(); } catch (err) { alert('Delete failed.'); } } };
    const handleBulkAction = async (actionType) => { /* ... same as before ... */ }; // This logic remains the same
    const handleFileSelect = (event) => { /* ... same as before ... */ }; // This logic remains the same
    const handleExport = () => { /* ... same as before ... */ }; // This logic remains the same
    
    if (error) return <div className="error-state-message">Failed to load inventory. Please check your connection and refresh.</div>;

    return (
        <div className={`product-list-container ${isSelectionMode ? 'selection-active' : ''}`}>
            
            <div className="product-list-header">
                <div className="header-title-group">
                    <h1>Inventory</h1>
                    <span className="product-count-badge">
                        {isLoading ? 'Loading...' : `Total ${allProducts.length.toLocaleString()} Items`}
                    </span>
                </div>
                <div className="header-actions">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} accept=".csv" />
                    <button className="action-btn-desktop" onClick={() => fileInputRef.current.click()}><span className="icon">📥</span> Import</button>
                    <button className="action-btn-desktop" onClick={handleExport}><span className="icon">📤</span> Export</button>
                    <button className="btn-add-product" onClick={() => navigate('/products/add')}><span className="plus-sign">+</span></button>
                </div>
            </div>

            <div className={`selection-status-bar ${isSelectionMode ? 'visible' : ''}`}>
                <div className="selection-count">{selectedIds.size} Selected</div>
                <div className="selection-controls">
                    <button onClick={handleSelectAll}>{selectedIds.size === filteredProducts.length ? 'Deselect All' : 'Select All'}</button>
                    <button className="cancel-btn" onClick={handleCancelSelection}>Cancel</button>
                </div>
            </div>

            <div className="search-filter-wrapper">
                <div className="search-bar-container">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" className="search-input" placeholder="Search by title or SKU..." 
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={isSelectionMode}
                    />
                    {searchTerm && (<button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>)}
                </div>
                <div className="filter-tabs-container">
                    <button className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>All</button>
                    <button className={`filter-tab ${filterStatus === 'in_stock' ? 'active' : ''}`} onClick={() => setFilterStatus('in_stock')}>In Stock</button>
                    <button className={`filter-tab ${filterStatus === 'out_of_stock' ? 'active' : ''}`} onClick={() => setFilterStatus('out_of_stock')}>Out of Stock</button>
                </div>
            </div>

            <div className="products-scroll-area">
                {isLoading ? (
                    Array(10).fill(0).map((_, idx) => <ProductCardSkeleton key={idx} />)
                ) : displayedProducts.length > 0 ? (
                    <>
                        {displayedProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onDelete={handleDelete}
                                isSelectionMode={isSelectionMode}
                                isSelected={selectedIds.has(product.id)}
                                onToggleSelect={toggleSelection}
                                onLongPress={handleLongPress}
                            />
                        ))}
                        
                        <div ref={loaderRef} className="list-footer-status">
                            {!isReachingEnd ? (
                                <div className="infinite-loader-text">
                                    Loading more items<span>.</span><span>.</span><span>.</span>
                                </div>
                            ) : (
                                <div className="end-of-list-msg">
                                    <span className="end-icon">✓</span>
                                    <p>End of Results</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="no-products-message">
                        <div className="empty-icon">📦</div>
                        <h3>No products found</h3>
                        <p>Your search or filter returned no results.</p>
                    </div>
                )}
            </div>

            <div className={`floating-bottom-bar ${isSelectionMode ? 'visible' : ''}`}>
                <button className="fab-action" onClick={() => handleBulkAction('in_stock')}><span className="fab-icon">⚡</span><span className="fab-label">In Stock</span></button>
                <button className="fab-action" onClick={() => handleBulkAction('out_stock')}><span className="fab-icon">🚫</span><span className="fab-label">Out Stock</span></button>
                <button className="fab-action" onClick={() => handleBulkAction('delete')}><span className="fab-icon">🗑️</span><span className="fab-label">Delete</span></button>
            </div>
        </div>
    );
};

export default ProductList;