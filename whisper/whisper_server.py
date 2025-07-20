from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import tempfile
import os

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)

# Load Whisper model once (base model, can be "tiny" or "small" for speed)
model = whisper.load_model("base")

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    audio_file = request.files["file"]

    if audio_file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp:
            audio_file.save(temp.name)
            temp_path = temp.name

        # Transcribe
        result = model.transcribe(temp_path)
        text = result.get("text", "").strip()

        # Clean up
        os.remove(temp_path)

        return jsonify({"transcription": text}), 200

    except Exception as e:
        print(f"Transcription error: {e}")
        return jsonify({"error": "Transcription failed", "details": str(e)}), 500

# Run the server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
