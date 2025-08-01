import React, { useMemo } from 'react';

const FloatingShapes = () => {
  // Enhanced blob shapes configuration with subtle movement
  const shapes = [
    { 
      id: 1, 
      size: 'w-72 h-72', 
      position: 'top-8 left-8', // Top left
      gradient: 'from-blue-500/30 via-purple-600/20 to-cyan-400/30',
      animation: 'animate-drift-ne'
    },
    { 
      id: 2, 
      size: 'w-64 h-64', 
      position: 'top-12 right-12', // Top right
      gradient: 'from-cyan-400/25 via-blue-500/30 to-indigo-600/20',
      animation: 'animate-drift-sw'
    },
    { 
      id: 3, 
      size: 'w-96 h-96', 
      position: 'bottom-16 left-16', // Bottom left
      gradient: 'from-purple-500/30 via-pink-500/25 to-rose-400/30',
      animation: 'animate-drift-se'
    },
    { 
      id: 4, 
      size: 'w-80 h-80', 
      position: 'bottom-20 right-20', // Bottom right
      gradient: 'from-green-400/25 via-cyan-500/30 to-emerald-400/20',
      animation: 'animate-drift-nw'
    },
    { 
      id: 5, 
      size: 'w-60 h-60', 
      position: 'top-1/4 left-1/2', // Upper center
      gradient: 'from-yellow-400/20 via-pink-400/20 to-purple-400/20',
      animation: 'animate-orbit'
    },
  ];

  // Enhanced starscape with multiple star types
  const starCount = 500;
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

      {/* Enhanced floating gradient blobs with subtle movement */}
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