// src/pages/ProductForm.js

import React, { useState, useEffect, useRef } from 'react';
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
    Bold: () => <span style={{ fontWeight: 'bold', fontSize: '14px' }}>B</span>,
    Italic: () => <span style={{ fontStyle: 'italic', fontSize: '14px', fontFamily: 'serif' }}>I</span>,
    H1: () => <span style={{ fontWeight: 'bold', fontSize: '12px' }}>H1</span>,
    H2: () => <span style={{ fontWeight: 'bold', fontSize: '11px' }}>H2</span>,
    List: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    Warranty: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>,
    Palette: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>,
    Ruler: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"></path><path d="M6 12v-2"></path><path d="M10 12v-4"></path><path d="M14 12v-4"></path><path d="M18 12v-2"></path></svg>,
    Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
   ImageIcon: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
    Sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2"></path><path d="M12 21v2"></path><path d="M4.22 4.22l1.42 1.42"></path><path d="M18.36 18.36l1.42 1.42"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="M4.22 19.78l1.42-1.42"></path><path d="M18.36 5.64l1.42-1.42"></path></svg>
};

// --- CONSTANTS ---
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const initialProductState = {
    title: '', description: '', price: '', discounted_price: '',
    quantity: '', status: 'In Stock', category_id: '', main_category_id: '',
    attributes: {}, variants: [], image_urls: [], video_url: '',
    shipping_details: 'Standard', package_information: '', season: 'No Season',
    custom_season: '', pkg_length: '', pkg_width: '', pkg_height: '',
    pkg_unit: 'cm', pkg_weight: '', pkg_weight_unit: 'g',
    // --- NEW FIELDS ---
    main_color: '', main_size: '',
    imported_region: 'Pakistan', custom_region: '',
    warranty_type: '', warranty_details: '', season: 'No Season'
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

// --- CUSTOM DROPDOWN ---
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
                                        onChange={(val) => setAttributes(p => ({ ...p, [attr.name]: val === 'Custom' ? '' : val }))}
                                        placeholder={`Select ${attr.name}...`}
                                    />
                                    {(isCustomValue || attributes[attr.name] === '') && (
                                        <input type="text" className="mt-2" placeholder={`Enter custom ${attr.name} (e.g. 100% Cotton)`} value={currentValue} onChange={(e) => setAttributes(p => ({ ...p, [attr.name]: e.target.value }))} />
                                    )}
                                </>
                            ) : (
                                <input type="text" value={currentValue} onChange={(e) => setAttributes(p => ({ ...p, [attr.name]: e.target.value }))} placeholder={`Enter ${attr.name}...`} />
                            )}
                            <small className="helper-text">Specific {attr.name} improves search ranking.</small>
                        </div>
                    );
                }) : <div className="empty-state">No predefined attributes for this category. Add custom ones below.</div>}

                <div className="custom-section">
                    <h4>Additional Details</h4>
                    {customAttributes.map((c, i) => (
                        <div key={i} className="custom-row">
                            <input placeholder="Name (e.g. Pattern)" value={c.key} onChange={e => { const n = [...customAttributes]; n[i].key = e.target.value; setCustomAttributes(n) }} />
                            <input placeholder="Value (e.g. Floral)" value={c.value} onChange={e => { const n = [...customAttributes]; n[i].value = e.target.value; setCustomAttributes(n) }} />
                            <button onClick={() => setCustomAttributes(p => p.filter((_, idx) => idx !== i))}><Icons.Trash /></button>
                        </div>
                    ))}
                    <button className="add-custom-btn" onClick={() => setCustomAttributes(p => [...p, { key: '', value: '' }])}>+ Add Custom Field</button>
                </div>
            </div>
        </div>
    );
};

