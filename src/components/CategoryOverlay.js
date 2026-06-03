// src/components/CategoryOverlay.js
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './CategoryOverlay.css'; 

// --- LOCAL ICONS ---
const Icons = {
    Close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
    Next: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
};

// --- DYNAMIC PASTEL AVATAR COLOR GENERATOR ---
const getCategoryAvatarStyles = (name) => {
    const palette = [
        { bg: '#eff6ff', text: '#2563eb' }, 
        { bg: '#fff7ed', text: '#ea580c' }, 
        { bg: '#f0fdf4', text: '#16a34a' }, 
        { bg: '#faf5ff', text: '#8b5cf6' }, 
        { bg: '#fdf2f8', text: '#db2777' }, 
        { bg: '#f0fdfa', text: '#0d9488' }, 
        { bg: '#fffbeb', text: '#d97706' }  
    ];
    const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return palette[charSum % palette.length];
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

const CategoryOverlay = ({ isOpen, onClose, categories, onSelect }) => {
    const [view, setView] = useState('main');
    const [selectedMain, setSelectedMain] = useState(null);

    useEffect(() => { if (isOpen) { setView('main'); setSelectedMain(null); } }, [isOpen]);

    if (!isOpen) return null;

    const parentCategories = categories.filter(c => {
        return !c.parent_id || String(c.parent_id) === '0' || String(c.parent_id).trim() === '';
    });

    const subCategories = selectedMain 
        ? categories.filter(c => String(c.parent_id) === String(selectedMain.id) && String(c.parent_id) !== '0') 
        : [];

    return createPortal(
        <div className="fullscreen-overlay category-overlay-theme fade-in-overlay" style={overlayInlineStyle}>
            
            {/* REDESIGNED PREMIUM HEADER WITH CENTERED TYPOGRAPHY BLOCK */}
            <div className="overlay-header">
                {view === 'sub' ? (
                    <button type="button" className="overlay-back-btn" onClick={() => setView('main')}>
                        <Icons.Back /> <span className="hide-on-mobile">Back</span>
                    </button>
                ) : (
                    <span className="overlay-header-placeholder"></span>
                )}
                
                <div className="overlay-header-center">
                    <h3 className="overlay-title">
                        {view === 'main' ? 'Select Category' : selectedMain.name}
                    </h3>
                    <p className="overlay-subtitle">
                        Choose the most relevant category for your product
                    </p>
                </div>

                <button type="button" className="overlay-close-btn" onClick={onClose} title="Close Overlay">
                    <Icons.Close />
                </button>
            </div>
            
            <div className="overlay-body">
                <div className="category-list-container">
                    {view === 'main' ? (
                        parentCategories.map(cat => {
                            const { bg, text } = getCategoryAvatarStyles(cat.name);
                            const initialLetter = cat.name.charAt(0).toUpperCase();

                            return (
                                <div key={cat.id} className="category-list-item scale-in-entry" onClick={() => { setSelectedMain(cat); setView('sub'); }}>
                                    <div className="category-item-left">
                                        <div className="category-css-avatar" style={{ backgroundColor: bg, color: text }}>
                                            {initialLetter}
                                        </div>
                                        <span className="category-item-name">{cat.name}</span>
                                    </div>
                                    <div className="category-item-right">
                                        <span className="category-arrow-icon"><Icons.Next /></span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        subCategories.length > 0 ? (
                            subCategories.map(sub => {
                                const { bg, text } = getCategoryAvatarStyles(sub.name);
                                const initialLetter = sub.name.charAt(0).toUpperCase();

                                return (
                                    <div key={sub.id} className="category-list-item scale-in-entry" onClick={() => { onSelect(selectedMain.id, sub.id); onClose(); }}>
                                        <div className="category-item-left">
                                            <div className="category-css-avatar" style={{ backgroundColor: bg, color: text }}>
                                                {initialLetter}
                                            </div>
                                            <span className="category-item-name">{sub.name}</span>
                                        </div>
                                        <div className="category-item-right">
                                            <button type="button" className="category-item-select-btn">
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="empty-state">No sub-categories available.</div>
                        )
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CategoryOverlay;