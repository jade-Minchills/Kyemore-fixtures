'use client';

import Link from 'next/link';

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(6, 78, 59, 0.75), rgba(2, 44, 34, 0.9)), url("/hero.jpg")' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f0fdf4]/50" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-emerald-100 uppercase bg-emerald-500/30 rounded-full backdrop-blur-sm border border-emerald-400/30">
          Official Sports Ground
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          International <br /> 
          <span className="gradient-text">Standard</span> Sports Fields
        </h1>
        
        <p className="text-xl md:text-2xl text-emerald-50/90 mb-10 max-w-3xl mx-auto leading-relaxed">
          The heart of rugby and soccer in the community. Experience world-class facilities at Kylemore Sports Ground.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/fixtures" 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold rounded-xl transition-all shadow-xl shadow-emerald-500/30 transform hover:-translate-y-1 text-lg"
          >
            View Match Fixtures
          </Link>
          <Link 
            href="/contact" 
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/30 backdrop-blur-md transform hover:-translate-y-1 text-lg"
          >
            Add an Event
          </Link>
        </div>
      </div>
    </section>
  );
}
