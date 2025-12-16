import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse'; // Import the newly installed CSV parser
import supplierService from '../services/supplierService';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

// Professional Skeleton Loader Component
const ProductCardSkeleton = () => (
    <div className="product-card-skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-details">
            <div className="skeleton-line title"></div>
            <div className="skeleton-line text"></div>
            <div className="skeleton-line text short"></div>
        </div>
    </div>
);

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Ref for the hidden file input

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await supplierService.getMyProducts();
            setProducts(data);
        } catch (error) { console.error("Failed to fetch products:", error); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await supplierService.deleteProduct(productId);
                fetchProducts(); 
            } catch (error) { alert('Could not delete product.'); }
        }
    };

    // --- NEW: CSV Import Handler ---
    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    // NOTE: This assumes your backend has a POST /api/supplier/products/import endpoint
                    // await supplierService.importProductsCSV(results.data);
                    console.log("Parsed CSV Data to send to backend:", results.data);
                    alert(`${results.data.length} products parsed. Implement backend endpoint to save them.`);
                    // fetchProducts(); // Uncomment this after backend is ready
                } catch (err) {
                    alert('CSV Import Failed: ' + (err.response?.data?.message || err.message));
                } finally {
                    setLoading(false);
                    fileInputRef.current.value = '';
                }
            },
            error: (err) => {
                setLoading(false);
                alert('Error parsing CSV file: ' + err.message);
                fileInputRef.current.value = '';
            }
        });
    };

    // --- NEW: CSV Export Handler ---
    const handleExport = () => {
        if (products.length === 0) {
            alert("No products to export.");
            return;
        }

        const productHeaders = ['id', 'title', 'description', 'price', 'discounted_price', 'quantity', 'status', 'category_id', 'attributes', 'image_urls', 'video_url'];
        const productCSV = Papa.unparse(products.map(p => ({...p, attributes: JSON.stringify(p.attributes), image_urls: JSON.stringify(p.image_urls)})), { columns: productHeaders });

        const variantHeaders = ['variant_id', 'product_id', 'color', 'size', 'price', 'stock', 'sku'];
        const allVariants = products.flatMap(p => {
            const variants = typeof p.variants === 'string' ? JSON.parse(p.variants) : (p.variants || []);
            return variants.map(v => ({
                variant_id: v.id, product_id: p.id, color: v.custom_color, size: v.custom_size,
                price: v.price, stock: v.stock, sku: v.sku
            }));
        });
        const variantsCSV = Papa.unparse(allVariants, { columns: variantHeaders });

        downloadCSV(productCSV, 'products.csv');
        if (allVariants.length > 0) {
            downloadCSV(variantsCSV, 'variants.csv');
        }
    };

    const downloadCSV = (csvString, filename) => {
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        return products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <h1>Products</h1>
                <div className="header-actions">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} accept=".csv" />
                    <button className="btn-secondary" onClick={handleImportClick}>Import CSV</button>
                    <button className="btn-secondary" onClick={handleExport}>Export CSV</button>
                    <button className="btn-add-product" onClick={() => navigate('/products/add')}>+</button>
                </div>
            </div>
            
            <div className="search-bar-container">
                <span className="search-icon">🔍</span>
                <input 
                    type="text"
                    className="search-input"
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="products-scroll-area">
                {loading ? (
                    Array(5).fill(0).map((_, index) => <ProductCardSkeleton key={index} />)
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} onDelete={handleDelete} />
                    ))
                ) : (
                    <div className="no-products-message">
                        <h3>No Products Found</h3>
                        <p>{searchTerm ? 'Try adjusting your search.' : 'Click the + button to add your first product.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;