// Platform registry class
class PlatformRegistry {
  constructor() {
    this.platforms = new Map();
    this.initializePlatforms();
  }

  initializePlatforms() {
    this.platforms.set('claude', new AIPlatform(
      'Claude', 'claude.ai', 0.0005, 
      ['/api/organizations/', '/api/chat_conversations/']
    ));
    
    this.platforms.set('chatgpt', new AIPlatform(
      'ChatGPT', 'chat.openai.com', 0.0003,
      ['/backend-api/conversation', '/backend-api/chat']
    ));
    
    this.platforms.set('gemini', new AIPlatform(
      'Gemini', 'gemini.google.com', 0.0004,
      ['/api/generate', '/api/chat']
    ));
  }

  getPlatform(key) {
    return this.platforms.get(key);
  }

  findPlatformByUrl(url) {
    for (const [key, platform] of this.platforms) {
      if (platform.matchesRequest(url)) {
        return { key, platform };
      }
    }
    return null;
  }
}