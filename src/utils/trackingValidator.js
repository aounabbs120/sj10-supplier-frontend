const VALIDATION_RULES = {
    'tcs': {
        rule: /^\d{11,12}$/,
        message: 'Invalid TCS format. Must be 11 or 12 digits.',
        example: 'e.g., 12345678901'
    },
    'leopards': {
  rule: /^[A-Z]{0,3}\d{7,15}$/,
  message: 'Invalid Leopards tracking number.',
  example: 'e.g., FS7511410463'
},

    'postex': {
        rule: /^[a-zA-Z0-9]{8,20}$/,
        message: 'Invalid PostEx format.',
        example: 'e.g., PEX12345678'
    },
    'm-p': {
        rule: /^\d{12}$/,
        message: 'Invalid M&P format. Must be 12 digits.',
        example: 'e.g., 123456789012'
    },
    'call-courier': {
        rule: /^\d{12,15}$/,
        message: 'Invalid Call Courier format.',
        example: 'e.g., 123456789012'
    },
    'daewoo': {
        rule: /^[a-zA-Z0-9]{10,20}$/,
        message: 'Invalid Daewoo format.',
        example: 'e.g., 1001234567'
    },
    'trax': {
        rule: /^\d{12}$/,
        message: 'Invalid Trax format. Must be 12 digits.',
        example: 'e.g., 771234567890'
    },
    'swyft': {
        rule: /^\d{10}$/,
        message: 'Invalid Swyft format. Must be 10 digits.',
        example: 'e.g., SW12345678'
    },
};

export const getCourierExample = (courierCode) => {
    return VALIDATION_RULES[courierCode]?.example || 'Enter tracking ID';
};

export const validateTrackingNumber = (courierCode, trackingNumber) => {
    if (!courierCode) return { isValid: false, message: 'Select a courier first.' };
    if (!trackingNumber) return { isValid: false, message: 'Tracking number cannot be empty.' };

    const validator = VALIDATION_RULES[courierCode];
    if (!validator) return { isValid: true, message: '' }; // Allow if no rule exists

    return validator.rule.test(trackingNumber)
        ? { isValid: true, message: '' }
        : { isValid: false, message: validator.message };
};