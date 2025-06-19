
import { useState, useEffect } from 'react';

const ImageCarousel = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    '/lovable-uploads/a5e0d31f-6652-4ac3-bf68-f4e3f5fb83f4.png',
    '/lovable-uploads/16149e13-26c1-464e-be7d-7b954163e027.png',
    '/lovable-uploads/cfb630e2-411f-4efd-bd9a-3d12c4c96d8d.png',
    '/lovable-uploads/eea2bad8-1521-4f21-974b-a1f5aa772b87.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Team photo ${index + 1}`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover object-top rounded-lg transition-opacity duration-400 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

export default ImageCarousel;
