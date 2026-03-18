import { LandingNav } from '@/components/LandingNav';
import { EventForm } from '@/components/EventForm';

export const metadata = {
  title: 'Contact & Add Event | Kylemore Sports Ground',
  description: 'Request to host an event at Kylemore Sports Ground.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* We reuse the LandingNav so the user can easily get back */}
      <div className="bg-emerald-900 pb-20">
        <LandingNav />
        
        {/* Simple header for the contact page */}
        <div className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Contact Us</h1>
          <p className="text-emerald-100/80 text-lg max-w-2xl mx-auto">
            Get in touch with the Kylemore Sports team or request a booking for your next sporting event.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">General Enquiries</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Head Office</p>
                    <p className="text-gray-900 font-semibold">+353 (0) 1 234 5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email Us</p>
                    <p className="text-gray-900 font-semibold">bookings@kylemore.ie</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Location</p>
                    <p className="text-gray-900 font-semibold">Kylemore Road<br/>Ballyfermot, Dublin 10</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-2xl shadow-xl text-white">
              <h3 className="text-xl font-bold mb-4">Want to see what's on?</h3>
              <p className="text-emerald-100 mb-6">Check our live fixtures page to see all upcoming amateur rugby and soccer matches.</p>
              <a href="/fixtures" className="inline-block px-6 py-3 bg-white text-emerald-800 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                View Fixtures
              </a>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2">
            <EventForm />
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>© 2026 Kylemore Sports Ground. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
