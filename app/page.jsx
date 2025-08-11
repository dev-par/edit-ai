import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeroSection from "@/components/hero";
import FeaturesSection from "@/components/features";
import Pricing from "@/components/pricing";
import { MousePointerClick } from "lucide-react";

export default function Home() {
  return (
    <div id="top" className="pt-12 md:pt-20 lg:pt-12">
        {/* hero section */}
        <HeroSection />

        {/* features section */}
        <FeaturesSection />
        {/* pricing section */}
        <Pricing />

        
        <section className="py-12 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-5xl font-bold mb-6">
              Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Create Something Amazing?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators already using AI to transform their images and bring their vision to life.
            </p>
            <Link href="/dashboard">
                <Button variant="primary" size='xl'>
                <MousePointerClick className="mr-2" />
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
    </div>
  );
}