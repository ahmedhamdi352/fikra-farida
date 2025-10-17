'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function QRCodePage() {
  const searchParams = useSearchParams();
  const qrCodeUrl = searchParams.get('url');
  const [isIOS, setIsIOS] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect iOS
    const ios = /iPhone|iPad|iPod/i.test(navigator.platform) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    setIsIOS(ios);

    // Handle PWA install prompt for Android
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleDownload = async () => {
    if (!qrCodeUrl) return;

    try {
      if (isIOS) {
        // For iOS: Open image in new tab for saving
        window.open(qrCodeUrl, '_blank');
        alert('To save the QR code:\n1. Long press on the image\n2. Tap "Add to Photos"');
      } else {
        // For Android and other devices: Direct download
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    }
  };

  const handleAddToHomeScreen = async () => {
    if (isIOS) {
      // For iOS devices
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>My QR Code</title>
            <link rel="apple-touch-icon" href="${qrCodeUrl}">
            <style>
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: black;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            <img src="${qrCodeUrl}" alt="QR Code">
          </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      alert('To add to home screen:\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Name your QR code and tap Add');
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } else if (deferredPrompt) {
      // For Android devices
      try {
        // Show the install prompt
        await deferredPrompt.prompt();
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Error showing PWA prompt:', error);
        // Fallback for Android if PWA prompt fails
        alert('To add to home screen:\n1. Tap the three dots menu (⋮)\n2. Select "Add to Home screen"\n3. Follow the prompts to add the QR code');
      }
    } else {
      // Fallback instructions for other browsers
      alert('To add to home screen:\n1. Open your browser menu\n2. Look for "Add to Home screen" or similar option\n3. Follow the prompts to add the QR code');
    }
  };

  if (!qrCodeUrl) {
    return <div>No QR code URL provided</div>;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl w-full max-w-md flex flex-col items-center gap-6">
        <div className="relative w-full aspect-square">
          <Image
            src={qrCodeUrl}
            alt="QR Code"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={handleDownload}
            className="w-full px-6 py-3 bg-[#FEC400] text-black font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {isIOS ? 'Save to Photos' : 'Download QR Code'}
          </button>

          <button
            onClick={handleAddToHomeScreen}
            className="w-full px-6 py-3 border-2 border-[#FEC400] text-[#FEC400] font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4" />
              <path d="M17 8l-5-5-5 5" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Add to Home Screen
          </button>
        </div>
      </div>
    </div>
  );
}
