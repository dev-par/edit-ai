"use client";
import React, { useState, useRef } from 'react';

const BeforeAfterSlider = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!isDragging && e.type !== 'mousemove') return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderValue(percentage);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderValue(percentage);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderValue(percentage);
  };

  return (
    <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem] mx-auto mt-16 px-4">
      {/* Before/After Container */}
      <div className="relative overflow-hidden bg-gray-900 border border-gray-800">
        <div 
          ref={containerRef}
          className="relative cursor-col-resize select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={isDragging ? handleMouseMove : undefined}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Before Image - This sets the container height */}
          <img
            src={"/heroCarBefore.png"}
            alt="Before editing"
            className="w-full h-auto pointer-events-none block"
            draggable={false}
          />

          {/* After Image */}
          <div
            className="absolute top-0 left-0 w-full h-full overflow-hidden"
            style={{
              clipPath: `polygon(${sliderValue}% 0%, 100% 0%, 100% 100%, ${sliderValue}% 100%)`
            }}
          >
            <img
              src={"/heroCarAfter.png"}
              alt="After editing"
              className="w-full h-auto pointer-events-none"
              draggable={false}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
