// src/components/PaymentModal.js
import React from 'react';

const PaymentModal = ({ onClose }) => {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                
                <div className="payment-instruction-box">
                    <span className="payment-icon-large">💸</span>
                    <h2 style={{color: '#fff', marginBottom: '10px'}}>Payment Required</h2>
                    <p style={{color: '#d1d5db', lineHeight: '1.5'}}>
                        Please send the exact amount to one of the accounts below. 
                        <br />
                        <strong>Crucial:</strong> Take a screenshot of the transaction and send it to the WhatsApp number below to activate your promotion immediately.
                    </p>
                </div>

                <div className="account-list">
                    {/* JazzCash */}
                    <div className="account-card jazz">
                        <div className="acc-details">
                            <h4>JazzCash</h4>
                            <div className="acc-number">0349 564 0300 2</div>
                            <div className="acc-name">Azher Mehmood</div>
                        </div>
                        <div style={{fontSize: '1.5rem'}}>🔴</div>
                    </div>

                    {/* UPaisa */}
                    <div className="account-card upaisa">
                        <div className="acc-details">
                            <h4>UPaisa</h4>
                            <div className="acc-number">0334 884 6378</div>
                            <div className="acc-name">Azher Mehmood</div>
                        </div>
                        <div style={{fontSize: '1.5rem'}}>🟢</div>
                    </div>
                </div>

                {/* WhatsApp Section */}
                <div className="whatsapp-box">
                    <div className="wa-icon">💬</div>
                    <div>
                        <div style={{color: '#34d399', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase'}}>Send Screenshot Here</div>
                        <div style={{color: '#fff', fontWeight: 'bold', fontSize: '1.3rem'}}>0334 884 6378</div>
                        <div style={{color: '#a7f3d0', fontSize: '0.85rem'}}>Azher Mehmood (Admin)</div>
                    </div>
                </div>

                <div style={{marginTop: '25px', textAlign: 'right'}}>
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;