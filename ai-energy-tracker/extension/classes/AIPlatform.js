// Enhanced Platform class with validation
class AIPlatform {
  constructor(name, hostname, energyPerToken, apiPatterns) {
    this.name = SecurityConfig.sanitizeData(name);
    this.hostname = this.validateHostname(hostname);
    this.energyPerToken = this.validateNumber(energyPerToken, 0, 1);
    this.apiPatterns = apiPatterns.map(p => SecurityConfig.sanitizeData(p));
  }

  validateHostname(hostname) {
    const allowed = ['claude.ai', 'chat.openai.com', 'gemini.google.com'];
    if (!allowed.includes(hostname)) {
      throw new Error(`Unauthorized hostname: ${hostname}`);
    }
    return hostname;
  }

  validateNumber(value, min, max) {
    const num = Number(value);
    if (isNaN(num) || num < min || num > max) {
      throw new Error(`Invalid number: ${value}`);
    }
    return num;
  }

  matchesRequest(url) {
    if (!SecurityConfig.validateOrigin(url.href)) return false;
    
    return url.hostname === this.hostname && 
           this.apiPatterns.some(pattern => url.pathname.includes(pattern));
  }
}