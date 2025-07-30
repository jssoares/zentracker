// Enhanced Request Monitor
class RequestMonitor {
  constructor(usageTracker, platformRegistry) {
    this.usageTracker = usageTracker;
    this.platformRegistry = platformRegistry;
    this.requestCounts = new Map(); // Rate limiting
    this.initializeListeners();
  }

  initializeListeners() {
    browser.webRequest.onBeforeRequest.addListener(
      (details) => this.handleRequest(details),
      {
        urls: [
          "https://claude.ai/*",
          "https://chat.openai.com/*", 
          "https://gemini.google.com/*"
        ]
      },
      ["requestBody"]
    );
  }

  startMonitoring() {
    console.log('Request monitoring started');
  }

  handleRequest(details) {
    try {
      if (details.method !== 'POST') return;
      
      // Rate limiting per origin
      if (this.isRateLimited(details.url)) {
        console.warn('Request rate limited:', details.url);
        return;
      }

      const url = new URL(details.url);
      
      // Additional security check
      if (!SecurityConfig.validateOrigin(details.url)) {
        console.warn('Unauthorized origin blocked:', details.url);
        return;
      }

      const match = this.platformRegistry.findPlatformByUrl(url);
      
      if (match) {
        console.log(`AI API call detected: ${match.platform.name}`);
        this.usageTracker.recordInteraction(match.key);
        this.updateRateLimit(details.url);
      }
    } catch (error) {
      console.error('Request handling error:', error);
    }
  }

  isRateLimited(url) {
    const origin = new URL(url).origin;
    const count = this.requestCounts.get(origin) || 0;
    return count > 100; // Max 100 requests per minute per origin
  }

  updateRateLimit(url) {
    const origin = new URL(url).origin;
    const current = this.requestCounts.get(origin) || 0;
    this.requestCounts.set(origin, current + 1);
    
    // Reset counter every minute
    setTimeout(() => {
      this.requestCounts.set(origin, Math.max(0, (this.requestCounts.get(origin) || 0) - 1));
    }, 60000);
  }
}