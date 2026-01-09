// src/utils/formatCount.js
export const formatCount = (num) => {
    const number = Number(num) || 0;
    if (number < 1000) {
        return number.toString();
    }
    if (number < 1000000) {
        const thousands = number / 1000;
        // Show one decimal place only if it's not .0
        return thousands.toFixed(1).replace(/\.0$/, '') + 'k';
    }
    const millions = number / 1000000;
    return millions.toFixed(1).replace(/\.0$/, '') + 'M';
};