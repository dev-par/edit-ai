"use client";
import React from 'react';

const PhotoMarquee = () => {
  // Sample photo data - you can replace these with actual edited photos
  const editedPhotos = [
    {
      id: 1,
      before: "/heroCarBefore.png",
      after: "/heroCarAfter.png",
      title: "Car Enhancement"
    },
    {
      id: 2,
      before: "/heroCarBefore.png", // Placeholder - replace with actual before images
      after: "/heroCarAfter.png",   // Placeholder - replace with actual after images
      title: "Color Correction"
    },
    {
      id: 3,
      before: "/heroCarBefore.png",
      after: "/heroCarAfter.png",
      title: "Background Removal"
    },
    {
      id: 4,
      before: "/heroCarBefore.png",
      after: "/heroCarAfter.png",
      title: "Image Enhancement"
    },
    {
      id: 5,
      before: "/heroCarBefore.png",
      after: "/heroCarAfter.png",
      title: "Professional Edit"
    },
    {
      id: 6,
      before: "/heroCarBefore.png",
      after: "/heroCarAfter.png",
      title: "Quality Boost"
    }
  ];

  // Duplicate the array to create seamless infinite scroll
  const duplicatedPhotos = [...editedPhotos, ...editedPhotos];

  return (
    <div className="w-full mt-16 overflow-hidden">
      <div className="relative">
        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
        
        {/* Scrolling container */}
        <div className="flex animate-marquee hover:pause-marquee">
          {duplicatedPhotos.map((photo, index) => (
            <div
              key={`${photo.id}-${index}`}
              className="flex-shrink-0 mx-4 group cursor-pointer"
            >
              {/* Photo container with hover effect */}
              <div className="relative w-80 h-56 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                {/* Before image (base layer) */}
                <img
                  src={photo.before}
                  alt={`${photo.title} - Before`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                  draggable={false}
                />
                
                {/* After image (revealed on hover) */}
                <img
                  src={photo.after}
                  alt={`${photo.title} - After`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  draggable={false}
                />
                
                {/* Overlay with title and labels */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg mb-2">{photo.title}</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                        Before
                      </span>
                      <span className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        After
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Hover indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Hover to see result
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Instruction text */}
      <div className="text-center mt-8">
        <p className="text-gray-400 text-sm">
          Hover over images to see the amazing transformations
        </p>
      </div>
    </div>
  );
};

export default PhotoMarquee;
