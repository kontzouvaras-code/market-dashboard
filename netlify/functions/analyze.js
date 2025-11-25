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
    
    // Check if SPY data is available
    const hasSPYData = data.spyPrice && data.spyPrice !== '--' && data.spyPrice !== '';
    
    // Build SPY section if data exists
    let spySection = '';
    if (hasSPYData) {
      spySection = `
S&P 500 (SPY) Benchmark Data:
- SPY Price: $${data.spyPrice}
- SPY Distance from 21MA: ${data.spy21ma}%
- SPY Distance from 50MA: ${data.spy50ma}%
- SPY 21MA vs 50MA Spread: ${data.spyMa21vs50}%
- SPY Cross Status: ${data.spyCrossStatus}
`;
    }
    
    // Build a structured prompt for Claude
    const prompt = `You are a financial market analyst providing concise, structured market analysis for GROWTH TECHNOLOGY STOCKS. The data below uses QQQ (Nasdaq-100 ETF) as a proxy/benchmark for the broader growth tech sector${hasSPYData ? ', with SPY (S&P 500) for broad market comparison' : ''}.

IMPORTANT FRAMING GUIDELINES:
- This analysis is for the GENERAL growth/tech stock sector, NOT specific QQQ trading advice
- Use terms like "growth stocks", "tech positions", "risk-on assets", "growth exposure" instead of "QQQ"
- Provide risk assessment and market conditions, not direct trading recommendations
- Frame opportunities in terms of "growth stock allocation" or "tech sector exposure"
- Keep the tone educational and informational, suitable for monitoring overall portfolio risk
${hasSPYData ? '- Compare QQQ vs SPY to identify sector rotation signals (growth vs broad market)' : ''}

Market Data (QQQ as growth tech benchmark):
- Benchmark Price: $${data.qqqPrice}
- 21-Day MA: $${data.qqq21}
- 50-Day MA: $${data.qqq50}
- 21MA vs 50MA Spread: ${data.ma21vs50}%
- VIX (Current): ${data.vixEod}
- VIX 10-Day MA: ${data.vix10ma}
- VIX vs 10-Day Avg: ${data.vixVs10d}%
- Distance from 21MA: ${data.qqq21ma}%
- Distance from 50MA: ${data.qqq50ma}%
- CNN Fear & Greed Index: ${data.fearGreed}
- Risk Level: ${data.riskLevel}
- Cross Status: ${data.crossStatus}
${spySection}
Format your response EXACTLY like this:

**MARKET POSITIONING: [Write a single compelling sentence (15-20 words) that captures the current GROWTH STOCK market environment and risk posture - this will be the executive summary]**

**Current Market Conditions**
[2-3 concise sentences about growth tech sector positioning relative to moving averages and what this indicates about trend strength/weakness for risk-on assets]

**Risk Indicator Assessment**
[2-3 sentences about VIX levels, Fear & Greed index, and what these mean for growth stock volatility and sentiment]
${hasSPYData ? `
**Sector Rotation Analysis (QQQ vs SPY)**
[2-3 sentences comparing growth stocks (QQQ) vs broad market (SPY) performance. Is money rotating into or out of growth? What does the relative strength indicate about risk appetite?]
` : ''}
**Strategic Opportunities**
[2-3 sentences about what the current environment offers for growth stock investors - favorable/unfavorable conditions, key levels to monitor]

**Positioning Recommendations**
[2-3 sentences with general guidance on growth stock exposure: suggested allocation stance (overweight/neutral/underweight), risk management considerations, and time horizon perspective]

CRITICAL RULES:
1. The "MARKET POSITIONING:" line must be a punchy, standalone summary about GROWTH STOCKS (not QQQ specifically)
2. Never say "buy QQQ" or "sell QQQ" - instead discuss "growth stock exposure" or "tech allocation"
3. Frame all advice as risk monitoring guidance, not trading signals
4. This is educational/informational content, not financial advice
${hasSPYData ? '5. Use the QQQ vs SPY comparison to provide sector rotation insights' : ''}

Example of a good MARKET POSITIONING line:
"Cautious Accumulation Zone - Elevated fear and technical support confluence suggest favorable entry conditions for growth stock exposure"

Another example:
"Risk-Off Environment - Deteriorating momentum and rising volatility warrant reduced growth stock allocation until conditions stabilize"

Keep each section focused and concise. Reference specific data points to support your assessment.`;

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
