import { useState, useEffect } from 'react';

interface ImageState {
  src: string;
  loaded: boolean;
  error: boolean;
}

export const useDynamicImage = (imagePath: string, fallbackImage?: string) => {
  const [imageState, setImageState] = useState<ImageState>({
    src: fallbackImage || '/placeholder-product.svg',
    loaded: false,
    error: false
  });

  useEffect(() => {
    if (!imagePath) return;

    const img = new Image();

    const handleLoad = () => {
      setImageState({
        src: imagePath,
        loaded: true,
        error: false
      });
    };

    const handleError = () => {
      setImageState({
        src: fallbackImage || '/placeholder-product.jpg',
        loaded: true,
        error: true
      });
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = imagePath;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [imagePath, fallbackImage]);

  return imageState;
};