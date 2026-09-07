import React, { useState, useEffect } from 'react';
import { Blurhash } from 'react-blurhash';
import './BlurHashImage.css';

// A simple generic blurhash string for placeholders
const DEFAULT_BLURHASH = 'L46*|{E100oM9]a#~qt700R*~qj[';

export default function BlurHashImage({ src, alt, className, blurhash = DEFAULT_BLURHASH }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.src = src;
  }, [src]);

  return (
    <div className={`blurhash-container ${className || ''}`}>
      {!imageLoaded && (
        <Blurhash
          hash={blurhash}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
          className="blurhash-canvas"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`actual-image ${imageLoaded ? 'loaded' : ''}`}
      />
    </div>
  );
}
