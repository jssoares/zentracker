document.addEventListener('DOMContentLoaded', async () => {
  try {
    const result = await browser.storage.local.get('dailyUsage');
    const today = new Date().toISOString().split('T')[0];
    const usage = result.dailyUsage?.[today] || {};
    
    document.getElementById('claude-sessions').textContent = usage.claude?.sessions || 0;
    document.getElementById('chatgpt-sessions').textContent = usage.chatgpt?.sessions || 0;
    document.getElementById('gemini-sessions').textContent = usage.gemini?.sessions || 0;
    
    document.getElementById('loading').style.display = 'none';
    document.getElementById('usage').style.display = 'block';
  } catch (error) {
    console.error('Error loading usage data:', error);
    document.getElementById('loading').textContent = 'Error loading data';
  }
});
