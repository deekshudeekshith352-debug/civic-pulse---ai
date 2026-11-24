import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, Building, Award, CheckCircle2, ChevronRight, BarChart3, Search } from 'lucide-react';
import { WARDS_DATA } from '../data/seedReports';
import { CivicIssue } from '../types';

interface Props {
  issues: CivicIssue[];
  onSelectWardFilter: (wardName: string) => void;
}

const WARD_PHOTOS: Record<string, string> = {
  'Ward 12': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&auto=format&fit=crop&q=80', // Indiranagar 100ft road
  'Ward 45': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=500&auto=format&fit=crop&q=80', // Koramangala 80ft road
  'Ward 84': 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=80', // HSR Layout
  'Ward 14': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&auto=format&fit=crop&q=80', // MG Road Vidhana Soudha
  'Ward 78': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80', // Whitefield Tech Corridor
  'Ward 112': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80', // Malleshwaram West
  'Ward 56': 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500&auto=format&fit=crop&q=80', // Bellandur Lake Ring Road
  'Ward 102': 'https://images.unsplash.com/photo-1578637387939-43c525550085?w=500&auto=format&fit=crop&q=80', // Jayanagar 4th Block
};

export const TransparencyPortal: React.FC<Props> = ({ issues, onSelectWardFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const cityAverageScore = Math.round(
    WARDS_DATA.reduce((acc, curr) => acc + curr.healthScore, 0) / WARDS_DATA.length
  );

  const filteredWards = WARDS_DATA.filter((w) =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.ward.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Citywide Health Index Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/60 to-slate-900 border border-sky-500/30 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>OPEN MUNICIPAL TRANSPARENCY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Bengaluru Ward Health Index
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Real-time infrastructure health computed from 60+ verified field audits, resolution velocity, and citizen satisfaction ratings.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center p-4 rounded-2xl bg-slate-900/90 border border-sky-500/40 shadow-lg">
            <div className="text-3xl font-black text-sky-400">{cityAverageScore}/100</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Metropolitan Score</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-lg">
            <div className="text-3xl font-black text-emerald-400">91.4%</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">SLA Compliance</div>
          </div>
        </div>
      </div>

      {/* Ward Leaderboards & Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-white">Bengaluru Wards Infrastructure Ranking</h3>
            <p className="text-xs text-slate-400">Compare response times, pending hazards, and civic score per ward</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by ward or neighborhood..."
              className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWards.map((w, idx) => (
            <div
              key={w.ward}
              className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:border-sky-500/50 transition shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <img
                  src={WARD_PHOTOS[w.ward] || 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500'}
                  alt={w.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{w.ward}</span>
                        <span className="text-xs text-slate-300 font-semibold truncate">{w.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Dominant defect: <strong className="text-sky-300">{w.topCategory}</strong>
                      </div>
                    </div>

                    <div className={`text-sm font-black px-2.5 py-1 rounded-xl shrink-0 ${
                      w.healthScore >= 85
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {w.healthScore} / 100
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${w.healthScore >= 85 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${w.healthScore}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-slate-700/50">
                <div>
                  <div className="text-[10px] text-slate-400">Active Issues</div>
                  <div className="font-bold text-white mt-0.5">{w.activeIssues}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Resolved (30d)</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{w.resolvedThisMonth}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Avg Resolution</div>
                  <div className="font-bold text-sky-400 mt-0.5">{w.avgResolutionHours}h</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
                <span>Nodal Officer: <strong className="text-slate-200">{w.nodalOfficer}</strong></span>
                <span>Corporator: <strong className="text-sky-300">{w.corporatorName}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
