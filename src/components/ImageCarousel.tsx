import { useState, useEffect } from 'react';
import alcan from '@/assets/carousel/Alcan.jpg';
import manor from '@/assets/carousel/Manor.jpg';
import steiner from '@/assets/carousel/Steiner.jpg';
import bigapple from '@/assets/carousel/Bigapple.jpg';
import ktttx from '@/assets/carousel/KTTTX.jpg';
import kttmi from '@/assets/carousel/KTTMI.jpg';
import sprout from '@/assets/carousel/SproutTeam.jpg';

const ImageCarousel = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [alcan, manor, steiner, bigapple, ktttx, kttmi, sprout];

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
          alt={`Alcan team photo ${index + 1}`}
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
