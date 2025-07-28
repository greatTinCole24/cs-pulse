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

## Video analysis script

The repository includes a Python utility in `analysis/video_analyzer.py`
which demonstrates how OpenCV and an LLM can be combined to analyse
match footage. The script extracts basic statistics from a video and uses
an LLM to produce gameplay feedback.

Example usage:

```bash
python analysis/video_analyzer.py match.mp4 --player-profile profile.json
```

The output file specified with `--output` contains the raw statistics and
LLM-generated feedback.

For more information and support, please contact Base44 support at
app@base44.com.
