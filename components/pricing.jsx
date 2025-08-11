"use client"

import React from 'react';
import { useIntersectionObserver } from '@/hooks/use-landing-hooks';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';


const PricingCard = ({ id, plan, price, features, buttonText, featured = false, planId }) => {

    const [ref, isVisible] = useIntersectionObserver(.4);
    const { has } = useAuth();

    const isCurrentPlan = id ? has?.({ plan: id }) : false;

    const handlePopup = async() => {
        if (isCurrentPlan) return;

        try {
            if (window.Clerk && window.Clerk.__internal_openCheckout) {
                await window.Clerk.__internal_openCheckout({
                    planId: planId,
                    planPeriod: 'month',
                    subscriberType: 'user',
                });
            }
        }
        catch (error){
            console.error('Error opening checkout:', error);
            toast.error('Failed to open checkout. Please try again.');
        }
    };

    return (
        <div
        ref={ref}
        className={`group transition-transform duration-300 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        } hover:scale-105 hover:-translate-y-1 cursor-pointer rounded-3xl overflow-hidden`}
        >
            <div className={`backdrop-blur-lg border transition-colors duration-200 rounded-3xl p-8 h-full relative flex flex-col ${
                featured 
                    ? 'bg-gradient-to-b from-blue-500/20 to-purple-600/20 border-blue-400/50 group-hover:border-blue-400/70' 
                    : 'bg-white/5 border-white/10 group-hover:border-white/30'
            }`}>

                <div className='text-center flex-1'>
                    <h3 className='text-2xl font-bold text-white mb-2'>{plan}</h3>
                    <div className='text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6'>${price}
                        <span className='text-lg text-gray-400'>/month</span>
                    </div>

                    <ul className='space-y-3'>
                        {features.map((feature, index) => (
                            <li key={index} className='flex items-center text-gray-300'>
                                <span className='text-green-400 mr-3'>✓</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='mt-8'>
                    <Button variant={featured ? 'primary' : 'glass'} 
                    className='w-full'
                    disabled={isCurrentPlan || !planId}
                    onClick={handlePopup}
                    >
                        {isCurrentPlan ? 'Current Plan' : buttonText}
                    </Button>
                </div>

            </div>
        </div>
    )
}

const Pricing = () => {
    const [headerRef, headerVisible] = useIntersectionObserver(.9);

    const plans = [
        {
          id: "free_user",
          plan: "Free",
          price: 0,
          features: [
            "3 projects maximum",
            "20 exports per month",
            "Basic crop & resize",
            "Color adjustments",
            "Text Tool",
          ],
          buttonText: "Get Started Free",
        },
        {
          id: "pro",
          plan: "Pro",
          price: 5,
          features: [
            "Unlimited exports",
            "All Editing Tools",
            "AI Background Remover",
            "AI Image Extender",
            "AI Retouch, Upscaler and more",
          ],
          featured: true,
          planId: "cplan_319X5oE0509K3wdiOnVz204GKcJ",
          buttonText: "Upgrade to Pro",
        },
      ];

  return (
    <section className='py-20' id='pricing'>
      <div className='max-w-6xl mx-auto px-6'>
        <div 
            ref={headerRef}
            className={`text-center mb-16 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            <h2 className="text-6xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 leading-tight pb-1">
            Pricing
            </h2>
            <p className="text-xl text-muted-foreground mx-auto">
            Start free and upgrade when you need more power. No hidden fees, cancel whenever.
            </p>     
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            {plans.map((plan, index) => (
                <PricingCard key={index} {...plan} />
            ))}
        </div>

      </div>
    </section>
  )
}

export default Pricing