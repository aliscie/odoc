import { useState, useCallback } from 'react';

export const useVoiceInput = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start();

      recorder.onerror = (event) => {
        setRecordingError('Recording error: ' + event.error);
        stopRecording();
      };

    } catch (error) {
      setRecordingError('Error accessing microphone: ' + error.message);
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setMediaRecorder(null);
  }, [mediaRecorder]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    recordingError,
  };
};

export default useVoiceInput;
