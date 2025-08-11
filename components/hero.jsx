"use client"

import React, { useEffect } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import BeforeAfterSlider from './before-after-slider'


const HeroSection = () => {

    const [textVisible, setTextVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setTextVisible(true)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

  return (
    <section className='min-h-screen flex items-center justify-center relative overflow-hidden'>
     <div className='text-center z-10 px-6'>
        <div className={`transition-all duration-1000 ${textVisible ? 'opacity-100 translate-y-0' : "opacity-0 translate-y-10"}`}>
            <h1 className='text-6xl md:text-9xl font-black mb-5 tracking-tight'>
                <span className="text-white">Edit Beyond</span>
                <br/>
                <span className='bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse'>Reality</span>
            </h1>
            <p className='text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed'>
            Professional image editing powered by AI. Crop, resize, adjust colors, remove backgrounds, and enhance your images with cutting-edge technology.
            </p>

            <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-12'>
                <Link href="/dashboard">
                    <Button variant="primary" size='xl'>
                        Get Started
                    </Button>
                </Link>
            </div>
        </div>
        
        {/* Demo Section */}
        <div 
            className={`transition-all duration-1000 ${textVisible ? 'opacity-100 translate-y-0' : "opacity-0 translate-y-20"}`}>
        <BeforeAfterSlider />
        </div>
     </div>
    </section>
  )
}

export default HeroSection