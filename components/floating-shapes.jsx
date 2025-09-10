"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { useParallax } from '@/hooks/use-parallax';
import { isMobile, isTablet } from 'react-device-detect';

const FloatingShapes = () => {
  const scrollY = useParallax();

  const [stars, setStars] = useState([])
  const starCount = 500;
  // Enhanced blob shapes configuration with subtle movement
  const shapes = [
    {
      id: 1,
      size: 'w-[30rem] h-[30rem]', // New blob for upper left coverage
      position: 'top-[-2%] left-[12%]',
      gradient: 'from-indigo-400/30 via-violet-500/25 to-purple-400/30',
      animation: 'animate-drift-se'
    },
    { 
      id: 2, 
      size: 'w-[32rem] h-[32rem]', // Large blob far left
      position: 'top-[23%] left-[-8%]',
      gradient: 'from-blue-500/30 via-purple-600/25 to-cyan-400/30',
      animation: 'animate-drift-sw'
    },
    { 
      id: 3, 
      size: 'w-[24rem] h-[24rem]', // Medium blob top-right
      position: 'top-[-5%] right-[18%]',
      gradient: 'from-purple-500/35 via-pink-500/30 to-rose-400/35',
      animation: 'animate-drift-sw'
    },
    { 
      id: 4, 
      size: 'w-[38rem] h-[38rem]', // Largest blob bottom
      position: 'bottom-[-15%] left-[28%]',
      gradient: 'from-cyan-400/30 via-blue-500/25 to-indigo-600/30',
      animation: 'animate-drift-ne'
    },
    { 
      id: 5, 
      size: 'w-[28rem] h-[28rem]', // Medium-large blob right
      position: 'top-[35%] right-[-12%]',
      gradient: 'from-emerald-400/35 via-cyan-500/30 to-teal-400/35',
      animation: 'animate-drift-nw'
    },
    {
      id: 6,
      size: 'w-[20rem] h-[20rem]', // Smallest blob center-left
      position: 'top-[45%] left-[15%]',
      gradient: 'from-violet-500/30 via-fuchsia-500/25 to-purple-400/30',
      animation: 'animate-drift-ne'
    },
    {
      id: 7,
      size: 'w-[26rem] h-[26rem]', // Medium blob bottom-right
      position: 'bottom-[8%] right-[15%]',
      gradient: 'from-rose-400/35 via-orange-500/30 to-yellow-400/35',
      animation: 'animate-drift-sw'
    },
  ];

  // Enhanced starscape with multiple star types
  useEffect(() => {

    if (isMobile || isTablet) {
      return; // Skip rendering on mobile/tablet for performance
    }

    const starTypes = [
      { className: 'animate-twinkle-fast', baseOpacity: 0.4, sizeRange: [1, 2] },
      { className: 'animate-twinkle', baseOpacity: 0.3, sizeRange: [1.5, 3] },
      { className: 'animate-twinkle-slow', baseOpacity: 0.5, sizeRange: [0.5, 1.5] },
      { className: 'animate-shimmer', baseOpacity: 0.6, sizeRange: [2, 4] },
    ];
    const colors = ['blue', 'purple', 'cyan', 'pink'];
    const generatedStars = Array.from({ length: starCount }).map((_, index) => {
      const starType = starTypes[Math.floor(Math.random() * starTypes.length)];
      const size = Math.random() * (starType.sizeRange[1] - starType.sizeRange[0]) + starType.sizeRange[0];
      return {
        id: `star-${index}`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${size}px`,
        delay: `${Math.random() * 8}s`,
        className: starType.className,
        baseOpacity: starType.baseOpacity,
        color: Math.random() > 0.8 ? colors[Math.floor(Math.random() * colors.length)] : null
      };
    });
    setStars(generatedStars);
  }, []);

  return (
    <>
      {/* Enhanced starscape background */}
      {!(isMobile || isTablet) && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

        {stars.map(star => (
          <div
            key={star.id}
            className={`star ${star.className} ${star.color ? `star-${star.color}` : ""}`}
            style={{
              position: "absolute",
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.baseOpacity,
              animationDelay: star.delay,
              borderRadius: "50%",
              background: star.color || "white",
            }}
          />    
        ))}
        </div>
      )}

      {/* Enhanced floating gradient blobs with subtle movement */}
      {!(isMobile || isTablet) && (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className={`absolute ${shape.size} ${shape.position} bg-gradient-to-r ${shape.gradient} rounded-full blur-3xl`}
                          style={{
                filter: 'blur(60px)',
                transform: `translateY(${scrollY * .6}px) rotate(${scrollY * -0.1}deg)`,
                opacity: Math.max(0, 1 - (scrollY * 0.001))
              }}
          />
        ))}
      </div>
      )}
    </>
  );
};

export default FloatingShapes;