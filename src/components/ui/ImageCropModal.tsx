'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File;
  onCropComplete: (croppedFile: File) => void;
  cropType?: 'profile' | 'cover';
}

type CropShape = 'circle' | 'square' | 'rectangle';

export default function ImageCropModal({ isOpen, onClose, imageFile, onCropComplete, cropType = 'profile' }: ImageCropModalProps) {
  const [mounted, setMounted] = useState(false);
  const [cropShape, setCropShape] = useState<CropShape>(cropType === 'profile' ? 'circle' : 'rectangle');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Create image URL from file
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      return () => {
        // Restore body scrolling when modal closes
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      };
    }
  }, [mounted, isOpen]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      const { width: displayWidth, height: displayHeight } = imageRef.current;

      setImageSize({ width: displayWidth, height: displayHeight });

      // Center the crop area with different dimensions based on crop type
      if (cropType === 'cover') {
        // For cover images, use a 3:1 aspect ratio
        const cropWidth = Math.min(displayWidth * 0.8, displayHeight * 2.5);
        const cropHeight = cropWidth / 3; // 3:1 aspect ratio for cover
        setCrop({
          x: (displayWidth - cropWidth) / 2,
          y: (displayHeight - cropHeight) / 2,
          width: cropWidth,
          height: cropHeight
        });
      } else {
        // For profile images, use square dimensions
        const cropSize = Math.min(displayWidth, displayHeight) * 0.6;
        setCrop({
          x: (displayWidth - cropSize) / 2,
          y: (displayHeight - cropSize) / 2,
          width: cropSize,
          height: cropSize
        });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({
      x: relativeX - crop.x,
      y: relativeY - crop.y
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    if (isDragging) {
      const newX = Math.max(0, Math.min(relativeX - dragStart.x, imageSize.width - crop.width));
      const newY = Math.max(0, Math.min(relativeY - dragStart.y, imageSize.height - crop.height));
      setCrop(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      // Calculate distance from crop center to mouse position
      const centerX = crop.x + crop.width / 2;
      const centerY = crop.y + crop.height / 2;

      const distanceX = Math.abs(relativeX - centerX);
      const distanceY = Math.abs(relativeY - centerY);

      if (cropType === 'cover' && cropShape === 'rectangle') {
        // For cover images, maintain 3:1 aspect ratio
        const newWidth = distanceX * 2;

        const minWidth = 150;
        const maxWidth = Math.min(imageSize.width, imageSize.height * 3);

        const finalWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
        const finalHeight = finalWidth / 3;

        // Adjust position to keep crop centered and within bounds
        const newX = Math.max(0, Math.min(centerX - finalWidth / 2, imageSize.width - finalWidth));
        const newY = Math.max(0, Math.min(centerY - finalHeight / 2, imageSize.height - finalHeight));

        setCrop({
          x: newX,
          y: newY,
          width: finalWidth,
          height: finalHeight
        });
      } else {
        // For profile images, maintain square aspect ratio
        const newRadius = Math.max(distanceX, distanceY);
        const newSize = newRadius * 2;

        const minSize = 50;
        const maxSize = Math.min(
          imageSize.width - Math.max(0, centerX - newRadius),
          imageSize.height - Math.max(0, centerY - newRadius),
          centerX + newRadius <= imageSize.width ? newSize : crop.width,
          centerY + newRadius <= imageSize.height ? newSize : crop.height
        );

        const finalSize = Math.max(minSize, Math.min(newSize, maxSize));
        const finalRadius = finalSize / 2;

        // Adjust position to keep crop centered and within bounds
        const newX = Math.max(0, Math.min(centerX - finalRadius, imageSize.width - finalSize));
        const newY = Math.max(0, Math.min(centerY - finalRadius, imageSize.height - finalSize));

        setCrop({
          x: newX,
          y: newY,
          width: finalSize,
          height: finalSize
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleCrop = async () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = imageRef.current;
    const { naturalWidth, naturalHeight } = image;
    const { width: displayWidth, height: displayHeight } = image;

    // Calculate scale factors
    const scaleX = naturalWidth / displayWidth;
    const scaleY = naturalHeight / displayHeight;

    // Set canvas size
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    // Draw the cropped image
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], imageFile.name, {
          type: imageFile.type,
          lastModified: Date.now()
        });
        onCropComplete(croppedFile);
        onClose();
      }
    }, imageFile.type, 0.9);
  };

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        style={{ 
          position: 'relative',
          transform: 'none',
          touchAction: 'none'
        }}
      >
        <div className="p-6 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[black]">
            Crop {cropType === 'profile' ? 'Profile' : 'Cover'} Image
          </h2>
          <button
            onClick={onClose}
            className="text-[black] hover:text-[black] text-2xl"
          >
            ×
          </button>
        </div>

        {/* Crop Shape Selection */}
        <div className="mb-4">
          <div className="flex gap-4">
            {cropType === 'profile' ? (
              // Profile image options: Circle and Square
              <>
                <button
                  onClick={() => setCropShape('circle')}
                  className={`px-4 py-2 rounded-lg border ${cropShape === 'circle'
                      ? 'bg-[var(--main-color1)] text-black border-[var(--main-color1)]'
                      : 'bg-white text-[black] border-gray-300'
                    }`}
                >
                  Circle
                </button>
                <button
                  onClick={() => setCropShape('square')}
                  className={`px-4 py-2 rounded-lg border ${cropShape === 'square'
                    ? 'bg-[var(--main-color1)] text-black border-[var(--main-color1)]'
                    : 'bg-white text-[black] border-gray-300'
                    }`}
                >
                  Square
                </button>
              </>
            ) : (
              // Cover image options: Rectangle and Square
              <>
                <button
                  onClick={() => setCropShape('rectangle')}
                  className={`px-4 py-2 rounded-lg border ${cropShape === 'rectangle'
                      ? 'bg-[var(--main-color1)] text-black border-[var(--main-color1)]'
                      : 'bg-white text-[black] border-gray-300'
                    }`}
                >
                  Rectangle (3:1)
                </button>

              </>
            )}
          </div>
        </div>

        {/* Image Crop Area */}
        <div className="relative mb-4 flex justify-center">
          <div
            className="relative inline-block"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              className="max-w-full max-h-96 object-contain"
              onLoad={handleImageLoad}
              draggable={false}
            />

            {/* Crop Overlay */}
            <div
              className="absolute border-2 border-[var(--main-color1)] cursor-move select-none"
              style={{
                left: crop.x,
                top: crop.y,
                width: crop.width,
                height: crop.height,
                borderRadius: cropShape === 'circle' ? '50%' : '0',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Size indicator */}
              <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                {Math.round(crop.width)}×{Math.round(crop.height)}
              </div>

              {/* Corner handles for resizing */}
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--main-color1)] border-2 border-white cursor-se-resize rounded-full hover:bg-opacity-80 transition-all"
                onMouseDown={handleResizeMouseDown}
              ></div>

              {/* Additional resize handles for better UX */}
              <div
                className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--main-color1)] border-2 border-white cursor-ne-resize rounded-full hover:bg-opacity-80 transition-all"
                onMouseDown={handleResizeMouseDown}
              ></div>
              <div
                className="absolute -bottom-1 -left-1 w-4 h-4 bg-[var(--main-color1)] border-2 border-white cursor-sw-resize rounded-full hover:bg-opacity-80 transition-all"
                onMouseDown={handleResizeMouseDown}
              ></div>
              <div
                className="absolute -top-1 -left-1 w-4 h-4 bg-[var(--main-color1)] border-2 border-white cursor-nw-resize rounded-full hover:bg-opacity-80 transition-all"
                onMouseDown={handleResizeMouseDown}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[black] border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="px-4 py-2 bg-[var(--main-color1)] text-black rounded-lg hover:opacity-90"
          >
            Crop & Save
          </button>
        </div>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
