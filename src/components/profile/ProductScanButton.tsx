'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import SnackbarUtils from 'utils/SnackbarUtils';

export default function ProductScanButton() {
  const [isScanning, setIsScanning] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Refs for our DOM elements and stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);

  // Function to stop the camera stream and cleanup
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  // Main scanning loop function
  const scanLoop = useCallback(() => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Set canvas dimensions to match the video feed
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        // Draw the current video frame to the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the image data from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Use jsQR to check for a QR code
        let code;
        try {
          code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });
        } catch (error) {
          console.error('Error decoding QR code:', error);
          // Don't show error message here as it would show repeatedly during scanning
          // Continue scanning
        }

        // If a QR code is found
        if (code) {
          // Draw a line to highlight the QR code - good for user feedback
          const { topLeftCorner, topRightCorner, bottomRightCorner, bottomLeftCorner } = code.location;
          ctx.beginPath();
          ctx.moveTo(topLeftCorner.x, topLeftCorner.y);
          ctx.lineTo(topRightCorner.x, topRightCorner.y);
          ctx.lineTo(bottomRightCorner.x, bottomRightCorner.y);
          ctx.lineTo(bottomLeftCorner.x, bottomLeftCorner.y);
          ctx.closePath();
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#FEC400';
          ctx.stroke();

          // Handle the successful scan
          handleScanSuccess(code.data);
          return; // Exit the loop
        }
      }
    }
    // Continue the loop
    requestRef.current = requestAnimationFrame(scanLoop);
  }, []);

  // Function to start the camera and the scanning loop
  const startCamera = useCallback(async () => {
    try {
      setIsScanning(true);
      setShowCameraModal(true);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        SnackbarUtils.error('Camera access not supported in this browser');
        setIsScanning(false);
        return;
      }

      stopCameraStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        // Start the scanning loop once the video is playing
        requestRef.current = requestAnimationFrame(scanLoop);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      SnackbarUtils.error(
        'Could not access camera. Please check permissions and make sure you are using a secure connection (HTTPS).'
      );
      setIsScanning(false);
      setShowCameraModal(false);
    }
  }, [scanLoop, stopCameraStream]);

  // Handle successful scan
  const handleScanSuccess = (url: string) => {
    try {
      SnackbarUtils.success('QR Code scanned successfully');
      console.log('Scanned URL:', url);

      // Open the URL in a new tab
      if (url) {
        // Validate URL to make sure it's safe to open
        try {
          // Check if it's a valid URL format
          new URL(url);

          // Open in new tab
          window.open(url, '_blank', 'noopener,noreferrer');
        } catch (error) {
          console.error('Invalid URL format:', url, error);
          SnackbarUtils.warning('The QR code contains invalid URL format');
        }
      }

      // Close the camera modal
      handleClose();
    } catch (error) {
      console.error('Error processing QR code:', error);
      SnackbarUtils.error('Error processing QR code. Please try again.');
    }
  };

  // Close the modal and cleanup
  const handleClose = () => {
    setShowCameraModal(false);
    setIsScanning(false);
    stopCameraStream();
  };

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  return (
    <>
      <button
        className="inline-flex text-body items-center whitespace-nowrap gap-2 border border-[#FEC400] text-[#FEC400] px-6 py-3 rounded-2xl hover:bg-[#FEC400] hover:text-white transition-colors"
        onClick={startCamera}
        disabled={isScanning}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="currentColor">
          <path d="M7.75684 11.9998C7.75684 11.8009 7.83585 11.6102 7.97651 11.4695C8.11716 11.3289 8.30792 11.2498 8.50684 11.2498H11.9998V7.75684C11.9998 7.55792 12.0789 7.36716 12.2195 7.22651C12.3602 7.08585 12.5509 7.00684 12.7498 7.00684C12.9487 7.00684 13.1395 7.08585 13.2802 7.22651C13.4208 7.36716 13.4998 7.55792 13.4998 7.75684V11.2498H16.9928C17.1917 11.2498 17.3825 11.3289 17.5232 11.4695C17.6638 11.6102 17.7428 11.8009 17.7428 11.9998C17.7428 12.1987 17.6638 12.3895 17.5232 12.5302C17.3825 12.6708 17.1917 12.7498 16.9928 12.7498H13.4998V16.2428C13.4998 16.4417 13.4208 16.6325 13.2802 16.7732C13.1395 16.9138 12.9487 16.9928 12.7498 16.9928C12.5509 16.9928 12.3602 16.9138 12.2195 16.7732C12.0789 16.6325 11.9998 16.4417 11.9998 16.2428V12.7498H8.50684C8.30792 12.7498 8.11716 12.6708 7.97651 12.5302C7.83585 12.3895 7.75684 12.1987 7.75684 11.9998ZM8.06716 3.76856C11.1796 3.4235 14.3207 3.4235 17.4332 3.76856C19.2602 3.97256 20.7352 5.41156 20.9492 7.24856C21.3192 10.4056 21.3192 13.5946 20.9492 16.7516C20.7342 18.5886 19.2592 20.0266 17.4332 20.2316C14.3207 20.5766 11.1796 20.5766 8.06716 20.2316C6.24016 20.0266 4.76516 18.5886 4.55116 16.7516C4.18282 13.5946 4.18282 10.4055 4.55116 7.24856C4.76516 5.41156 6.24116 3.97256 8.06716 3.76856ZM17.2672 5.25856C14.265 4.92579 11.2353 4.92579 8.23316 5.25856C7.6774 5.32021 7.15866 5.56743 6.76074 5.96028C6.36281 6.35312 6.10895 6.86864 6.04016 7.42356C5.68449 10.4645 5.68449 13.5366 6.04016 16.5776C6.10916 17.1323 6.36312 17.6476 6.76102 18.0402C7.15892 18.4329 7.67755 18.6799 8.23316 18.7416C11.2102 19.0736 14.2902 19.0736 17.2672 18.7416C17.8226 18.6797 18.341 18.4326 18.7387 18.0399C19.1364 17.6473 19.3902 17.1321 19.4592 16.5776C19.8148 13.5366 19.8148 10.4645 19.4592 7.42356C19.39 6.86915 19.1361 6.35421 18.7384 5.96178C18.3407 5.56936 17.8224 5.32234 17.2672 5.26056" />
        </svg>
        <span>{isScanning ? 'Opening Camera...' : 'Add New Product'}</span>
      </button>

      {showCameraModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-11/12 max-w-md flex flex-col items-center gap-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-black">Point Camera at QR Code</h2>

            <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              {/* The canvas is overlaid on the video to draw the highlight box */}
              <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
            </div>

            <button
              onClick={handleClose}
              className="bg-gray-200 text-gray-800 px-8 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
