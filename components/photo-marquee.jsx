"use client";
import React from 'react';

const PhotoMarquee = () => {
  // Sample photo data - you can replace these with actual edited photos
  const editedPhotos = [
    {
      id: 1,
      before: "/heroCarBefore.png",
      title: "Car Enhancement"
    },
    {
      id: 2,
      before: "/stepGarden.png", // Placeholder - replace with actual before images
      title: "Color Correction"
    },
    {
      id: 3,
      before: "/laptopSetup.png",
      title: "Background Removal"
    },
    {
      id: 4,
      before: "/mountianPhoto.png",
      title: "Image Enhancement"
    },
    {
      id: 5,
      before: "/coolCar.png",
      title: "Professional Edit"
    },
    {
      id: 6,
      before: "/bowlOfStrawberries.png",
      title: "Quality Boost"
    }
  ];

  // Duplicate the array to create seamless infinite scroll
  const duplicatedPhotos = [...editedPhotos, ...editedPhotos];

  return (
    <div className="w-full overflow-hidden">
      <div className="relative">
        
        {/* Scrolling container */}
        <div className="flex animate-marquee">
          {duplicatedPhotos.map((photo, index) => (
            <div
              key={`${photo.id}-${index}`}
              className="flex-shrink-0 mx-4"
            >
              {/* Photo container */}
              <div className="relative w-88 h-60 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-lg">
                {/* Before image (base layer) */}
                <img
                  src={photo.before}
                  alt={`${photo.title} - Before`}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
                
                {/* After image */}
                <img
                  src={photo.after}
                  alt={`${photo.title} - After`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0"
                  draggable={false}
                />
                

                

              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default PhotoMarquee;
