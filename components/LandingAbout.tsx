'use client';

import Image from 'next/image';

export function LandingAbout() {
  return (
    <section id="about" className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-700" />
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-gray-50 transform hover:scale-[1.02] transition-transform duration-500">
              <Image 
                src="/photo-1.jpg" 
                alt="Kylemore Sports Ground" 
                width={800} 
                height={600} 
                className="w-full object-cover h-[400px] md:h-[500px]"
              />
              <div className="absolute inset-0 bg-emerald-900/10" />
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 rounded-full border border-emerald-100">
              About Our Grounds
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              15+ Years We Stood Up And Always Improved
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Kylemore Sports Ground has been the cornerstone of local competition since 2011. Our commitment to maintaining international-standard fields ensures that every player has the best surface to compete on, whether it's for rugby or soccer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                "Professional Maintenance",
                "Floodlit Training Areas",
                "Full-service Clubhouse",
                "Community Events",
                "Youth Development",
                "Safe Environment"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-800">{item}</span>
                </div>
              ))}
            </div>

            <button className="mt-10 px-8 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-emerald-500/30">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
