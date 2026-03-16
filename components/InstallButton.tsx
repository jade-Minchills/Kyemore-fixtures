'use client';

import { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Detect iOS Safari
    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window.navigator as Navigator & { standalone?: boolean }).standalone;
    setIsIOS(ios);

    // Capture Android/Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Don't render if already installed (standalone mode) or dismissed
  if (hidden) return null;
  if (!installPrompt && !isIOS) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') setHidden(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        title="Add to Home Screen"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-xs font-semibold transition-colors flex-shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install</span>
      </button>

      {/* iOS instruction sheet */}
      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Add to Home Screen</h3>
              <button onClick={() => setShowIOSGuide(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 font-bold text-xs flex items-center justify-center">1</span>
                <span>Tap the <Share className="inline w-4 h-4 text-blue-500 mx-0.5" /> <strong>Share</strong> button at the bottom of your browser</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 font-bold text-xs flex items-center justify-center">2</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 font-bold text-xs flex items-center justify-center">3</span>
                <span>Tap <strong>"Add"</strong> to confirm</span>
              </li>
            </ol>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 bg-green-600 text-white font-semibold rounded-xl text-sm hover:bg-green-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
