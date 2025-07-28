import os
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from analysis.video_analyzer import VideoAnalyzer

app = FastAPI()

@app.post("/analyze")
async def analyze_video(video: UploadFile = File(...)):
    """Accepts an uploaded video, runs analysis and returns stats."""
    fd, temp_path = tempfile.mkstemp(dir="/tmp", suffix=os.path.splitext(video.filename)[1])
    os.close(fd)
    try:
        # Save uploaded video to temporary location
        with open(temp_path, "wb") as out_file:
            content = await video.read()
            out_file.write(content)

        analyzer = VideoAnalyzer(temp_path)
        result = analyzer.analyze()
        return JSONResponse(content=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        try:
            os.remove(temp_path)
        except OSError:
            pass

