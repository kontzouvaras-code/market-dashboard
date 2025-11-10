// Save this file as: netlify/functions/analyze.js

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    const prompt = `You are a professional market analyst. Analyze the following market data and provide a concise 2-3 sentence summary with actionable insights:

Market Data:
- QQQ Price: ${data.qqqPrice}
- QQQ 21-Day MA: ${data.qqq21} (QQQ is ${data.qqq21ma} from 21MA)
- QQQ 50-Day MA: ${data.qqq50} (QQQ is ${data.qqq50ma} from 50MA)
- 21MA vs 50MA: ${data.ma21vs50}
- VIX (Fear Index): ${data.vixEod}
- VIX vs 10-Day Avg: ${data.vixVs10d}
- CNN Fear & Greed Index: ${data.fearGreed}
- VIX 10-Day MA: ${data.vix10ma}
- Risk Level: ${data.riskLevel}
- Cross Status: ${data.crossStatus}

Provide a practical summary that interprets these indicators and suggests what this means for market positioning. Focus on risk/reward and timing considerations.`;

    // Use node-fetch or global fetch
    const fetchModule = globalThis.fetch || (await import('node-fetch')).default;
    
    const response = await fetchModule('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('AI analysis failed: ' + response.status + ' - ' + errorText);
    }

    const result = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        analysis: result.content[0].text 
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Analysis failed',
        message: error.message 
      })
    };
  }
};// Save this file as: netlify/functions/analyze.js

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    const prompt = `You are a professional market analyst. Analyze the following market data and provide a concise 2-3 sentence summary with actionable insights:

Market Data:
- QQQ Price: $${data.qqqPrice}
- QQQ 21-Day MA: $${data.qqq21} (QQQ is ${data.qqq21ma} from 21MA)
- QQQ 50-Day MA: $${data.qqq50} (QQQ is ${data.qqq50ma} from 50MA)
- 21MA vs 50MA: ${data.ma21vs50}
- VIX (Fear Index): ${data.vixEod}
- VIX vs 10-Day Avg: ${data.vixVs10d}
- CNN Fear & Greed Index: ${data.fearGreed}
- VIX 10-Day MA: ${data.vix10ma}
- Risk Level: ${data.riskLevel}
- Cross Status: ${data.crossStatus}

Provide a practical summary that interprets these indicators and suggests what this means for market positioning. Focus on risk/reward and timing considerations.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error('AI analysis failed: ' + response.status);
    }

    const result = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        analysis: result.content[0].text 
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Analysis failed',
        message: error.message 
      })
    };
  }
};