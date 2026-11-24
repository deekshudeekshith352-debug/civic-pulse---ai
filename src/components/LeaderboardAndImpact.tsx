import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Flame,
  Share2,
  Download,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Star,
  User,
  ArrowUpRight
} from 'lucide-react';
import { UserProfile, WardMetric } from '../types';
import { WARDS_DATA } from '../data/seedReports';

interface Props {
  userProfile: UserProfile;
}

export const LeaderboardAndImpact: React.FC<Props> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'card'>('leaderboard');
  const [copied, setCopied] = useState(false);

  // Top citizen champions leaderboard
  const topCitizens = [
    { rank: 1, name: 'Ananya Rao', ward: 'Ward 12 (Indiranagar)', points: 1450, reports: 24, badge: 'Civic Champion' },
    { rank: 2, name: 'Vikram Sundaram', ward: 'Ward 84 (HSR Layout)', points: 1220, reports: 19, badge: 'Pothole Patrol' },
    { rank: 3, name: 'Priya Sharma (You)', ward: 'Ward 12 (Indiranagar)', points: userProfile.points, reports: userProfile.reportsSubmitted, badge: 'First Responder' },
    { rank: 4, name: 'Karthik Raja', ward: 'Ward 45 (Koramangala)', points: 790, reports: 14, badge: 'Green Guardian' },
    { rank: 5, name: 'Deepa Nair', ward: 'Ward 102 (Jayanagar)', points: 640, reports: 11, badge: 'Ward Sentinel' },
  ];

  const handleShareCard = () => {
    navigator.clipboard.writeText(`I've earned ${userProfile.points} Swachh Civic Points on Praja Voice AI helping resolve ${userProfile.reportsResolved} civic issues in Ward 12 Indiranagar, BBMP Bengaluru!`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`🏛️ *Praja Voice AI - Citizen Impact Passport*\nI've earned *${userProfile.points} Swachh Points* and helped resolve *${userProfile.reportsResolved} civic issues* in Bengaluru Ward 12!\nCheck your neighborhood health score: ${window.location.origin}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex justify-center">
        <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex text-xs font-bold shadow-lg">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'leaderboard' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Swachh Leaderboard & Badges</span>
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'card' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Citizen Impact Passport</span>
          </button>
        </div>
      </div>

      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* User Scorecard Banner */}
          <div className="bg-gradient-to-r from-sky-900/60 via-slate-900 to-indigo-950/60 border border-sky-500/30 p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 p-0.5 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/30">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  PS
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">{userProfile.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    Rank #3 Bengaluru
                  </span>
                </div>
                <p className="text-xs text-slate-400">Ward 12 Indiranagar (BBMP East Zone)</p>
                <div className="flex items-center gap-3 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {userProfile.points} Swachh Pts
                  </span>
                  <span className="flex items-center gap-1 text-orange-400 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    {userProfile.streakDays}-Day Streak
                  </span>
                  <span className="text-emerald-400 font-bold">
                    ✓ {userProfile.reportsResolved} Resolved
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('card')}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-500/20"
            >
              <span>View Impact Card</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Badges Carousel */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Earned Civic & Swachh Badges</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {userProfile.badges.map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl flex flex-col items-center text-center space-y-1.5 hover:border-amber-400/50 transition group"
                >
                  <div className="text-2xl group-hover:scale-110 transition">{b.icon}</div>
                  <h5 className="font-bold text-xs text-white">{b.name}</h5>
                  <p className="text-[10px] text-slate-400 leading-tight">{b.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h4 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Bengaluru Ward Champions Leaderboard</span>
            </h4>

            <div className="divide-y divide-slate-800">
              {topCitizens.map((citizen) => (
                <div
                  key={citizen.rank}
                  className={`py-3.5 px-3 rounded-2xl flex items-center justify-between gap-3 transition ${
                    citizen.name.includes('(You)') ? 'bg-sky-950/40 border border-sky-800/50' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                      citizen.rank === 1
                        ? 'bg-amber-400 text-slate-900'
                        : citizen.rank === 2
                        ? 'bg-slate-300 text-slate-900'
                        : citizen.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {citizen.rank}
                    </span>
                    <div>
                      <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                        {citizen.name}
                        <span className="text-[10px] text-sky-400 font-semibold px-2 py-0.2 bg-slate-800 rounded-full">
                          {citizen.badge}
                        </span>
                      </h5>
                      <span className="text-[11px] text-slate-400">{citizen.ward}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-xs text-amber-400">{citizen.points} pts</div>
                    <div className="text-[10px] text-slate-400">{citizen.reports} reports</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shareable Impact Card */}
      {activeTab === 'card' && (
        <div className="max-w-md mx-auto space-y-4">
          <div className="relative rounded-3xl border border-sky-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-sky-950 p-6 shadow-2xl overflow-hidden text-slate-100">
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center font-black text-white text-xs">
                  PV
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Praja Voice AI</h4>
                  <p className="text-[10px] text-sky-400 font-semibold">SWACHH CITIZEN PASSPORT</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">BBMP VERIFIED</span>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Total Swachh Points</div>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400">
                {userProfile.points}
              </div>
              <div className="text-xs text-emerald-400 font-semibold">Top 3% Bengaluru Contributor</div>
            </div>

            <div className="grid grid-cols-3 gap-2 my-5 text-center">
              <div className="p-3 bg-slate-800/70 border border-slate-700/60 rounded-2xl">
                <div className="text-lg font-black text-white">{userProfile.reportsSubmitted}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Complaints</div>
              </div>
              <div className="p-3 bg-slate-800/70 border border-slate-700/60 rounded-2xl">
                <div className="text-lg font-black text-emerald-400">{userProfile.reportsResolved}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Resolved</div>
              </div>
              <div className="p-3 bg-slate-800/70 border border-slate-700/60 rounded-2xl">
                <div className="text-lg font-black text-orange-400">{userProfile.streakDays}d</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Active Streak</div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-xs space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Active Ward:</span>
                <strong className="text-white">Ward 12 Indiranagar (East Zone)</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Direct Civic Impact:</span>
                <strong className="text-emerald-400">~420 kg waste cleared / 3 road craters leveled</strong>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Ward Committee Verification</span>
              <span className="font-mono">ID: #PV-IN-KA-8492</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={shareViaWhatsApp}
              className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleShareCard}
              className="py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
