/**
 * Featured Stocks Configuration
 *
 * Simply add stock symbols here - the name and logo will be fetched automatically
 * from Yahoo Finance and LogoKit APIs.
 *
 * Format: Just list the ticker symbols as strings in the array
 */

export const featuredStocks = [
  // US Tech Giants
  'FUN',
  'IAG.L',
  '2587.T',
  'COF'
];

/**
 * Get logo URL for a stock symbol
 * @param {string} symbol - Stock ticker symbol
 * @returns {string} Logo URL
 */
export const getLogoUrl = (symbol) => {
  return `https://img.logokit.com/ticker/${symbol}?token=pk_fr4c5e5fc1caaa89b3cef3`;
};

/**
 * Stock card data structure
 * This will be populated dynamically by fetching from the API
 */
export const createStockCard = (symbol, name = null) => ({
  symbol,
  name: name || symbol, // Use symbol as fallback until name is loaded
  logoUrl: getLogoUrl(symbol),
});
