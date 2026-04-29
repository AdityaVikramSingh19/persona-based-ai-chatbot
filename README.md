# Scaler Persona Chatbot

A persona-based AI chatbot that lets you talk with three Scaler personalities — Anshuman Singh, Abhimanyu Saxena, and Kshitij Mishra.

Built as Assignment 01 for the Prompt Engineering module at Scaler School of Technology.

## Live Demo

[🔗 Insert your deployed Vercel/Netlify URL here]

## Features

- 3 distinct AI personas with unique system prompts
- Persona switcher — conversation resets on switch
- Suggestion chips per persona
- Typing indicator during API calls
- Graceful error handling
- Mobile responsive

## Tech Stack

- React 18
- Anthropic Claude API (`claude-sonnet-4-20250514`)

## Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/scaler-persona-chatbot
   cd scaler-persona-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and replace `your_anthropic_api_key_here` with your real Anthropic API key.

4. **Run locally**
   ```bash
   npm start
   ```
   The app opens at `http://localhost:3000`

## Deployment (Vercel)

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. In the Environment Variables section, add:
   - Key: `REACT_APP_ANTHROPIC_API_KEY`
   - Value: your real API key
4. Deploy

## Project Structure

```
src/
  App.jsx      — Main component, UI logic, API calls
  App.css      — All styles
  personas.js  — System prompts for all 3 personas
  index.js     — React entry point
```

## Screenshots

[Add screenshots here]
