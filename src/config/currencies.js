// Currency code to symbol mapping
export const currencySymbols = {
  // Major currencies
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'CNY': '¥',
  'CHF': 'Fr',
  'CAD': 'C$',
  'AUD': 'A$',
  'NZD': 'NZ$',
  'HKD': 'HK$',
  'SGD': 'S$',
  'KRW': '₩',
  'INR': '₹',
  'RUB': '₽',
  'BRL': 'R$',
  'MXN': 'Mex$',
  'ZAR': 'R',
  'SEK': 'kr',
  'NOK': 'kr',
  'DKK': 'kr',
  'PLN': 'zł',
  'TRY': '₺',
  'IDR': 'Rp',
  'MYR': 'RM',
  'PHP': '₱',
  'THB': '฿',
  'TWD': 'NT$',
  'ILS': '₪',
  'CLP': 'CLP$',
  'COP': 'COL$',
  'ARS': 'AR$',
  'PEN': 'S/',
  'VND': '₫',
  'CZK': 'Kč',
  'HUF': 'Ft',
  'SAR': 'SR',
  'AED': 'AED',

  // Special cases
  'GBp': 'p', // British pence (used in UK markets)
  'ILA': '₪', // Israeli Agorot
  'ZAc': 'c', // South African cents
};

/**
 * Get currency symbol from currency code
 * @param {string} currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @returns {string} The currency symbol (e.g., '$', '€')
 */
export const getCurrencySymbol = (currencyCode) => {
  return currencySymbols[currencyCode] || currencyCode;
};

/**
 * Format price with currency symbol and code
 * @param {number} price - The price value
 * @param {string} currencyCode - The currency code
 * @returns {object} Object with symbol and formatted display
 */
export const formatCurrency = (price, currencyCode) => {
  const symbol = getCurrencySymbol(currencyCode);
  return {
    symbol,
    code: currencyCode,
    display: symbol !== currencyCode ? `${symbol}${price}` : `${currencyCode} ${price}`,
  };
};
