FROM python:3.10-slim

# Install system dependencies for OpenCV, FFmpeg, and headless operation
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    opencv-python-headless \
    ultralytics \
    sqlalchemy \
    psycopg2-binary

# Copy the application code
COPY app.py .

# Expose the port
EXPOSE 8000

# Run the app with Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
