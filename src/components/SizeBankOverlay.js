// src/components/SizeBankOverlay.js
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './SizeBankOverlay.css';

// --- LOCAL ICONS ---
const Icons = {
    Close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
    Info: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
};

// Bulletproof Inline Layout Style
const overlayInlineStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f8fafc',
    zIndex: 999999,
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflowY: 'auto'
};

const SizeBankOverlay = ({ isOpen, onClose, onSelect, sizeGroups }) => {
    const [topCustomInput, setTopCustomInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
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

    // --- REAL-TIME NESTED SIZE SEARCH FILTERING LOGIC ---
    const filteredGroups = {};
    let totalMatches = 0;

    Object.entries(sizeGroups).forEach(([group, sizes]) => {
        const matchedSizes = sizes.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        if (matchedSizes.length > 0) {
            filteredGroups[group] = matchedSizes;
            totalMatches += matchedSizes.length;
        }
    });

    const isSearching = searchQuery.trim() !== '';
    const noResultsFound = isSearching && totalMatches === 0;

    return createPortal(
        <div className="fullscreen-overlay size-bank-theme fade-in-overlay" style={overlayInlineStyle}>
            <div className="overlay-header">
                <button type="button" className="overlay-back-btn" onClick={onClose}>
                    <Icons.Back /> <span>Cancel</span>
                </button>
                <h3>Select Product Size</h3>
                <button type="button" className="overlay-close-btn" onClick={onClose} title="Close Overlay">
                    <Icons.Close />
                </button>
            </div>
            
            <div className="overlay-body">
                {/* 1. TOP CUSTOM CREATOR FORM */}
                <div className="top-custom-creator">
                    <h4>Add Custom Size</h4>
                    <form onSubmit={handleTopCustomSubmit} className="top-custom-form">
                        <input 
                            type="text" 
                            placeholder="Type Custom Size (e.g. 5.5 Gaz, 44x36, Double XL)..." 
                            value={topCustomInput} 
                            onChange={e => setTopCustomInput(e.target.value)}
                            className="top-custom-input"
                        />
                        <button type="submit" className="top-custom-btn ripple-click" disabled={!topCustomInput.trim()}>
                            Apply Custom
                        </button>
                    </form>
                </div>

                <div className="specs-divider"></div>

                {/* 2. LIVE SEARCH INPUT */}
                <div className="search-section-wrapper">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search size (e.g. 3 Piece, XXL, US 9, Single Sheet)..." 
                        value={searchQuery} 
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* 3. DYNAMIC SEARCH CONTENT LIST */}
                {noResultsFound ? (
                    <div className="no-sizes-found-alert scale-in-entry">
                        <Icons.Info />
                        <div className="alert-content">
                            <strong>This size is not available</strong>
                            <p>Aap jo size search kar rahay hain woh list mein nahi mila. Meharbani kar ke upar diye gaye custom options se apna khud ka size dakhil karein!</p>
                        </div>
                    </div>
                ) : (
                    Object.entries(filteredGroups).map(([group, sizes], idx) => (
                        <div key={group} className="size-group scale-in-entry" style={{ animationDelay: `${idx * 0.04}s` }}>
                            <h4>{group}</h4>
                            <div className="size-bank-grid">
                                {sizes.map(s => (
                                    <button 
                                        key={s} 
                                        type="button" 
                                        className="size-chip-item ripple-click"
                                        onClick={() => { onSelect(s); onClose(); }}
                                    >
                                        {s}
                                    </button>
                                ))}
                                {!isSearching && (
                                    activeCustomGroup === group ? (
                                        <div className="custom-size-mini-form">
                                            <input autoFocus placeholder="Enter size" value={customInput} onChange={e => setCustomInput(e.target.value)} />
                                            <button type="button" onClick={handleCustomSubmit}>OK</button>
                                        </div>
                                    ) : (
                                        <button className="custom-btn-trigger" type="button" onClick={() => setActiveCustomGroup(group)}>+ Custom</button>
                                    )
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>,
        document.body
    );
};

export default SizeBankOverlay;