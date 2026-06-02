// src/pages/ProductForm.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import supplierService from '../services/supplierService';

// --- DATA IMPORTS ---
import { categoryAttributes } from '../data/attributes';
import { colorFamilies } from '../data/colors'; 
import { sizeGroups } from '../data/sizes';     

// --- COMPONENT IMPORTS ---
import AttributesOverlay from '../components/AttributesOverlay';
import VariantsOverlay from '../components/VariantsOverlay';

import './ProductForm.css';

// --- ICONS ---
const Icons = {
    Camera: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>,
    Video: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>,
    Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
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
    Sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2"></path><path d="M12 21v2"></path><path d="M4.22 4.22l1.42 1.42"></path><path d="M18.36 18.36l1.42 1.42"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="M4.22 19.78l1.42-1.42"></path><path d="M18.36 5.64l1.42-1.42"></path></svg>
};

// --- CONSTANTS ---
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';
const UPLOAD_API_URL = process.env.REACT_APP_UPLOAD_API_URL || API_BASE_URL;

const initialProductState = {
    title: '', description: '', price: '', discounted_price: '',
    quantity: '', status: 'In Stock', category_id: '', main_category_id: '',
    attributes: {}, variants: [], image_urls: [], video_url: '',
    shipping_details: 'Standard', package_information: '', season: 'No Season',
    custom_season: '', pkg_length: '', pkg_width: '', pkg_height: '',
    pkg_unit: 'cm', pkg_weight: '', pkg_weight_unit: 'g',
    main_color: '', main_size: '',
    imported_region: 'Pakistan', custom_region: '',
    warranty_type: '', warranty_details: ''
};

const safeParseJSON = (jsonString, defaultValue) => {
    try { const parsed = JSON.parse(jsonString); return parsed === null ? defaultValue : parsed; } catch (e) { return defaultValue; }
};

// --- SHIMMER IMAGE ---
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

// --- CATEGORY OVERLAY ---
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

