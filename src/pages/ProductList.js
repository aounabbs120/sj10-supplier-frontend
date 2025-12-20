// src/pages/ProductList.js

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse'; 
import supplierService from '../services/supplierService';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const ProductCardSkeleton = () => (
    <div className="product-card-skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-details">
            <div className="skeleton-line title"></div>
            <div className="skeleton-line text"></div>
        </div>
    </div>
);

const ProductList = ({ setIsLoading }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // --- SELECTION STATE ---
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await supplierService.getMyProducts();
            setProducts(data);
        } catch (error) { console.error("Failed to fetch products:", error); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
            let matchesStatus = true;
            if (filterStatus === 'in_stock') matchesStatus = p.quantity > 0;
            else if (filterStatus === 'out_of_stock') matchesStatus = p.quantity === 0;
            return matchesSearch && matchesStatus;
        });
    }, [products, searchTerm, filterStatus]);

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                if(setIsLoading) setIsLoading(true);
                await supplierService.deleteProduct(productId);
                await fetchProducts(); 
            } catch (error) { alert('Could not delete product.'); }
            finally { if(setIsLoading) setIsLoading(false); }
        }
    };

    // --- CSV FUNCTIONS ---
    const handleImportClick = () => fileInputRef.current.click();
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if(setIsLoading) setIsLoading(true);
        Papa.parse(file, {
            header: true, skipEmptyLines: true,
            complete: async (results) => {
                alert(`${results.data.length} products parsed.`);
                if(setIsLoading) setIsLoading(false);
                fileInputRef.current.value = '';
            }
        });
    };

    const handleExport = () => {
        if (filteredProducts.length === 0) return alert("No products to export.");
        const csvData = Papa.unparse(filteredProducts.map(p => ({
            ...p, attributes: JSON.stringify(p.attributes), image_urls: JSON.stringify(p.image_urls)
        })));
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `products_export_${Date.now()}.csv`;
        link.click();
    };

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
        if (selectedIds.size === filteredProducts.length) {
            setSelectedIds(new Set());
            setIsSelectionMode(false);
        } else {
            const allIds = filteredProducts.map(p => p.id);
            setSelectedIds(new Set(allIds));
            setIsSelectionMode(true);
        }
    };

    const handleCancelSelection = () => {
        setSelectedIds(new Set());
        setIsSelectionMode(false);
    };

    const handleBulkAction = async (actionType) => {
        if (selectedIds.size === 0) return;
        if (actionType === 'delete' && !window.confirm(`Permanently delete ${selectedIds.size} items?`)) return;

        if(setIsLoading) setIsLoading(true);
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
            await fetchProducts();
            handleCancelSelection();
        } catch (e) { alert("Operation failed."); }
        finally { if(setIsLoading) setIsLoading(false); }
    };

    return (
        <div className={`product-list-container ${isSelectionMode ? 'selection-active' : ''}`}>
            
            {/* HEADER */}
            <div className="product-list-header">
                <div className="header-title-group">
                    <h1>Inventory</h1>
                    <span className="product-count-badge">{filteredProducts.length} Items</span>
                </div>
                
                <div className="header-actions">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} accept=".csv" />
                    
                    {/* DESKTOP BUTTONS (Hidden on Mobile) */}
                    <button className="action-btn-desktop" onClick={handleImportClick}>
                        <span className="icon">📥</span> Import CSV
                    </button>
                    <button className="action-btn-desktop" onClick={handleExport}>
                        <span className="icon">📤</span> Export CSV
                    </button>
                    
                    {/* MOBILE BUTTONS (Hidden on Desktop) */}
                    <button className="action-btn-mobile" onClick={handleImportClick} title="Import">📥</button>
                    <button className="action-btn-mobile" onClick={handleExport} title="Export">📤</button>
                    
                    {/* ADD BUTTON */}
                    <button className="btn-add-product" onClick={() => navigate('/products/add')}>
                        <span className="plus-sign">+</span>
                    </button>
                </div>
            </div>

            {/* SELECTION STATUS BAR */}
            <div className={`selection-status-bar ${isSelectionMode ? 'visible' : ''}`}>
                <div className="selection-count">{selectedIds.size} Selected</div>
                <div className="selection-controls">
                    <button onClick={handleSelectAll}>
                        {selectedIds.size === filteredProducts.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <button className="cancel-btn" onClick={handleCancelSelection}>Cancel</button>
                </div>
            </div>

            {/* SEARCH */}
            <div className="search-bar-container">
                <span className="search-icon">🔍</span>
                <input 
                    type="text"
                    className="search-input"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isSelectionMode}
                />
            </div>

            {/* FILTER TABS */}
            <div className="filter-tabs-container">
                <button className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>All</button>
                <button className={`filter-tab ${filterStatus === 'in_stock' ? 'active' : ''}`} onClick={() => setFilterStatus('in_stock')}>In Stock</button>
                <button className={`filter-tab ${filterStatus === 'out_of_stock' ? 'active' : ''}`} onClick={() => setFilterStatus('out_of_stock')}>Out of Stock</button>
            </div>

            {/* LIST */}
            <div className="products-scroll-area">
                {loading ? (
                    Array(6).fill(0).map((_, index) => <ProductCardSkeleton key={index} />)
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            // Ensure backend cart count or 0 is passed
                            cartCount={product.cart_count || 0} 
                            onDelete={handleDelete}
                            isSelectionMode={isSelectionMode}
                            isSelected={selectedIds.has(product.id)}
                            onToggleSelect={toggleSelection}
                            onLongPress={handleLongPress}
                        />
                    ))
                ) : (
                    <div className="no-products-message">
                        <p>No products found.</p>
                    </div>
                )}
            </div>

            {/* FLOATING ACTION BAR */}
            <div className={`floating-bottom-bar ${isSelectionMode ? 'visible' : ''}`}>
                <button className="fab-action btn-instock" onClick={() => handleBulkAction('in_stock')}>
                    <span className="fab-icon">⚡</span>
                    <span className="fab-label">In Stock</span>
                </button>
                <button className="fab-action btn-outstock" onClick={() => handleBulkAction('out_stock')}>
                    <span className="fab-icon">🚫</span>
                    <span className="fab-label">Out Stock</span>
                </button>
                <button className="fab-action btn-delete-bulk" onClick={() => handleBulkAction('delete')}>
                    <span className="fab-icon">🗑️</span>
                    <span className="fab-label">Delete</span>
                </button>
            </div>
        </div>
    );
};

export default ProductList;