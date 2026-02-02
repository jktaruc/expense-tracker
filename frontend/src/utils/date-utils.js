// utils/date-utils.js

/**
 * Format ISO date string to MM-DD-YYYY format
 * @param {string} isoDate - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date (MM-DD-YYYY)
 */
export const formatDate = (isoDate) => {
    if (!isoDate) return "No date";
    
    const [year, month, day] = isoDate.split("-");
    return `${month}-${day}-${year}`;
};

/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency ($XX.XX)
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount || 0);
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

/**
 * Get date N months ago in YYYY-MM-DD format
 * @param {number} months - Number of months ago
 * @returns {string} Date N months ago
 */
export const getDateMonthsAgo = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.toISOString().split('T')[0];
};
