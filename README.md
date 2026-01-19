# AI Superpowers Workshop

Medical Affairs Training Pilot - AI Superpowers Workshop

## Overview

This workshop helps Medical Affairs professionals build confidence in:
- When to use AI
- How to prompt with CRAFT framework
- How to apply four AI superpowers in Medical Affairs

## Features

- **CRAFT Framework**: Learn the Context, Role, Action, Format, Tone framework for effective prompting
- **Four Superpowers**:
  - Generate Ideas
  - Analyze Content
  - Generate Content
  - Provide Feedback

## Local Development

1. Install Node.js (v18 or higher)
2. Install dependencies (if any):
   ```bash
   npm install
   ```
3. Set environment variable:
   ```bash
   export VENICE_API_KEY=your-api-key-here
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open http://localhost:3000 in your browser

## Deploy to Railway

### One-Click Deploy

1. Fork this repository
2. Go to [Railway](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your forked repo
5. Add environment variable: `VENICE_API_KEY` (your Venice API key)
6. Deploy!

### Manual Deploy

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Set environment variables
railway variables set VENICE_API_KEY=your-key-here

# Deploy
railway up
```

## Environment Variables

- `VENICE_API_KEY` (required): Your Venice AI API key
- `VENICE_MODEL` (optional): Model to use (default: "gemini-3-flash-preview")
- `PORT` (optional): Server port (default: 3000)

## Project Structure

```
Workshop/
├── index.html              # Home page
├── craft.html              # CRAFT framework page
├── superpower-*.html       # Superpower pages
├── server.js               # Node.js server
├── script.js               # Client-side JavaScript
├── styles.css              # Styles
├── assets/                 # Images and assets
└── package.json            # Dependencies and scripts
```

## Created By

Patrina Pellett and Vivek Mukhatyar
