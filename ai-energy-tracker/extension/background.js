
// Main initialization and coordination

class BackgroundService {
  constructor() {
    this.platformRegistry = new PlatformRegistry();
    this.usageTracker     = new UsageTracker(this.platformRegistry);
    this.requestMonitor   = new RequestMonitor(this.usageTracker, this.platformRegistry);
    this.securityConfig   = new SecurityConfig();
  }

  async initialize() {
    try {
      await this.usageTracker.loadStoredData();
      this.requestMonitor.startMonitoring();
      console.log('AI Energy Tracker initialized');
    } catch (error) {
      console.error('Initialization failed:', error);
    }
  }
}

// Start the service
const backgroundService = new BackgroundService();
backgroundService.initialize();