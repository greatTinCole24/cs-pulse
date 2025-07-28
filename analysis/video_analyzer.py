"""Video analysis tool integrating OpenCV and an LLM.

This script processes an esports match video to extract basic statistics
and then queries an LLM to generate gameplay feedback. It is intended as a
starting point for replacing the mock analysis logic in the web app.

Requirements:
    - opencv-python
    - openai>=1.0

Example:
    python analysis/video_analyzer.py match.mp4 --player-profile player.json
"""

import argparse
import json
import cv2
from openai import OpenAI


class VideoAnalyzer:
    """Extract simple statistics from a gameplay video."""

    def __init__(self, llm_client: OpenAI):
        self.llm_client = llm_client

    def analyze_video(self, video_path: str) -> dict:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise FileNotFoundError(f"Unable to open video file: {video_path}")

        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = float(cap.get(cv2.CAP_PROP_FPS))

        brightness_values = []
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            brightness_values.append(float(gray.mean()))

        cap.release()

        avg_brightness = sum(brightness_values) / len(brightness_values) if brightness_values else 0.0

        # Placeholder for real event detection. A production system would
        # inspect each frame for kill feeds, HUD elements, or other cues.
        analysis = {
            "frames": frame_count,
            "fps": fps,
            "avg_brightness": avg_brightness,
            "kills": 0,
            "deaths": 0,
            "accuracy": 0.0,
            "kill_events": [],
            "death_events": [],
        }

        return analysis

    def create_feedback(self, analysis: dict, player_profile: dict) -> str:
        prompt = (
            "You are an esports strategist. Review the following raw statistics "
            "and player profile and provide a short performance summary, three "
            "bullet points of improvement suggestions, and a brief strategy tip "
            "for defeating upcoming opponents.\n\nStatistics:\n"
            f"{json.dumps(analysis, indent=2)}\n\n"
            f"Player Profile:\n{json.dumps(player_profile, indent=2)}"
        )

        response = self.llm_client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=250,
        )
        return response.choices[0].message.content.strip()


def main() -> None:
    parser = argparse.ArgumentParser(description="Analyze an esports match video")
    parser.add_argument("video", help="Path to the video file")
    parser.add_argument("--player-profile", required=True, help="JSON file with player info")
    parser.add_argument("--output", default="analysis_output.json", help="Where to write the results")
    args = parser.parse_args()

    with open(args.player_profile, "r", encoding="utf-8") as f:
        profile = json.load(f)

    llm_client = OpenAI()
    analyzer = VideoAnalyzer(llm_client)

    stats = analyzer.analyze_video(args.video)
    feedback = analyzer.create_feedback(stats, profile)

    result = {"stats": stats, "feedback": feedback}
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    print(f"Analysis written to {args.output}")


if __name__ == "__main__":
    main()
