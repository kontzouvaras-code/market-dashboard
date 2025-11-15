// netlify/functions/analyze.js

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Build a structured prompt for Claude
    const prompt = `You are a financial market analyst providing concise, structured market analysis. Analyze the following market data and provide a response with TWO parts:

Market Data:
- QQQ Price: $${data.qqqPrice}
- QQQ 21-Day MA: $${data.qqq21}
- QQQ 50-Day MA: $${data.qqq50}
- 21MA vs 50MA: ${data.ma21vs50}%
- VIX (Current): ${data.vixEod}
- VIX 10-Day MA: ${data.vix10ma}
- VIX vs 10-Day Avg: ${data.vixVs10d}%
- QQQ Distance from 21MA: ${data.qqq21ma}%
- QQQ Distance from 50MA: ${data.qqq50ma}%
- CNN Fear & Greed Index: ${data.fearGreed}
- Risk Level: ${data.riskLevel}
- Cross Status: ${data.crossStatus}

Format your response EXACTLY like this:

**MARKET POSITIONING: [Write a single compelling sentence (15-20 words) that captures the current market stance and opportunity - this will be the executive summary]**

**Current Market Conditions**
[2-3 concise sentences about QQQ's position relative to moving averages and what this indicates about trend strength/weakness]

**Risk Indicator Assessment**
[2-3 sentences about VIX levels, Fear & Greed index, and overall sentiment conditions]

**Strategic Opportunities**
[2-3 sentences about what the current setup offers for investors, including specific price levels to watch]

**Positioning Recommendations**
[2-3 sentences with actionable guidance: position sizing, key support/resistance levels, stop levels, and time horizon]

CRITICAL: The "MARKET POSITIONING:" line must be a punchy, standalone summary that makes sense on its own. It should immediately convey the market stance and key opportunity/risk.

Example of a good MARKET POSITIONING line:
"Cautious Optimism - Technical consolidation presents attractive accumulation zone near $606 support with 3-6 month upside potential"

Keep each section focused and concise. Use specific numbers from the data.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API Error:', errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    const analysis = result.content[0].text;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ analysis })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Analysis failed',
        analysis: 'AI analysis temporarily unavailable. Please check back shortly.'
      })
    };
  }
}
