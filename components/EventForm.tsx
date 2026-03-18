'use client';

import { useState } from 'react';
import { submitEvent } from '@/app/contact/actions';
import { useRouter } from 'next/navigation';

export function EventForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleAction(formData: FormData) {
    setIsPending(true);
    setMessage(null);

    const result = await submitEvent(formData);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Event submitted successfully!' });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
    
    setIsPending(false);
  }

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-3">Host an Event</h2>
        <p className="text-gray-500">Fill out the details below to schedule an event at Kylemore Sports Ground.</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg font-medium flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {message.text}
        </div>
      )}

      <form action={handleAction} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Event Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none bg-gray-50/50 hover:bg-white"
            placeholder="e.g., Annual Rugby 7s Tournament"
          />
        </div>

        <div>
          <label htmlFor="venue" className="block text-sm font-bold text-gray-700 mb-2">Venue *</label>
          <div className="relative">
            <select
              id="venue"
              name="venue"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none bg-gray-50/50 hover:bg-white appearance-none"
            >
              <option value="">Select a venue...</option>
              <option value="Rugby Field">Rugby Field</option>
              <option value="Soccer Field">Soccer Field</option>
              <option value="Clubhouse">Clubhouse</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="start_datetime" className="block text-sm font-bold text-gray-700 mb-2">Start Time *</label>
            <input
              type="datetime-local"
              id="start_datetime"
              name="start_datetime"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none bg-gray-50/50 hover:bg-white"
            />
          </div>
          <div>
            <label htmlFor="end_datetime" className="block text-sm font-bold text-gray-700 mb-2">End Time *</label>
            <input
              type="datetime-local"
              id="end_datetime"
              name="end_datetime"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none bg-gray-50/50 hover:bg-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Additional Details (Optional)</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none bg-gray-50/50 hover:bg-white resize-none"
            placeholder="Tell us about expected attendance, special requirements, etc."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none flex justify-center items-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Event Request'
          )}
        </button>
      </form>
    </div>
  );
}
