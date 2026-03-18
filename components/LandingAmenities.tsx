'use client';

export function LandingAmenities() {
  const amenities = [
    {
      title: "Rugby Fields",
      description: "Full-sized, professionally maintained rugby pitch with spectator seating.",
      icon: (
        <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: "Soccer Fields",
      description: "High-quality grass fields suitable for senior and junior matches.",
      icon: (
        <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Clubhouse",
      description: "Social hub with changing rooms, bar facilities, and function rooms.",
      icon: (
        <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 bg-transparent border-t border-emerald-100/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-3">Ground Amenities</h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Provide Quality Sports Grounds</h3>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Our facilities are designed to support athletes at every level, providing a safe and professional environment for sports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {amenities.map((item, index) => (
            <div key={index} className="bg-white p-10 rounded-2xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-emerald-200/20 transition-all duration-300 border border-gray-100 group">
              <div className="mb-6 p-4 bg-emerald-50 rounded-xl inline-block group-hover:bg-gradient-to-br group-hover:from-[#10B981] group-hover:to-[#059669] transition-all duration-300">
                <div className="group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h4>
              <p className="text-gray-600 leading-relaxed mb-6 italic">
                "{item.description}"
              </p>
              <div className="flex items-center text-emerald-600 font-bold gap-2 cursor-pointer group-hover:translate-x-2 transition-transform">
                Details
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