// --- 3. VARIANTS OVERLAY ---
// --- UPDATED: VARIANTS OVERLAY (With Image Selection) ---
const VariantsOverlay = ({ isOpen, onClose, onSave, existingVariants, colorData, uploadedImages }) => {
    const [variants, setVariants] = useState([]);
    
    // Inputs
    const [color, setColor] = useState('');
    const [colorSearch, setColorSearch] = useState('');
    const [sizeType, setSizeType] = useState('stitched');
    const [size, setSize] = useState('S');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    
    // Image Selection State
    const [showImgSelect, setShowImgSelect] = useState(false);
    const [selectedImg, setSelectedImg] = useState(''); // Temp holder for current addition

    useEffect(() => { if (isOpen) setVariants(existingVariants || []); }, [isOpen, existingVariants]);

    const handleSizeTypeChange = (type) => {
        setSizeType(type);
        if (type === 'unstitched') setSize('Unstitched');
        else setSize('');
    };

   const addVariant = () => {
        // --- VALIDATION: NOW CHECKS FOR selectedImg ---
        if (!color || !size || !price || !stock || !selectedImg) {
            return alert("Please select an image for this variant. It is required for a professional look.");
        }
        
        setVariants(p => [...p, { color, size, price, stock, image: selectedImg }]);
        
        // Reset inputs
        setColor('');
        if (sizeType !== 'unstitched') setSize('');
        setSelectedImg(''); 
    };

    const handleSave = () => { onSave(variants); onClose(); };
    const filteredColors = colorData.filter(c => c.name.toLowerCase().includes(colorSearch.toLowerCase()));

    // ... (Your existing Size Arrays here: sizesStitched, sizesNumber, etc.) ...
    const sizesStitched = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    const sizesNumber = ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50'];
    const sizesKids = ['NB', '0-3m', '3-6m', '6-12m', '12-18m', '1-2y', '2-3y', '3-4y', '4-5y', '5-6y', '7-8y', '9-10y'];
    const sizesShoes = ['US 5', 'US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42'];


    if (!isOpen) return null;

    return (
        <div className="fullscreen-overlay">
            {/* Nested Overlay for Image Selection */}
            <VariantImageSelector 
                isOpen={showImgSelect} 
                onClose={() => setShowImgSelect(false)} 
                uploadedImages={uploadedImages}
                onSelect={(url) => setSelectedImg(url)}
            />

            <div className="overlay-header">
                <h3>Manage Variants</h3>
                <button className="overlay-save" onClick={handleSave}>Done ({variants.length})</button>
            </div>
            <div className="overlay-body variant-body">
                <div className="variant-creator-card">
                    {/* ... (Color & Size Steps Remain Exactly the Same) ... */}
                    <div className="step-label">Step 1: Choose Color</div>
                    <input className="search-input" placeholder="Search Color..." value={colorSearch} onChange={e => setColorSearch(e.target.value)} />
                    <div className="color-scroll-container">
                        {filteredColors.map(c => (
                            <div key={c.name} className={`color-chip ${color === c.name ? 'active' : ''}`} onClick={() => setColor(c.name)}>
                                <span className="dot" style={{ background: c.hex }}></span> {c.name}
                            </div>
                        ))}
                    </div>

                    <div className="step-label mt-20">Step 2: Choose Size</div>
                    <div className="size-type-scroll">
                        {['stitched', 'unstitched', 'number', 'kids', 'shoes', 'custom'].map(t => (
                            <button key={t} className={`type-btn ${sizeType === t ? 'active' : ''}`} onClick={() => handleSizeTypeChange(t)}>{t}</button>
                        ))}
                    </div>
                    {sizeType !== 'unstitched' && (
                        <div className="size-options mt-10">
                            {sizeType === 'stitched' && sizesStitched.map(s => <button key={s} onClick={() => setSize(s)} className={`size-btn ${size === s ? 'active' : ''}`}>{s}</button>)}
                            {sizeType === 'number' && sizesNumber.map(s => <button key={s} onClick={() => setSize(s)} className={`size-btn ${size === s ? 'active' : ''}`}>{s}</button>)}
                            {sizeType === 'kids' && sizesKids.map(s => <button key={s} onClick={() => setSize(s)} className={`size-btn ${size === s ? 'active' : ''}`}>{s}</button>)}
                            {sizeType === 'shoes' && sizesShoes.map(s => <button key={s} onClick={() => setSize(s)} className={`size-btn ${size === s ? 'active' : ''}`}>{s}</button>)}
                            {sizeType === 'custom' && <input className="custom-size-input" placeholder="Custom Size" value={size} onChange={e => setSize(e.target.value)} />}
                        </div>
                    )}

                 {/* --- NEW STEP: IMAGE SELECTION --- */}
                    <div className="step-label mt-20">Step 3: Link Image <span className="red">*</span></div>
                    {selectedImg ? (
                        <div 
                            className="v-img-selected" 
                            onClick={() => setShowImgSelect(true)}
                            // --- FORCE FIX: INLINE STYLES ---
                            style={{ 
                                width: '140px', 
                                height: '140px', 
                                margin: '0 auto', 
                                position: 'relative',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '2px solid #4f46e5',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img 
                                src={selectedImg} 
                                alt="" 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    borderRadius: '0',
                                    display: 'block'
                                }} 
                            />
                            <span style={{
                                position: 'absolute',
                                bottom: 0, left: 0, width: '100%',
                                background: 'rgba(79, 70, 229, 0.9)',
                                color: 'white', fontSize: '11px',
                                fontWeight: '600', textAlign: 'center',
                                padding: '6px 0'
                            }}>Change Image</span>
                        </div>
                    ) : (
                        <div 
                            className="v-img-placeholder" 
                            onClick={() => setShowImgSelect(true)}
                        >
                            <Icons.ImageIcon /> 
                            <span>Select Image from Uploads</span>
                        </div>
                    )}
                    

                    <div className="step-label mt-20">Step 4: Inventory</div>
                    <div className="v-section grid-2">
                        <div><label>Price *</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} /></div>
                        <div><label>Stock *</label><input type="number" value={stock} onChange={e => setStock(e.target.value)} /></div>
                    </div>

                    <button className="add-variant-btn" onClick={addVariant}>+ Add This Variant</button>
                </div>

                <div className="variant-list-view">
                    <h4 className="list-title">Added Variants</h4>
                    {variants.length > 0 ? variants.map((v, i) => (
                        <div key={i} className="v-item">
                            {/* NEW: Show Linked Image in List */}
                            <div className="v-img-thumb">
                                {v.image ? <img src={v.image} alt="" /> : <div className="no-img">No Img</div>}
                            </div>
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
// --- NEW 1. REGION SELECTOR (Custom with Flags) ---
const RegionSelector = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const regions = [
        { id: 'Pakistan', label: 'Pakistan', img: '/pakistan.png' }, // Ensure images are in /public folder
        { id: 'China', label: 'China', img: '/china.png' },
        { id: 'Custom', label: 'Other / Custom', img: '/custom.png' }
    ];
    const selected = regions.find(r => r.id === value) || regions[0];

    return (
        <div className="custom-flag-dropdown">
            <div className="flag-trigger" onClick={() => setIsOpen(!isOpen)}>
                <div className="flag-info">
                    <img src={selected.img} alt="" className="flag-icon" />
                    <span>{selected.label}</span>
                </div>
                <Icons.ChevronDown />
            </div>
            {isOpen && (
                <div className="flag-options slide-in-down">
                    {regions.map(r => (
                        <div key={r.id} className={`flag-opt ${value === r.id ? 'active' : ''}`}
                            onClick={() => { onChange(r.id); setIsOpen(false); }}>
                            <img src={r.img} alt="" className="flag-icon" />
                            <span>{r.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- NEW 2. ADVANCED WARRANTY OVERLAY ---
const WarrantyOverlay = ({ isOpen, onClose, onSave, initialData }) => {
    const [duration, setDuration] = useState('');
    const [details, setDetails] = useState('');

    useEffect(() => {
        if (isOpen) {
            setDuration(initialData.type || '');
            setDetails(initialData.info || '');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    return (
        <div className="fullscreen-overlay glass-effect">
            <div className="overlay-header">
                <h3>Add Warranty</h3>
                <button className="overlay-close" onClick={onClose}><Icons.Close /></button>
            </div>
            <div className="overlay-body">
                <div className="warranty-card fade-in-up">
                    <div className="w-input-group">
                        <label>Warranty Duration <span className="red">*</span></label>
                        <input type="text" placeholder="e.g. 12 Months, 2 Years, 7 Days Check"
                            value={duration} onChange={e => setDuration(e.target.value)}
                            className="pro-input" autoFocus />
                    </div>

                    <div className="w-input-group mt-20">
                        <label>Warranty Terms & Details</label>
                        <div className="fake-rich-editor">
                            <div className="editor-toolbar">
                                <Icons.Bold /> <Icons.Italic /> <Icons.List /> <span>|</span> <Icons.H1 /> <Icons.H2 />
                            </div>
                            <textarea
                                placeholder="Example: Warranty covers engine repair but excludes physical damage or water damage..."
                                value={details}
                                onChange={e => setDetails(e.target.value)}
                                maxLength={200}
                            ></textarea>
                            <div className="char-count">{details.length}/200</div>
                        </div>
                    </div>

                    <div className="w-actions">
                        <button className="w-cancel" onClick={onClose}>Cancel</button>
                        <button className="w-save" onClick={() => { onSave(duration, details); onClose(); }}>
                            Save Warranty
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- NEW 3. UPDATED COLOR BANK (With Multicolor) ---
const ColorBankOverlay = ({ isOpen, onClose, onSelect, colorData }) => {
    const [search, setSearch] = useState('');
    if (!isOpen) return null;

    // Logic: Add Multicolor at the top
    const multiColorObj = { name: 'Multicolor', hex: 'linear-gradient(135deg, #ff0000, #ffff00, #00ff00, #0000ff)' };
    const allColors = [multiColorObj, ...colorData];
    const filtered = allColors.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fullscreen-overlay">
            <div className="overlay-header">
                <h3>Select Color</h3>
                <button className="overlay-close" onClick={onClose}><Icons.Close /></button>
            </div>
            <div className="overlay-body">
                <input className="search-input" placeholder="Search Color..." value={search} onChange={e => setSearch(e.target.value)} />
                <div className="color-grid-bank animate-grid">
                    {filtered.map(c => (
                        <div key={c.name} className="bank-item" onClick={() => { onSelect(c.name); onClose(); }}>
                            <div className="bank-dot" style={{ background: c.hex }}></div>
                            <span>{c.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- NEW 4. UPDATED SIZE BANK (With Custom Button per Group) ---
const SizeBankOverlay = ({ isOpen, onClose, onSelect }) => {
    const [customInput, setCustomInput] = useState('');
    const [activeCustomGroup, setActiveCustomGroup] = useState(null);

    if (!isOpen) return null;
const sizeGroups = {

  /* ==================================================================================
     🧵 UNSTITCHED FABRIC (THE MOST CRITICAL SECTION FOR PAKISTAN)
     ================================================================================== */
  
  // 1. SUIT CUTTING STYLE (Wholesale & Retail)
  'Unstitched Suit Config': [
    '1 Piece (Shirt Front Only)',
    '1 Piece (Shirt Only)',
    '1 Piece (Trouser Only)',
    '1 Piece (Dupatta Only)',
    '1 Piece (Shawl Only)',
    '2 Piece (Shirt & Trouser)',
    '2 Piece (Shirt & Dupatta)',
    '2 Piece (Co-Ord Set)',
    '2.5 Piece (Shirt, Dupatta & Trouser Patch)',
    '2.5 Piece (Shirt, Trouser & Dupatta Patch)',
    '3 Piece (Shirt, Trouser & Dupatta)',
    '3 Piece (Shirt, Trouser & Shawl)',
    '4 Piece (Shirt, Trouser, Dupatta & Inner/Slip)',
    '4 Piece (Fully Embroidered Signature Series)',
    'Loose Fabric (Cut Piece)',
    'Thaan / Bundle (Wholesale 20+ Suits)'
  ],

  // 2. FABRIC LENGTH - GAZ / YARDS (Local Bazar Standard - Ashiana, Liberty, etc.)
  'Unstitched Length (Gaz/Yards)': [
    '0.5 Gaz', '0.75 Gaz', '1 Gaz', '1.25 Gaz', '1.5 Gaz', '1.75 Gaz', '2 Gaz', 
    '2.25 Gaz', '2.5 Gaz (Kameez Standard)', '2.75 Gaz', '3 Gaz (Big Shirt)', 
    '3.25 Gaz', '3.5 Gaz', '3.75 Gaz', '4 Gaz (Small Suit)', '4.25 Gaz', 
    '4.5 Gaz', '5 Gaz (Bara Suit)', '5.5 Gaz', '6 Gaz', '6.5 Gaz', '7 Gaz', 
    '8 Gaz', '10 Gaz', '12 Gaz', '15 Gaz', '20 Gaz', '100 Gaz (Thaan)'
  ],

  // 3. FABRIC LENGTH - METERS (Export/Mall Brands - Sapphire, Khaadi, etc.)
  'Unstitched Length (Meters)': [
    '0.5 M', '0.75 M', '1.0 M', '1.25 M', '1.5 M', '1.75 M', 
    '2.0 M', '2.25 M', '2.5 M (Std Shirt)', '2.75 M', '3.0 M', '3.25 M', 
    '3.5 M', '3.75 M', '4.0 M (Std Suit)', '4.25 M', '4.5 M', '4.75 M', 
    '5.0 M', '5.5 M', '6.0 M', '7.0 M', '8.0 M', '10.0 M', '25 M (Roll)'
  ],

  // 4. FABRIC WIDTH (ARZ) - Critical for Cutting Frocks/Gowns
  'Fabric Width (Arz)': [
    '35-36 Inches (Small Arz / Chota Bar)', 
    '39-41 Inches (Normal Arz)', 
    '42-44 Inches (Medium Arz)', 
    '48-50 Inches (Wide Arz)', 
    '52-54 Inches (Large Arz / Bara Bar)', 
    '56-60 Inches (Extra Large Arz)', 
    '90-110 Inches (King Width / Bedding / Curtains)'
  ],

  // 5. FABRIC WEIGHT (GSM - Winter/Summer distinction)
  'Fabric Weight (GSM)': [
    '60 GSM (Very Light Lawn)', '70 GSM', '80 GSM (Lawn Standard)', '90 GSM', 
    '100 GSM', '120 GSM (Cotton)', '140 GSM', '160 GSM (Khaddar)', 
    '180 GSM', '200 GSM (Wool/Linen)', '220 GSM', '250 GSM', '300 GSM (Denim/Coat)'
  ],

  /* ==================================================================================
     👗 WOMEN'S READY-TO-WEAR (STITCHED FASHION)
     ================================================================================== */
  
  'Women Alpha Sizes': [
    '5XS', '4XS', 'XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 
    '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', 'Free Size', 'One Size'
  ],

  // CHEST SIZE - The only way Pakistani women buy kurtis online accurately
  'Women Kurti Chest (Inches)': [
    '14"', '15"', '16" (XS)', '17" (XS)', 
    '18" (Small)', '19" (Small)', 
    '20" (Medium)', '21" (Medium)', 
    '22" (Large)', '23" (Large)', 
    '24" (XL)', '25" (XL)', 
    '26" (XXL)', '27" (XXL)', 
    '28" (3XL)', '29" (3XL)', '30" (4XL)', 
    '32" (5XL)', '34" (6XL)', '36"', '38"', '40"'
  ],

  'Women Kurti Length (Inches)': [
    '26 (Crop)', '28', '30', '32', '34', '35', '36 (Standard)', '37', 
    '38', '39', '40 (Long)', '41', '42', '43', '44', '45', '46 (Maxi)', 
    '47', '48', '50', '52', '54', '56 (Abaya Style)', '58', '60'
  ],

  'Women Hip Size (Inches)': [
    '34"', '36"', '38"', '40"', '42"', '44"', '46"', '48"', '50"', '52"', '54"'
  ],

  'Women Trousers/Bottoms Waist': [
    '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50'
  ],

  // ABAYA & MODEST WEAR
  'Abaya Sizes (Length)': [
    '48', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', 
    '60', '61', '62', '63', '64', 'Custom Order'
  ],
  
  'Hijab/Scarf Size': [
    'Square (40x40)', 'Rectangular (28x72)', 'Rectangular (30x80)', 'Maxi Shawl'
  ],

  /* ==================================================================================
     👙 WOMEN'S LINGERIE (DETAILED)
     ================================================================================== */
  
  'Bra Band Size': [
    '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54'
  ],
  'Bra Cup Size': [
    'AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G', 'GG', 'H', 'HH', 'J', 'K'
  ],
  'Panty Size (Hip Measure)': [
    'XS (34")', 'S (36")', 'M (38")', 'L (40")', 'XL (42")', 
    'XXL (44")', '3XL (46")', '4XL (48")', '5XL', '6XL'
  ],

  /* ==================================================================================
     👔 MEN'S FASHION
     ================================================================================== */
  
  'Men Alpha Sizes': [
    'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL'
  ],

  'Men Collar Size (Neck)': [
    '13"', '13.5"', '14"', '14.5"', '15"', '15.5"', '16"', '16.5"', 
    '17"', '17.5"', '18"', '18.5"', '19"', '19.5"', '20"', '21"'
  ],

  'Men Waist (Jeans/Trousers)': [
    '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', 
    '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', 
    '46', '48', '50', '52', '54', '56', '58', '60'
  ],

  'Men Inseam Length': [
    '26', '27', '28', '29', '30', '31', '32 (Regular)', '33', '34 (Long)', '35', '36', '38'
  ],

  'Kameez Shalwar Length': [
    '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60'
  ],

  // VEST / BANYAN SIZES (CM System - Standard in PK)
  'Men Vest Sizes': [
    '75cm', '80cm (XS)', '85cm (S)', '90cm (M)', '95cm (L)', '100cm (XL)', 
    '105cm (XXL)', '110cm (3XL)', '115cm (4XL)', '120cm (5XL)'
  ],

  /* ==================================================================================
     👶 KIDS, BABY, TODDLER & TEEN
     ================================================================================== */
  
  'Baby Age Groups': [
    'Preemie', 'Newborn (NB)', '0-1 Month', '0-3 Months', '3-6 Months', 
    '6-9 Months', '9-12 Months', '12-18 Months', '18-24 Months', '24-36 Months'
  ],

  'Kids Age Groups': [
    '2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', 
    '9-10Y', '10-11Y', '11-12Y', '12-13Y', '13-14Y', '14-15Y', '15-16Y'
  ],

  'Kids Height (CM)': [
    '50cm', '56cm', '62cm', '68cm', '74cm', '80cm', '86cm', '92cm', '98cm', 
    '104cm', '110cm', '116cm', '122cm', '128cm', '134cm', '140cm', '152cm', '164cm'
  ],

  /* ==================================================================================
     👟 FOOTWEAR (GLOBAL & DESI)
     ================================================================================== */
  
  'Men Shoe Sizes (UK/PK)': [
    '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', 
    '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '14', '15'
  ],

  // DESI SIZES (Peshawari Chappal / Khussa)
  'Desi Footwear Numbers': [
    'No. 6', 'No. 7', 'No. 8', 'No. 9', 'No. 10', 'No. 11', 'No. 12', 'No. 13'
  ],

  'Women Shoe Sizes (UK/PK)': [
    '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', 
    '7', '7.5', '8', '8.5', '9', '9.5', '10', '11', '12'
  ],

  'Kids Shoe Sizes (UK)': [
    '0 (Baby)', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', 
    '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', 
    '12', '12.5', '13', '13.5', '1 (Junior)', '2 (Junior)', '3 (Junior)', '4 (Junior)', '5 (Junior)'
  ],

  /* ==================================================================================
     💍 JEWELRY (GOLD & ARTIFICIAL)
     ================================================================================== */
  
  // GOLD WEIGHT (Traditional Tola System)
  'Gold Weight (PK)': [
    '1 Ratti', '2 Ratti', '4 Ratti', '1 Masha', '2 Masha', '4 Masha', '6 Masha (Half Tola)', 
    '1 Tola', '1.25 Tola', '1.5 Tola', '2 Tola', '2.5 Tola', '3 Tola', '4 Tola', '5 Tola', '10 Tola'
  ],

  'Ring Sizes (US Standard)': [
    '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', 
    '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14', '15'
  ],

  // BANGLE SIZES (Diameter Inches)
  'Bangle Sizes': [
    '1.12 (Newborn)', '1.14', '2.0', '2.2 (Sawa Do)', '2.4 (Dhai - Standard)', 
    '2.6 (Sawa Do - Large)', '2.8 (Dhai - XL)', '2.10', '2.12', '2.14', '3.0'
  ],

  'Necklace / Chain Length': [
    '12" (Collar)', '14" (Choker)', '16" (Bib)', '18" (Princess)', '20" (Matinee)', 
    '22"', '24" (Opera)', '26"', '28"', '30" (Rope)', '32"', '36"', '40"'
  ],

  /* ==================================================================================
     📱 MOBILE, TABLETS, COMPUTING & ELECTRONICS
     ================================================================================== */
  
  'Internal Storage': [
    '4 GB', '8 GB', '16 GB', '32 GB', '64 GB', '128 GB', '256 GB', '512 GB', 
    '1 TB', '2 TB', '4 TB', '8 TB', '10 TB', '12 TB', '16 TB'
  ],

  'RAM Memory': [
    '1 GB', '2 GB', '3 GB', '4 GB', '6 GB', '8 GB', '10 GB', '12 GB', '16 GB', '18 GB', '24 GB', '32 GB', '64 GB'
  ],

  'Screen Size (Mobile)': [
    '4.0"', '4.5"', '4.7"', '5.0"', '5.5"', '5.8"', '6.0"', '6.1"', '6.2"', 
    '6.3"', '6.4"', '6.5"', '6.6"', '6.7"', '6.8"', '6.9"', '7.2"', '7.6"'
  ],

  'Laptop Screen Size': [
    '10.1"', '11.6"', '12.0"', '12.5"', '13.3"', '13.5"', '14.0"', '14.5"', 
    '15.0"', '15.6"', '16.0"', '17.0"', '17.3"', '18.4"'
  ],

  'Processor Cores': [
    'Dual Core', 'Quad Core', 'Hexa Core', 'Octa Core', 'Deca Core', '12 Core', '16 Core'
  ],

  /* ==================================================================================
     📺 TV, AUDIO & HOME ENTERTAINMENT
     ================================================================================== */
  
  'TV Screen Sizes': [
    '19"', '22"', '24"', '28"', '32"', '39"', '40"', '42"', '43"', '48"', 
    '49"', '50"', '55"', '58"', '60"', '65"', '70"', '75"', '80"', '82"', 
    '85"', '86"', '90"', '98"', '100"', '110"'
  ],

  'Speaker Output (Watts)': [
    '3W', '5W', '10W', '20W', '30W', '40W', '50W', '60W', '80W', '100W', 
    '120W', '200W', '300W', '500W', '600W', '800W', '1000W', '1200W', '2000W'
  ],

  /* ==================================================================================
     ❄️ LARGE APPLIANCES (AC, FRIDGE, WASHING MACHINE)
     ================================================================================== */
  
  'AC Capacity (Tons)': [
    '0.75 Ton', '1.0 Ton', '1.5 Ton', '2.0 Ton', '2.5 Ton', '3.0 Ton', '4.0 Ton (Floor)'
  ],

  'Refrigerator Capacity (Cu Ft)': [
    '3 Cu Ft', '4 Cu Ft', '5 Cu Ft', '6 Cu Ft', '7 Cu Ft', '8 Cu Ft', '9 Cu Ft', 
    '10 Cu Ft', '11 Cu Ft', '12 Cu Ft', '13 Cu Ft', '14 Cu Ft', '15 Cu Ft', 
    '16 Cu Ft', '17 Cu Ft', '18 Cu Ft', '19 Cu Ft', '20 Cu Ft', '22 Cu Ft', 
    '24 Cu Ft', '26 Cu Ft', '28 Cu Ft'
  ],

  'Washing Machine Capacity': [
    '4 kg', '5 kg', '6 kg', '7 kg', '8 kg', '9 kg', '10 kg', '11 kg', '12 kg', 
    '13 kg', '14 kg', '15 kg', '16 kg', '17 kg', '18 kg', '20 kg', '25 kg'
  ],

  'Geyser Capacity': [
    '6 Gallons', '10 Gallons', '15 Gallons', '20 Gallons', '25 Gallons', 
    '30 Gallons', '35 Gallons', '40 Gallons', '50 Gallons', '55 Gallons'
  ],

  /* ==================================================================================
     🛏️ HOME, BEDDING, FURNITURE & DECOR
     ================================================================================== */
  
  'Bed Sheet Sizes': [
    'Single (60" x 90")', 'Twin (66" x 96")', 'Double (90" x 96")', 
    'Queen (90" x 100")', 'King (100" x 108")', 'Super King (108" x 108")', 
    'California King', 'Emperor'
  ],

  'Mattress Sizes': [
    'Single (36x78)', 'Twin (39x78)', 'Single Wide (42x78)', 'Double (54x78)', 
    'Queen (60x78)', 'King (72x78)', 'Super King (84x78)'
  ],

  'Mattress Thickness': [
    '4 Inches', '5 Inches', '6 Inches', '8 Inches', '10 Inches', '12 Inches', '14 Inches'
  ],

  'Curtain Dimensions (Width x Length)': [
    '46x54', '46x72', '46x90', '52x63', '52x84', '52x95', '66x54', '66x72', 
    '66x90', '90x72', '90x90', '90x108', 'Custom Size'
  ],

  'Rug / Carpet Sizes (Feet & Marla)': [
    '2x3', '2x4', '3x5', '4x6', '5x7', '5x8', '6x9', '7x10', '8x10', '8x11', 
    '9x12', '9x13', '10x14', '12x15', '12x18', '0.5 Marla', '1 Marla', '2 Marla'
  ],

  'Water Tank Capacity': [
    '100 Gallons', '150 Gallons', '200 Gallons', '300 Gallons', '400 Gallons', 
    '500 Gallons', '750 Gallons', '1000 Gallons', '1500 Gallons', '2000 Gallons'
  ],

  /* ==================================================================================
     💄 BEAUTY, COSMETICS & PERSONAL CARE
     ================================================================================== */
  
  'Liquid Volume (ml/oz)': [
    '5ml', '10ml', '15ml', '20ml', '30ml (1oz)', '50ml (1.7oz)', '60ml (2oz)', 
    '75ml (2.5oz)', '100ml (3.4oz)', '125ml', '150ml (5oz)', '200ml (6.7oz)', 
    '250ml (8.4oz)', '300ml', '400ml', '500ml', '750ml', '1000ml (1L)'
  ],

  'Perfume (Attar) Volume': [
    '3ml (Half Tola)', '6ml (1 Tola)', '12ml (2 Tola)', '24ml', '50ml'
  ],

  'Foundation Shades': [
    'Ivory', 'Classic Ivory', 'Porcelain', 'Natural', 'Nude', 'Beige', 
    'Warm Beige', 'Sand', 'Sun Beige', 'Golden', 'Honey', 'Caramel', 
    'Toffee', 'Tan', 'Bronze', 'Mocha', 'Cocoa', 'Espresso', 'Ebony'
  ],

  /* ==================================================================================
     🥦 GROCERY, FMCG & AGRICULTURE
     ================================================================================== */
  
  // SPICES & HERBS
  'Weight (Grams - Small)': [
    '5g', '10g', '15g', '20g', '25g', '30g', '40g', '50g', '60g', '70g', 
    '75g', '80g', '85g', '90g', '100g', '110g', '120g', '125g', '150g', '175g', '200g'
  ],

  // PACKAGED FOODS
  'Weight (Grams - Medium)': [
    '225g', '250g (Paao)', '300g', '350g', '375g', '400g', '450g', '454g (1lb)', 
    '500g (Half Kg)', '600g', '700g', '750g', '800g', '900g', '950g'
  ],

  // BULK STAPLES (Rice, Flour, Sugar)
  'Weight (Kilograms - Bulk)': [
    '1 kg', '1.5 kg', '2 kg', '2.5 kg', '3 kg', '3.5 kg', '4 kg', '4.5 kg', '5 kg', 
    '6 kg', '7 kg', '8 kg', '9 kg', '10 kg', '12 kg', '15 kg', '16 kg', '20 kg', 
    '25 kg', '30 kg', '40 kg (1 Maund)', '50 kg', '60 kg', '80 kg', '100 kg'
  ],

  'Liquid Volume (Bulk Liters)': [
    '1 Liter', '1.5 Liters', '2 Liters', '2.25 Liters', '3 Liters', '4 Liters', 
    '5 Liters', '6 Liters', '8 Liters', '10 Liters', '15 Liters', '16 Liters (Ghee Tin)', 
    '19 Liters (Water Bottle)', '20 Liters', '25 Liters', '50 Liters', '200 Liters (Drum)'
  ],

  'Diaper Sizes': [
    'Newborn (NB)', 'Size 1 (Small)', 'Size 2 (Medium)', 'Size 3 (Large)', 
    'Size 4 (Large)', 'Size 4+ (Maxi)', 'Size 5 (Junior)', 'Size 6 (XL)', 
    'Size 7 (XXL)', 'Pants M', 'Pants L', 'Pants XL', 'Pants XXL'
  ],

  /* ==================================================================================
     🏗️ HARDWARE, SOLAR & CONSTRUCTION (CRITICAL PK STANDARDS)
     ================================================================================== */
  
  // SOLAR PANELS (High Demand)
  'Solar Panel Watts': [
    '150W', '160W', '170W', '180W', '200W', '250W', '280W', '300W', '320W', 
    '350W', '380W', '400W', '440W', '450W', '480W', '530W', '535W', '540W', 
    '545W', '550W', '580W', '600W', '650W', '660W', '670W', '700W'
  ],

  // SOLAR INVERTERS
  'Solar Inverter Capacity': [
    '1 kW', '1.2 kW', '2.2 kW', '3 kW', '3.2 kW', '4 kW', '5 kW', '5.2 kW', 
    '6 kW', '8 kW', '10 kW', '12 kW', '15 kW', '20 kW', '25 kW', '30 kW', 
    '40 kW', '50 kW', '60 kW', '80 kW', '100 kW'
  ],

  // ELECTRIC WIRES (IMPERIAL - Standard in PK Local Market)
  'Electric Wire (Imperial)': [
    '3/29 (Light Duty / Bulb)', 
    '7/29 (Standard / Plug)', 
    '7/36 (Heavy)', 
    '7/44 (AC Wire Standard)', 
    '7/52 (Main Line)', 
    '7/64 (Heavy Main)', 
    '19/44', '19/52'
  ],

  // ELECTRIC WIRES (METRIC - International/Industrial)
  'Electric Wire (mm)': [
    '1.0 mm', '1.5 mm', '2.5 mm', '4.0 mm', '6.0 mm', '10 mm', '16 mm', 
    '25 mm', '35 mm', '50 mm', '70 mm', '95 mm', '120 mm', '150 mm'
  ],

  // STEEL RODS (SARYA) - Measured in "Sutar"
  'Steel Rod Thickness (Sutar)': [
    '2 Sutar (6mm)', '2.5 Sutar', '3 Sutar (10mm)', '4 Sutar (12mm)', 
    '5 Sutar (16mm)', '6 Sutar (20mm)', '7 Sutar (22mm)', '8 Sutar (25mm)'
  ],

  // PIPES (PVC/PPR)
  'Pipe Diameter': [
    '0.5 inch', '0.75 inch', '1 inch', '1.25 inch', '1.5 inch', '2 inch', 
    '2.5 inch', '3 inch', '4 inch', '5 inch', '6 inch', '8 inch', '10 inch', '12 inch'
  ],

  // PAINT
  'Paint Bucket Sizes': [
    '0.91 Liters (Quarter)', '3.64 Liters (Gallon)', '14.56 Liters (Drumy)', '20 Liters (Balti)'
  ],

  /* ==================================================================================
     🚗 AUTOMOTIVE & INDUSTRIAL
     ================================================================================== */
  
  'Engine Oil Viscosity': [
    '0W-20', '0W-30', '0W-40', '5W-20', '5W-30', '5W-40', '5W-50', 
    '10W-30', '10W-40', '10W-50', '10W-60', '15W-40', '15W-50', 
    '20W-40', '20W-50', 'SAE 30', 'SAE 40', 'SAE 50', 'SAE 90 (Gear Oil)', 'SAE 140'
  ],

  'Engine Oil Volume': [
    '0.7 Liter (70cc)', '0.8 Liter', '1.0 Liter', '1.2 Liters', '1.5 Liters', 
    '3.0 Liters', '3.5 Liters', '3.7 Liters', '4.0 Liters', '5.0 Liters', 
    '8.0 Liters', '10 Liters', '20 Liters', '205 Liters (Drum)'
  ],

  'Tyre Rim Size': [
    'R10', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17', 'R18', 'R19', 
    'R20', 'R21', 'R22', 'R23', 'R24'
  ],

  'Tyre Width': [
    '145', '155', '165', '175', '185', '195', '205', '215', '225', 
    '235', '245', '255', '265', '275', '285', '295', '305', '315', '325'
  ],

  'Helmet Sizes': [
    'XXS (51-52cm)', 'XS (53-54cm)', 'S (55-56cm)', 'M (57-58cm)', 
    'L (59-60cm)', 'XL (61-62cm)', 'XXL (63-64cm)', '3XL (65-66cm)'
  ],

  // CAR BATTERIES (JIS/DIN Standards used in PK - AGS/Exide/Phoenix)
  'Car Battery Model': [
    'NS40', 'NS40L', 'NS60', 'NS60L', 'N50', 'N50Z', 'N70', 'N100', 'N120', 
    'N150', 'N200', 'DIN44', 'DIN55', 'DIN66', 'DIN74', 'DIN88', 'DIN100'
  ],

  /* ==================================================================================
     🖇️ STATIONERY, OFFICE & SCHOOL
     ================================================================================== */
  
  'Paper Sizes': [
    'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 
    'B4', 'B5', 'Legal', 'Letter', 'Executive', 'Foolscap'
  ],

  'Notebook / Register Pages': [
    '40 Pages', '60 Pages', '80 Pages', '100 Pages', '120 Pages', 
    '160 Pages', '200 Pages', '240 Pages', '300 Pages', '400 Pages', '500 Pages', '1000 Pages'
  ],

  /* ==================================================================================
     💊 OPTICAL (CONTACT LENSES)
     ================================================================================== */
  
  'Contact Lens Power': [
    '0.00', '-0.50', '-0.75', '-1.00', '-1.25', '-1.50', '-1.75', '-2.00', 
    '-2.25', '-2.50', '-2.75', '-3.00', '-3.25', '-3.50', '-3.75', '-4.00', 
    '-4.25', '-4.50', '-4.75', '-5.00', '-5.25', '-5.50', '-5.75', '-6.00', 
    '-6.50', '-7.00', '-7.50', '-8.00', '-8.50', '-9.00', '-9.50', '-10.00', 
    '+0.50', '+1.00', '+1.50', '+2.00', '+2.50', '+3.00', '+3.50', '+4.00'
  ],

  /* ==================================================================================
     🛠️ GENERAL TOOLS & FASTENERS
     ================================================================================== */
  
  'Wrench / Spanner Size (mm)': [
    '6mm', '7mm', '8mm', '9mm', '10mm', '11mm', '12mm', '13mm', '14mm', 
    '15mm', '16mm', '17mm', '18mm', '19mm', '20mm', '21mm', '22mm', '24mm', 
    '27mm', '30mm', '32mm', '36mm'
  ],

  'Screw / Nail Length (Inches)': [
    '0.5"', '0.75"', '1"', '1.25"', '1.5"', '1.75"', '2"', '2.5"', '3"', 
    '3.5"', '4"', '5"', '6"'
  ],

  'Drill Bit Size (mm)': [
    '1mm', '1.5mm', '2mm', '2.5mm', '3mm', '3.5mm', '4mm', '4.5mm', '5mm', 
    '5.5mm', '6mm', '6.5mm', '7mm', '8mm', '9mm', '10mm', '11mm', '12mm', '13mm'
  ]

};


    const handleCustomSubmit = () => {
        if (customInput) { onSelect(customInput); onClose(); }
    };

    return (
        <div className="fullscreen-overlay">
            <div className="overlay-header">
                <h3>Select Size</h3>
                <button className="overlay-close" onClick={onClose}><Icons.Close /></button>
            </div>
            <div className="overlay-body">
                {Object.entries(sizeGroups).map(([group, sizes], idx) => (
                    <div key={group} className="size-group fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <h4>{group}</h4>
                        <div className="size-bank-grid">
                            {sizes.map(s => (
                                <button key={s} type="button" onClick={() => { onSelect(s); onClose(); }}>{s}</button>
                            ))}
                            {/* Custom Input Logic Per Group */}
                            {activeCustomGroup === group ? (
                                <div className="custom-size-mini-form">
                                    <input autoFocus placeholder="Enter size" value={customInput} onChange={e => setCustomInput(e.target.value)} />
                                    <button onClick={handleCustomSubmit}>OK</button>
                                </div>
                            ) : (
                                <button className="custom-btn-trigger" onClick={() => setActiveCustomGroup(group)}>+ Custom</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
// --- NEW: SEASON SELECTOR (Animated with Images) ---
const SeasonSelector = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Make sure these images exist in your /public folder
    const seasons = [
        { id: 'Summer', label: 'Summer', img: '/summer.png' },
        { id: 'Winter', label: 'Winter', img: '/winter.png' },
        { id: 'Spring', label: 'Spring', img: '/spring.png' },
        { id: 'Autumn', label: 'Autumn', img: '/autumn.png' },
        { id: 'No Season', label: 'All Season / None', img: '/custom.png' } 
    ];
    const selected = seasons.find(s => s.id === value) || seasons[4];

    return (
        <div className="custom-flag-dropdown">
            <div className="flag-trigger" onClick={() => setIsOpen(!isOpen)}>
                <div className="flag-info">
                    <img src={selected.img} alt="" className="flag-icon" />
                    <span>{selected.label}</span>
                </div>
                <Icons.ChevronDown />
            </div>
            {isOpen && (
                <div className="flag-options slide-in-down">
                    {seasons.map(s => (
                        <div key={s.id} className={`flag-opt ${value === s.id ? 'active' : ''}`} 
                             onClick={() => { onChange(s.id); setIsOpen(false); }}>
                            <img src={s.img} alt="" className="flag-icon" />
                            <span>{s.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
// --- NEW: VARIANT IMAGE SELECTOR ---
const VariantImageSelector = ({ isOpen, onClose, uploadedImages, onSelect }) => {
    if (!isOpen) return null;
    return (
        <div className="fullscreen-overlay">
            <div className="overlay-header">
                <h3>Select Variant Image</h3>
                <button className="overlay-close" onClick={onClose}><Icons.Close /></button>
            </div>
            <div className="overlay-body">
                {uploadedImages.length === 0 ? (
                    <div className="empty-state">Please upload product images first in the "Basic Details" section.</div>
                ) : (
                    <div className="variant-img-grid">
                        {uploadedImages.map((img, idx) => (
                            <div key={idx} className="v-img-card" onClick={() => { onSelect(img.url); onClose(); }}>
                                <img src={img.url} alt="" />
                            </div>
                        ))}
                    </div>
                )}
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
    const [showColorBank, setShowColorBank] = useState(false);
    const [showSizeBank, setShowSizeBank] = useState(false);
    // NEW: Warranty State
    const [showWarranty, setShowWarranty] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // Initial Load
    // --- REPLACE THE OLD useEffect WITH THIS ONE ---
        // --- REPLACE YOUR EXISTING useEffect WITH THIS FIXED VERSION ---
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const cats = await supplierService.getCategories();
                setCategories(cats);
                
                if (isEditMode) {
                    const pData = await supplierService.getProductById(productId);
                    if (pData) {
                        const parent = cats.find(c => String(c.id) === String(pData.category_id))?.parent_id || '';
                        
                        // -------------------------------------------------------
                        // 1. IMAGE FIX (Handle Array vs String)
                        // -------------------------------------------------------
                        let rawImages = pData.image_urls;
                        let finalImages = [];

                        if (Array.isArray(rawImages)) {
                            // Backend already parsed it to an Array (Good!)
                            finalImages = rawImages;
                        } else {
                            // It's a string, we need to parse it
                            finalImages = safeParseJSON(rawImages, []);
                        }

                        // Map to the activeImages format
                        setActiveImages(finalImages.map(url => ({ 
                            id: url, 
                            url: url, 
                            isUploading: false, 
                            progress: 100 
                        })));
                        // -------------------------------------------------------

                        // 2. PARSE VIDEO
                        if (pData.video_url) {
                            if (pData.video_url.includes('youtube')) { 
                                setVideoType('youtube'); 
                                setYoutubeUrl(pData.video_url); 
                            } else { 
                                setVideoType('upload'); 
                                setUploadedVideoUrl(pData.video_url); 
                            }
                        }

                        // 3. PARSE DIMENSIONS & WEIGHT
                        let l = '', w = '', h = '', unit = 'cm', weight = '', weightUnit = 'g';
                        
                        if (pData.package_information) {
                            // Remove any extra quotes if they exist
                            const info = pData.package_information.replace(/"/g, '');
                            const parts = info.split(','); // ["10x10x10 cm", " 500g"]
                            
                            // Parse Dimensions part
                            if (parts[0]) {
                                const dimPart = parts[0].trim().split(' '); // ["10x10x10", "cm"]
                                if (dimPart[1]) unit = dimPart[1];
                                if (dimPart[0]) {
                                    const dims = dimPart[0].split('x'); // ["10", "10", "10"]
                                    if (dims[0]) l = dims[0];
                                    if (dims[1]) w = dims[1];
                                    if (dims[2]) h = dims[2];
                                }
                            }
                            
                            // Parse Weight part
                            if (parts[1]) {
                                const wStr = parts[1].trim(); 
                                if (wStr.includes('kg')) {
                                    weightUnit = 'kg';
                                    weight = wStr.replace('kg', '').trim();
                                } else {
                                    weightUnit = 'g';
                                    weight = wStr.replace('g', '').trim();
                                }
                            }
                        }

                        // 4. SET STATE
                        setProduct({ 
                            ...initialProductState, 
                            ...pData, 
                            main_category_id: parent,
                            attributes: safeParseJSON(pData.attributes, {}),
                            variants: safeParseJSON(pData.variants, []), // Backend sends variants as array now
                            main_color: safeParseJSON(pData.colors, [])[0] || '',
                            main_size: safeParseJSON(pData.sizes, [])[0] || '',
                            imported_region: ['Pakistan', 'China'].includes(pData.imported_region) ? pData.imported_region : 'Custom',
                            custom_region: (!['Pakistan', 'China'].includes(pData.imported_region)) ? pData.imported_region : '',
                            warranty_type: safeParseJSON(pData.warranty_details, {}).type || '',
                            warranty_details: safeParseJSON(pData.warranty_details, {}).info || '',
                            season: pData.season || 'No Season',
                            
                            // Dimensions
                            pkg_length: l || '',
                            pkg_width: w || '',
                            pkg_height: h || '',
                            pkg_unit: unit || 'cm', 
                            pkg_weight: weight || '',
                            pkg_weight_unit: weightUnit || 'g',
                            
                            // Ensure SKU is persisted for image uploads
                            sku: pData.sku 
                        });
                    }
                }
            } catch (e) { 
                console.error("Load Data Error:", e);
                setError("Error loading data"); 
            } finally { 
                setIsLoading(false); 
            }
        };
        loadData();
    }, [isEditMode, productId, setIsLoading]);

    // --- UPDATED HANDLER (Clean Input Logic) ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        let cleanedValue = value;

        // 1. Title: Remove stars, extra spaces, and Auto-Capitalize Words
        if (name === 'title') {
            // Remove * and extra whitespace
            let temp = value.replace(/\*/g, '').replace(/\s+/g, ' ');
            // Capitalize first letter of every word
            cleanedValue = temp.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        }

        // 2. Description: Just remove stars (*)
        if (name === 'description') {
            cleanedValue = value.replace(/\*/g, '');
        }

        setProduct(p => ({ ...p, [name]: cleanedValue }));
    };

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

    

   // --- UPDATED: BATCH UPLOAD LOGIC ---
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // 1. Validation
        if ((activeImages.length + files.length) > 15) { 
            alert('Maximum 15 images total.'); 
            return; 
        }

        // 2. Create Temporary Placeholders (So user sees "Uploading..." immediately)
        const newPlaceholders = files.map(f => ({
            id: Math.random().toString(36), // Temp ID
            url: URL.createObjectURL(f),    // Local Preview
            isUploading: true,
            progress: 0
        }));

        setActiveImages(prev => [...prev, ...newPlaceholders]);

        try {
            // 3. Compress All Images in Parallel
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/webp' };
            const compressedFiles = await Promise.all(
                files.map(file => imageCompression(file, options))
            );

            // 4. Prepare Data for ONE Request
            const formData = new FormData();
            
            // CRITICAL: Send existing SKU if we have it!
            // If product.sku is empty, Backend will generate a new one and return it.
            if (product.sku) {
                formData.append('sku', product.sku);
            }

            compressedFiles.forEach(file => {
                formData.append('images', file);
            });

            // 5. Send Request
            const token = localStorage.getItem('supplierToken');
            const response = await axios.post(`${API_BASE_URL}/api/supplier/products/upload`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data', 
                    'Authorization': `Bearer ${token}` 
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    // Update progress bars for the uploading images
                    setActiveImages(prev => prev.map(img => 
                        newPlaceholders.find(p => p.id === img.id) 
                            ? { ...img, progress: percentCompleted } 
                            : img
                    ));
                }
            });

            // 6. SUCCESS: Update State
            const { urls, sku } = response.data;

            // A. SAVE THE SKU! (So next upload uses the same ID)
            if (!product.sku || product.sku !== sku) {
                setProduct(prev => ({ ...prev, sku: sku }));
            }

            // B. Replace Placeholders with Real URLs
            setActiveImages(prev => {
                // Remove the temp placeholders
                const cleanState = prev.filter(img => !newPlaceholders.find(p => p.id === img.id));
                
                // Add the real uploaded URLs
                const realImages = urls.map(url => ({
                    id: url, // Use URL as ID for stability
                    url: url,
                    isUploading: false,
                    progress: 100
                }));
                
                return [...cleanState, ...realImages];
            });

        } catch (err) {
            console.error("Batch Upload Error:", err);
            alert("Failed to upload images. Please try again.");
            // Remove placeholders on error
            setActiveImages(prev => prev.filter(img => !newPlaceholders.find(p => p.id === img.id)));
        }
    };
    const removeImage = (id) => setActiveImages(p => p.filter(i => i.id !== id));

    const handleVideoChange = async (e) => {
        const file = e.target.files[0];
        if (!file || file.size > 80 * 1024 * 1024) return alert("Video too large (Max 80MB)");
        setVideoFile(file); setIsVideoUploading(true); setVideoProgress(0);
        try {
            const formData = new FormData();
            formData.append('video', file);
            const token = localStorage.getItem('supplierToken');
            const response = await axios.post(`${API_BASE_URL}/api/supplier/products/upload-video`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
                onUploadProgress: (p) => setVideoProgress(Math.round((p.loaded * 100) / p.total))
            });
            if (response.data.urls && response.data.urls.length > 0) setUploadedVideoUrl(response.data.urls[0]);
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
        // --- INSERT THIS INSIDE handleSubmit ---

        // Check Basic Fields
        if (!product.title || !product.price || !product.category_id) {
            window.scrollTo(0, 0);
            return setError("Please fill Title, Price, and Category.");
        }

        // CRITICAL: Variants Check
        const hasVariants = product.variants.length > 0;
        if (!hasVariants) {
            // Agar variants nahi hain, to Color aur Size zaroori hain
            if (!product.main_color || !product.main_size) {
                alert("⚠️ Since you have added NO Variants, you MUST select a main Color and Size from the Specifications section.");
                return; // Stop saving
            }
        }
        // ---------------------------------------
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
                colors: product.main_color ? [product.main_color] : [],
                sizes: product.main_size ? [product.main_size] : [],
                imported_region: product.imported_region === 'Custom' ? product.custom_region : product.imported_region,
                warranty_details: JSON.stringify({ type: product.warranty_type, info: product.warranty_details }),
                season: product.season, // <--- ADD THIS LINE
                // -----------------------

                variants: product.variants.map(v => ({ ...v, price: parseFloat(v.price), stock: parseInt(v.stock) }))
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
            <ColorBankOverlay isOpen={showColorBank} onClose={() => setShowColorBank(false)} colorData={colorFamilies} onSelect={(c) => setProduct(p => ({ ...p, main_color: c }))} />
            <SizeBankOverlay isOpen={showSizeBank} onClose={() => setShowSizeBank(false)} onSelect={(s) => setProduct(p => ({ ...p, main_size: s }))} />
            <AttributesOverlay isOpen={showAttributes} onClose={() => setShowAttributes(false)} onSave={(attrs) => setProduct(p => ({ ...p, attributes: attrs }))} subCategoryId={product.category_id} existingAttributes={product.attributes} attributeData={categoryAttributes} />
           <VariantsOverlay 
    isOpen={showVariants} 
    onClose={() => setShowVariants(false)} 
    onSave={(vars) => setProduct(p => ({...p, variants: vars}))} 
    existingVariants={product.variants} 
    colorData={colorFamilies}
    uploadedImages={activeImages} // <--- PASS THIS PROP
/>
            {/* --- MISSING WARRANTY OVERLAY ADDED HERE --- */}
            <WarrantyOverlay 
                isOpen={showWarranty} 
                onClose={() => setShowWarranty(false)}
                initialData={{ type: product.warranty_type, info: product.warranty_details }}
                onSave={(type, info) => setProduct(p => ({...p, warranty_type: type, warranty_details: info}))}
            />

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
                                    {img.isUploading && <div className="prog-overlay"><div className="bar" style={{ width: `${img.progress}%` }}></div></div>}
                                    <button type="button" className="del-btn" onClick={() => removeImage(img.id)}><Icons.Trash /></button>
                                </div>
                            ))}
                            {(uploadedVideoUrl || videoFile) && videoType === 'upload' && (
                                <div className="preview-item video-item">
                                    <video src={videoFile ? URL.createObjectURL(videoFile) : uploadedVideoUrl} controls />
                                    {isVideoUploading && <div className="prog-overlay"><div className="bar" style={{ width: `${videoProgress}%` }}></div></div>}
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
                {/* --- 3. SPECIFICATIONS (New Animated & Advanced) --- */}
                <div className="form-card">
                    <h3>Specifications</h3>

                    {/* Import Region with Flags */}
                    <div className="form-group full-width">
                        <label>Imported Region</label>
                        <RegionSelector
                            value={product.imported_region}
                            onChange={(val) => setProduct(p => ({ ...p, imported_region: val, custom_region: '' }))}
                        />
                        {product.imported_region === 'Custom' && (
                            <input
                                type="text"
                                placeholder="Enter Custom Region Name"
                                value={product.custom_region}
                                onChange={e => setProduct(p => ({ ...p, custom_region: e.target.value }))}
                                className="mt-2 animate-input"
                            />
                        )}
                    </div>
{/* --- PASTE THIS NEW BLOCK HERE --- */}
<div className="form-group full-width mt-10">
    <label><Icons.Sun /> Season</label>
    <SeasonSelector 
        value={product.season} 
        onChange={(val) => setProduct(p => ({...p, season: val}))} 
    />
</div>
{/* --------------------------------- */}

                    <div className="specs-divider"></div>

                    {/* Warranty Section - The Button Approach */}
                    <div className="form-group full-width">
                        <label>Warranty</label>
                        {product.warranty_type ? (
                            <div className="warranty-active-display" onClick={() => setShowWarranty(true)}>
                                <div className="w-icon-box"><Icons.Warranty /></div>
                                <div className="w-text-content">
                                    <span className="w-title">{product.warranty_type}</span>
                                    <span className="w-desc">{product.warranty_details ? product.warranty_details.substring(0, 40) + '...' : 'No details added'}</span>
                                </div>
                                <div className="w-edit"><Icons.Edit /></div>
                            </div>
                        ) : (
                            <button type="button" className="add-warranty-btn" onClick={() => setShowWarranty(true)}>
                                <Icons.Warranty /> <span>Add Warranty</span>
                            </button>
                        )}
                    </div>

                    <div className="specs-divider"></div>

                    {/* Colors & Sizes with Icons and Animations */}
                    <div className="spec-info-alert">
                        {product.variants.length === 0
                            ? <><span className="red">⚠️ Required:</span> No variants added? Select Color & Size below.</>
                            : <><span className="blue">ℹ️ Optional:</span> Set default display options.</>
                        }
                    </div>

                    <div className="form-grid mt-10">
                        <div className="form-group">
                            <label><Icons.Palette /> Main Color <span className="red">*</span></label>
                            <div className="bank-select-trigger" onClick={() => setShowColorBank(true)}>
                                {product.main_color ? (
                                    <span className="selected-val">
                                        <span className="dot" style={{ background: product.main_color === 'Multicolor' ? 'linear-gradient(135deg, #ff0000, #ffff00, #00ff00, #0000ff)' : (colorFamilies.find(c => c.name === product.main_color)?.hex || '#ccc') }}></span>
                                        {product.main_color}
                                    </span>
                                ) : <span className="placeholder">Select Color...</span>}
                                <Icons.ChevronDown />
                            </div>
                        </div>

                        <div className="form-group">
                            <label><Icons.Ruler /> Main Size <span className="red">*</span></label>
                            <div className="bank-select-trigger" onClick={() => setShowSizeBank(true)}>
                                <span className={product.main_size ? "selected-val" : "placeholder"}>
                                    {product.main_size || "Select Size..."}
                                </span>
                                <Icons.ChevronDown />
                            </div>
                        </div>
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