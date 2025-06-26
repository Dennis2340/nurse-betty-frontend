import { useEffect, useRef } from 'react';

const VoiceVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const canvasContext = canvas.getContext('2d');

    if (!canvasContext) return;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);

          canvasContext.fillStyle = 'rgb(255, 255, 255)';
          canvasContext.fillRect(0, 0, canvas.width, canvas.height);

          const barWidth = (canvas.width / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            canvasContext.fillStyle = `rgb(59, 130, 246, ${barHeight / 255})`;
            canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
          }
        };

        draw();
      })
      .catch(err => {
        console.error('Error accessing microphone', err);
      });

    return () => {
      audioContext.close();
    };
  }, []);

  return <canvas ref={canvasRef} width="300" height="150" />;
};

export default VoiceVisualizer;