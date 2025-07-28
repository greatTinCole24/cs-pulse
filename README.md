# Base44 App

This app was created automatically by Base44. It's a Vite + React project that communicates with the Base44 API.

## Installation

Install dependencies with:

```bash
npm install
```

## Running the app

```bash
npm run dev
```

## Building the app

```bash
npm run build
```

## Deployment

Deploy the application using the Vercel CLI:

```bash
npm install -g vercel    # if you do not already have it
vercel
```

Follow the prompts in the terminal to deploy.

## API Configuration

Configure your API keys before running or deploying. Set the following environment variables in a `.env` file or in your Vercel project settings:

```
BASE44_API_KEY=<your api key>
BASE44_API_URL=<https://api.base44.com>
```

The `/api/analyze` endpoint is powered by the Python script `analysis/video_analyzer.py`.

## Video Upload

Uploading a match video will create a new analysis entry. After a successful upload you will see a card in the **Video Analysis** page summarizing key stats such as kills, deaths, accuracy and improvement suggestions.

For more information and support, please contact Base44 support at app@base44.com
