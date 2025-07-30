// Secure Usage Tracker
class UsageTracker {
  constructor() {
    this.dailyUsage = {};
    this.today = new Date().toISOString().split('T')[0];
    this.loadStoredData();
  }

  recordInteraction(platformKey, tokenCount = 500) {
    // Input validation
    if (!this.isValidPlatformKey(platformKey)) {
      console.warn('Invalid platform key:', platformKey);
      return;
    }

    tokenCount = this.validateTokenCount(tokenCount);
    
    this.initializeTodayIfNeeded();
    
    // Rate limiting check
    if (this.exceedsRateLimit(platformKey)) {
      console.warn('Rate limit exceeded for platform:', platformKey);
      return;
    }

    const usage = this.dailyUsage[this.today][platformKey];
    usage.sessions += 1;
    usage.tokens += tokenCount;
    
    const platform = platformRegistry.getPlatform(platformKey);
    usage.energy += platform.calculateEnergy(tokenCount);
    
    this.saveToStorage();
  }

  isValidPlatformKey(key) {
    return ['claude', 'chatgpt', 'gemini'].includes(key);
  }

  validateTokenCount(count) {
    const num = Number(count);
    if (isNaN(num) || num < 0) return 500; // Default fallback
    return Math.min(num, SecurityConfig.MAX_TOKEN_COUNT);
  }

  exceedsRateLimit(platformKey) {
    const usage = this.dailyUsage[this.today]?.[platformKey];
    return usage && usage.sessions >= SecurityConfig.MAX_SESSIONS_PER_DAY;
  }

  async saveToStorage() {
    try {
      // Only store sanitized data
      const sanitizedData = this.sanitizeStorageData(this.dailyUsage);
      await browser.storage.local.set({ dailyUsage: sanitizedData });
    } catch (error) {
      console.error('Storage save failed:', error);
    }
  }

  sanitizeStorageData(data) {
    // Deep clone and validate data structure
    const sanitized = {};
    for (const [date, dayData] of Object.entries(data)) {
      if (this.isValidDate(date)) {
        sanitized[date] = this.sanitizeDayData(dayData);
      }
    }
    return sanitized;
  }

  isValidDate(dateString) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  }

  sanitizeDayData(dayData) {
    const sanitized = {};
    const allowedKeys = ['claude', 'chatgpt', 'gemini'];
    
    for (const key of allowedKeys) {
      if (dayData[key]) {
        sanitized[key] = {
          sessions: Math.max(0, Number(dayData[key].sessions) || 0),
          tokens: Math.max(0, Number(dayData[key].tokens) || 0),
          energy: Math.max(0, Number(dayData[key].energy) || 0)
        };
      }
    }
    return sanitized;
  }

  async loadStoredData() {
    const result = await browser.storage.local.get('dailyUsage');
    this.dailyUsage = result.dailyUsage || {};
    this.initializeTodayIfNeeded();
  }

  initializeTodayIfNeeded() {
    if (!this.dailyUsage[this.today]) {
      this.dailyUsage[this.today] = {
        claude: { sessions: 0, tokens: 0, energy: 0 },
        chatgpt: { sessions: 0, tokens: 0, energy: 0 },
        gemini: { sessions: 0, tokens: 0, energy: 0 }
      };
    }
  }
}
