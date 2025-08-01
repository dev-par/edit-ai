import React, { useMemo } from 'react';

const FloatingShapes = () => {
  // Enhanced blob shapes configuration with subtle movement
  const shapes = [
    {
      id: 1,
      size: 'w-[30rem] h-[30rem]', // New blob for upper left coverage
      position: 'top-[-2%] left-[12%]',
      gradient: 'from-indigo-400/15 via-violet-500/10 to-purple-400/15',
      animation: 'animate-drift-se'
    },
    { 
      id: 2, 
      size: 'w-[32rem] h-[32rem]', // Large blob far left
      position: 'top-[23%] left-[-8%]',
      gradient: 'from-blue-500/15 via-purple-600/10 to-cyan-400/15',
      animation: 'animate-drift-sw'
    },
    { 
      id: 3, 
      size: 'w-[24rem] h-[24rem]', // Medium blob top-right
      position: 'top-[-5%] right-[18%]',
      gradient: 'from-purple-500/20 via-pink-500/15 to-rose-400/20',
      animation: 'animate-drift-sw'
    },
    { 
      id: 4, 
      size: 'w-[38rem] h-[38rem]', // Largest blob bottom
      position: 'bottom-[-15%] left-[28%]',
      gradient: 'from-cyan-400/15 via-blue-500/10 to-indigo-600/15',
      animation: 'animate-drift-ne'
    },
    { 
      id: 5, 
      size: 'w-[28rem] h-[28rem]', // Medium-large blob right
      position: 'top-[35%] right-[-12%]',
      gradient: 'from-emerald-400/20 via-cyan-500/15 to-teal-400/20',
      animation: 'animate-drift-nw'
    },
    {
      id: 6,
      size: 'w-[20rem] h-[20rem]', // Smallest blob center-left
      position: 'top-[45%] left-[15%]',
      gradient: 'from-violet-500/15 via-fuchsia-500/10 to-purple-400/15',
      animation: 'animate-drift-ne'
    },
    {
      id: 7,
      size: 'w-[26rem] h-[26rem]', // Medium blob bottom-right
      position: 'bottom-[8%] right-[15%]',
      gradient: 'from-rose-400/20 via-orange-500/15 to-yellow-400/20',
      animation: 'animate-drift-sw'
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