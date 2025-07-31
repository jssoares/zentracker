// Secure configuration class
class SecurityConfig {
  static get ALLOWED_ORIGINS() {
    return [
      'https://claude.ai',
      'https://chatgpt.com',
      'https://gemini.google.com',
    ];
  }

  static get MAX_TOKEN_COUNT() {
    return 100000; // Prevent memory exhaustion
  }

  static get MAX_SESSIONS_PER_DAY() {
    return 1000; // Reasonable usage limit
  }

  static validateOrigin(url) {
    try {
      const urlObj = new URL(url);
      return this.ALLOWED_ORIGINS.some(origin => 
        urlObj.origin === origin
      );
    } catch (e) {
      console.warn('Invalid URL detected:', url);
      return false;
    }
  }

  static sanitizeData(data) {
    // Remove any potential XSS vectors
    if (typeof data === 'string') {
      return data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    return data;
  }
}