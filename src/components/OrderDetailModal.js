import React, { useEffect } from 'react';

const OrderDetailModal = ({ onClose }) => {
    useEffect(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    // This component is now replaced by the full OrderDetailsPage.
    // Return null to ensure it never renders.
    return null;
};

export default OrderDetailModal;