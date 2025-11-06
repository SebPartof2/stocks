import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import StockViewer from './components/StockViewer';
import NotFound from './pages/NotFound';
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

  const popularStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'];

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

        <div className="popular-stocks">
          <h3>Popular Stocks:</h3>
          <div className="stock-chips">
            {popularStocks.map((stock) => (
              <button
                key={stock}
                onClick={() => navigate(`/stock/${stock}`)}
                className="stock-chip"
              >
                {stock}
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
