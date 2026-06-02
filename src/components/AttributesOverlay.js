// src/components/AttributesOverlay.js
import React, { useState, useEffect, useRef } from 'react';
import './AttributesOverlay.css'; 

// --- LOCAL ICONS ---
const Icons = {
    Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
};

// --- CUSTOM SELECT ---
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

// --- MAIN COMPONENT ---
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
        <div className="fullscreen-overlay attr-overlay-theme fade-in-overlay" style={{ zIndex: 2001 }}>
            <div className="overlay-header">
                <button type="button" className="overlay-back-btn" onClick={onClose}>
                     <span>Cancel</span>
                </button>
                <h3>Specifications</h3>
                <button type="button" className="overlay-save-animated" onClick={handleSave}>Done</button>
            </div>
            <div className="overlay-body form-content">
                <p className="overlay-hint">Detailed specifications help customers find your product.</p>

                {attrsForCat.length > 0 ? attrsForCat.map(attr => {
                    const options = (attr.options || '').split(',').map(o => o.trim());
                    const displayOptions = [...options, "Custom"];
                    const currentValue = attributes[attr.name] || '';
                    const isCustomValue = currentValue && !options.includes(currentValue);

                    return (
                        <div key={attr.name} className="overlay-form-group scale-in-entry">
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
                                        <input type="text" className="mt-2 slide-in-down-quick" placeholder={`Enter custom ${attr.name}`} value={currentValue} onChange={(e) => setAttributes(p => ({ ...p, [attr.name]: e.target.value }))} />
                                    )}
                                </>
                            ) : (
                                <input type="text" value={currentValue} onChange={(e) => setAttributes(p => ({ ...p, [attr.name]: e.target.value }))} placeholder={`Enter ${attr.name}...`} />
                            )}
                        </div>
                    );
                }) : <div className="empty-state">No predefined attributes for this category. Add custom ones below.</div>}

                <div className="custom-section">
                    <h4>Additional Details</h4>
                    {customAttributes.map((c, i) => (
                        <div key={i} className="custom-row scale-in-entry">
                            <input placeholder="Name (e.g. Pattern)" value={c.key} onChange={e => { const n = [...customAttributes]; n[i].key = e.target.value; setCustomAttributes(n) }} />
                            <input placeholder="Value (e.g. Floral)" value={c.value} onChange={e => { const n = [...customAttributes]; n[i].value = e.target.value; setCustomAttributes(n) }} />
                            <button type="button" className="trash-action-btn" onClick={() => setCustomAttributes(p => p.filter((_, idx) => idx !== i))}><Icons.Trash /></button>
                        </div>
                    ))}
                    <button type="button" className="add-custom-btn" onClick={() => setCustomAttributes(p => [...p, { key: '', value: '' }])}>+ Add Custom Field</button>
                </div>
            </div>
        </div>
    );
};

export default AttributesOverlay;