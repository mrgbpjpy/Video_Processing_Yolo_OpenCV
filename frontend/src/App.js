import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setProcessedVideoUrl(null); // Reset video on new selection
    setError(null);
    setProgress(0);
    setStatusMessage('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a video file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);
    setStatusMessage('Uploading...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/upload_video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Expect binary response (MP4 file)
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
          if (percentCompleted === 100) {
            setStatusMessage('Processing with YOLO and OpenCV...');
          }
        },
      });

      // Create a URL for the blob to display in <video>
      const videoBlob = new Blob([response.data], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);
      setProcessedVideoUrl(videoUrl);
      setStatusMessage('Done!');
    } catch (err) {
      console.error(err);
      setError('Error uploading or processing video: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Video Processor</h1>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload and Process Video'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && (
        <div>
          <p>{statusMessage}</p>
          <progress value={progress} max="100" style={{ width: '300px' }} />
          <p>{progress}%</p>
        </div>
      )}
      {processedVideoUrl && (
        <div>
          <h2>Processed Video</h2>
          <video controls width="600" src={processedVideoUrl}>
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}

export default App;