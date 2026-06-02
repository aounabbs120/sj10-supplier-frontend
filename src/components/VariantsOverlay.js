// src/components/VariantsOverlay.js
import React, { useState, useEffect } from 'react';
import { colorFamilies } from '../data/colors'; 
import { sizeGroups } from '../data/sizes';     
import './VariantsOverlay.css'; 

// --- LOCAL ICONS ---
const Icons = {
    Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Back: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
    Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    ImageIcon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
    Ruler: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"></path><path d="M6 12v-2"></path><path d="M10 12v-4"></path><path d="M14 12v-4"></path><path d="M18 12v-2"></path></svg>,
    Check: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Sparkles: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>,
    Info: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
};

// --- SUB-COMPONENT: NESTED SIZE PICKER ---
const VariantSizePicker = ({ isOpen, onClose, onSelect }) => {
    const [topCustomInput, setTopCustomInput] = useState('');

    if (!isOpen) return null;

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (topCustomInput.trim()) {
            onSelect(topCustomInput.trim());
            onClose();
            setTopCustomInput('');
        }
    };

    return (
        <div className="fullscreen-overlay picker-modal-appear" style={{ zIndex: 3100 }}>
            <div className="overlay-header">
                <h3>Select Variant Size</h3>
                <button type="button" className="overlay-close" onClick={onClose}><Icons.Close /></button>
            </div>
            <div className="overlay-body">
                <div className="top-custom-creator">
                    <h4>Add Custom Size</h4>
                    <form onSubmit={handleCustomSubmit} className="top-custom-form">
                        <input 
                            type="text" 
                            placeholder="Type any custom size..." 
                            value={topCustomInput} 
                            onChange={e => setTopCustomInput(e.target.value)}
                            className="top-custom-input"
                            autoFocus
                        />
                        <button type="submit" className="top-custom-btn" disabled={!topCustomInput.trim()}>
                            Apply Size
                        </button>
                    </form>
                </div>

                <div className="specs-divider"></div>

                {Object.entries(sizeGroups).map(([group, sizes]) => (
                    <div key={group} className="size-group">
                        <h4>{group}</h4>
                        <div className="size-bank-grid">
                            {sizes.map(s => (
                                <button 
                                    key={s} 
                                    type="button" 
                                    onClick={() => { onSelect(s); onClose(); }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const VariantsOverlay = ({ isOpen, onClose, onSave, existingVariants, uploadedImages }) => {
    const [variants, setVariants] = useState([]);
    
    // Inputs
    const [color, setColor] = useState('');
    const [colorSearch, setColorSearch] = useState('');
    const [customColor, setCustomColor] = useState('');
    const [isCustomActive, setIsCustomActive] = useState(false);
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [selectedImg, setSelectedImg] = useState('');

    const [showSizePicker, setShowSizePicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { if (isOpen) setVariants(existingVariants || []); }, [isOpen, existingVariants]);

    const addVariant = () => {
        const finalColor = isCustomActive ? customColor.trim() : color;
        if (!finalColor) return alert("Please select or enter a color.");
        if (!size) return alert("Please select a size.");
        if (!price || parseFloat(price) <= 0) return alert("Please enter a valid price.");
        if (!stock || parseInt(stock) < 0) return alert("Please enter valid stock quantity.");
        if (!selectedImg) return alert("Please link an image for this variant.");

        const isDuplicate = variants.some(v => v.color.toLowerCase() === finalColor.toLowerCase() && v.size.toLowerCase() === size.toLowerCase());
        if (isDuplicate) return alert("This Color and Size combination already exists.");

        setVariants(p => [...p, { 
            color: finalColor, 
            size, 
            price: parseFloat(price), 
            stock: parseInt(stock), 
            image: selectedImg 
        }]);
        
        // Retain inputs, clear linked image for next variant
        setSelectedImg(''); 
    };

    const handleSaveProcess = () => {
        setIsSaving(true);
        setTimeout(() => {
            onSave(variants);
            onClose();
            setIsSaving(false);
        }, 850); 
    };

    const filteredColors = colorFamilies.filter(c => c.name.toLowerCase().includes(colorSearch.toLowerCase()));
    const displayColorName = isCustomActive ? (customColor.trim() || 'Custom Color') : (color || 'Not Selected');

    if (!isOpen) return null;

    return (
        <div className="fullscreen-overlay variants-root-theme fade-in-overlay" style={{ zIndex: 2001 }}>
            <VariantSizePicker 
                isOpen={showSizePicker} 
                onClose={() => setShowSizePicker(false)} 
                onSelect={(selectedSize) => setSize(selectedSize)} 
            />

            <div className="overlay-header">
                <button type="button" className="overlay-back-btn" onClick={onClose}>
                    <Icons.Back /> <span className="hide-on-mobile">Go Back</span>
                </button>
                <h3 className="overlay-title">Manage Variants</h3>
                <button 
                    type="button" 
                    className="overlay-save-animated" 
                    onClick={handleSaveProcess}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <div className="saving-spinner-row">
                            <span className="spinner-slice"></span>
                            <span className="hide-on-mobile">Saving...</span>
                        </div>
                    ) : (
                        <>
                            <span className="hide-on-mobile">Save Changes ({variants.length})</span>
                            <span className="show-on-mobile">Save ({variants.length})</span>
                        </>
                    )}
                </button>
            </div>

            <div className="overlay-body scroll-container">
                <div className="variant-columns-layout">
                    
                    {/* LEFT COLUMN: CREATOR CARD */}
                    <div className="creator-column">
                        <div className="wizard-card">
                            <h4 className="wizard-card-title">Create Variant</h4>
                            
                            {/* STEP 1: COLOR SELECTION */}
                            <div className="wizard-step-section">
                                <span className="wizard-step-tag">Step 1: Color Selection</span>
                                
                                <input 
                                    className="search-input mt-10" 
                                    placeholder="Search standard color..." 
                                    value={colorSearch} 
                                    onChange={e => setColorSearch(e.target.value)} 
                                />

                                <div className="color-scroll-container">
                                    <button
                                        type="button"
                                        className={`color-chip-btn custom-trigger-chip ${isCustomActive ? 'active' : ''}`}
                                        onClick={() => { setIsCustomActive(true); setColor(''); }}
                                    >
                                        <span className="dot gradient-dot"></span>
                                        <span>+ Custom</span>
                                    </button>

                                    {filteredColors.map(c => (
                                        <button 
                                            type="button"
                                            key={c.name} 
                                            className={`color-chip-btn ${(!isCustomActive && color === c.name) ? 'active' : ''}`} 
                                            onClick={() => { setColor(c.name); setIsCustomActive(false); setCustomColor(''); }}
                                        >
                                            <span className="dot" style={{ background: c.hex }}></span> 
                                            <span>{c.name}</span>
                                            {!isCustomActive && color === c.name && <Icons.Check />}
                                        </button>
                                    ))}
                                </div>

                                {isCustomActive && (
                                    <div className="custom-color-inline-form slide-in-down-quick">
                                        <input 
                                            type="text" 
                                            placeholder="Enter Custom Color Name (e.g. Olive Green)" 
                                            value={customColor}
                                            onChange={e => setCustomColor(e.target.value)}
                                            className="inline-text-input mt-10"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>

                            {/* STEP 2: SIZE SELECTION */}
                            <div className="wizard-step-section mt-15">
                                <span className="wizard-step-tag">Step 2: Size Selection</span>
                                <div className="mt-10">
                                    {size ? (
                                        <div className="selected-indicator-box ripple-click" onClick={() => setShowSizePicker(true)}>
                                            <div className="indicator-content">
                                                <Icons.Ruler />
                                                <span>Size: <strong>{size}</strong></span>
                                            </div>
                                            <button type="button" className="indicator-change-btn">Change</button>
                                        </div>
                                    ) : (
                                        <button type="button" className="trigger-picker-btn ripple-click" onClick={() => setShowSizePicker(true)}>
                                            <Icons.Ruler /> <span>Choose from Size Bank</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* STEP 3: LINK MEDIA */}
                            <div className="wizard-step-section mt-15">
                                <span className="wizard-step-tag">Step 3: Link Media (1-Click Select)</span>
                                <div className="mt-10">
                                    {uploadedImages.length > 0 ? (
                                        <div className="horizontal-media-scroll">
                                            {uploadedImages.map((img, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className={`media-scroll-item ${selectedImg === img.url ? 'selected' : ''}`}
                                                    onClick={() => setSelectedImg(img.url)}
                                                >
                                                    <img src={img.url} alt="" />
                                                    {selectedImg === img.url && (
                                                        <div className="item-selected-overlay">
                                                            <Icons.Check />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="no-images-inline-warning">
                                            <Icons.Info />
                                            <span>Please upload product images first in "Basic Details".</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* STEP 4: PRICE & INVENTORY */}
                            <div className="wizard-step-section mt-15">
                                <span className="wizard-step-tag">Step 4: Price & Inventory</span>
                                <div className="form-grid-v2 mt-10">
                                    <div className="form-group-v">
                                        <label>Price (PKR) *</label>
                                        <input 
                                            type="number" 
                                            placeholder="e.g. 1999" 
                                            value={price} 
                                            onChange={e => setPrice(e.target.value)} 
                                        />
                                    </div>
                                    <div className="form-group-v">
                                        <label>Stock Qty *</label>
                                        <input 
                                            type="number" 
                                            placeholder="e.g. 20" 
                                            value={stock} 
                                            onChange={e => setStock(e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* STEP 5: LIVE PREVIEW CONTAINER */}
                            <div className="live-preview-container mt-15">
                                <div className="live-preview-header">
                                    <Icons.Sparkles />
                                    <span>Live Variant Preview</span>
                                </div>
                                <div className="live-preview-badges">
                                    <span className="badge color-badge">{displayColorName}</span>
                                    <span className="badge plus-sign">+</span>
                                    <span className="badge size-badge">{size || 'No Size'}</span>
                                    <span className="badge price-badge">PKR {price || '0'}</span>
                                    <span className="badge stock-badge">Qty: {stock || '0'}</span>
                                </div>
                            </div>

                            <button type="button" className="add-this-variant-btn mt-15 animated-add-btn" onClick={addVariant}>
                                Add This Variant
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: LIST VIEW */}
                    <div className="list-column">
                        <div className="list-view-header">
                            <h4>Added Variants ({variants.length})</h4>
                            {variants.length > 0 && (
                                <span className="sum-tag">
                                    Total Stock: {variants.reduce((acc, curr) => acc + parseInt(curr.stock || 0), 0)} pcs
                                </span>
                            )}
                        </div>
                        
                        <div className="variants-list-wrapper">
                            {variants.length > 0 ? (
                                <div className="modern-v-grid">
                                    {variants.map((v, i) => (
                                        <div key={i} className="modern-v-item scale-in-entry">
                                            <div className="modern-v-img">
                                                <img src={v.image} alt="" />
                                            </div>
                                            <div className="modern-v-info">
                                                <div className="info-tags">
                                                    <span className="info-badge-col">{v.color}</span>
                                                    <span className="info-badge-sz">{v.size}</span>
                                                </div>
                                                <div className="info-prices">
                                                    <span className="price-text">PKR {v.price}</span>
                                                    <span className="stock-text">Stock: {v.stock}</span>
                                                </div>
                                            </div>
                                            <button 
                                                type="button" 
                                                className="modern-v-del-btn" 
                                                onClick={() => setVariants(p => p.filter((_, idx) => idx !== i))}
                                            >
                                                <Icons.Trash />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-list-placeholder">
                                    <Icons.ImageIcon />
                                    <p>No variants added yet.</p>
                                    <span>Fill out the creator card on the left to add a product variant.</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VariantsOverlay;