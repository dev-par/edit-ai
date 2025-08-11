"use client";

import { Brain, Cpu, Paintbrush, Scissors, Sparkles, Wand2 } from 'lucide-react';
import React from 'react'
import { useIntersectionObserver } from '@/hooks/use-landing-hooks';

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`group transition-all duration-500 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } hover:scale-105`}
      style={{ transitionDelay: `${delay * 300}ms` }}
    >
      <div className="backdrop-blur-lg border border-white/10 bg-white/5 transition-colors duration-200 hover:bg-white/10 hover:border-white/20 rounded-2xl p-8 h-full relative">
        <div className="inline-block mb-6">
          <Icon className="w-12 h-12 transition-transform duration-200 group-hover:scale-105" style={{ color: '#6565ff' }} />
        </div>

        <h3 className="text-xl font-semibold mb-4 text-foreground transition-all duration-200 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-500 group-hover:to-pink-500">
          {title}
        </h3>

        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Hover glow effect */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, hsl(240 100% 70% / 0.1), transparent 70%)',
          }}
        />
      </div>
    </div>
  );
};


const FeaturesSection = () => {
    const [headerRef, headerVisible] = useIntersectionObserver(0.1);
    const features = [
        {
          icon: Scissors,
          title: "Smart Crop & Resize",
          description:
            "Interactive cropping with aspect ratio constraints and intelligent resizing that preserves image quality across any dimension.",
        },
        {
          icon: Paintbrush,
          title: "Color & Light Adjustment",
          description:
            "Professional-grade brightness, contrast, saturation controls with real-time preview and auto-enhance capabilities.",
        },
        {
          icon: Brain,
          title: "AI Background Removal",
          description:
            "Remove or replace backgrounds instantly using advanced AI that detects complex edges and fine details with precision.",
        },
        {
          icon: Sparkles,
          title: "AI Content Editor",
          description:
            "Edit images with natural language prompts. Remove objects, change elements, or add new content using generative AI.",
        },
        {
          icon: Wand2,
          title: "Image Extender",
          description:
            "Expand your canvas in any direction with AI-powered generative fill that seamlessly blends new content with existing images.",
        },
        {
          icon: Cpu,
          title: "AI Upscaler",
          description:
            "Enhance image resolution up to 4x using AI upscaling technology that preserves details and reduces artifacts.",
        },
      ];


  return (
    <section id="features" className="py-5 relative">


    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div 
        ref={headerRef}
        className={`text-center mb-16 transition-all duration-700 ease-out ${
          headerVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
          Unleash Creative Power
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience the next evolution of image editing with AI capabilities that understand your creative intent
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} delay={index * 0.1} />
        ))}
      </div>
    </div>
  </section>
  )
}

export default FeaturesSection