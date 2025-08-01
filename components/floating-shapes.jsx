import React, { useMemo } from 'react';

const FloatingShapes = () => {
  // Enhanced blob shapes configuration with more movement
  const shapes = [
    { 
      id: 1, 
      size: 'w-72 h-72', 
      position: 'top-20 left-10', 
      gradient: 'from-blue-500/30 via-purple-600/20 to-cyan-400/30',
      animation: 'animate-pulse'
    },
    { 
      id: 2, 
      size: 'w-96 h-96', 
      position: 'top-1/3 right-10', 
      gradient: 'from-cyan-400/25 via-blue-500/30 to-indigo-600/20',
      animation: 'animate-bounce-slow'
    },
    { 
      id: 3, 
      size: 'w-64 h-64', 
      position: 'bottom-20 left-1/4', 
      gradient: 'from-purple-500/30 via-pink-500/25 to-rose-400/30',
      animation: 'animate-float'
    },
    { 
      id: 4, 
      size: 'w-80 h-80', 
      position: 'bottom-1/3 right-1/4', 
      gradient: 'from-green-400/25 via-cyan-500/30 to-emerald-400/20',
      animation: 'animate-pulse-slow'
    },
  ];

  // Enhanced starscape with multiple star types
  const starCount = 150;
  const stars = useMemo(() => {
    const starTypes = [
      { className: 'animate-twinkle-fast', baseOpacity: 0.4, sizeRange: [1, 2] },
      { className: 'animate-twinkle', baseOpacity: 0.3, sizeRange: [1.5, 3] },
      { className: 'animate-twinkle-slow', baseOpacity: 0.5, sizeRange: [0.5, 1.5] },
      { className: 'animate-shimmer', baseOpacity: 0.6, sizeRange: [2, 4] },
    ];

    return Array.from({ length: starCount }).map((_, index) => {
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
        // Some stars get a subtle color tint
        color: Math.random() > 0.8 ? ['blue', 'purple', 'cyan', 'pink'][Math.floor(Math.random() * 4)] : null
      };
    });
  }, [starCount]);

  // Shooting stars for extra magic
  const shootingStars = useMemo(() => 
    Array.from({ length: 3 }).map((_, index) => ({
      id: `shooting-${index}`,
      delay: `${Math.random() * 10 + 5}s`,
      duration: `${Math.random() * 2 + 1}s`,
      startPosition: Math.random() > 0.5 ? 'top-0 right-0' : 'top-0 left-0',
    })), []);

  return (
    <>
      {/* Enhanced starscape background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {stars.map(({ id, top, left, size, delay, className, baseOpacity, color }) => (
          <div
            key={id}
            className={`absolute rounded-full ${className} ${
              color 
                ? `bg-${color}-400/40 dark:bg-${color}-300/50 shadow-${color}-400/20` 
                : 'bg-gray-400/30 dark:bg-white/40'
            }`}
            style={{
              width: size,
              height: size,
              top,
              left,
              animationDelay: delay,
              opacity: baseOpacity,
              boxShadow: color ? `0 0 8px rgba(var(--color-${color}-400), 0.3)` : undefined,
            }}
          />
        ))}
      </div>

      {/* Shooting stars layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-5">
        {shootingStars.map(({ id, delay, duration, startPosition }) => (
          <div
            key={id}
            className={`absolute ${startPosition} w-1 h-1 bg-white/80 rounded-full animate-shooting-star`}
            style={{
              animationDelay: delay,
              animationDuration: duration,
            }}
          />
        ))}
      </div>

      {/* Enhanced floating gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className={`absolute ${shape.size} ${shape.position} bg-gradient-to-r ${shape.gradient} rounded-full blur-3xl ${shape.animation}`}
            style={{
              filter: 'blur(60px)',
            }}
          />
        ))}
      </div>

      {/* Ambient light overlay for depth */}
      <div className="fixed inset-0 pointer-events-none z-15">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-500/5 to-purple-900/10 dark:from-transparent dark:via-cyan-400/5 dark:to-indigo-900/15 animate-pulse-very-slow" />
      </div>


    </>
  );
};

export default FloatingShapes;