<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Market Risk Monitor - Real-Time Dashboard</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2300d4ff;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%230099ff;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='20' fill='url(%23grad)'/%3E%3Cpath d='M25 50 L35 40 L45 55 L55 35 L65 45 L75 30' stroke='white' stroke-width='4' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='75' cy='30' r='3' fill='white'/%3E%3C/svg%3E">
    
    <!-- Modern Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: #000000;
            color: #fff;
            padding: 20px;
            min-height: 100vh;
        }
        .container { max-width: 1600px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; padding: 20px; }
        .header-logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 10px;
        }
        .logo-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
        }
        .logo-icon svg { width: 30px; height: 30px; }
        .header h1 {
            font-size: 2.8em;
            font-weight: 800;
            margin-bottom: 8px;
            background: linear-gradient(45deg, #00d4ff, #0099ff, #00d4ff);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -1px;
            animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
        }
        .header-subtitle { font-size: 1em; color: #888; font-weight: 500; letter-spacing: 0.5px; }
        .header-disclaimer {
            font-size: 0.9em; color: #bbb; margin-top: 15px; padding: 15px 25px;
            background: rgba(0, 212, 255, 0.08); border: 1px solid rgba(0, 212, 255, 0.25);
            border-radius: 10px; max-width: 900px; margin-left: auto; margin-right: auto; line-height: 1.7;
        }
        .header-disclaimer strong { color: #00d4ff; font-weight: 600; }
        .last-updated { color: #888; font-size: 0.9em; }
        .loading { text-align: center; padding: 40px; font-size: 1.2em; color: #00d4ff; }
        .error { background: rgba(255, 71, 87, 0.2); border: 1px solid #ff4757; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; color: #ff4757; }
        
        .exec-summary { background: rgba(0, 212, 255, 0.1); backdrop-filter: blur(10px); border-radius: 15px; border: 2px solid rgba(0, 212, 255, 0.4); padding: 30px; margin-bottom: 30px; box-shadow: 0 8px 32px rgba(0, 212, 255, 0.2); }
        .exec-summary-header { color: #00d4ff; font-size: 1.5em; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 12px; }
        .exec-summary-content { font-size: 1.1em; line-height: 1.9; color: #fff; font-weight: 500; }
        .tldr-badge { background: linear-gradient(45deg, #00d4ff, #0099ff); color: white; padding: 6px 14px; border-radius: 12px; font-size: 0.6em; font-weight: 700; letter-spacing: 1px; }
        
        .risk-meter-container { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 15px; padding: 25px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.1); }
        .risk-meter-title { font-size: 1.3em; font-weight: 600; margin-bottom: 20px; color: #00d4ff; text-align: center; }
        .risk-meter { position: relative; height: 40px; background: rgba(255, 255, 255, 0.1); border-radius: 20px; overflow: hidden; margin-bottom: 15px; }
        .risk-meter-fill { height: 100%; transition: width 1s ease, background 1s ease; border-radius: 20px; position: relative; }
        .risk-meter-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 700; font-size: 1.1em; color: #fff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); z-index: 10; }
        .risk-breakdown { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 15px; }
        .risk-factor { background: rgba(255, 255, 255, 0.05); padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9em; }
        .risk-factor-label { color: #ccc; }
        .risk-factor-value { font-weight: 600; }
        
        .market-comparison { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 15px; padding: 25px; margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.1); }
        .comparison-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        @media (max-width: 768px) { .comparison-grid { grid-template-columns: 1fr; } }
        .comparison-card { background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.1); }
        .comparison-card.qqq { border-color: rgba(0, 212, 255, 0.3); }
        .comparison-card.spy { border-color: rgba(255, 165, 2, 0.3); }
        .comparison-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .comparison-title { font-size: 1.3em; font-weight: 700; }
        .comparison-title.qqq { color: #00d4ff; }
        .comparison-title.spy { color: #ffa502; }
        .comparison-subtitle { font-size: 0.85em; color: #888; }
        .comparison-price { font-size: 1.8em; font-weight: 700; }
        .comparison-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .comp-metric { background: rgba(255, 255, 255, 0.03); padding: 10px; border-radius: 8px; }
        .comp-metric-label { font-size: 0.8em; color: #888; margin-bottom: 4px; }
        .comp-metric-value { font-size: 1.1em; font-weight: 600; }
        
        .rotation-indicator { background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-top: 20px; text-align: center; }
        .rotation-title { font-size: 1em; color: #888; margin-bottom: 10px; }
        .rotation-status { font-size: 1.2em; font-weight: 600; padding: 8px 20px; border-radius: 20px; display: inline-block; }
        .rotation-growth { background: rgba(0, 212, 255, 0.2); color: #00d4ff; border: 1px solid #00d4ff; }
        .rotation-defensive { background: rgba(255, 165, 2, 0.2); color: #ffa502; border: 1px solid #ffa502; }
        .rotation-neutral { background: rgba(255, 255, 255, 0.1); color: #ccc; border: 1px solid #666; }

        .section-header { font-size: 1.3em; font-weight: 600; color: #00d4ff; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid rgba(0, 212, 255, 0.3); }
        .dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 15px; padding: 25px; border: 1px solid rgba(255, 255, 255, 0.1); transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; flex-direction: column; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2); }
        .card-title { font-size: 1.1em; font-weight: 600; margin-bottom: 5px; color: #00d4ff; }
        .card-subtitle { font-size: 0.85em; color: #888; margin-bottom: 15px; }
        .metric { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .metric:last-child { border-bottom: none; }
        .metric-label { font-size: 0.9em; color: #ccc; }
        .metric-value { font-size: 1.2em; font-weight: 600; }
        
        .trend-mini { display: flex; align-items: center; gap: 8px; margin-top: 10px; padding: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 8px; }
        .trend-label { font-size: 0.85em; color: #888; min-width: 80px; }
        .trend-values { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .trend-dot { width: 8px; height: 8px; border-radius: 50%; background: #666; }
        .trend-value { font-size: 0.85em; color: #aaa; font-family: 'Courier New', monospace; }
        .trend-arrow-mini { font-size: 1.2em; margin-left: 5px; }
        
        .extreme-fear { color: #ff4757; } .fear { color: #ff6b6b; } .neutral { color: #ffa502; } .greed { color: #26de81; }
        .bullish { color: #26de81; } .bearish { color: #ff4757; } .mid-risk { color: #ffa502; } .low-risk { color: #26de81; }
        .high-risk { color: #ff6b6b; } .critical-risk { color: #8B0000; }
        
        .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 0.9em; font-weight: 600; }
        .badge-golden-cross { background: rgba(38, 222, 129, 0.3); color: #26de81; border: 2px solid #26de81; box-shadow: 0 0 20px rgba(38, 222, 129, 0.3); }
        .badge-death-cross { background: rgba(255, 71, 87, 0.3); color: #ff4757; border: 2px solid #ff4757; box-shadow: 0 0 20px rgba(255, 71, 87, 0.3); }
        .badge-critical-risk { background: rgba(139, 0, 0, 0.3); color: #8B0000; border: 2px solid #8B0000; }
        .badge-high-risk { background: rgba(255, 71, 87, 0.2); color: #ff4757; border: 2px solid #ff4757; }
        .badge-mid-risk { background: rgba(255, 165, 2, 0.2); color: #ffa502; border: 2px solid #ffa502; }
        .badge-low-risk { background: rgba(38, 222, 129, 0.2); color: #26de81; border: 2px solid #26de81; }
        .ai-badge { background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.65em; font-weight: 600; letter-spacing: 0.5px; }
        
        .ai-insight-box { margin-top: auto; padding: 12px; background: rgba(102, 126, 234, 0.1); border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 8px; font-size: 0.85em; }
        .ai-insight-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #a8b3ff; font-weight: 600; font-size: 0.9em; }
        .ai-badge-mini { background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); color: white; padding: 2px 8px; border-radius: 6px; font-size: 0.75em; font-weight: 700; letter-spacing: 0.5px; }
        .ai-insight-content { color: #e0e0ff; line-height: 1.5; font-size: 0.95em; }
        
        .summary-box { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 12px; border: 1px solid rgba(255, 165, 2, 0.3); padding: 25px; margin-bottom: 30px; line-height: 1.8; }
        .detailed-analysis-header { color: #ffa502; font-size: 1.2em; font-weight: 600; margin-bottom: 20px; text-align: center; padding: 15px; border-bottom: 2px solid rgba(255, 165, 2, 0.3); }
        .analysis-section { margin-bottom: 20px; }
        .section-title { color: #00d4ff; font-weight: 600; font-size: 1.05em; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .section-icon { font-size: 1.2em; }
        .section-content { color: #e0e0e0; font-size: 0.95em; line-height: 1.7; padding-left: 28px; }
        .highlight { color: #ffa502; font-weight: 600; }
        .key-level { background: rgba(255, 165, 2, 0.15); padding: 2px 6px; border-radius: 4px; font-weight: 600; }
        
        @media (max-width: 768px) { .dashboard { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-logo">
                <div class="logo-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 17 9 11 13 15 21 7"></polyline>
                        <polyline points="14 7 21 7 21 14"></polyline>
                    </svg>
                </div>
            </div>
            <h1>Market Risk Monitor</h1>
            <div class="header-subtitle">Real-Time Market Intelligence Dashboard</div>
            <div class="header-disclaimer">
                <strong>Purpose:</strong> This dashboard is designed as a risk monitoring and technical analysis tool specifically for <strong>growth technology stocks</strong> (primarily QQQ/Nasdaq-100). All metrics, analyses, and AI-generated insights are provided for educational and informational purposes only and should not be considered financial advice.
            </div>
            <div class="last-updated" id="lastUpdated">Loading...</div>
        </div>

        <div id="loading" class="loading">Loading market data...</div>
        <div id="error" class="error" style="display: none;"></div>
        
        <div id="dashboard" style="display: none;">
            <div class="exec-summary">
                <div class="exec-summary-header"><span>📋</span>Executive Summary<span class="tldr-badge">TL;DR</span></div>
                <div class="exec-summary-content" id="execSummary">Analyzing market conditions...</div>
            </div>
            
            <div class="risk-meter-container">
                <div class="risk-meter-title">🎯 Composite Risk Score</div>
                <div class="risk-meter"><div class="risk-meter-fill" id="riskMeterFill"></div><div class="risk-meter-label" id="riskMeterLabel">Calculating...</div></div>
                <div class="risk-breakdown" id="riskBreakdown"></div>
            </div>
            
            <div class="market-comparison">
                <div class="section-header">📊 Market Comparison: Growth vs Broad Market</div>
                <div class="comparison-grid">
                    <div class="comparison-card qqq">
                        <div class="comparison-header">
                            <div><div class="comparison-title qqq">QQQ</div><div class="comparison-subtitle">Nasdaq-100 (Growth/Tech)</div></div>
                            <div class="comparison-price" id="qqqPriceCompare">--</div>
                        </div>
                        <div class="comparison-metrics">
                            <div class="comp-metric"><div class="comp-metric-label">vs 21MA</div><div class="comp-metric-value" id="qqq21maCompare">--</div></div>
                            <div class="comp-metric"><div class="comp-metric-label">vs 50MA</div><div class="comp-metric-value" id="qqq50maCompare">--</div></div>
                            <div class="comp-metric"><div class="comp-metric-label">21/50 Spread</div><div class="comp-metric-value" id="qqqSpreadCompare">--</div></div>
                            <div class="comp-metric"><div class="comp-metric-label">Trend</div><div class="comp-metric-value" id="qqqTrendCompare">--</div></div>
                        </div>
                    </div>
                    <div class="comparison-card spy">
                        <div class="comparison-header">
                            <div><div class="comparison-title spy">SPY</div><div class="comparison-subtitle">S&P 500 (Broad Market)</div></div>
                            <div class="comparison-price" id="spyPriceCompare">--</div>
                        </div>
                        <div class="comparison-metrics">
                            <div class="comp-metric"><div class="comp-metric-label">vs 21MA</div><div class="comp-metric-value" id="spy21maCompare">--</div></div>
                            <div class="comp-metric"><div class="comp-metric-label">vs 50MA</div><div class="comp-metric-value" id="spy50maCompare">--</div></div>
                            <div class="comp-metric"><div class="comp-metric-label">21/50 Spread</div><div class="comp-metric-value" id="spySpreadCompare">--</div></div>
                            <div class="comp-metric"><div class="comp-metric-label">Trend</div><div class="comp-metric-value" id="spyTrendCompare">--</div></div>
                        </div>
                    </div>
                </div>
                <div class="rotation-indicator">
                    <div class="rotation-title">Market Rotation Signal</div>
                    <div class="rotation-status" id="rotationStatus">Analyzing...</div>
                    <div style="margin-top: 10px; font-size: 0.9em; color: #888;" id="rotationDetail"></div>
                </div>
            </div>
            
            <div class="multi-asset-section">
                <div class="section-header">📈 QQQ Detailed Metrics</div>
                <div class="dashboard">
                    <div class="card">
                        <div class="card-title">Advanced Risk Assessment</div>
                        <div class="card-subtitle">Multi-factor algorithmic risk evaluation</div>
                        <div style="text-align: center; margin: 15px 0;"><span class="status-badge" id="mainRiskBadge">--</span></div>
                        <div id="vixTrend" class="trend-mini"></div>
                        <div style="flex: 1;"></div>
                        <div class="ai-insight-box" id="riskAIInsight"><div class="ai-insight-header"><span class="ai-badge-mini">AI</span><span>Quick Insight</span></div><div class="ai-insight-content">Analyzing risk factors...</div></div>
                    </div>
                    <div class="card">
                        <div class="card-title">Golden/Death Cross Analysis</div>
                        <div class="card-subtitle">21-Day vs 50-Day MA crossover</div>
                        <div style="text-align: center; margin: 15px 0;"><span class="status-badge" id="mainCrossBadge">--</span></div>
                        <div class="metric"><span class="metric-label">Short-term Trend (21 vs 50)</span><span class="metric-value" id="crossTrendValue">--</span></div>
                        <div class="metric"><span class="metric-label">QQQ Distance from 50MA</span><span class="metric-value" id="qqq50maMain">--</span></div>
                        <div id="maTrend" class="trend-mini"></div>
                        <div class="ai-insight-box" id="crossAIInsight"><div class="ai-insight-header"><span class="ai-badge-mini">AI</span><span>Quick Insight</span></div><div class="ai-insight-content">Analyzing momentum...</div></div>
                    </div>
                    <div class="card">
                        <div class="card-title">QQQ Moving Averages</div>
                        <div class="card-subtitle">Price relative to key MAs</div>
                        <div class="metric"><span class="metric-label">Current Price</span><span class="metric-value" id="qqqPrice">--</span></div>
                        <div class="metric"><span class="metric-label">21-Day MA</span><span class="metric-value" id="qqq21">--</span></div>
                        <div class="metric"><span class="metric-label">50-Day MA</span><span class="metric-value" id="qqq50">--</span></div>
                        <div class="metric"><span class="metric-label">21 vs 50 Trend</span><span class="metric-value" id="ma21vs50">--</span></div>
                        <div id="priceTrend" class="trend-mini"></div>
                        <div class="ai-insight-box" id="maAIInsight"><div class="ai-insight-header"><span class="ai-badge-mini">AI</span><span>Quick Insight</span></div><div class="ai-insight-content">Analyzing price position...</div></div>
                    </div>
                    <div class="card">
                        <div class="card-title">Market Sentiment & Volatility</div>
                        <div class="card-subtitle">Fear indicators and sentiment composite</div>
                        <div class="metric"><span class="metric-label">VIX (Fear Index)</span><span class="metric-value" id="vixEod">--</span></div>
                        <div class="metric"><span class="metric-label">VIX 10-Day MA</span><span class="metric-value" id="vix10ma">--</span></div>
                        <div class="metric"><span class="metric-label">VIX vs 10-Day Avg</span><span class="metric-value" id="vixVs10d">--</span></div>
                        <div class="metric"><span class="metric-label">CNN Fear & Greed</span><span class="metric-value" id="fearGreedValue">--</span></div>
                        <div style="text-align: center; margin-top: 10px;"><span class="status-badge" id="fearGreedBadge">--</span></div>
                        <div id="fearGreedTrend" class="trend-mini"></div>
                        <div class="ai-insight-box" id="sentimentAIInsight"><div class="ai-insight-header"><span class="ai-badge-mini">AI</span><span>Quick Insight</span></div><div class="ai-insight-content">Analyzing sentiment...</div></div>
                    </div>
                </div>
            </div>
            
            <div class="summary-box">
                <div class="detailed-analysis-header">📊 Detailed Market Analysis<span class="ai-badge" style="margin-left: 10px;">CLAUDE AI</span></div>
                <div id="detailedAnalysis">Analyzing market conditions...</div>
            </div>
            
            <div style="text-align: center; margin: 40px 0; padding: 30px; background: rgba(0, 212, 255, 0.05); border-radius: 15px; border: 1px solid rgba(0, 212, 255, 0.2);">
                <h3 style="color: #00d4ff; margin-bottom: 15px; font-size: 1.3em;">📚 Want to Learn More?</h3>
                <p style="color: #ccc; margin-bottom: 20px; font-size: 1em;">Explore our comprehensive methodology and intelligence glossary.</p>
                <a href="glossary.html" style="display: inline-block; padding: 15px 40px; background: linear-gradient(45deg, #00d4ff, #0099ff); color: white; text-decoration: none; border-radius: 10px; font-weight: 600;">View Methodology & Glossary →</a>
            </div>
        </div>
    </div>

    <script>
        const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9zKKjsxivMTlhDdAnsf3py3xCQZfZbcZtdV20FFKGwEpJXzIofIk-qYWDCCw1eP5QMOjNfQpB5wLH/pub?gid=2141065289&single=true&output=csv';
        const HISTORICAL_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9zKKjsxivMTlhDdAnsf3py3xCQZfZbcZtdV20FFKGwEpJXzIofIk-qYWDCCw1eP5QMOjNfQpB5wLH/pub?gid=192889417&single=true&output=csv';
        
        let historicalData = { vix: [], qqq: [], ma21vs50: [], fearGreed: [] };

        function getTrendArrow(v) { return v > 0 ? ' ↑' : v < 0 ? ' ↓' : ''; }
        function getColorClass(v, t) { if (t === 'vix') return v < 20 ? 'neutral' : v < 30 ? 'fear' : 'extreme-fear'; return v > 0 ? 'bullish' : 'bearish'; }
        function getFearGreedStatus(v) {
            if (v <= 25) return { text: 'EXTREME FEAR', class: 'badge-extreme-fear' };
            if (v <= 45) return { text: 'FEAR', class: 'badge-fear' };
            if (v <= 55) return { text: 'NEUTRAL', class: 'badge-neutral' };
            if (v <= 75) return { text: 'GREED', class: 'badge-greed' };
            return { text: 'EXTREME GREED', class: 'badge-greed' };
        }
        
        function calculateRiskScore(data) {
            let score = 0; const factors = {};
            const vix10 = parseFloat(data.vix10ma);
            if (vix10 >= 30) { score += 30; factors.vix = { score: 30, label: 'Critical' }; }
            else if (vix10 >= 25) { score += 22; factors.vix = { score: 22, label: 'High' }; }
            else if (vix10 >= 20) { score += 15; factors.vix = { score: 15, label: 'Elevated' }; }
            else { score += 5; factors.vix = { score: 5, label: 'Low' }; }
            
            const qqq21ma = parseFloat(data.qqq21ma), qqq50ma = parseFloat(data.qqq50ma);
            if (qqq21ma < 0 && qqq50ma < 0) { score += 25; factors.position = { score: 25, label: 'Below All MAs' }; }
            else if (qqq21ma < 0) { score += 15; factors.position = { score: 15, label: 'Below 21MA' }; }
            else if (qqq50ma < 0) { score += 10; factors.position = { score: 10, label: 'Below 50MA' }; }
            else { score += 0; factors.position = { score: 0, label: 'Above MAs' }; }
            
            const ma21vs50 = parseFloat(data.ma21vs50);
            if (ma21vs50 < 0) { score += 20; factors.momentum = { score: 20, label: 'Death Cross' }; }
            else if (ma21vs50 < 1) { score += 10; factors.momentum = { score: 10, label: 'Weak Golden' }; }
            else { score += 0; factors.momentum = { score: 0, label: 'Golden Cross' }; }
            
            const fg = parseFloat(data.fearGreed);
            if (fg <= 25) { score += 20; factors.sentiment = { score: 20, label: 'Extreme Fear' }; }
            else if (fg <= 45) { score += 12; factors.sentiment = { score: 12, label: 'Fear' }; }
            else if (fg >= 75) { score += 15; factors.sentiment = { score: 15, label: 'Extreme Greed' }; }
            else { score += 5; factors.sentiment = { score: 5, label: 'Neutral' }; }
            
            return { score, factors, max: 100 };
        }
        
        function updateRiskMeter(data) {
            const risk = calculateRiskScore(data);
            const percentage = (risk.score / risk.max) * 100;
            const fill = document.getElementById('riskMeterFill');
            const label = document.getElementById('riskMeterLabel');
            let color, riskLabel;
            if (percentage <= 25) { color = '#26de81'; riskLabel = 'LOW RISK'; }
            else if (percentage <= 50) { color = '#ffa502'; riskLabel = 'MODERATE RISK'; }
            else if (percentage <= 75) { color = '#ff6b6b'; riskLabel = 'HIGH RISK'; }
            else { color = '#8B0000'; riskLabel = 'CRITICAL RISK'; }
            fill.style.width = percentage + '%';
            fill.style.background = `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`;
            label.textContent = `${Math.round(risk.score)}/${risk.max} - ${riskLabel}`;
            document.getElementById('riskBreakdown').innerHTML = `
                <div class="risk-factor"><span class="risk-factor-label">📊 VIX Level</span><span class="risk-factor-value">${risk.factors.vix.score}/30 - ${risk.factors.vix.label}</span></div>
                <div class="risk-factor"><span class="risk-factor-label">📈 Price Position</span><span class="risk-factor-value">${risk.factors.position.score}/25 - ${risk.factors.position.label}</span></div>
                <div class="risk-factor"><span class="risk-factor-label">🔄 Momentum</span><span class="risk-factor-value">${risk.factors.momentum.score}/20 - ${risk.factors.momentum.label}</span></div>
                <div class="risk-factor"><span class="risk-factor-label">😨 Sentiment</span><span class="risk-factor-value">${risk.factors.sentiment.score}/25 - ${risk.factors.sentiment.label}</span></div>`;
        }
        
        function createTrendMini(label, values, currentValue) {
            if (!values || values.length === 0) values = [currentValue * 0.97, currentValue * 0.99, currentValue * 1.01, currentValue * 0.98, currentValue];
            const trend = values[values.length - 1] > values[0] ? '↗' : '↘';
            const trendClass = values[values.length - 1] > values[0] ? 'bullish' : 'bearish';
            return `<span class="trend-label">${label}:</span><div class="trend-values">${values.map((v, i) => `<span class="trend-value ${i === values.length - 1 ? trendClass : ''}">${typeof v === 'number' ? v.toFixed(2) : v}</span>${i < values.length - 1 ? '<span class="trend-dot"></span>' : ''}`).join('')}<span class="trend-arrow-mini ${trendClass}">${trend}</span></div>`;
        }
        
        function updateMarketComparison(qqqData, spyData) {
            const set = (id, val, cls) => { const el = document.getElementById(id); if (el) { el.textContent = val; if (cls) el.className = el.className.split(' ')[0] + ' ' + cls; } };
            set('qqqPriceCompare', '$' + qqqData.qqqPrice);
            const qqq21ma = parseFloat(qqqData.qqq21ma), qqq50ma = parseFloat(qqqData.qqq50ma), qqqSpread = parseFloat(qqqData.ma21vs50);
            set('qqq21maCompare', qqqData.qqq21ma + '%', qqq21ma >= 0 ? 'comp-metric-value bullish' : 'comp-metric-value bearish');
            set('qqq50maCompare', qqqData.qqq50ma + '%', qqq50ma >= 0 ? 'comp-metric-value bullish' : 'comp-metric-value bearish');
            set('qqqSpreadCompare', qqqData.ma21vs50 + '%', qqqSpread >= 0 ? 'comp-metric-value bullish' : 'comp-metric-value bearish');
            set('qqqTrendCompare', qqqData.crossStatus);
            
            if (spyData && spyData.spyPrice && spyData.spyPrice !== '--') {
                set('spyPriceCompare', '$' + spyData.spyPrice);
                const spy21ma = parseFloat(spyData.spy21ma) || 0, spy50ma = parseFloat(spyData.spy50ma) || 0, spySpread = parseFloat(spyData.spyMa21vs50) || 0;
                set('spy21maCompare', (spyData.spy21ma || '--') + '%', spy21ma >= 0 ? 'comp-metric-value bullish' : 'comp-metric-value bearish');
                set('spy50maCompare', (spyData.spy50ma || '--') + '%', spy50ma >= 0 ? 'comp-metric-value bullish' : 'comp-metric-value bearish');
                set('spySpreadCompare', (spyData.spyMa21vs50 || '--') + '%', spySpread >= 0 ? 'comp-metric-value bullish' : 'comp-metric-value bearish');
                set('spyTrendCompare', spyData.spyCrossStatus || '--');
                updateRotationSignal(qqqData, spyData);
            } else {
                set('spyPriceCompare', 'Awaiting Data');
                set('spy21maCompare', '--'); set('spy50maCompare', '--'); set('spySpreadCompare', '--'); set('spyTrendCompare', '--');
                document.getElementById('rotationStatus').textContent = '⏳ SPY Data Pending';
                document.getElementById('rotationStatus').className = 'rotation-status rotation-neutral';
                document.getElementById('rotationDetail').textContent = 'SPY data will appear once the Apps Script runs at market close.';
            }
        }
        
        function updateRotationSignal(qqqData, spyData) {
            const rotationStatus = document.getElementById('rotationStatus');
            const rotationDetail = document.getElementById('rotationDetail');
            const qqq21ma = parseFloat(qqqData.qqq21ma) || 0, spy21ma = parseFloat(spyData.spy21ma) || 0;
            const qqqSpread = parseFloat(qqqData.ma21vs50) || 0, spySpread = parseFloat(spyData.spyMa21vs50) || 0;
            const qqqStrength = qqq21ma + qqqSpread, spyStrength = spy21ma + spySpread;
            const differential = qqqStrength - spyStrength;
            
            if (differential > 1) {
                rotationStatus.textContent = '🚀 Risk-On: Growth Favored';
                rotationStatus.className = 'rotation-status rotation-growth';
                rotationDetail.textContent = `QQQ outperforming SPY by ${differential.toFixed(2)}% on relative strength. Growth stocks leading.`;
            } else if (differential < -1) {
                rotationStatus.textContent = '🛡️ Risk-Off: Defensive Rotation';
                rotationStatus.className = 'rotation-status rotation-defensive';
                rotationDetail.textContent = `SPY outperforming QQQ by ${Math.abs(differential).toFixed(2)}% on relative strength. Rotation to defensive sectors.`;
            } else {
                rotationStatus.textContent = '⚖️ Neutral: No Clear Rotation';
                rotationStatus.className = 'rotation-status rotation-neutral';
                rotationDetail.textContent = 'QQQ and SPY showing similar relative strength. No clear sector rotation signal.';
            }
        }

        function formatAIAnalysis(rawAnalysis) {
            let execSummary = '', detailedAnalysis = '';
            if (rawAnalysis.includes('**MARKET POSITIONING**') || rawAnalysis.includes('MARKET POSITIONING:')) {
                const lines = rawAnalysis.split('\n').filter(line => line.trim());
                const titleMatch = (lines[0] || '').match(/\*\*MARKET POSITIONING:\s*(.+?)\*\*/i) || (lines[0] || '').match(/MARKET POSITIONING:\s*(.+)/i);
                let headline = titleMatch ? titleMatch[1].trim() : '';
                
                // Get just ONE key insight from opportunities section
                let keyInsight = '';
                const opportunitiesMatch = rawAnalysis.match(/\*\*(Strategic Opportunities|Opportunities)\*\*\s*\n([\s\S]+?)(?=\n\*\*|$)/i);
                if (opportunitiesMatch) {
                    const oppLines = opportunitiesMatch[2].split('\n').map(l => l.trim().replace(/\*\*/g, '').replace(/^[\-•]\s*/, '')).filter(l => l.length > 15);
                    if (oppLines.length > 0) keyInsight = oppLines[0];
                }
                
                // Keep it simple: headline + one key action point
                if (headline) {
                    execSummary = '<strong>' + headline + '</strong>';
                    if (keyInsight) execSummary += '<br><br><span style="color: #ffa502;">→ ' + keyInsight + '</span>';
                } else {
                    execSummary = 'Analyzing current market conditions...';
                }
                detailedAnalysis = formatDetailedSections(rawAnalysis);
            } else {
                const sentences = rawAnalysis.split(/(?<=[.!?])\s+/);
                execSummary = sentences.slice(0, 2).join(' ');
                detailedAnalysis = '<div class="section-content">' + rawAnalysis.replace(/\$(\d+)/g, '<span class="key-level">$$$1</span>').replace(/([\+\-]\d+\.?\d*%)/g, '<span class="highlight">$1</span>') + '</div>';
            }
            return { execSummary, detailedAnalysis };
        }
        
        function formatDetailedSections(rawAnalysis) {
            let formattedHTML = ''; const lines = rawAnalysis.split('\n'); let currentSection = null;
            const sectionMap = {
                'MARKET POSITIONING': { icon: '📊', title: 'Market Positioning' },
                'Current Market Conditions': { icon: '📈', title: 'Current Market Conditions' },
                'Risk Indicator': { icon: '⚠️', title: 'Risk Assessment' },
                'Risk Assessment': { icon: '⚠️', title: 'Risk Assessment' },
                'Strategic Opportunities': { icon: '💡', title: 'Strategic Opportunities' },
                'Opportunities': { icon: '💡', title: 'Strategic Opportunities' },
                'Positioning Recommendations': { icon: '🎯', title: 'Action Items' },
                'Recommendations': { icon: '🎯', title: 'Action Items' },
                'Sector Rotation': { icon: '🔄', title: 'Sector Rotation Analysis' },
                'QQQ vs SPY': { icon: '🔄', title: 'Sector Rotation Analysis' }
            };
            lines.forEach(line => {
                line = line.trim(); if (!line) return;
                let matched = false;
                for (const [key, val] of Object.entries(sectionMap)) {
                    if (line.includes(key)) {
                        if (currentSection) formattedHTML += '</div></div>';
                        formattedHTML += `<div class="analysis-section"><div class="section-title"><span class="section-icon">${val.icon}</span>${val.title}</div><div class="section-content">`;
                        currentSection = key; matched = true; break;
                    }
                }
                if (!matched && currentSection && line.length > 0 && !line.startsWith('**MARKET')) {
                    let cleanLine = line.replace(/\*\*/g, '').replace(/^\-\s+/, '• ').replace(/\$(\d+)/g, '<span class="key-level">$$$1</span>').replace(/([\+\-]\d+\.?\d*%)/g, '<span class="highlight">$1</span>');
                    formattedHTML += cleanLine + '<br>';
                }
            });
            if (currentSection) formattedHTML += '</div></div>';
            return formattedHTML;
        }

        async function getAIAnalysis(data) {
            try {
                const response = await fetch('/.netlify/functions/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                if (!response.ok) throw new Error('AI analysis failed');
                const result = await response.json();
                return result.analysis;
            } catch (error) {
                console.error('AI Analysis Error:', error);
                return 'AI analysis temporarily unavailable. Market sentiment: ' + data.riskLevel + '. Trend: ' + data.crossStatus + '.';
            }
        }

        function generateRiskInsight(data) {
            const riskScore = calculateRiskScore(data).score, vix = parseFloat(data.vix10ma), fg = parseFloat(data.fearGreed);
            if (riskScore <= 25) return '✓ Favorable environment with ' + (vix < 15 ? 'low volatility' : 'controlled volatility') + '. ' + (fg > 50 ? 'Market optimism supports positioning.' : 'Cautious sentiment may present opportunities.');
            if (riskScore <= 50) return '⚠ Mixed signals detected. VIX at ' + vix.toFixed(1) + ' suggests ' + (vix < 20 ? 'moderate' : 'elevated') + ' uncertainty. Consider selective positioning with stops.';
            if (riskScore <= 75) return '⚠️ Elevated risk across multiple factors. ' + (vix > 25 ? 'High volatility (' + vix.toFixed(1) + ') ' : '') + 'Defensive stance recommended with reduced exposure.';
            return '🛑 Critical risk level. Multiple warning signals active. Cash preservation priority. Wait for improved conditions.';
        }

        function generateCrossInsight(data) {
            const ma21vs50 = parseFloat(data.ma21vs50), qqq50ma = parseFloat(data.qqq50ma), vix = parseFloat(data.vix10ma);
            if (ma21vs50 > 2) return '🚀 Strong bullish momentum with ' + ma21vs50.toFixed(2) + '% spread. Price ' + (qqq50ma > 0 ? qqq50ma.toFixed(2) + '% above 50MA' : 'near support') + '. Trend strength supports continued upside.';
            if (ma21vs50 > 0) return '↗ Positive but weakening momentum. 21MA/50MA spread narrowing to ' + ma21vs50.toFixed(2) + '%. Watch for potential consolidation or reversal signals.';
            if (ma21vs50 > -2) return '↘ Bearish cross confirmed. 21MA below 50MA by ' + Math.abs(ma21vs50).toFixed(2) + '%. ' + (vix > 20 ? 'Elevated volatility adds risk. ' : '') + 'Cautious approach warranted.';
            return '⚠️ Strong bearish momentum. Death Cross with ' + Math.abs(ma21vs50).toFixed(2) + '% gap. Consider defensive positioning until trend reversal confirmed.';
        }

        function generateMAInsight(data) {
            const qqq21ma = parseFloat(data.qqq21ma), qqq50ma = parseFloat(data.qqq50ma), ma21 = parseFloat(data.qqq21), ma50 = parseFloat(data.qqq50);
            if (qqq21ma > 2 && qqq50ma > 2) return '💪 Strong bullish structure. Price trading well above both MAs (' + qqq21ma.toFixed(2) + '% above 21MA, ' + qqq50ma.toFixed(2) + '% above 50MA). Uptrend firmly intact.';
            if (qqq21ma > 0 && qqq50ma > 0) return '✓ Healthy positioning above key support levels. 21MA at $' + ma21.toFixed(2) + ' and 50MA at $' + ma50.toFixed(2) + ' acting as support.';
            if (qqq21ma < 0 && qqq50ma > 0) return '⚠ Short-term weakness with price below 21MA ($' + ma21.toFixed(2) + ') but above 50MA ($' + ma50.toFixed(2) + '). Watch $' + ma50.toFixed(2) + ' as critical support.';
            if (qqq21ma < 0 && qqq50ma < 0) return '📉 Price below both key MAs. 21MA at $' + ma21.toFixed(2) + ' and 50MA at $' + ma50.toFixed(2) + ' now resistance.';
            return '📊 Price action around key moving averages. Monitor for directional break.';
        }

        function generateSentimentInsight(data) {
            const vix = parseFloat(data.vixEod), fg = parseFloat(data.fearGreed), vixVs10d = parseFloat(data.vixVs10d);
            if (fg <= 25) return '🔴 EXTREME FEAR at ' + fg + '. ' + (vix > 25 ? 'VIX elevated at ' + vix.toFixed(1) + ' confirms panic. ' : '') + 'Historically marks near-term bottoms.';
            if (fg <= 45) return '😨 Fear dominates at ' + fg + '. VIX at ' + vix.toFixed(1) + ' shows ' + (vix < 20 ? 'controlled anxiety' : 'heightened concern') + '. Contrarian opportunity if support holds.';
            if (fg <= 55) return '😐 Neutral sentiment (' + fg + '). Market in balance with VIX at ' + vix.toFixed(1) + '. Look to technical levels for directional cues.';
            if (fg <= 75) return '😊 Greed emerging at ' + fg + '. ' + (vix < 15 ? 'Low VIX suggests complacency. ' : '') + 'Monitor for overheated conditions.';
            return '🟢 EXTREME GREED at ' + fg + '. VIX compressed at ' + vix.toFixed(1) + ' shows complacency. Warning: Historically precedes pullbacks.';
        }

        async function loadHistoricalData() {
            if (!HISTORICAL_CSV_URL) return false;
            try {
                const res = await fetch(HISTORICAL_CSV_URL);
                if (!res.ok) return false;
                const csv = await res.text();
                const rows = csv.split('\n').map(r => r.split(',').map(c => c.trim().replace(/"/g, '')));
                if (rows.length >= 5) {
                    if (rows[1]?.[0]?.includes('QQQ')) historicalData.qqq = [rows[1][1], rows[1][2], rows[1][3], rows[1][4], rows[1][5]].map(v => parseFloat(v)).filter(v => !isNaN(v));
                    if (rows[2]?.[0]?.includes('VIX')) historicalData.vix = [rows[2][1], rows[2][2], rows[2][3], rows[2][4], rows[2][5]].map(v => parseFloat(v)).filter(v => !isNaN(v));
                    if (rows[3]?.[0]?.includes('MA21')) historicalData.ma21vs50 = [rows[3][1], rows[3][2], rows[3][3], rows[3][4], rows[3][5]].map(v => parseFloat(v)).filter(v => !isNaN(v));
                    if (rows[4]?.[0]?.includes('Fear')) historicalData.fearGreed = [rows[4][1], rows[4][2], rows[4][3], rows[4][4], rows[4][5]].map(v => parseFloat(v)).filter(v => !isNaN(v));
                    return true;
                }
                return false;
            } catch (e) { console.error('Historical data error:', e); return false; }
        }

        async function loadData() {
            try {
                await loadHistoricalData();
                const res = await fetch(CSV_URL);
                if (!res.ok) throw new Error('Fetch failed');
                const csv = await res.text();
                const rows = csv.split('\n').map(r => r.split(',').map(c => c.trim().replace(/"/g, ''))).filter(r => r.some(c => c));
                console.log('CSV Rows:', rows);
                if (rows.length < 4) throw new Error('Not enough data');
                
                const d = rows[3];
                const qqqData = {
                    qqqPrice: d[0] || '--', qqq21: d[1] || '--', qqq50: d[2] || '--', ma21vs50: d[3] || '--',
                    vixEod: d[4] || '--', vixVs10d: d[5] || '--', qqq21ma: d[6] || '--', fearGreed: d[7] || '--',
                    vix10ma: d[9] || '--', riskLevel: d[10] || '--', crossStatus: d[11] || '--', qqq50ma: d[12] || '--'
                };
                
                // SPY data - check row 9 (index 8) based on your sheet structure
                let spyData = null;
                if (rows.length >= 9 && rows[8] && rows[8][0] && !isNaN(parseFloat(rows[8][0]))) {
                    const s = rows[8];
                    spyData = {
                        spyPrice: s[0] || '--', spy21: s[1] || '--', spy50: s[2] || '--',
                        spyMa21vs50: s[3] || '--', spy21ma: s[4] || '--', spy50ma: s[5] || '--', spyCrossStatus: s[6] || '--'
                    };
                    console.log('SPY Data loaded:', spyData);
                }
                
                const combinedData = { ...qqqData };
                if (spyData) {
                    combinedData.spyPrice = spyData.spyPrice;
                    combinedData.spy21ma = spyData.spy21ma;
                    combinedData.spy50ma = spyData.spy50ma;
                    combinedData.spyMa21vs50 = spyData.spyMa21vs50;
                    combinedData.spyCrossStatus = spyData.spyCrossStatus;
                }
                
                updateDashboard(qqqData);
                updateRiskMeter(qqqData);
                updateMarketComparison(qqqData, spyData);
                
                const analysis = await getAIAnalysis(combinedData);
                const { execSummary, detailedAnalysis } = formatAIAnalysis(analysis);
                document.getElementById('execSummary').innerHTML = execSummary;
                document.getElementById('detailedAnalysis').innerHTML = detailedAnalysis;
                
            } catch (e) {
                console.error('Load error:', e);
                document.getElementById('error').textContent = 'Error: ' + e.message;
                document.getElementById('error').style.display = 'block';
                document.getElementById('loading').style.display = 'none';
            }
        }

        function updateDashboard(d) {
            const set = (id, val, cls) => { const el = document.getElementById(id); if (el) { if (val !== undefined) el.textContent = val; if (cls) el.className = cls; } };
            const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
            
            set('qqqPrice', '$' + d.qqqPrice); set('qqq21', '$' + d.qqq21); set('qqq50', '$' + d.qqq50);
            const ma21 = parseFloat(d.ma21vs50);
            set('ma21vs50', d.ma21vs50 + getTrendArrow(ma21), 'metric-value ' + getColorClass(ma21, 'p'));
            set('crossTrendValue', d.ma21vs50 + getTrendArrow(ma21), 'metric-value ' + getColorClass(ma21, 'p'));
            
            const vix = parseFloat(d.vixEod);
            let vixColorClass = vix < 15 ? 'greed' : vix < 20 ? 'neutral' : vix < 30 ? 'fear' : 'extreme-fear';
            set('vixEod', d.vixEod, 'metric-value ' + vixColorClass);
            const vix10 = parseFloat(d.vixVs10d);
            set('vixVs10d', d.vixVs10d + getTrendArrow(vix10), 'metric-value ' + (vix10 > 0 ? 'fear' : 'neutral'));
            set('qqq21ma', d.qqq21ma, 'metric-value ' + getColorClass(parseFloat(d.qqq21ma), 'p'));
            
            const fg = parseFloat(d.fearGreed); const fgs = getFearGreedStatus(fg);
            let fgColorClass = fg <= 25 ? 'extreme-fear' : fg <= 45 ? 'fear' : fg <= 55 ? 'neutral' : 'greed';
            set('fearGreedValue', d.fearGreed, 'metric-value ' + fgColorClass);
            set('fearGreedBadge', fgs.text, 'status-badge ' + fgs.class);
            set('vix10ma', d.vix10ma);
            
            const vix10maVal = parseFloat(d.vix10ma);
            let vix10maColorClass = vix10maVal < 15 ? 'greed' : vix10maVal < 20 ? 'neutral' : vix10maVal < 30 ? 'fear' : 'extreme-fear';
            const vix10maEl = document.getElementById('vix10ma');
            if (vix10maEl) vix10maEl.className = 'metric-value ' + vix10maColorClass;
            
            const risk = d.riskLevel.toLowerCase();
            let riskClass = risk.includes('critical') ? 'badge-critical-risk' : risk.includes('high') ? 'badge-high-risk' : risk.includes('mid') ? 'badge-mid-risk' : 'badge-low-risk';
            set('mainRiskBadge', d.riskLevel.toUpperCase(), 'status-badge ' + riskClass);
            
            const cross = d.crossStatus.toLowerCase().includes('bull');
            set('mainCrossBadge', cross ? 'BULLISH SIGNAL' : 'BEARISH SIGNAL', 'status-badge ' + (cross ? 'badge-golden-cross' : 'badge-death-cross'));
            
            const q50 = parseFloat(d.qqq50ma);
            set('qqq50maMain', d.qqq50ma + getTrendArrow(q50), 'metric-value ' + getColorClass(q50, 'p'));
            
            setHTML('vixTrend', createTrendMini('5-Day VIX', historicalData.vix, parseFloat(d.vixEod)));
            setHTML('priceTrend', createTrendMini('5-Day QQQ', historicalData.qqq, parseFloat(d.qqqPrice)));
            setHTML('maTrend', createTrendMini('5-Day 21vs50', historicalData.ma21vs50, parseFloat(d.ma21vs50)));
            setHTML('fearGreedTrend', createTrendMini('5-Day F&G', historicalData.fearGreed, parseFloat(d.fearGreed)));
            
            const insights = [
                { box: 'riskAIInsight', fn: generateRiskInsight },
                { box: 'crossAIInsight', fn: generateCrossInsight },
                { box: 'maAIInsight', fn: generateMAInsight },
                { box: 'sentimentAIInsight', fn: generateSentimentInsight }
            ];
            insights.forEach(({ box, fn }) => {
                const el = document.getElementById(box);
                if (el) { const content = el.querySelector('.ai-insight-content'); if (content) content.textContent = fn(d); }
            });
            
            set('lastUpdated', 'Last Updated: ' + new Date().toLocaleString());
            document.getElementById('loading').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
        }

        loadData();
        
        function isMarketHours() {
            const now = new Date(), day = now.getUTCDay(), hour = now.getUTCHours();
            const etHour = (hour - 5 + 24) % 24;
            return day >= 1 && day <= 5 && etHour >= 9 && etHour <= 17;
        }
        setInterval(() => { if (isMarketHours()) { console.log('📊 Refreshing...'); loadData(); } }, 3600000);
    </script>
</body>
</html>
