// src/components/WarrantyOverlay.js
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './WarrantyOverlay.css';

// --- LOCAL ICONS ---
const Icons = {
    Close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
    Bold: () => <span style={{ fontWeight: 'bold', fontSize: '13px' }}>B</span>,
    Italic: () => <span style={{ fontStyle: 'italic', fontSize: '13px', fontFamily: 'serif' }}>I</span>,
    List: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line></svg>,
    Shield: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    Doc: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
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

    return createPortal(
        <div className="fullscreen-overlay warranty-root-theme fade-in-overlay" style={overlayInlineStyle}>
            <div className="overlay-header">
                <button type="button" className="overlay-back-btn" onClick={onClose}>
                    <Icons.Back /> <span>Cancel</span>
                </button>
                <h3>Product Warranty</h3>
                <button type="button" className="overlay-close-btn" onClick={onClose} title="Close Overlay">
                    <Icons.Close />
                </button>
            </div>
            
            <div className="overlay-body">
                <div className="warranty-card scale-in-entry">
                    {/* INPUT 1: DURATION */}
                    <div className="w-input-group">
                        <label>
                            <Icons.Shield /> <span>Warranty Duration <span className="red">*</span></span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="e.g. 12 Months, 2 Years, 7 Days Check..."
                            value={duration} 
                            onChange={e => setDuration(e.target.value)}
                            className="pro-input" 
                            autoFocus 
                        />
                    </div>

                    {/* INPUT 2: RICH DETAIL TEXTAREA */}
                    <div className="w-input-group mt-20">
                        <label>
                            <Icons.Doc /> <span>Warranty Terms & Details</span>
                        </label>
                        <div className="fake-rich-editor mt-5">
                            <div className="editor-toolbar">
                                <button type="button" className="tb-btn" title="Bold"><Icons.Bold /></button>
                                <button type="button" className="tb-btn" title="Italic"><Icons.Italic /></button>
                                <button type="button" className="tb-btn" title="Bullet List"><Icons.List /></button>
                            </div>
                            <textarea
                                placeholder="Terms and conditions, exclusions (e.g. No physical damage covered)..."
                                value={details}
                                onChange={e => setDetails(e.target.value)}
                                maxLength={200}
                            ></textarea>
                            <div className="char-count">{details.length}/200</div>
                        </div>
                    </div>

                    <div className="w-actions mt-20">
                        <button type="button" className="w-cancel ripple-click" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="w-save ripple-click" onClick={() => { onSave(duration, details); onClose(); }}>
                            Save Warranty
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default WarrantyOverlay;