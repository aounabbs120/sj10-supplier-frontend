// src/pages/ProductForm.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import supplierService from '../services/supplierService';
import { categoryAttributes, colorFamilies } from '../data/attributes';
import './ProductForm.css';

// --- ICONS ---
const Icons = {
    Camera: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>,
    Video: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>,
    Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Youtube: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>,
    Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    Back: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
    Next: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
    // Editor Icons
    Bold: () => <span style={{fontWeight:'bold', fontSize:'14px'}}>B</span>,
    Italic: () => <span style={{fontStyle:'italic', fontSize:'14px', fontFamily:'serif'}}>I</span>,
    H1: () => <span style={{fontWeight:'bold', fontSize:'12px'}}>H1</span>,
    H2: () => <span style={{fontWeight:'bold', fontSize:'11px'}}>H2</span>,
    List: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
};

// --- CONSTANTS ---
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const initialProductState = {
    title: '', description: '', price: '', discounted_price: '',
    quantity: '', status: 'In Stock', category_id: '', main_category_id: '',
    attributes: {}, variants: [], image_urls: [], video_url: '',
    shipping_details: 'Standard', package_information: '', season: 'No Season',
    custom_season: '', pkg_length: '', pkg_width: '', pkg_height: '',
    pkg_unit: 'cm', pkg_weight: '', pkg_weight_unit: 'g'
};

const safeParseJSON = (jsonString, defaultValue) => {
    try { const parsed = JSON.parse(jsonString); return parsed === null ? defaultValue : parsed; } catch (e) { return defaultValue; }
};

// --- SHIMMER IMAGE COMPONENT ---
const ShimmerImage = ({ src, alt, className }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className={`shimmer-wrapper ${className}`}>
            {!loaded && <div className="shimmer-effect"></div>}
            <img 
                src={src} 
                alt={alt} 
                onLoad={() => setLoaded(true)} 
                style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }} 
            />
        </div>
    );
};

