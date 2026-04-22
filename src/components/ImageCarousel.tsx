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
    <div className="relative w-full">
      <div className="relative h-80 w-full overflow-hidden rounded-lg">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Alcan team photo ${index + 1}`}
            loading="lazy"
            className={`absolute inset-0 h-full w-full rounded-lg object-cover transition-opacity duration-500 ease-in-out ${image === bigapple ? 'object-center' : 'object-top'} ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Dot indicators */}
      <div className="mt-4 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setCurrentImage(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentImage
                ? 'w-6 bg-primary'
                : 'w-2 bg-primary/30 hover:bg-primary/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
