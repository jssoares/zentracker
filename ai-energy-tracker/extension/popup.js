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
      claude: { sessions: 0, tokens: 0, energy: 0, water: 0 },
      chatgpt: { sessions: 0, tokens: 0, energy: 0, water: 0 },
      gemini: { sessions: 0, tokens: 0, energy: 0, water: 0 }
    };

    // Calculate totals
    const totalSessions = usage.claude.sessions + usage.chatgpt.sessions + usage.gemini.sessions;
    const totalTokens = usage.claude.tokens + usage.chatgpt.tokens + usage.gemini.tokens;
    const totalEnergy = usage.claude.energy + usage.chatgpt.energy + usage.gemini.energy;
    const totalWater = (usage.claude.water || 0) + (usage.chatgpt.water || 0) + (usage.gemini.water || 0);

    // Convert to proper units
    const totalEnergyKW = totalEnergy / 1000;  // Convert Wh to kWh
    const totalWaterL = totalWater / 1000;     // Convert ml to L

    // Dynamic color functions
    function getEnergyColor(kilowattHours) {
      if (kilowattHours < 0.002) return '#16a34a';      // Green - very low
      if (kilowattHours < 0.004) return '#84cc16';      // Light green - low
      if (kilowattHours < 0.006) return '#eab308';      // Yellow - medium-low
      if (kilowattHours < 0.008) return '#f59e0b';      // Amber - medium
      if (kilowattHours < 0.012) return '#f97316';      // Orange - medium-high
      if (kilowattHours < 0.016) return '#ef4444';      // Red - high
      if (kilowattHours < 0.020) return '#dc2626';      // Dark red - very high
      return '#991b1b';                                 // Very dark red - extreme
    }

    function getWaterColor(liters) {
      if (liters === 0) return '#020617';        // Almost black - pristine world water
      if (liters < 0.005) return '#0c1220';      // Very very dark blue - minimal impact  
      if (liters < 0.015) return '#1e293b';      // Very dark blue - low impact
      if (liters < 0.025) return '#334155';      // Dark blue - moderate
      if (liters < 0.035) return '#475569';      // Medium blue - significant impact
      if (liters < 0.050) return '#64748b';      // Light blue - high impact
      return '#f1f5f9';                          // Almost white - severe depletion
    }

    // Convert hex to rgba for transparency
    function hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Update UI
    document.getElementById('total-sessions').textContent = totalSessions;
    document.getElementById('total-energy').textContent = `${totalEnergyKW.toFixed(3)} kWh`;
    document.getElementById('total-water').textContent = `${totalWaterL.toFixed(3)} L`;
    document.getElementById('total-tokens').textContent = totalTokens.toLocaleString();
   
    document.getElementById('claude-count').textContent = `${usage.claude.sessions} sessions`;
    document.getElementById('chatgpt-count').textContent = `${usage.chatgpt.sessions} sessions`;
    document.getElementById('gemini-count').textContent = `${usage.gemini.sessions} sessions`;

    // Apply dynamic colors with transparency
    const energyCard = document.querySelector('.energy-card');
    const waterCard = document.querySelector('.water-card');

    energyCard.style.backgroundColor = hexToRgba(getEnergyColor(totalEnergyKW), 0.55);
    waterCard.style.backgroundColor = hexToRgba(getWaterColor(totalWaterL), 0.55);

    if (totalWaterL >= 0.035) {  // Only switch to dark text at higher usage
      waterCard.style.color = '#1f2937'; // Dark text for light backgrounds
    } else {
      waterCard.style.color = 'white';   // Keep white text for dark backgrounds
    }
   
    // Show content, hide loading
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
   
  } catch (error) {
    console.error('Error loading usage data:', error);
    document.getElementById('loading').textContent = 'Error loading data';
  }
});