// --- REGION SELECTOR (Custom with Flags) ---
const RegionSelector = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const regions = [
        { id: 'Pakistan', label: 'Pakistan', img: '/pakistan.png' }, 
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

// --- ADVANCED WARRANTY OVERLAY ---
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
                        <input type="text" placeholder="e.g. 12 Months, 2 Years..."
                            value={duration} onChange={e => setDuration(e.target.value)}
                            className="pro-input" autoFocus />
                    </div>

                    <div className="w-input-group mt-20">
                        <label>Warranty Terms & Details</label>
                        <div className="fake-rich-editor">
                            <div className="editor-toolbar">
                                <Icons.Bold /> <Icons.Italic /> <Icons.List />
                            </div>
                            <textarea
                                placeholder="Terms and conditions..."
                                value={details}
                                onChange={e => setDetails(e.target.value)}
                                maxLength={200}
                            ></textarea>
                            <div className="char-count">{details.length}/200</div>
                        </div>
                    </div>

                    <div className="w-actions">
                        <button type="button" className="w-cancel" onClick={onClose}>Cancel</button>
                        <button type="button" className="w-save" onClick={() => { onSave(duration, details); onClose(); }}>
                            Save Warranty
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COLOR BANK OVERLAY ---
const ColorBankOverlay = ({ isOpen, onClose, onSelect, colorData }) => {
    const [search, setSearch] = useState('');
    const [customColorName, setCustomColorName] = useState('');

    if (!isOpen) return null;

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (customColorName.trim()) {
            onSelect(customColorName.trim());
            onClose();
            setCustomColorName('');
        }
    };

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
                <div className="top-custom-creator">
                    <h4>Add Custom Color</h4>
                    <form onSubmit={handleCustomSubmit} className="top-custom-form">
                        <input 
                            type="text" 
                            placeholder="Type Custom Color..." 
                            value={customColorName} 
                            onChange={e => setCustomColorName(e.target.value)}
                            className="top-custom-input"
                        />
                        <button type="submit" className="top-custom-btn" disabled={!customColorName.trim()}>
                            Add & Select
                        </button>
                    </form>
                </div>

                <div className="specs-divider"></div>

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

// --- SIZE BANK OVERLAY ---
const SizeBankOverlay = ({ isOpen, onClose, onSelect, sizeGroups }) => {
    const [topCustomInput, setTopCustomInput] = useState('');
    const [customInput, setCustomInput] = useState('');
    const [activeCustomGroup, setActiveCustomGroup] = useState(null);

    if (!isOpen) return null;

    const handleTopCustomSubmit = (e) => {
        e.preventDefault();
        if (topCustomInput.trim()) {
            onSelect(topCustomInput.trim());
            onClose();
            setTopCustomInput('');
        }
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
                <div className="top-custom-creator">
                    <h4>Add Custom Size</h4>
                    <form onSubmit={handleTopCustomSubmit} className="top-custom-form">
                        <input 
                            type="text" 
                            placeholder="Type Custom Size..." 
                            value={topCustomInput} 
                            onChange={e => setTopCustomInput(e.target.value)}
                            className="top-custom-input"
                        />
                        <button type="submit" className="top-custom-btn" disabled={!topCustomInput.trim()}>
                            Add & Select
                        </button>
                    </form>
                </div>

                <div className="specs-divider"></div>

                {Object.entries(sizeGroups).map(([group, sizes], idx) => (
                    <div key={group} className="size-group fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <h4>{group}</h4>
                        <div className="size-bank-grid">
                            {sizes.map(s => (
                                <button key={s} type="button" onClick={() => { onSelect(s); onClose(); }}>{s}</button>
                            ))}
                            {activeCustomGroup === group ? (
                                <div className="custom-size-mini-form">
                                    <input autoFocus placeholder="Enter size" value={customInput} onChange={e => setCustomInput(e.target.value)} />
                                    <button type="button" onClick={handleCustomSubmit}>OK</button>
                                </div>
                            ) : (
                                <button className="custom-btn-trigger" type="button" onClick={() => setActiveCustomGroup(group)}>+ Custom</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- SEASON SELECTOR ---
const SeasonSelector = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
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

// --- MAIN PRODUCT FORM COMPONENT ---
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

    // Drag-and-Drop state
    const [isDragging, setIsDragging] = useState(false);

    // Overlay States
    const [showAttributes, setShowAttributes] = useState(false);
    const [showVariants, setShowVariants] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [showColorBank, setShowColorBank] = useState(false);
    const [showSizeBank, setShowSizeBank] = useState(false);
    const [showWarranty, setShowWarranty] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // Load Data
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
                        
                        let rawImages = pData.image_urls;
                        let finalImages = [];

                        if (Array.isArray(rawImages)) {
                            finalImages = rawImages;
                        } else {
                            finalImages = safeParseJSON(rawImages, []);
                        }

                        setActiveImages(finalImages.map(url => ({ 
                            id: url, 
                            url: url, 
                            isUploading: false, 
                            progress: 100 
                        })));

                        if (pData.video_url) {
                            if (pData.video_url.includes('youtube')) { 
                                setVideoType('youtube'); 
                                setYoutubeUrl(pData.video_url); 
                            } else { 
                                setVideoType('upload'); 
                                setUploadedVideoUrl(pData.video_url); 
                            }
                        }

                        let l = '', w = '', h = '', unit = 'cm', weight = '', weightUnit = 'g';
                        
                        if (pData.package_information) {
                            const info = pData.package_information.replace(/"/g, '');
                            const parts = info.split(',');
                            
                            if (parts[0]) {
                                const dimPart = parts[0].trim().split(' ');
                                if (dimPart[1]) unit = dimPart[1];
                                if (dimPart[0]) {
                                    const dims = dimPart[0].split('x');
                                    if (dims[0]) l = dims[0];
                                    if (dims[1]) w = dims[1];
                                    if (dims[2]) h = dims[2];
                                }
                            }
                            
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

                        setProduct({ 
                            ...initialProductState, 
                            ...pData, 
                            main_category_id: parent,
                            attributes: safeParseJSON(pData.attributes, {}),
                            variants: safeParseJSON(pData.variants, []), 
                            main_color: safeParseJSON(pData.colors, [])[0] || '',
                            main_size: safeParseJSON(pData.sizes, [])[0] || '',
                            imported_region: ['Pakistan', 'China'].includes(pData.imported_region) ? pData.imported_region : 'Custom',
                            custom_region: (!['Pakistan', 'China'].includes(pData.imported_region)) ? pData.imported_region : '',
                            warranty_type: safeParseJSON(pData.warranty_details, {}).type || '',
                            warranty_details: safeParseJSON(pData.warranty_details, {}).info || '',
                            season: pData.season || 'No Season',
                            pkg_length: l || '',
                            pkg_width: w || '',
                            pkg_height: h || '',
                            pkg_unit: unit || 'cm', 
                            pkg_weight: weight || '',
                            pkg_weight_unit: weightUnit || 'g',
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

    // Input Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        let cleanedValue = value;

        if (name === 'title') {
            let temp = value.replace(/\*/g, '').replace(/\s+/g, ' ');
            cleanedValue = temp.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        }

        if (name === 'description') {
            cleanedValue = value.replace(/\*/g, '');
        }

        setProduct(p => ({ ...p, [name]: cleanedValue }));
    };

    // Rich Text insertion
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

    // --- CORE IMAGE BATCH UPLOAD PROCESS ---
    const processImageFiles = async (files) => {
        if (files.length === 0) return;

        if ((activeImages.length + files.length) > 15) { 
            alert('Maximum 15 images total.'); 
            return; 
        }

        const newPlaceholders = files.map(f => ({
            id: Math.random().toString(36), 
            url: URL.createObjectURL(f),    
            isUploading: true,
            progress: 0
        }));

        setActiveImages(prev => [...prev, ...newPlaceholders]);

        try {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/webp' };
            const compressedFiles = await Promise.all(
                files.map(file => imageCompression(file, options))
            );

            const formData = new FormData();
            if (product.sku) {
                formData.append('sku', product.sku);
            }

            compressedFiles.forEach(file => {
                formData.append('images', file);
            });

            const token = localStorage.getItem('supplierToken');
            const response = await axios.post(`${UPLOAD_API_URL}/api/upload`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data', 
                    'Authorization': `Bearer ${token}` 
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setActiveImages(prev => prev.map(img => 
                        newPlaceholders.find(p => p.id === img.id) 
                            ? { ...img, progress: percentCompleted } 
                            : img
                    ));
                }
            });

            const { urls, sku } = response.data;

            if (!product.sku || product.sku !== sku) {
                setProduct(prev => ({ ...prev, sku: sku }));
            }

            setActiveImages(prev => {
                const cleanState = prev.filter(img => !newPlaceholders.find(p => p.id === img.id));
                const realImages = urls.map(url => ({
                    id: url, 
                    url: url,
                    isUploading: false,
                    progress: 100
                }));
                return [...cleanState, ...realImages];
            });

        } catch (err) {
            console.error("Batch Upload Error:", err);
            alert("Failed to upload images. Please try again.");
            setActiveImages(prev => prev.filter(img => !newPlaceholders.find(p => p.id === img.id)));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        processImageFiles(files);
    };

    // Drag Drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            processImageFiles(files);
        } else {
            alert("Please drop valid image files.");
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
            const response = await axios.post(`${UPLOAD_API_URL}/api/upload-video`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
                onUploadProgress: (p) => setVideoProgress(Math.round((p.loaded * 100) / p.total))
            });
            if (response.data.urls && response.data.urls.length > 0) setUploadedVideoUrl(response.data.urls[0]);
        } catch (e) { alert("Video upload failed"); setVideoFile(null); }
        finally { setIsVideoUploading(false); }
    };

    const removeVideo = () => { setVideoFile(null); setUploadedVideoUrl(''); setYoutubeUrl(''); setVideoProgress(0); };

    const handleCategorySelect = (mainId, subId) => setProduct(p => ({ ...p, main_category_id: mainId, category_id: subId, attributes: {} }));
    
    const getCatNames = () => {
        const m = categories.find(c => String(c.id) === String(product.main_category_id));
        const s = categories.find(c => String(c.id) === String(product.category_id));
        if (m && s) return `${m.name} > ${s.name}`;
        return "Select Category";
    };

    // Submit Handling
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product.title || !product.price || !product.category_id) {
            window.scrollTo(0, 0);
            return setError("Please fill Title, Price, and Category.");
        }

        const hasVariants = product.variants.length > 0;
        if (!hasVariants) {
            if (!product.main_color || !product.main_size) {
                alert("⚠️ Since you have added NO Variants, you MUST select a main Color and Size from the Specifications section.");
                return;
            }
        }
        
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
                season: product.season,
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
            <SizeBankOverlay isOpen={showSizeBank} onClose={() => setShowSizeBank(false)} onSelect={(s) => setProduct(p => ({ ...p, main_size: s }))} sizeGroups={sizeGroups} />
            
            {/* EXTERNAL SEPARATED COMPONENTS */}
            <AttributesOverlay isOpen={showAttributes} onClose={() => setShowAttributes(false)} onSave={(attrs) => setProduct(p => ({ ...p, attributes: attrs }))} subCategoryId={product.category_id} existingAttributes={product.attributes} attributeData={categoryAttributes} />
            <VariantsOverlay isOpen={showVariants} onClose={() => setShowVariants(false)} onSave={(vars) => setProduct(p => ({...p, variants: vars}))} existingVariants={product.variants} colorData={colorFamilies} uploadedImages={activeImages} />
            
            <WarrantyOverlay isOpen={showWarranty} onClose={() => setShowWarranty(false)} initialData={{ type: product.warranty_type, info: product.warranty_details }} onSave={(type, info) => setProduct(p => ({...p, warranty_type: type, warranty_details: info}))} />

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

                    <div 
                        className={`media-section mt-20 drag-drop-zone ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <label className="section-title">
                            Media Gallery {isDragging && <span className="drag-active-text">(Drop Images Here!)</span>}
                        </label>
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

                        <p className="drag-drop-hint">Tip: You can drag & drop multiple images directly here.</p>

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
                                    <button type="button" className="del-btn" onClick={removeVideo}><Icons.Trash /></button>
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

                {/* ProductForm.js ke andar Category & Specs Card */}
<div className="form-card">
    <h3>Category & Specs</h3>
    <div className="form-group full-width">
        <label>Category <span className="red">*</span></label>
        <div className="cat-select-btn" onClick={() => setShowCategories(true)}>
            <span>{getCatNames()}</span> <button type="button">Change</button>
        </div>
    </div>
    <div className="btn-row">
        {/* NAYA INTERACTIVE ATTRIBUTES BUTTON */}
        <button 
            type="button" 
            className={`action-btn ${!product.category_id ? 'attr-disabled-btn' : ''}`} 
            onClick={() => {
                if (!product.category_id) {
                    alert("⚠️ Please select a Category first to unlock Specifications/Attributes!");
                } else {
                    setShowAttributes(true);
                }
            }}
        >
            {!product.category_id 
                ? 'Select Category First' 
                : (Object.keys(product.attributes).length > 0 
                    ? `✓ ${Object.keys(product.attributes).length} Attributes` 
                    : 'Add Attributes'
                  )
            }
        </button>
        <button type="button" className="action-btn" onClick={() => setShowVariants(true)}>
            {product.variants.length > 0 ? `✓ ${product.variants.length} Variants` : 'Add Variants'}
        </button>
    </div>
</div>

                <div className="form-card">
                    <h3>Specifications</h3>

                    {/* Import Region */}
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

                    <div className="form-group full-width mt-10">
                        <label><Icons.Sun /> Season</label>
                        <SeasonSelector 
                            value={product.season} 
                            onChange={(val) => setProduct(p => ({...p, season: val}))} 
                        />
                    </div>

                    <div className="specs-divider"></div>

                    {/* Warranty Section */}
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