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

   // Energy color function: light yellow (low usage) to dark red (high usage)
  function getEnergyColor(kilowattHours) {
    if (kilowattHours === 0) return '#fef3c7';        // Light yellow (more visible)
    if (kilowattHours < 0.005) return '#fde047';      // Yellow
    if (kilowattHours < 0.010) return '#f59e0b';      // Orange
    if (kilowattHours < 0.015) return '#ea580c';      // Dark orange
    if (kilowattHours < 0.020) return '#dc2626';      // Red
    if (kilowattHours < 0.025) return '#b91c1c';      // Dark red
    if (kilowattHours < 0.030) return '#991b1b';      // Very dark red
    if (kilowattHours < 0.035) return '#7f1d1d';      // Almost black red
    if (kilowattHours < 0.040) return '#450a0a';      // Very dark red
    if (kilowattHours < 0.045) return '#3c0a0a';      // Extremely dark red
    if (kilowattHours < 0.050) return '#2d0505';      // Nearly black
    return '#1a0000';                                 // Almost black
  }

   // Water color function: dark blue/teal (low usage) to light blue (high usage)
   function getWaterColor(liters) {
     if (liters === 0) return '#134e4a';        // Dark teal
     if (liters < 0.005) return '#155e63';      // Dark blue-teal
     if (liters < 0.010) return '#0e7490';      // Medium dark blue
     if (liters < 0.015) return '#0284c7';      // Blue
     if (liters < 0.020) return '#0ea5e9';      // Medium blue
     if (liters < 0.025) return '#38bdf8';      // Light blue
     if (liters < 0.030) return '#7dd3fc';      // Very light blue
     if (liters < 0.035) return '#bae6fd';      // Pale blue
     if (liters < 0.040) return '#e0f2fe';      // Very pale blue
     if (liters < 0.045) return '#f0f9ff';      // Almost white blue
     if (liters < 0.050) return '#f8fafc';      // Near white
     return '#ffffff';                          // White
   }

   // Water text color: white (dark bg) to dark (light bg)
   function getWaterTextColor(liters) {
     if (liters < 0.025) return 'white';        // White text for dark backgrounds
     if (liters < 0.040) return '#374151';      // Medium gray for medium backgrounds
     return '#111827';                          // Dark text for light backgrounds
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
   document.getElementById('total-energy').textContent = `${totalEnergyKW.toFixed(5)} kWh`;
   document.getElementById('total-water').textContent = `${totalWaterL.toFixed(5)} L`;
   document.getElementById('total-tokens').textContent = totalTokens.toLocaleString();
  
   document.getElementById('claude-count').textContent = `${usage.claude.sessions} sessions`;
   document.getElementById('chatgpt-count').textContent = `${usage.chatgpt.sessions} sessions`;
   document.getElementById('gemini-count').textContent = `${usage.gemini.sessions} sessions`;

   // Apply dynamic colors
   const energyCard = document.querySelector('.energy-card');
   const waterCard = document.querySelector('.water-card');

   energyCard.style.backgroundColor = hexToRgba(getEnergyColor(totalEnergyKW), 0.8);
   waterCard.style.backgroundColor = hexToRgba(getWaterColor(totalWaterL), 0.8);

   // Energy text: always white
   energyCard.style.color = 'white';

   // Water text: dynamic based on background
   waterCard.style.color = getWaterTextColor(totalWaterL);
  
   // Show content, hide loading
   document.getElementById('loading').style.display = 'none';
   document.getElementById('content').style.display = 'block';
  
 } catch (error) {
   console.error('Error loading usage data:', error);
   document.getElementById('loading').textContent = 'Error loading data';
 }
});