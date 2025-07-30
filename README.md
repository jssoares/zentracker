# ZenTracker

Making digital consumption visible through environmental awareness tools.

## Mission

In an age of invisible digital infrastructure, ZenTracker creates transparency around the environmental cost of our online interactions. We believe users have the right to understand the carbon footprint of their digital choices.

## Current Project: AI Energy Tracker

A Firefox browser extension that monitors the environmental impact of AI interactions across major platforms.

### What It Does

- **Real-time monitoring** of AI platform usage (Claude, ChatGPT, Gemini)
- **Energy consumption estimates** based on token usage and model specifications
- **Daily usage tracking** with session counts and environmental impact
- **Privacy-first approach** - all data stored locally, no tracking

### Why This Matters

Every AI interaction consumes energy and water through data center operations. Most users have no visibility into this environmental cost. Our extension makes the invisible visible, empowering conscious digital consumption choices.

### Current Status: MVP Development

🚧 **Work in Progress** - Basic functionality under development

**Completed:**
- Core extension architecture
- Platform detection system
- Basic energy calculation framework

**Next Steps:**
- Firefox extension testing
- UI development for usage dashboard
- Enhanced token counting accuracy

## Technical Approach

### Principles
- **Firefox-first development** (privacy-aligned browser)
- **No Big Tech cloud dependencies** 
- **Object-oriented, maintainable code**
- **Security and privacy by design**

### Architecture
- **Frontend:** Firefox WebExtension (Manifest V2)
- **Backend:** FastAPI (Python) - planned
- **Database:** PostgreSQL with local storage fallback
- **Hosting:** Independent infrastructure (no AWS/GCP/Azure)

## Values

- **Non-commercial** - This is not a business, it's a public service
- **Community-driven** - Built by environmentally conscious developers
- **Transparency** - Open methodologies, open source, open data
- **Privacy-first** - Your usage data belongs to you
- **Environmental justice** - Making corporate environmental externalities visible

## Getting Started

### Prerequisites
- Firefox Browser
- Git
- Text editor

### Installation (Development)
```bash
git clone https://github.com/jssoares/zentracker.git
cd zentracker/ai-energy-tracker/extension