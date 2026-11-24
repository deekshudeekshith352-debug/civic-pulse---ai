import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  className?: string;
  label?: string;
}

export const PWAInstallButton: React.FC<Props> = ({ className = '', label = 'Install App' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 transition active:scale-95 cursor-pointer ${className}`}
        aria-label="Install Praja Voice AI PWA"
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span>{label}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-950/40 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-900/50 transition cursor-pointer ${className}`}
          aria-label="Install PWA on iOS Safari"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iOS Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Install Praja Voice AI</h3>
                  <p className="text-xs text-slate-400">Add to iPhone / iPad Home Screen</p>
                </div>
              </div>
              <ol className="space-y-3 text-xs text-slate-300 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 mb-4">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sky-400">1.</span>
                  <span>Tap the <strong>Share</strong> button (box with upward arrow) in the Safari toolbar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sky-400">2.</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sky-400">3.</span>
                  <span>Enjoy instant one-tap camera reporting with offline sync!</span>
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
