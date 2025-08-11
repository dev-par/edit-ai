"use client"

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="py-4 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center mb-3">
          <hr className="w-3/4 border-white/10" />
        </div>
        <div className="flex items-center justify-center">
          <p className="text-center text-muted-foreground">
            EditAI © 2025 | Built by <Link className='text-blue-500' href="https://www.linkedin.com/in/devanparekh/">Devan</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
