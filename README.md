# Base44 App

This app was created automatically by Base44.
It's a Vite+React app that communicates with the Base44 API.

## Running the app

```bash
npm install
npm run dev
```

## Building the app

```bash
npm run build
```

## Deploying to Vercel

The project can be deployed as a static site with API functions on
[Vercel](https://vercel.com). A basic configuration is provided via
`vercel.json` and `requirements.txt`.

1. Install the Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Link your project and deploy:

   ```bash
   vercel
   ```

The build command runs `npm run build` and outputs the production files to the
`dist` folder. Python files in the `api` directory are deployed as serverless
functions using Python 3.11 with dependencies from `requirements.txt`.

For more information and support, please contact Base44 support at app@base44.com.

## Video analysis script

The optional video analysis script relies on a few Python packages.

### Required packages

- `opencv-python`
- `openai>=1.0`

### Installation

Install the packages using pip:

```bash
pip install opencv-python
pip install "openai>=1.0"
```
