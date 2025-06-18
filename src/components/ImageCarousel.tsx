
import { useState, useEffect } from 'react';

const ImageCarousel = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
          alt={`Team meeting ${index + 1}`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-400 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

export default ImageCarousel;
