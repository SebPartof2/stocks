# Stock Viewer

A modern web application for viewing real-time stock information using the Yahoo Finance API. Share direct links to specific stock symbols with others.

## Features

- Real-time stock price information
- Detailed trading statistics (open, close, high, low, volume)
- Company information (sector, industry, description)
- Key financial metrics (Market Cap, P/E Ratio, Dividend Yield, 52-week high/low)
- Shareable direct links to specific stocks
- Responsive design for mobile and desktop
- Clean, modern UI with gradient designs

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

Start both the backend server and frontend development server:

```bash
npm run dev
```

This will start:
- Backend API server on `http://localhost:3001`
- Frontend React app on `http://localhost:3000`

Alternatively, you can run them separately:

```bash
# Terminal 1 - Backend server
npm run server

# Terminal 2 - Frontend development server
npm run client
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter a stock symbol (e.g., AAPL, MSFT, GOOGL) in the search box
3. Click "View Stock" or press Enter
4. View detailed stock information
5. Click "Share Link" to copy the direct URL to your clipboard
6. Share the URL with others to show them that specific stock

### Direct Links

You can share direct links to specific stocks:
- Format: `http://localhost:3000/stock/SYMBOL`
- Example: `http://localhost:3000/stock/AAPL`

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## API Endpoints

### Get Stock Information

```
GET /api/stock/:symbol
```

Returns detailed information about a stock including:
- Current price and price changes
- Trading data (open, close, high, low, volume)
- Company information
- Financial metrics

Example:
```bash
curl http://localhost:3001/api/stock/AAPL
```

## Technology Stack

- **Frontend**: React, React Router, Vite
- **Backend**: Node.js, Express
- **API**: Yahoo Finance
- **Styling**: CSS3 with gradients and modern design

## Project Structure

```
stocks/
├── src/
│   ├── components/
│   │   ├── StockViewer.jsx      # Main stock display component
│   │   └── StockViewer.css      # Stock viewer styles
│   ├── App.jsx                  # Main app component with routing
│   ├── App.css                  # App styles
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── server.js                    # Express backend server
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies and scripts
└── index.html                  # HTML template
```

## Popular Stocks to Try

- AAPL (Apple)
- MSFT (Microsoft)
- GOOGL (Google)
- AMZN (Amazon)
- TSLA (Tesla)
- META (Meta/Facebook)
- NVDA (NVIDIA)

## Troubleshooting

**Stock not found error:**
- Make sure you're using the correct stock symbol
- Try using the ticker symbol from major exchanges (NYSE, NASDAQ)

**Server connection error:**
- Ensure both backend (port 3001) and frontend (port 3000) are running
- Check that no other services are using these ports

**CORS errors:**
- The backend includes CORS middleware - ensure the server is running

## License

MIT
