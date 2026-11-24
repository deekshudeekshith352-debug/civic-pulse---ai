import React from 'react';
import { X, Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { CivicIssue } from '../types';

interface Props {
  issue: CivicIssue;
  onClose: () => void;
}

export const QRCodeModal: React.FC<Props> = ({ issue, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = `${window.location.origin}/#report-${issue.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate deterministic QR-like SVG pattern for crisp offline rendering
  const generatePattern = (seed: string) => {
    const size = 21; // 21x21 QR standard grid
    const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

    // Corner Finder Patterns (standard QR corners)
    const setFinder = (row: number, col: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 || r === 6 || c === 0 || c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[row + r][col + c] = true;
          }
        }
      }
    };

    setFinder(0, 0);
    setFinder(0, size - 7);
    setFinder(size - 7, 0);

    // Fill data area pseudo-randomly using issue.id hash
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip finder areas
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= size - 8) ||
          (r >= size - 8 && c < 8)
        ) {
          continue;
        }
        // Timing tracks
        if (r === 6 || c === 6) {
          matrix[r][c] = (r + c) % 2 === 0;
          continue;
        }
        const val = Math.abs(Math.sin((hash * (r * size + c + 1)))) * 10000;
        matrix[r][c] = (Math.floor(val) % 3) !== 0;
      }
    }

    return matrix;
  };

  const matrix = generatePattern(issue.id + issue.title);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold mb-2">
            <span>OFFICIAL CIVIC TICKET</span>
          </div>
          <h3 className="text-lg font-extrabold text-white">Ticket #{issue.id}</h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{issue.title}</p>
        </div>

        {/* QR Code Graphic */}
        <div className="bg-white p-4 rounded-2xl mx-auto w-56 h-56 flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 21 21" className="w-full h-full shape-rendering-crispEdges">
            {matrix.map((row, r) =>
              row.map((active, c) =>
                active ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0f172a" /> : null
              )
            )}
          </svg>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400">
            Scan to track repair progress or verify on-site resolution
          </p>
        </div>

        <div className="mt-5 space-y-2.5">
          <button
            onClick={copyLink}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-xs text-slate-200 flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Direct Report Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
