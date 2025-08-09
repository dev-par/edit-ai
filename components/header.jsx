'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { BarLoader } from 'react-spinners'
import { useStoreUser } from '@/hooks/use-store-user'
import { Unauthenticated, Authenticated } from "convex/react"
import { LayoutDashboardIcon } from 'lucide-react'

const Header = () => {
  const path = usePathname();
  const { isLoading, isAuthenticated } = useStoreUser();

  if (path.includes("/editor")) {
    return null;
  }

  return (
    <header className='fixed top-6 left-1/2 transform -translate-x-1/2 z-50 text-nowrap'>
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-8 py-3 flex items-center justify-between gap-8">
            <Link href="/" className="mr-10 md:mr-20">
                <Image
                    src="/EditAIHomeLogo.png"
                    alt="EditAI Logo"
                    className="min-w-24 object-cover"
                    width={96}
                    height={24}
                />
            </Link>

            {path === "/" && (
              <div className='hidden md:flex space-x-6'>
                <Link href="#features"
                className='text-white font-medium transition-all duration-300 hover:text-cyan-400 cursor-pointer'>
                  Features
                </Link>
                <Link href="#pricing"
                className='text-white font-medium transition-all duration-300 hover:text-cyan-400 cursor-pointer'>
                  Pricing
                </Link>
                <Link href="#contact"
                className='text-white font-medium transition-all duration-300 hover:text-cyan-400 cursor-pointer'>
                  Contact
                </Link>
              </div>
            )}

            <div className='flex items-center gap-3 ml-10 md:ml-20'>
            <Unauthenticated>
              <SignInButton>
                <Button variant="glass">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button variant="primary">Sign Up</Button>
              </SignUpButton>
            </Unauthenticated>
            <Authenticated>

              <Link href="/dashboard">
                <Button variant="glass">
                  <LayoutDashboardIcon className='w-4 h-4' />
                  <span className='hidden md:flex'>Dashboard</span>
                </Button>
              </Link>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  }
                }}
              />
            </Authenticated>
            </div>

            {isLoading && (
            <div className='fixed bottom-0 left-0 w-full z-40 flex justify-center'>
              <BarLoader width={'95%'} color='#06b6d4'/>
            </div>
            )}
        </div>
    </header>
  )
}

export default Header