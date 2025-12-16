// src/components/Loader.js

import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-wrapper">
            <svg viewBox="0 0 360 130">
                {/* ✅ CORRECTED: 'text-anchor' is now 'textAnchor' for JSX compatibility ✅ */}
                <text x="50%" y="80%" textAnchor="middle" className="static-base">SJ10</text>
                <text x="50%" y="80%" textAnchor="middle" className="running-line color-gold">SJ10</text>
                <text x="50%" y="80%" textAnchor="middle" className="running-line color-pink">SJ10</text>
                <text x="50%" y="80%" textAnchor="middle" className="running-line color-blue">SJ10</text>
            </svg>
        </div>
    );
};

export default Loader;