import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Yahoo Finance API endpoint
app.get('/api/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    // Using Yahoo Finance API v8
    const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
    const quoteResponse = await fetch(quoteUrl);
    const quoteData = await quoteResponse.json();

    if (quoteData.chart.error) {
      return res.status(404).json({ error: 'Symbol not found' });
    }

    const result = quoteData.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators.quote[0];

    // Get additional company info
    const summaryUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price,summaryDetail,assetProfile`;
    const summaryResponse = await fetch(summaryUrl);
    const summaryData = await summaryResponse.json();

    console.log('Summary response status:', summaryResponse.status);
    console.log('Summary data error:', summaryData.quoteSummary?.error);
    console.log('Summary data result available:', !!summaryData.quoteSummary?.result);

    const priceData = summaryData.quoteSummary?.result?.[0]?.price || {};
    const summaryDetail = summaryData.quoteSummary?.result?.[0]?.summaryDetail || {};
    const assetProfile = summaryData.quoteSummary?.result?.[0]?.assetProfile || {};

    // Debug logging
    console.log('\n=== DEBUG INFO FOR', symbol, '===');
    console.log('Meta:', JSON.stringify(meta, null, 2));
    console.log('PriceData keys:', Object.keys(priceData));
    console.log('PriceData.longName:', priceData.longName);
    console.log('PriceData.shortName:', priceData.shortName);
    console.log('PriceData.marketCap:', priceData.marketCap);
    console.log('SummaryDetail.marketCap:', summaryDetail.marketCap);
    console.log('SummaryDetail.trailingPE:', summaryDetail.trailingPE);
    console.log('SummaryDetail.fiftyTwoWeekHigh:', summaryDetail.fiftyTwoWeekHigh);
    console.log('=== END DEBUG ===\n');

    // Helper function to format numbers
    const formatNumber = (value) => {
      if (!value || typeof value !== 'object') return value;
      return value.fmt || value.raw || 'N/A';
    };

    const stockInfo = {
      symbol: meta.symbol,
      shortName: meta.shortName || priceData.shortName || meta.symbol,
      longName: meta.longName || priceData.longName || meta.shortName || meta.symbol,
      market: meta.fullExchangeName || meta.exchangeName,
      exchangeName: meta.exchangeName,
      fullExchangeName: meta.fullExchangeName || meta.exchangeName,
      currency: meta.currency,
      currentPrice: meta.regularMarketPrice,
      previousClose: meta.previousClose || meta.chartPreviousClose,
      open: quote.open?.[0] || meta.regularMarketPrice,
      dayHigh: meta.regularMarketDayHigh || quote.high?.[0] || meta.regularMarketPrice,
      dayLow: meta.regularMarketDayLow || quote.low?.[0] || meta.regularMarketPrice,
      volume: meta.regularMarketVolume || quote.volume?.[0] || 0,
      marketCap: formatNumber(priceData.marketCap) || formatNumber(summaryDetail.marketCap) || 'N/A',
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ? meta.fiftyTwoWeekHigh.toFixed(2) : formatNumber(summaryDetail.fiftyTwoWeekHigh) || 'N/A',
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow ? meta.fiftyTwoWeekLow.toFixed(2) : formatNumber(summaryDetail.fiftyTwoWeekLow) || 'N/A',
      peRatio: formatNumber(summaryDetail.trailingPE) || 'N/A',
      dividendYield: summaryDetail.dividendYield?.fmt ? (summaryDetail.dividendYield.fmt.includes('%') ? summaryDetail.dividendYield.fmt : (summaryDetail.dividendYield.raw * 100).toFixed(2) + '%') : 'N/A',
      sector: assetProfile.sector || 'N/A',
      industry: assetProfile.industry || 'N/A',
      website: assetProfile.website || '',
      description: assetProfile.longBusinessSummary || ''
    };

    // Calculate change
    const change = stockInfo.currentPrice - stockInfo.previousClose;
    const changePercent = (change / stockInfo.previousClose) * 100;

    stockInfo.change = change.toFixed(2);
    stockInfo.changePercent = changePercent.toFixed(2);

    res.json(stockInfo);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.listen(PORT, () => {
  console.log(`Stock API server running on http://localhost:${PORT}`);
});
