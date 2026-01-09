// src/components/LockedScreen.js
import React, { useState } from 'react';
import PaymentModal from './PaymentModal'; // Using your OLD PaymentModal
import './LockedScreen.css';

const LockedScreen = ({ details }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- ⚡ THE FIX IS HERE ⚡ ---
    // We use parseFloat() to FORCE the value into a number.
    // If details.unpaid_amount is "500.00" (text) or 500 (number), it will work.
    // If it's null or undefined, it will safely become 0.
    const amountDue = parseFloat(details?.unpaid_amount) || 0;

    return (
        <div className="locked-container">
            <div className="locked-card">
                <span className="lock-icon">🔒</span>
                <h1>Account Restricted</h1>
                <p className="locked-reason">
                    Your account has been temporarily locked due to overdue commission payments.
                </p>
                <div className="debt-info">
                    <span>Amount Due</span>
                    {/* Now toFixed() is guaranteed to work because amountDue is a number */}
                    <strong>PKR {amountDue.toFixed(2)}</strong>
                </div>
                <p className="locked-instructions">
                    Please pay your outstanding balance to restore full access to your seller account.
                </p>
                <button className="unlock-button" onClick={() => setIsModalOpen(true)}>
                    View Payment Instructions
                </button>
            </div>
            
            {/* This now correctly uses your OLD PaymentModal component */}
            {isModalOpen && <PaymentModal closeModal={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default LockedScreen;