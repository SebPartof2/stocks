// Cloudflare Workers version of the stock API

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Route: GET /api/stock/:symbol
    const stockMatch = path.match(/^\/api\/stock\/([A-Z0-9]+)$/i);

    if (stockMatch && request.method === 'GET') {
      const symbol = stockMatch[1].toUpperCase();

      try {
        // Fetch stock data from Yahoo Finance
        const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
        const quoteResponse = await fetch(quoteUrl);
        const quoteData = await quoteResponse.json();

        if (quoteData.chart.error) {
          return new Response(JSON.stringify({ error: 'Symbol not found' }), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        const result = quoteData.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];

        // Get additional company info
        const summaryUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price,summaryDetail,assetProfile`;
        const summaryResponse = await fetch(summaryUrl);
        const summaryData = await summaryResponse.json();

        const priceData = summaryData.quoteSummary?.result?.[0]?.price || {};
        const summaryDetail = summaryData.quoteSummary?.result?.[0]?.summaryDetail || {};
        const assetProfile = summaryData.quoteSummary?.result?.[0]?.assetProfile || {};

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
          description: assetProfile.longBusinessSummary || '',
        };

        // Calculate change
        const change = stockInfo.currentPrice - stockInfo.previousClose;
        const changePercent = (change / stockInfo.previousClose) * 100;

        stockInfo.change = change.toFixed(2);
        stockInfo.changePercent = changePercent.toFixed(2);

        return new Response(JSON.stringify(stockInfo), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        console.error('Error fetching stock data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch stock data' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
