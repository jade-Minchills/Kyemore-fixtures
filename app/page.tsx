import { LandingNav } from '@/components/LandingNav';
import { LandingHero } from '@/components/LandingHero';
import { LandingAbout } from '@/components/LandingAbout';
import { LandingAmenities } from '@/components/LandingAmenities';

export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingNav />
      <LandingHero />
      <LandingAbout />
      <LandingAmenities />
      
      {/* Simple Footer */}
      <footer className="bg-emerald-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white p-1 rounded-full">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight">Kylemore Sports</span>
            </div>
            
            <div className="flex gap-8 text-emerald-100/70 font-medium">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>

            <div className="text-emerald-100/50 text-sm">
              © 2026 Kylemore Sports Ground. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}