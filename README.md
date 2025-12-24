# grok-music-app

Cross-platform music player with DAW - React Native + Electron + Node.js

## Team

- Oleg (Lead Developer)
- Comet (AI Assistant - Perplexity)

## Architecture

This is a monorepo project using Turborepo:

- `packages/backend` - Node.js/Express API server
- `packages/desktop` - Electron desktop app (Windows/Mac/Linux) - Coming soon
- `packages/mobile` - React Native mobile app (iOS/Android) - Coming soon
- `packages/shared` - Shared types and utilities - Coming soon

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+

### Installation

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install dependencies
pnpm install
```

### Development

```bash
# Start backend API server
cd packages/backend
pnpm install
pnpm dev
```

Backend API will be available at http://localhost:3000

### API Endpoints

- `GET /` - Health check
- `GET /api/tracks` - Get all tracks
- `GET /api/tracks/:id` - Get track by ID

## Project Status

- Backend API: In Development
- Desktop App: Coming Soon
- Mobile App: Coming Soon

## License

MIT
