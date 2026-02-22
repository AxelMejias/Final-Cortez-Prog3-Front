import { useState } from 'react';
import './ImageZoom.css';

export default function ImageZoom({ src, alt = 'Imagen', simpleHover = false }) {
  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
    setZoom(true);
  };

  const handleMouseLeave = () => {
    setZoom(false);
  };

  // Modo simple: solo hover zoom 2x
  if (simpleHover) {
    return (
      <div
        className="image-zoom-simple"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={src}
          alt={alt}
          className={`image-zoom-simple-img ${zoom ? 'zoomed' : ''}`}
          style={{
            transformOrigin: `${position.x}% ${position.y}%`,
          }}
        />
      </div>
    );
  }

  // Modo original (no se usa, pero lo dejo para compatibilidad)
  return (
    <div className="image-zoom-container">
      <div className="image-zoom-viewport">
        <img
          src={src}
          alt={alt}
          className="image-zoom-img"
          style={{
            cursor: 'zoom-in',
          }}
        />
      </div>
    </div>
  );
}
