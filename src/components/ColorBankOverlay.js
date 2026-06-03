// src/components/ColorBankOverlay.js
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './ColorBankOverlay.css';

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

const ColorBankOverlay = ({ isOpen, onClose, onSelect, colorData }) => {
    const [searchQuery, setSearchQuery] = useState('');
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

    // --- REAL-TIME COLOR SEARCH FILTERING ---
    const filteredColors = allColors.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isSearching = searchQuery.trim() !== '';
    const noResultsFound = isSearching && filteredColors.length === 0;

    return createPortal(
        <div className="fullscreen-overlay color-bank-theme fade-in-overlay" style={overlayInlineStyle}>
            <div className="overlay-header">
                <button type="button" className="overlay-back-btn" onClick={onClose}>
                    <Icons.Back /> <span>Cancel</span>
                </button>
                <h3>Select Product Color</h3>
                <button type="button" className="overlay-close-btn" onClick={onClose} title="Close Overlay">
                    <Icons.Close />
                </button>
            </div>
            
            <div className="overlay-body">
                {/* 1. TOP CUSTOM COLOR CREATOR FORM */}
                <div className="top-custom-creator">
                    <h4>Add Custom Color</h4>
                    <form onSubmit={handleCustomSubmit} className="top-custom-form">
                        <input 
                            type="text" 
                            placeholder="Type Custom Color (e.g. Baby Pink, Mustard Gold)..." 
                            value={customColorName} 
                            onChange={e => setCustomColorName(e.target.value)}
                            className="top-custom-input"
                        />
                        <button type="submit" className="top-custom-btn ripple-click" disabled={!customColorName.trim()}>
                            Apply Color
                        </button>
                    </form>
                </div>

                <div className="specs-divider"></div>

                {/* 2. LIVE SEARCH INPUT */}
                <div className="search-section-wrapper">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search standard color (e.g. Red, Teal, Charcoal)..." 
                        value={searchQuery} 
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* 3. DYNAMIC CONTENT LIST */}
                {noResultsFound ? (
                    <div className="no-colors-found-alert scale-in-entry">
                        <Icons.Info />
                        <div className="alert-content">
                            <strong>This color is not available</strong>
                            <p>Aap jo color search kar rahay hain woh list mein nahi mila. Meharbani kar ke upar diye gaye custom options se apna khud ka color dakhil karein!</p>
                        </div>
                    </div>
                ) : (
                    <div className="color-grid-bank">
                        {filteredColors.map(c => (
                            <div 
                                key={c.name} 
                                className="bank-item scale-in-entry ripple-click" 
                                onClick={() => { onSelect(c.name); onClose(); }}
                            >
                                <div className="bank-dot" style={{ background: c.hex }}></div>
                                <span>{c.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ColorBankOverlay;