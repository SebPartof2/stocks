import { Helmet } from 'react-helmet-async';
import { getCurrencySymbol } from '../config/currencies';

function StockMetaTags({ stockData }) {
  if (!stockData) {
    return (
      <Helmet>
        <title>Stock Viewer</title>
        <meta name="description" content="View real-time stock information and market data" />
        <meta property="og:title" content="Stock Viewer" />
        <meta property="og:description" content="View real-time stock information and market data" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Stock Viewer" />
        <meta name="twitter:description" content="View real-time stock information and market data" />
      </Helmet>
    );
  }

  const stockName = stockData.longName || stockData.shortName || stockData.symbol;
  const isPositive = parseFloat(stockData.change) >= 0;
  const changeIndicator = isPositive ? '▲' : '▼';
  const currencySymbol = getCurrencySymbol(stockData.currency);

  const title = `${stockName} (${stockData.symbol}) - ${currencySymbol}${stockData.currentPrice.toFixed(2)}`;
  const description = `${stockName} is trading at ${currencySymbol}${stockData.currentPrice.toFixed(2)} (${changeIndicator} ${stockData.changePercent}%) on ${stockData.fullExchangeName || stockData.exchangeName}. View real-time stock data, market cap, P/E ratio, and more.`;

  // Use LogoKit for the stock logo image
  const logoUrl = `https://img.logokit.com/ticker/${stockData.symbol}?token=pk_fr4c5e5fc1caaa89b3cef3`;

  // Get the current URL for og:url
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={logoUrl} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta property="og:site_name" content="Stock Viewer" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={logoUrl} />

      {/* Additional metadata */}
      <meta name="keywords" content={`${stockData.symbol}, ${stockName}, stock price, ${stockData.sector}, ${stockData.industry}, stock market`} />
    </Helmet>
  );
}

export default StockMetaTags;
