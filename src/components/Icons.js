import React from 'react';

// Each icon is a simple SVG component. Using `currentColor` allows us to style them with CSS.
export const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm-1 3v4H7v2h4v4h2v-4h4v-2h-4V7h-2z" />
    </svg>
);

export const ProductsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h8v14H4zm10 0V5h6v14h-6z" />
    </svg>
);

export const OrdersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 11h7v2h-7zm0-4h7v2h-7zm0 8h7v2h-7zM4 5h5v2H4zm0 4h5v2H4zm0 4h5v2H4z" />
    </svg>
);

export const ReviewsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

// In src/components/Icons.js

// ... (keep your AddIcon, ProductsIcon, etc.)

export const PromotionsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a16.5 16.5 0 01-6.15 2.1zM12 6a6 6 0 016 6c0 1.933-.784 3.684-2.043 4.957m-4.11-8.125a16.5 16.5 0 00-6.15 2.1m12.3 0a16.5 16.5 0 00-12.3 0" />
    </svg>
);