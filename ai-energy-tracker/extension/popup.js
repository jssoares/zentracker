document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Set current date
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
    document.getElementById('current-date').textContent = today;
    
    // Load usage data
    const result = await browser.storage.local.get('dailyUsage');
    const todayKey = new Date().toISOString().split('T')[0];
    const usage = result.dailyUsage?.[todayKey] || {
      claude: { sessions: 0, tokens: 0, energy: 0 },
      chatgpt: { sessions: 0, tokens: 0, energy: 0 },
      gemini: { sessions: 0, tokens: 0, energy: 0 }
    };
    
    // Calculate totals
    const totalSessions = usage.claude.sessions + usage.chatgpt.sessions + usage.gemini.sessions;
    const totalTokens = usage.claude.tokens + usage.chatgpt.tokens + usage.gemini.tokens;
    const totalEnergy = usage.claude.energy + usage.chatgpt.energy + usage.gemini.energy;
    const totalWater = (usage.claude.water || 0) + (usage.chatgpt.water || 0) + (usage.gemini.water || 0);

    // Update UI
    document.getElementById('total-sessions').textContent = totalSessions;
    document.getElementById('total-energy').textContent = `${totalEnergy.toFixed(1)} Wh`;
    document.getElementById('total-water').textContent = `${totalWater.toFixed(1)} ml`;
    document.getElementById('total-tokens').textContent = totalTokens.toLocaleString();
    
    document.getElementById('claude-count').textContent = `${usage.claude.sessions} sessions`;
    document.getElementById('chatgpt-count').textContent = `${usage.chatgpt.sessions} sessions`;
    document.getElementById('gemini-count').textContent = `${usage.gemini.sessions} sessions`;
    
    // Show content, hide loading
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    
  } catch (error) {
    console.error('Error loading usage data:', error);
    document.getElementById('loading').textContent = 'Error loading data';
  }
});