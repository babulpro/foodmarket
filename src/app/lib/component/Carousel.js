"use client"; // Required for Next.js if using hooks

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Optional arrows


const Carousel = ({images}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  // Auto-play configuration
  const delay = 5000; // 3 seconds per slide

  // Reset timer on component mount/unmount
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      nextSlide();
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
    
  
   return (
    <div className="relative w-full h-[300px] md:h-[630px] overflow-hidden rounded-lg shadow-lg">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={index} className="min-w-full h-full">
            <img
              src={img}
              alt={`Slide ${index}`}
              className="w-full m-auto h-[300px] md:h-[630px]  mt-16"
            />
          </div>
        ))}
      </div>

      {/* Optional Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Optional Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;