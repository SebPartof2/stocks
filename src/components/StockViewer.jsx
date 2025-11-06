import { useState, useEffect } from 'react';
import './StockViewer.css';

function StockViewer({ symbol }) {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3001/api/stock/${symbol}`);

        if (!response.ok) {
          throw new Error('Stock symbol not found');
        }

        const data = await response.json();
        setStockData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchStockData();
    }
  }, [symbol]);

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return <div className="loading">Loading stock data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!stockData) {
    return null;
  }

  const isPositive = parseFloat(stockData.change) >= 0;

  return (
    <div className="stock-viewer">
      <div className="stock-header">
        <div className="stock-title">
          <div className="title-main">
            <h1>{stockData.longName || stockData.shortName || stockData.symbol}</h1>
            <span className="stock-symbol">{stockData.symbol}</span>
          </div>
          <div className="title-meta">
            {stockData.market && (
              <>
                <span className="stock-market">
                  <strong>Market:</strong> {stockData.market}
                </span>
                <span className="stock-exchange-divider">•</span>
              </>
            )}
            <span className="stock-exchange">
              <strong>Exchange:</strong> {stockData.fullExchangeName || stockData.exchangeName}
            </span>
          </div>
        </div>
        <button onClick={copyLink} className="share-button">
          🔗 Share Link
        </button>
      </div>

      <div className="stock-price-section">
        <div className="current-price">
          {stockData.currency} {stockData.currentPrice.toFixed(2)}
        </div>
        <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '▲' : '▼'} {stockData.change} ({stockData.changePercent}%)
        </div>
      </div>

      <div className="stock-details">
        <div className="detail-section">
          <h2>Today's Trading</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Open</span>
              <span className="detail-value">{stockData.open.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Previous Close</span>
              <span className="detail-value">{stockData.previousClose.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Day High</span>
              <span className="detail-value">{stockData.dayHigh.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Day Low</span>
              <span className="detail-value">{stockData.dayLow.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Volume</span>
              <span className="detail-value">{stockData.volume.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Key Statistics</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Market Cap</span>
              <span className="detail-value">{stockData.marketCap}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">P/E Ratio</span>
              <span className="detail-value">{stockData.peRatio}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Dividend Yield</span>
              <span className="detail-value">{stockData.dividendYield}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">52 Week High</span>
              <span className="detail-value">{stockData.fiftyTwoWeekHigh}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">52 Week Low</span>
              <span className="detail-value">{stockData.fiftyTwoWeekLow}</span>
            </div>
          </div>
        </div>

        {stockData.sector !== 'N/A' && (
          <div className="detail-section">
            <h2>Company Info</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Sector</span>
                <span className="detail-value">{stockData.sector}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Industry</span>
                <span className="detail-value">{stockData.industry}</span>
              </div>
              {stockData.website && (
                <div className="detail-item full-width">
                  <span className="detail-label">Website</span>
                  <a href={stockData.website} target="_blank" rel="noopener noreferrer" className="detail-value link">
                    {stockData.website}
                  </a>
                </div>
              )}
            </div>
            {stockData.description && (
              <div className="company-description">
                <h3>About</h3>
                <p>{stockData.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StockViewer;
