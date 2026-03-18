'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-strong py-3 shadow-md border-b border-gray-200/50' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Kylemore RFC Logo" 
              width={isScrolled ? 32 : 40} 
              height={isScrolled ? 32 : 40} 
              className="transition-all duration-300"
            />
            <span className={`font-bold text-lg md:text-xl tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              Kylemore Sports
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={`font-medium transition-colors hover:text-emerald-600 ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}>
              Home
            </Link>
            <Link href="#about" className={`font-medium transition-colors hover:text-emerald-600 ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}>
              About
            </Link>
            <Link href="/fixtures" className={`font-medium transition-colors hover:text-emerald-600 ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}>
              Fixtures
            </Link>
            <Link 
              href="/contact" 
              className={`px-5 py-2 rounded-full font-semibold transition-all shadow-lg ${
                isScrolled 
                  ? 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-emerald-500/20' 
                  : 'bg-white text-emerald-700 hover:bg-gray-50 shadow-black/10'
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 animate-slide-up-mobile">
            <div className="flex flex-col py-2 text-gray-800">
              <Link 
                href="/" 
                className="px-6 py-3 font-semibold hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/#about" 
                className="px-6 py-3 font-semibold hover:bg-emerald-50 hover:text-emerald-700 transition-colors border-t border-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/fixtures" 
                className="px-6 py-3 font-semibold hover:bg-emerald-50 hover:text-emerald-700 transition-colors border-t border-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Fixtures
              </Link>
              <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50">
                <Link 
                  href="/contact" 
                  className="block text-center w-full py-3 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
