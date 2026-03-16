// src/pages/ProductList.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRInfinite from 'swr/infinite';
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

const ProductList = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const loaderRef = useRef(null);

    // --- UI STATES ---
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(''); 
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // DEBOUNCE EFFECT: Prevents backend crash when typing fast
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // --- ⚡ SWR INFINITE CACHING & FETCHING ⚡ ---
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.hasMore) return null; 
        return `/supplier/products/paginated?page=${pageIndex + 1}&limit=40&search=${encodeURIComponent(debouncedSearch)}&status=${filterStatus}`;
    };

    const fetcher = async (url) => {
        return await supplierService.genericGet(url);
    };

    const { data, error, size, setSize, mutate } = useSWRInfinite(getKey, fetcher, {
        revalidateOnFocus: true,    // Silently updates data if user switches tabs and comes back
        revalidateFirstPage: false, // Don't refetch the first page if we are fetching page 2
        persistSize: true           // Keeps old chunks on screen while new ones load
    });

    // Extract products safely
    const products = data ? data.flatMap(page => page.products || []) : [];
    
    // Safely extract totalCount from the first page payload
    const totalCount = data?.[0]?.totalCount;
    const isTotalCountLoading = !data && !error;
    
    const isLoadingInitialData = !data && !error;
    const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
    const isReachingEnd = data && data[data.length - 1]?.hasMore === false;
    const isEmpty = products.length === 0;

    // --- INTERSECTION OBSERVER (INFINITE SCROLL) ---
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingMore && !isReachingEnd) {
                    setSize(size + 1); 
                }
            },
            { rootMargin: '400px' } 
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [isLoadingMore, isReachingEnd, size, setSize]);

    // Reset pagination on search or filter change
    useEffect(() => {
        setSize(1);
    }, [debouncedSearch, filterStatus, setSize]);

    // --- SELECTION LOGIC ---
    const handleLongPress = (productId) => {
        setIsSelectionMode(true);
        toggleSelection(productId);
    };

    const toggleSelection = (productId) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) newSet.delete(productId);
            else newSet.add(productId);
            if (newSet.size === 0) setIsSelectionMode(false);
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedIds.size === products.length) {
            setSelectedIds(new Set());
            setIsSelectionMode(false);
        } else {
            setSelectedIds(new Set(products.map(p => p.id)));
            setIsSelectionMode(true);
        }
    };

    const handleCancelSelection = () => {
        setSelectedIds(new Set());
        setIsSelectionMode(false);
    };

    // --- ACTIONS ---
    const handleDelete = async (productId) => {
        if (window.confirm('Permanently delete this product?')) {
            try {
                // Optimistic update
                mutate(data.map(page => ({
                    ...page,
                    products: page.products.filter(p => p.id !== productId)
                })), false);
                
                await supplierService.deleteProduct(productId);
                mutate(); // Revalidate from server
            } catch (err) { alert('Could not delete product.'); }
        }
    };

    const handleBulkAction = async (actionType) => {
        if (selectedIds.size === 0) return;
        if (actionType === 'delete' && !window.confirm(`Permanently delete ${selectedIds.size} items?`)) return;

        try {
            const updates = [...selectedIds].map(id => {
                if (actionType === 'delete') return supplierService.deleteProduct(id);
                const product = products.find(p => p.id === id);
                let payload = {};
                if (actionType === 'in_stock') payload = { quantity: product.quantity > 0 ? product.quantity : 10, status: 'in_stock' };
                else if (actionType === 'out_stock') payload = { quantity: 0, status: 'out_of_stock' };
                return supplierService.updateProduct(id, payload);
            });
            
            await Promise.all(updates);
            handleCancelSelection();
            mutate(); // Revalidate silently
        } catch (e) { alert("Operation failed."); } 
    };

    // --- FILE IMPORTS/EXPORTS ---
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        Papa.parse(file, {
            header: true, skipEmptyLines: true,
            complete: async (results) => {
                alert(`${results.data.length} products parsed.`);
                fileInputRef.current.value = '';
                mutate();
            }
        });
    };

    const handleExport = () => {
        if (products.length === 0) return alert("No products to export.");
        const csvData = Papa.unparse(products.map(p => ({ ...p, attributes: JSON.stringify(p.attributes), image_urls: JSON.stringify(p.image_urls) })));
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `products_export_${Date.now()}.csv`;
        link.click();
    };

    if (error) return <div className="error-state-message">Failed to load inventory. Please check your connection.</div>;

    return (
        <div className={`product-list-container ${isSelectionMode ? 'selection-active' : ''}`}>
            
            {/* --- HEADER --- */}
            <div className="product-list-header">
                <div className="header-title-group">
                    <h1>Inventory</h1>
                    <span className="product-count-badge">
                        {isTotalCountLoading 
                            ? 'Loading items...' 
                            : totalCount !== null && totalCount !== undefined
                                ? `Total ${totalCount.toLocaleString()} Items` 
                                : `${products.length} Filtered Items`}
                    </span>
                </div>
                
                <div className="header-actions">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} accept=".csv" />
                    <button className="action-btn-desktop" onClick={() => fileInputRef.current.click()}><span className="icon">📥</span> Import</button>
                    <button className="action-btn-desktop" onClick={handleExport}><span className="icon">📤</span> Export</button>
                    <button className="btn-add-product" onClick={() => navigate('/products/add')}><span className="plus-sign">+</span></button>
                </div>
            </div>

            {/* --- SELECTION ACTION BAR --- */}
            <div className={`selection-status-bar ${isSelectionMode ? 'visible' : ''}`}>
                <div className="selection-count">{selectedIds.size} Selected</div>
                <div className="selection-controls">
                    <button onClick={handleSelectAll}>{selectedIds.size === products.length ? 'Deselect All' : 'Select All'}</button>
                    <button className="cancel-btn" onClick={handleCancelSelection}>Cancel</button>
                </div>
            </div>

            {/* --- BEAUTIFUL SEARCH & FILTER --- */}
            <div className="search-filter-wrapper">
                <div className="search-bar-container">
                    <span className="search-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </span>
                    <input 
                        type="text" className="search-input" placeholder="Search by title or SKU..." 
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={isSelectionMode}
                    />
                    {searchTerm && (
                        <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
                    )}
                </div>
                <div className="filter-tabs-container">
                    <button className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>All</button>
                    <button className={`filter-tab ${filterStatus === 'in_stock' ? 'active' : ''}`} onClick={() => setFilterStatus('in_stock')}>In Stock</button>
                    <button className={`filter-tab ${filterStatus === 'out_of_stock' ? 'active' : ''}`} onClick={() => setFilterStatus('out_of_stock')}>Out of Stock</button>
                </div>
            </div>

            {/* --- PRODUCT LIST (Infinite Scroll Area) --- */}
            <div className="products-scroll-area">
                {isLoadingInitialData ? (
                    Array(8).fill(0).map((_, idx) => <ProductCardSkeleton key={idx} />)
                ) : isEmpty ? (
                    <div className="no-products-message">
                        <div className="empty-icon">📦</div>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <>
                        {products.map(product => (
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
                        
                        {/* BOTTOM LOADER & END MESSAGE */}
                        <div ref={loaderRef} className="list-footer-status">
                            {isLoadingMore ? (
                                <div className="infinite-loader-text">
                                    Loading more items<span>.</span><span>.</span><span>.</span>
                                </div>
                            ) : isReachingEnd && products.length >= 40 ? (
                                <div className="end-of-list-msg">
                                    <span className="end-icon">✓</span>
                                    <p>End of Results</p>
                                </div>
                            ) : null}
                        </div>
                    </>
                )}
            </div>

            {/* --- FLOATING BULK ACTIONS --- */}
            <div className={`floating-bottom-bar ${isSelectionMode ? 'visible' : ''}`}>
                <button className="fab-action btn-instock" onClick={() => handleBulkAction('in_stock')}><span className="fab-icon">⚡</span><span className="fab-label">In Stock</span></button>
                <button className="fab-action btn-outstock" onClick={() => handleBulkAction('out_stock')}><span className="fab-icon">🚫</span><span className="fab-label">Out Stock</span></button>
                <button className="fab-action btn-delete-bulk" onClick={() => handleBulkAction('delete')}><span className="fab-icon">🗑️</span><span className="fab-label">Delete</span></button>
            </div>
        </div>
    );
};

export default ProductList;