// --- CUSTOM DROPDOWN (Professional) ---
const CustomSelect = ({ options, value, onChange, placeholder = "Select an option..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`pro-select ${isOpen ? 'open' : ''}`} ref={wrapperRef}>
            <div className="select-trigger" onClick={() => setIsOpen(!isOpen)}>
                <span className={value ? 'val' : 'placeholder'}>{value || placeholder}</span>
                <Icons.ChevronDown />
            </div>
            {isOpen && (
                <div className="select-options">
                    {options.map((opt, i) => (
                        <div 
                            key={i} 
                            className={`option ${value === opt ? 'selected' : ''}`}
                            onClick={() => { onChange(opt); setIsOpen(false); }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- 1. CATEGORY OVERLAY ---
const CategoryOverlay = ({ isOpen, onClose, categories, onSelect }) => {
    const [view, setView] = useState('main');
    const [selectedMain, setSelectedMain] = useState(null);

    useEffect(() => { if (isOpen) { setView('main'); setSelectedMain(null); } }, [isOpen]);

    const parentCategories = categories.filter(c => !c.parent_id);
    const subCategories = selectedMain ? categories.filter(c => String(c.parent_id) === String(selectedMain.id)) : [];

    if (!isOpen) return null;

    return (
        <div className="fullscreen-overlay">
            <div className="overlay-header">
                {view === 'sub' && <button className="overlay-back" onClick={() => setView('main')}><Icons.Back /> Back</button>}
                <h3>{view === 'main' ? 'Select Main Category' : selectedMain.name}</h3>
                <button className="overlay-close" onClick={onClose}><Icons.Close /></button>
            </div>
            <div className="overlay-body">
                <p className="overlay-hint">Choose the most relevant category for your product.</p>
                <div className="grid-layout">
                    {view === 'main' ? parentCategories.map(cat => (
                        <div key={cat.id} className="grid-card" onClick={() => { setSelectedMain(cat); setView('sub'); }}>
                            <ShimmerImage src={cat.image_url || 'https://via.placeholder.com/80'} alt={cat.name} className="card-img-box" />
                            <span>{cat.name}</span>
                            <div className="card-arrow"><Icons.Next /></div>
                        </div>
                    )) : subCategories.length > 0 ? subCategories.map(sub => (
                        <div key={sub.id} className="grid-card" onClick={() => { onSelect(selectedMain.id, sub.id); onClose(); }}>
                            <ShimmerImage src={sub.image_url || 'https://via.placeholder.com/80'} alt={sub.name} className="card-img-box" />
                            <span>{sub.name}</span>
                            <div className="card-select">Select</div>
                        </div>
                    )) : <div className="empty-state">No sub-categories available.</div>}
                </div>
            </div>
        </div>
    );
};

// --- 2. ATTRIBUTES OVERLAY ---
const AttributesOverlay = ({ isOpen, onClose, onSave, subCategoryId, existingAttributes, attributeData }) => {
    const [attributes, setAttributes] = useState({});
    const [customAttributes, setCustomAttributes] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const predefined = {}; const custom = [];
            const attrsForCat = subCategoryId && attributeData ? (attributeData[String(subCategoryId)] || []) : [];
            const keys = attrsForCat.map(a => a.name);
            for (const key in existingAttributes) {
                if (keys.includes(key)) predefined[key] = existingAttributes[key];
                else custom.push({ key, value: existingAttributes[key] });
            }
            setAttributes(predefined); setCustomAttributes(custom);
        }
    }, [isOpen, existingAttributes, subCategoryId, attributeData]);

    const handleSave = () => {
        const final = { ...attributes };
        customAttributes.forEach(c => { if (c.key && c.value) final[c.key] = c.value; });
        onSave(final); onClose();
    };

    if (!isOpen) return null;
    const attrsForCat = subCategoryId && attributeData ? (attributeData[String(subCategoryId)] || []) : [];

    return (
        <div className="fullscreen-overlay">
            <div className="overlay-header">
                <h3>Product Specifications</h3>
                <button className="overlay-save" onClick={handleSave}>Done</button>
            </div>
            <div className="overlay-body form-content">
                <p className="overlay-hint">Detailed specifications help customers find your product.</p>
                
                {attrsForCat.length > 0 ? attrsForCat.map(attr => {
                    const options = (attr.options || '').split(',').map(o => o.trim());
                    const displayOptions = [...options, "Custom"];
                    const currentValue = attributes[attr.name] || '';
                    const isCustomValue = currentValue && !options.includes(currentValue);

                    return (
                        <div key={attr.name} className="overlay-form-group">
                            <label>{attr.name} <span className="red">*</span></label>
                            {attr.type === 'enum' ? (
                                <>
                                    <CustomSelect 
                                        options={displayOptions} 
                                        value={isCustomValue ? 'Custom' : currentValue} 
                                        onChange={(val) => setAttributes(p => ({...p, [attr.name]: val === 'Custom' ? '' : val}))}
                                        placeholder={`Select ${attr.name}...`} 
                                    />
                                    {(isCustomValue || attributes[attr.name] === '') && (
                                        <input type="text" className="mt-2" placeholder={`Enter custom ${attr.name} (e.g. 100% Cotton)`} value={currentValue} onChange={(e) => setAttributes(p => ({...p, [attr.name]: e.target.value}))} />
                                    )}
                                </>
                            ) : (
                                <input type="text" value={currentValue} onChange={(e) => setAttributes(p => ({...p, [attr.name]: e.target.value}))} placeholder={`Enter ${attr.name}...`} />
                            )}
                            <small className="helper-text">Specific {attr.name} improves search ranking.</small>
                        </div>
                    );
                }) : <div className="empty-state">No predefined attributes for this category. Add custom ones below.</div>}
                
                <div className="custom-section">
                    <h4>Additional Details</h4>
                    {customAttributes.map((c, i) => (
                        <div key={i} className="custom-row">
                            <input placeholder="Name (e.g. Pattern)" value={c.key} onChange={e => {const n=[...customAttributes]; n[i].key=e.target.value; setCustomAttributes(n)}} />
                            <input placeholder="Value (e.g. Floral)" value={c.value} onChange={e => {const n=[...customAttributes]; n[i].value=e.target.value; setCustomAttributes(n)}} />
                            <button onClick={() => setCustomAttributes(p => p.filter((_, idx) => idx !== i))}><Icons.Trash /></button>
                        </div>
                    ))}
                    <button className="add-custom-btn" onClick={() => setCustomAttributes(p => [...p, {key:'', value:''}])}>+ Add Custom Field</button>
                </div>
            </div>
        </div>
    );
};

// --- 3. VARIANTS OVERLAY (Open Design) ---
const VariantsOverlay = ({ isOpen, onClose, onSave, existingVariants, colorData }) => {
    const [variants, setVariants] = useState([]);
    const [color, setColor] = useState('');
    const [colorSearch, setColorSearch] = useState('');
    const [sizeType, setSizeType] = useState('stitched'); 
    const [size, setSize] = useState('S');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => { if (isOpen) setVariants(existingVariants || []); }, [isOpen, existingVariants]);

    const handleSizeTypeChange = (type) => {
        setSizeType(type);
        if (type === 'unstitched') setSize('Unstitched');
        else setSize('');
    };

    const addVariant = () => {
        if (!color || !size || !price || !stock) return alert("All fields are required (Color, Size, Price, Stock).");
        setVariants(p => [...p, { color, size, price, stock }]);
        // Reset Logic
        setColor(''); 
        if (sizeType !== 'unstitched') setSize(''); 
        // Keep price/stock for faster entry
    };

    const handleSave = () => { onSave(variants); onClose(); };
    const filteredColors = colorData.filter(c => c.name.toLowerCase().includes(colorSearch.toLowerCase()));

    // Deep Size Options
    const sizesStitched = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    const sizesNumber = ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50'];
    const sizesKids = ['NB', '0-3m', '3-6m', '6-12m', '12-18m', '1-2y', '2-3y', '3-4y', '4-5y', '5-6y', '7-8y', '9-10y'];
    const sizesShoes = ['US 5', 'US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42'];

    if (!isOpen) return null;

    return (
        <div className="fullscreen-overlay">
            <div className="overlay-header">
                <h3>Manage Variants</h3>
                <button className="overlay-save" onClick={handleSave}>Done ({variants.length})</button>
            </div>
            <div className="overlay-body variant-body">
                <div className="variant-creator-card">
                    <div className="step-label">Step 1: Choose Color</div>
                    <input className="search-input" placeholder="Search Color (e.g. Navy Blue)..." value={colorSearch} onChange={e => setColorSearch(e.target.value)} />
                    <div className="color-scroll-container">
                        {filteredColors.map(c => (
                            <div key={c.name} className={`color-chip ${color === c.name ? 'active' : ''}`} onClick={() => setColor(c.name)}>
                                <span className="dot" style={{background: c.hex}}></span> {c.name}
                            </div>
                        ))}
                    </div>

                    <div className="step-label mt-20">Step 2: Choose Size</div>
                    <div className="size-type-scroll">
                        {['stitched', 'unstitched', 'number', 'kids', 'shoes', 'custom'].map(t => (
                            <button key={t} className={`type-btn ${sizeType === t ? 'active' : ''}`} onClick={() => handleSizeTypeChange(t)}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                    
                    {sizeType !== 'unstitched' && (
                        <div className="size-options mt-10">
                            {sizeType === 'stitched' && sizesStitched.map(s => <button key={s} onClick={() => setSize(s)} className={`size-btn ${size === s ? 'active' : ''}`}>{s}</button>)}
                            {sizeType === 'number' && sizesNumber.map(s => <button key={s} onClick={() => setSize(s)} className={`size-btn ${size === s ? 'active' : ''}`}>{s}</button>)}
                            {sizeType === 'kids' && sizesKids.map(s => <button key={s} onClick={() => setSize(s)} className={`size-btn ${size === s ? 'active' : ''}`}>{s}</button>)}
                            {sizeType === 'shoes' && sizesShoes.map(s => <button key={s} onClick={() => setSize(s)} className={`size-btn ${size === s ? 'active' : ''}`}>{s}</button>)}
                            {sizeType === 'custom' && <input className="custom-size-input" placeholder="Enter Custom Size (e.g. 10x12, King Size)" value={size} onChange={e => setSize(e.target.value)} />}
                        </div>
                    )}
                    {sizeType === 'unstitched' && <div className="info-badge">Size set to 'Unstitched' automatically.</div>}

                    <div className="step-label mt-20">Step 3: Inventory</div>
                    <div className="v-section grid-2">
                        <div><label>Variant Price <span className="red">*</span></label><input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 2499" /></div>
                        <div><label>Variant Stock <span className="red">*</span></label><input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="e.g. 50" /></div>
                    </div>

                    <button className="add-variant-btn" onClick={addVariant}>+ Add This Variant</button>
                </div>

                <div className="variant-list-view">
                    <h4 className="list-title">Added Variants</h4>
                    {variants.length > 0 ? variants.map((v, i) => (
                        <div key={i} className="v-item">
                            <div className="v-info">
                                <span className="v-tag">{v.color}</span>
                                <span className="v-tag">{v.size}</span>
                                <span className="v-stock">Qty: {v.stock}</span>
                            </div>
                            <div className="v-price">PKR {v.price}</div>
                            <button onClick={() => setVariants(p => p.filter((_, idx) => idx !== i))}><Icons.Trash /></button>
                        </div>
                    )) : <p className="empty-text">No variants added yet.</p>}
                </div>
            </div>
        </div>
    );
};

// --- MAIN PRODUCT FORM ---

const ProductForm = ({ setIsLoading }) => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(productId);
    const textAreaRef = useRef(null);

    const [product, setProduct] = useState(initialProductState);
    const [categories, setCategories] = useState([]);
    
    // Media & Uploads
    const [activeImages, setActiveImages] = useState([]); 
    const [videoType, setVideoType] = useState('upload');
    const [videoFile, setVideoFile] = useState(null); 
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0); 
    const [uploadedVideoUrl, setUploadedVideoUrl] = useState(''); 
    const [youtubeUrl, setYoutubeUrl] = useState('');

    // Overlay States
    const [showAttributes, setShowAttributes] = useState(false);
    const [showVariants, setShowVariants] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true); // GLOBAL LOADER
            try {
                const cats = await supplierService.getCategories();
                setCategories(cats);
                if (isEditMode) {
                    const pData = await supplierService.getProductById(productId);
                    if (pData) {
                        const parent = cats.find(c => String(c.id) === String(pData.category_id))?.parent_id || '';
                        setProduct({ 
                            ...initialProductState, ...pData, main_category_id: parent,
                            attributes: safeParseJSON(pData.attributes, {}),
                            variants: safeParseJSON(pData.variants, [])
                        });
                        const imgs = safeParseJSON(pData.image_urls, []);
                        setActiveImages(imgs.map(url => ({ url, isUploading: false, progress: 100, id: url })));
                        if (pData.video_url) {
                            if (pData.video_url.includes('youtube')) { setVideoType('youtube'); setYoutubeUrl(pData.video_url); }
                            else { setVideoType('upload'); setUploadedVideoUrl(pData.video_url); }
                        }
                    }
                }
            } catch (e) { setError("Error loading data"); }
            finally { setIsLoading(false); } // HIDE LOADER
        };
        loadData();
    }, [isEditMode, productId, setIsLoading]);

    const handleChange = (e) => setProduct(p => ({ ...p, [e.target.name]: e.target.value }));

    // --- Rich Text ---
    const insertTag = (tag) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = product.description;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);
        
        let newText = '';
        if (tag === 'list') newText = before + `\n• ${selection}` + after;
        else if (tag === 'h1') newText = before + `<h1>${selection}</h1>` + after;
        else if (tag === 'h2') newText = before + `<h2>${selection}</h2>` + after;
        else newText = before + `<${tag}>${selection}</${tag}>` + after;

        setProduct(prev => ({ ...prev, description: newText }));
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tag.length + 2, end + tag.length + 2);
        }, 0);
    };

    // --- Media Logic (Compressed) ---
    const uploadWithProgress = async (file, onProgress) => {
        const formData = new FormData(); formData.append('images', file);
        const token = localStorage.getItem('supplierToken');
        const response = await axios.post(`${API_BASE_URL}/api/supplier/products/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
            onUploadProgress: (p) => onProgress(Math.round((p.loaded * 100) / p.total))
        });
        return response.data;
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if ((activeImages.length + files.length) > 8) { alert('Maximum 8 images total.'); return; }
        const temp = files.map(f => ({ id: Math.random().toString(36), url: URL.createObjectURL(f), isUploading: true, progress: 0, file: f }));
        setActiveImages(p => [...p, ...temp]);
        const opts = { maxSizeMB: 0.2, maxWidthOrHeight: 1024, useWebWorker: true, fileType: 'image/webp' };
        for (const item of temp) {
            try {
                const compressed = await imageCompression(item.file, opts);
                const res = await uploadWithProgress(compressed, (pct) => setActiveImages(p => p.map(img => img.id === item.id ? { ...img, progress: pct } : img)));
                setActiveImages(p => p.map(img => img.id === item.id ? { ...img, url: res.urls[0], isUploading: false, progress: 100 } : img));
            } catch (e) { setActiveImages(p => p.filter(img => img.id !== item.id)); }
        }
    };
    const removeImage = (id) => setActiveImages(p => p.filter(i => i.id !== id));

    const handleVideoChange = async (e) => {
        const file = e.target.files[0];
        if (!file || file.size > 80 * 1024 * 1024) return alert("Video too large (Max 80MB)");
        setVideoFile(file); setIsVideoUploading(true); setVideoProgress(0);
        try {
            const res = await uploadWithProgress(file, (p) => setVideoProgress(p));
            if (res.urls && res.urls.length > 0) setUploadedVideoUrl(res.urls[0]);
        } catch (e) { alert("Video upload failed"); setVideoFile(null); }
        finally { setIsVideoUploading(false); }
    };
    const removeVideo = () => { setVideoFile(null); setUploadedVideoUrl(''); setYoutubeUrl(''); setVideoProgress(0); };
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?modestbranding=1&rel=0` : null;
    };

    // --- Main Actions ---
    const handleCategorySelect = (mainId, subId) => setProduct(p => ({ ...p, main_category_id: mainId, category_id: subId, attributes: {} }));
    const getCatNames = () => {
        const m = categories.find(c => String(c.id) === String(product.main_category_id));
        const s = categories.find(c => String(c.id) === String(product.category_id));
        if (m && s) return `${m.name} > ${s.name}`;
        return "Select Category";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!product.title || !product.price || !product.category_id) return setError("Please fill all required fields.");
        if (activeImages.some(i => i.isUploading) || isVideoUploading) return alert("Wait for uploads to finish.");

        setIsLoading(true); setIsSaving(true); 

        try {
            const finalImages = activeImages.map(i => i.url);
            const finalVideo = videoType === 'youtube' ? youtubeUrl : uploadedVideoUrl;
            const pkgInfo = `${product.pkg_length}x${product.pkg_width}x${product.pkg_height} ${product.pkg_unit}, ${product.pkg_weight}${product.pkg_weight_unit}`;
            
            const payload = {
                ...product, 
                price: parseFloat(product.price), 
                quantity: parseInt(product.quantity, 10),
                image_urls: finalImages, 
                video_url: finalVideo || null,
                package_information: pkgInfo,
                variants: product.variants.map(v => ({...v, price: parseFloat(v.price), stock: parseInt(v.stock)}))
            };

            if (isEditMode) await supplierService.updateProduct(productId, payload);
            else await supplierService.createProduct(payload);

            setIsLoading(false); 
            setTimeout(() => navigate('/products'), 50);
        } catch (e) {
            setIsLoading(false); setIsSaving(false);
            setError("Failed to save product.");
        }
    };

    return (
        <div className="product-form-container">
            {/* OVERLAYS */}
            <CategoryOverlay isOpen={showCategories} onClose={() => setShowCategories(false)} categories={categories} onSelect={handleCategorySelect} />
            <AttributesOverlay isOpen={showAttributes} onClose={() => setShowAttributes(false)} onSave={(attrs) => setProduct(p => ({...p, attributes: attrs}))} subCategoryId={product.category_id} existingAttributes={product.attributes} attributeData={categoryAttributes} />
            <VariantsOverlay isOpen={showVariants} onClose={() => setShowVariants(false)} onSave={(vars) => setProduct(p => ({...p, variants: vars}))} existingVariants={product.variants} colorData={colorFamilies} />

            <div className="form-header">
                <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-card">
                    <h3>Basic Details</h3>
                    <div className="form-group full-width">
                        <label>Product Title <span className="red">*</span></label>
                        <input type="text" name="title" value={product.title} onChange={handleChange} placeholder="e.g., Premium Cotton Summer Shirt" required />
                        <small className="helper-text">Include key details like material and style.</small>
                    </div>
                    
                    <div className="media-section mt-20">
                        <label className="section-title">Media Gallery</label>
                        <div className="toggle-row">
                            <button type="button" className={videoType === 'upload' ? 'active' : ''} onClick={() => setVideoType('upload')}>Upload</button>
                            <button type="button" className={videoType === 'youtube' ? 'active' : ''} onClick={() => setVideoType('youtube')}>YouTube</button>
                        </div>
                        
                        <div className="media-buttons">
                            <div className="upload-box">
                                <input type="file" multiple accept="image/*" id="img-in" onChange={handleImageChange} />
                                <label htmlFor="img-in"><Icons.Camera /><span>Images</span></label>
                            </div>
                            {videoType === 'upload' && (
                                <div className="upload-box video-box">
                                    <input type="file" accept="video/*" id="vid-in" onChange={handleVideoChange} />
                                    <label htmlFor="vid-in"><Icons.Video /><span>Video</span></label>
                                </div>
                            )}
                        </div>

                        {videoType === 'youtube' && <input type="text" className="yt-input" placeholder="Paste YouTube Link (e.g. https://youtu.be/...)" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} />}

                        <div className="previews">
                            {activeImages.map(img => (
                                <div key={img.id} className="preview-item">
                                    <img src={img.url} alt="" />
                                    {img.isUploading && <div className="prog-overlay"><div className="bar" style={{width: `${img.progress}%`}}></div></div>}
                                    <button type="button" className="del-btn" onClick={() => removeImage(img.id)}><Icons.Trash /></button>
                                </div>
                            ))}
                            {(uploadedVideoUrl || videoFile) && videoType === 'upload' && (
                                <div className="preview-item video-item">
                                    <video src={videoFile ? URL.createObjectURL(videoFile) : uploadedVideoUrl} controls />
                                    {isVideoUploading && <div className="prog-overlay"><div className="bar" style={{width: `${videoProgress}%`}}></div></div>}
                                    <button type="button" className="del-btn" onClick={() => setVideoFile(null)}><Icons.Trash /></button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group full-width mt-20">
                        <label>Description</label>
                        <div className="rich-text-wrapper">
                            <div className="rich-toolbar">
                                <button type="button" onClick={() => insertTag('b')} title="Bold"><Icons.Bold /></button>
                                <button type="button" onClick={() => insertTag('i')} title="Italic"><Icons.Italic /></button>
                                <button type="button" onClick={() => insertTag('h1')} title="Heading 1"><Icons.H1 /></button>
                                <button type="button" onClick={() => insertTag('h2')} title="Heading 2"><Icons.H2 /></button>
                                <button type="button" onClick={() => insertTag('list')} title="Bullet List"><Icons.List /></button>
                            </div>
                            <textarea ref={textAreaRef} name="description" rows="5" value={product.description} onChange={handleChange} placeholder="Write a detailed description including features, care instructions, etc..."></textarea>
                        </div>
                    </div>
                </div>

                <div className="form-card">
                    <h3>Category & Specs</h3>
                    <div className="form-group full-width">
                        <label>Category <span className="red">*</span></label>
                        <div className="cat-select-btn" onClick={() => setShowCategories(true)}>
                            <span>{getCatNames()}</span> <button type="button">Change</button>
                        </div>
                    </div>
                    <div className="btn-row">
                        <button type="button" className="action-btn" disabled={!product.category_id} onClick={() => setShowAttributes(true)}>
                            {Object.keys(product.attributes).length > 0 ? `${Object.keys(product.attributes).length} Attributes` : 'Add Attributes'}
                        </button>
                        <button type="button" className="action-btn" onClick={() => setShowVariants(true)}>
                            {product.variants.length > 0 ? `${product.variants.length} Variants` : 'Add Variants'}
                        </button>
                    </div>
                </div>

                <div className="form-card">
                    <h3>Pricing & Inventory</h3>
                    <div className="form-grid">
                        <div className="form-group"><label>Price (PKR) <span className="red">*</span></label><input type="number" name="price" value={product.price} onChange={handleChange} placeholder="e.g. 2499" /></div>
                        <div className="form-group"><label>Discount Price (PKR)</label><input type="number" name="discounted_price" value={product.discounted_price} onChange={handleChange} placeholder="e.g. 1999" /></div>
                        <div className="form-group"><label>Stock <span className="red">*</span></label><input type="number" name="quantity" value={product.quantity} onChange={handleChange} placeholder="e.g. 50" /></div>
                        <div className="form-group"><label>Status</label><select name="status" value={product.status} onChange={handleChange}><option>In Stock</option><option>Out of Stock</option></select></div>
                    </div>
                </div>

                <div className="form-card">
                    <h3>Shipping</h3>
                    <div className="form-grid">
                        <div className="form-group"><label>Type</label><select name="shipping_details" value={product.shipping_details} onChange={handleChange}><option>Standard</option><option>Express</option></select></div>
                        <div className="form-group"><label>Weight</label><div className="flex-grp"><input type="number" name="pkg_weight" value={product.pkg_weight} onChange={handleChange} placeholder="e.g. 250" /><select name="pkg_weight_unit" value={product.pkg_weight_unit} onChange={handleChange}><option>g</option><option>kg</option></select></div></div>
                    </div>
                    <div className="form-group mt-10">
                        <label>Dimensions (LxWxH)</label>
                        <div className="dim-grp">
                            <input type="number" name="pkg_length" placeholder="L" value={product.pkg_length} onChange={handleChange} />
                            <input type="number" name="pkg_width" placeholder="W" value={product.pkg_width} onChange={handleChange} />
                            <input type="number" name="pkg_height" placeholder="H" value={product.pkg_height} onChange={handleChange} />
                            <select name="pkg_unit" value={product.pkg_unit} onChange={handleChange}><option>cm</option><option>in</option></select>
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <button type="button" className="cancel-btn" onClick={() => navigate('/products')}>Cancel</button>
                    <button type="submit" className="save-btn" disabled={isSaving}>
                        {isEditMode ? 'Update Product' : 'Save Product'}
                    </button>
                </div>
                {error && <p className="error-text">{error}</p>}
            </form>
        </div>
    );
};

export default ProductForm;