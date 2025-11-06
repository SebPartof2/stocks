import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import StockViewer from './components/StockViewer';
import NotFound from './pages/NotFound';
import { featuredStocks, getLogoUrl } from './config/featuredStocks';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stock/:symbol" element={<StockPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim()) {
      navigate(`/stock/${symbol.toUpperCase()}`);
    }
  };

  return (
    <div className="home">
      <div className="home-content">
        <h1>Stock Viewer</h1>
        <p>Enter a stock symbol to view real-time information</p>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">View Stock</button>
        </form>

        <div className="featured-stocks">
          <h3>Featured Stocks</h3>
          <div className="stock-grid">
            {featuredStocks.map((stockSymbol) => (
              <button
                key={stockSymbol}
                onClick={() => navigate(`/stock/${stockSymbol}`)}
                className="stock-card"
              >
                <img
                  src={getLogoUrl(stockSymbol)}
                  alt={`${stockSymbol} logo`}
                  className="stock-card-logo"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <span className="stock-card-symbol">{stockSymbol}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StockPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  return (
    <div className="stock-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Search
      </button>
      <StockViewer symbol={symbol} />
    </div>
  );
}

export default App;
