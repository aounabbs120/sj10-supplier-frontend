// src/pages/ProductList.js
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRInfinite from 'swr/infinite';
import { 
    Search, Plus, Loader2, Trash2, CheckCircle, 
    XCircle, CheckSquare, Square, X 
} from 'lucide-react';
import supplierService from '../services/supplierService';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const ProductList = ({ setIsLoading }) => {
    const navigate = useNavigate();
    const loaderRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

   const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.hasMore) return null;
    
    // Yahan '/supplier' ko badal kar '/suppliers' kar dein
    return `/suppliers/products/paginated?page=${pageIndex + 1}&limit=40&search=${encodeURIComponent(debouncedSearch)}&status=${filterStatus}`;
};

    const { data, size, setSize, mutate, isValidating, isLoading } = useSWRInfinite(
        getKey, (url) => supplierService.genericGet(url), { 
            revalidateOnFocus: false, 
            persistSize: true,
            revalidateFirstPage: false 
        }
    );

    const products = useMemo(() => data ? data.flatMap(page => page.products || []) : [], [data]);
    const totalCount = data?.[0]?.totalCount || 0;
    const isReachingEnd = data && data[data.length - 1]?.hasMore === false;

    // 🔥 FIXED: STABLE INTERSECTION OBSERVER 🔥
    useEffect(() => {
        const currentLoader = loaderRef.current;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isValidating && !isReachingEnd && products.length > 0) {
                setSize(s => s + 1);
            }
        }, { rootMargin: '200px' });

        if (currentLoader) observer.observe(currentLoader);
        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
        // Removed unnecessary dependencies that cause the size-change error
    }, [isValidating, isReachingEnd, products.length, setSize]);

    useEffect(() => { setSize(1); }, [debouncedSearch, filterStatus, setSize]);

    const handleAction = async (type, productId = null, shard = null) => {
        const ids = productId ? [productId] : [...selectedIds];
        if (ids.length === 0) return;
        const optimisticData = data.map(page => ({
            ...page,
            products: page.products.filter(p => !(type === 'delete' && ids.includes(p.id))).map(p => {
                if (ids.includes(p.id)) {
                    if (type === 'in_stock') return { ...p, quantity: 10 };
                    if (type === 'out_of_stock') return { ...p, quantity: 0 };
                }
                return p;
            })
        }));
        mutate(optimisticData, false);
        try {
            const promises = ids.map(id => {
                const p = products.find(item => item.id === id);
                const s = shard || p?._shardKey;
                if (type === 'delete') return supplierService.deleteProduct(id, s);
                return supplierService.updateProduct(id, { quantity: type === 'in_stock' ? 10 : 0 }, s);
            });
            await Promise.all(promises);
            if (!productId) { setIsSelectionMode(false); setSelectedIds(new Set()); }
            mutate();
        } catch (e) { mutate(); }
    };

    return (
        <div className="pro-lux-container">
            <header className="pro-lux-header">
                <div className="pro-lux-top">
                    <div className="pro-lux-title">
                        <h1>Inventory</h1>
                        <span className="pro-lux-total">{totalCount} items</span>
                    </div>
                    <div className="pro-lux-btns">
                        {isSelectionMode && (
                            <button className="pro-lux-sel-all" onClick={() => {
                                if (selectedIds.size === products.length) {
                                    setSelectedIds(new Set()); setIsSelectionMode(false);
                                } else {
                                    setSelectedIds(new Set(products.map(p => p.id))); setIsSelectionMode(true);
                                }
                            }}>
                                {selectedIds.size === products.length ? <CheckSquare size={18}/> : <Square size={18}/>}
                                <span>All</span>
                            </button>
                        )}
                        <button className="pro-lux-add" onClick={() => navigate('/products/add')}>
                            <Plus size={18}/> <span>Add</span>
                        </button>
                    </div>
                </div>

                <div className="pro-lux-search">
                    <Search className="pro-lux-s-icon" size={18}/>
                    <input type="text" placeholder="Search SKU or Title..." onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                <div className="pro-lux-tabs">
                    {['all', 'in_stock', 'out_of_stock'].map(f => (
                        <button key={f} className={`pro-lux-tab ${filterStatus === f ? 'active' : ''}`} onClick={() => setFilterStatus(f)}>
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </header>

            <main className="pro-lux-grid">
                {products.map(p => (
                    <ProductCard 
                        key={p.id} product={p} 
                        onDelete={(id, shard) => handleAction('delete', id, shard)}
                        isSelectionMode={isSelectionMode} isSelected={selectedIds.has(p.id)}
                        onToggleSelect={(id) => {
                            const next = new Set(selectedIds);
                            if(next.has(id)) next.delete(id); else next.add(id);
                            setSelectedIds(next);
                            if (next.size === 0) setIsSelectionMode(false);
                        }}
                        onLongPress={(id) => { setIsSelectionMode(true); setSelectedIds(new Set([id])); }}
                    />
                ))}

                <div ref={loaderRef} className="pro-lux-loader-trigger">
                    {isValidating && !isReachingEnd ? (
                        <div className="pro-lux-orbit">
                            <Loader2 className="pro-lux-spin" size={24}/>
                            <span>Fetching Items...</span>
                        </div>
                    ) : isReachingEnd && products.length > 0 ? (
                        <div className="pro-lux-end">End of results</div>
                    ) : null}
                </div>
            </main>

            {isSelectionMode && (
                <div className="pro-lux-bulk-bar animate-up">
                    <div className="bulk-count-row">
                        <span>{selectedIds.size} Selected</span>
                        <button onClick={() => {setIsSelectionMode(false); setSelectedIds(new Set())}}><X size={18}/></button>
                    </div>
                    <div className="bulk-btns-grid">
                        <button className="bulk-btn in" onClick={() => handleAction('in_stock')}>In Stock</button>
                        <button className="bulk-btn out" onClick={() => handleAction('out_of_stock')}>Out Stock</button>
                        <button className="bulk-btn del" onClick={() => handleAction('delete')}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;