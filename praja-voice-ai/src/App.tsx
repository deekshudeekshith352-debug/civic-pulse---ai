import React, { useState, useEffect } from 'react';
import {
  Camera,
  MapPin,
  List,
  Map,
  Shield,
  Trophy,
  Bot,
  Globe,
  Bell,
  Sparkles,
  AlertTriangle,
  Flame,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ThumbsUp,
  Share2,
  Clock,
  CheckCircle2,
  Play,
  User,
  Plus,
  Type as TypeIcon,
  Building2,
  Navigation,
  RefreshCw,
  Crosshair,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CivicIssue, IssueStatus, UserProfile } from './types';
import { CIVIC_CATEGORIES, getInitialSeedReports, WARDS_DATA } from './data/seedReports';
import { TRANSLATIONS, SupportedLang, LANGUAGES } from './i18n/translations';
import { CityMapView } from './components/CityMapView';
import { CitizenReportFlow } from './components/CitizenReportFlow';
import { IssueDetailModal } from './components/IssueDetailModal';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { TransparencyPortal } from './components/TransparencyPortal';
import { LeaderboardAndImpact } from './components/LeaderboardAndImpact';
import { AIChatDrawer } from './components/AIChatDrawer';
import { GuidedDemoRunner } from './components/GuidedDemoRunner';
import { PWAInstallButton } from './components/PWAInstallButton';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useGeolocation, calculateDistanceMeters, formatDistance } from './hooks/useGeolocation';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'feed' | 'map' | 'authority' | 'transparency' | 'leaderboard'>('feed');

  // Multi-language
  const [currentLang, setCurrentLang] = useState<SupportedLang>('en');
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en']?.[key] || key;

  // Accessibility large text mode
  const [largeText, setLargeText] = useState(false);

  // Issues state: show ONLY reports submitted by users (no hardcoded preloaded seed reports or fake sample complaints)
  const [issues, setIssues] = useState<CivicIssue[]>(() => {
    try {
      // Clear legacy sample seed reports from localStorage
      localStorage.removeItem('civic_pulse_issues_v2');
      const stored =
        localStorage.getItem('praja_voice_user_reports_v1') ||
        localStorage.getItem('civic_pulse_user_reports_v3');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Strip any seed reports (which had IDs starting with 'CP-10' or 'CP-1')
          return parsed.filter((i: CivicIssue) => !i.id?.startsWith('CP-10') && !i.id?.startsWith('CP-1'));
        }
      }
    } catch {}
    return [];
  });

  // User profile & gamification
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    return {
      id: 'usr-1',
      name: 'Priya Sharma',
      city: 'Bengaluru',
      state: 'Karnataka',
      ward: 'Ward 12 (Indiranagar)',
      whatsappOptIn: true,
      points: 150,
      streakDays: 3,
      badges: [
        { id: 'b1', name: 'Citizen Watch', icon: '🚨', description: 'Active citizen responder', unlockedAt: '2026-10-20' },
      ],
      reportsSubmitted: 0,
      reportsResolved: 0,
      upvotesGiven: 0,
      isAnonymous: false,
    };
  });

  // Modals & Drawers
  const [isReportFlowOpen, setIsReportFlowOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDemoRunnerOpen, setIsDemoRunnerOpen] = useState(false);
  const [dismissDemoBanner, setDismissDemoBanner] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  // Live GPS Location for Proximity Feed, Map Tracing & Distance Sorting
  const {
    lat: userLat,
    lng: userLng,
    accuracy: userGpsAccuracy,
    loading: isGpsLocating,
    isTracking: isGpsTracking,
    isLiveFix: isLiveGpsFix,
    error: gpsError,
    trail: gpsTrail,
    requestLocation: refreshUserGPS,
    startTracking: startGpsTracking,
    toggleTracking: toggleGpsTracking,
  } = useGeolocation();

  // Sort mode for "Near Me" feed
  const [sortBy, setSortBy] = useState<'distance' | 'severity' | 'upvotes' | 'recent'>('distance');

  // Citizen feed view mode: cards with embedded map, pure map, or split view
  const [feedViewMode, setFeedViewMode] = useState<'feed' | 'map' | 'split'>('feed');
  const [showEmbeddedMap, setShowEmbeddedMap] = useState(true);
  const [focusedIssueId, setFocusedIssueId] = useState<string | null>(null);

  // Offline status hook
  const { isOnline, offlineQueueCount, refreshQueue } = useOnlineStatus();

  // Save to localStorage when issues update
  useEffect(() => {
    try {
      localStorage.setItem('praja_voice_user_reports_v1', JSON.stringify(issues));
    } catch {}
  }, [issues]);

  // Handlers for issues
  const handleAddNewIssue = (newIssue: CivicIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    setIsReportFlowOpen(false);
    setSelectedIssue(newIssue);

    // Gamification points
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + 50,
      reportsSubmitted: prev.reportsSubmitted + 1,
    }));
  };

  const handleUpvote = (issueId: string) => {
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          const upvoted = !i.upvotedByMe;
          return {
            ...i,
            upvotes: upvoted ? i.upvotes + 1 : Math.max(0, i.upvotes - 1),
            upvotedByMe: upvoted,
          };
        }
        return i;
      })
    );

    // Update selected issue if open
    setSelectedIssue((prev) => {
      if (prev && prev.id === issueId) {
        const upvoted = !prev.upvotedByMe;
        return {
          ...prev,
          upvotes: upvoted ? prev.upvotes + 1 : Math.max(0, prev.upvotes - 1),
          upvotedByMe: upvoted,
        };
      }
      return prev;
    });

    setUserProfile((prev) => ({ ...prev, points: prev.points + 10 }));
  };

  const handleConfirmFix = (issueId: string) => {
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          return {
            ...i,
            citizenConfirmed: true,
            status: 'Resolved',
            updatedAt: new Date().toISOString(),
          };
        }
        return i;
      })
    );

    setSelectedIssue((prev) => {
      if (prev && prev.id === issueId) {
        return { ...prev, citizenConfirmed: true, status: 'Resolved' };
      }
      return prev;
    });

    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + 100,
      reportsResolved: prev.reportsResolved + 1,
    }));
  };

  const handleReopenIssue = (issueId: string, reason: string) => {
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          return {
            ...i,
            status: 'In Progress',
            citizenConfirmed: false,
            comments: [
              ...i.comments,
              {
                id: `c-reopen-${Date.now()}`,
                user: 'Citizen Reopen Request',
                text: `Issue reopened by citizen. Reason: ${reason}`,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return i;
      })
    );

    setSelectedIssue((prev) => {
      if (prev && prev.id === issueId) {
        return {
          ...prev,
          status: 'In Progress',
          citizenConfirmed: false,
          comments: [
            ...prev.comments,
            {
              id: `c-reopen-${Date.now()}`,
              user: 'Citizen Reopen Request',
              text: `Issue reopened by citizen. Reason: ${reason}`,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return prev;
    });
  };

  const handleAddComment = (issueId: string, text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      user: userProfile.name,
      text,
      timestamp: new Date().toISOString(),
    };

    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          return { ...i, comments: [...i.comments, newComment] };
        }
        return i;
      })
    );

    setSelectedIssue((prev) => {
      if (prev && prev.id === issueId) {
        return { ...prev, comments: [...prev.comments, newComment] };
      }
      return prev;
    });
  };

  const handleUpdateStatus = (issueId: string, newStatus: IssueStatus) => {
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          return {
            ...i,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            timeline: [
              ...i.timeline,
              {
                status: newStatus,
                timestamp: new Date().toISOString(),
                note: `Status updated to ${newStatus} by Municipal Authority.`,
                actor: 'Municipal Dispatch',
              },
            ],
          };
        }
        return i;
      })
    );
  };

  const handleAssignTeam = (issueId: string, team: string) => {
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          return {
            ...i,
            assignedTeam: team,
            status: i.status === 'Submitted' || i.status === 'Verified' ? 'Assigned' : i.status,
            timeline: [
              ...i.timeline,
              {
                status: 'Assigned',
                timestamp: new Date().toISOString(),
                note: `Dispatched to ${team}. Work order active.`,
                actor: 'Central Dispatch Control',
              },
            ],
          };
        }
        return i;
      })
    );
  };

  // Filtered and sorted issues for Near Me feed
  const feedIssues = issues
    .filter((i) => {
      const matchesSearch =
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || i.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
      const matchesEmergency = !emergencyOnly || i.isEmergency;
      return matchesSearch && matchesCategory && matchesStatus && matchesEmergency;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') {
        const distA = calculateDistanceMeters(userLat, userLng, a.lat, a.lng);
        const distB = calculateDistanceMeters(userLat, userLng, b.lat, b.lng);
        return distA - distB;
      }
      if (sortBy === 'severity') {
        return b.severity - a.severity;
      }
      if (sortBy === 'upvotes') {
        return b.upvotes - a.upvotes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${largeText ? 'text-base' : 'text-sm'}`}>
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 font-bold text-xs flex items-center justify-between shadow-lg sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-pulse"></span>
            <span>{t('offlineBanner')} ({offlineQueueCount} queued)</span>
          </div>
          <span className="text-[11px] underline cursor-pointer" onClick={refreshQueue}>Refresh</span>
        </div>
      )}

      {/* Top Guided Demo Banner */}
      {!dismissDemoBanner && (
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-cyan-600 px-4 py-2.5 text-xs text-white flex items-center justify-between shadow-md sticky top-0 z-40">
          <div className="flex items-center gap-2 font-bold">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Hackathon Demo: Experience the 30-sec photo-to-resolution lifecycle</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDemoRunnerOpen(true)}
              className="bg-white text-slate-900 px-3 py-1 rounded-full font-black text-xs hover:bg-slate-100 transition shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch 90s Demo</span>
            </button>
            <button
              onClick={() => setDismissDemoBanner(true)}
              className="text-white/80 hover:text-white text-base font-bold px-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-sky-400 text-sm">
              PV
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base sm:text-lg tracking-tight text-white">
                {t('appName')}
              </h1>
              <span className="px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-extrabold border border-sky-500/30">
                AI DISPATCH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Center Navigation on Desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-2xl border border-slate-700/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'feed' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>{t('feed')}</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'map' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>{t('map')}</span>
          </button>
          <button
            onClick={() => setActiveTab('authority')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'authority' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{t('dashboard')}</span>
          </button>
          <button
            onClick={() => setActiveTab('transparency')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'transparency' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t('transparency')}</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'leaderboard' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{t('leaderboard')}</span>
          </button>
        </nav>

        {/* Right utility buttons: Language, Large text, PWA Install, AI Chat */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value as SupportedLang)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl focus:outline-none cursor-pointer font-semibold"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native}
                </option>
              ))}
            </select>
          </div>

          {/* Large Text Mode Toggle */}
          <button
            onClick={() => setLargeText(!largeText)}
            title="Toggle Large Text for Accessibility"
            className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
              largeText ? 'bg-sky-500 text-white border-sky-400' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <TypeIcon className="w-4 h-4" />
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton label={t('installApp')} />

          {/* AI Pulse Bot Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-500/30 text-sky-400 hover:bg-sky-500/30 text-xs font-bold transition cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Praja Voice AI</span>
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-8">
        {/* 1. Near Me Feed View */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Search and Category Filter Bar */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 shadow-inner"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
                  >
                    <option value="All">{t('allStatuses')}</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Verified">Verified</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  <button
                    onClick={() => setEmergencyOnly(!emergencyOnly)}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      emergencyOnly
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Emergency</span>
                  </button>
                </div>
              </div>

              {/* Horizontal Category Badges */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                <button
                  onClick={() => setCategoryFilter('All')}
                  className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                    categoryFilter === 'All'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  All ({issues.length})
                </button>
                {CIVIC_CATEGORIES.map((cat) => {
                  const count = issues.filter((i) => i.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                        categoryFilter === cat.id
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] opacity-75 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Hero Banner with Camera Callout */}
            <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-500/30 p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    Bengaluru Metropolitan Dispatch Active
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Spot a pothole, open manhole, or broken street light?
                </h2>
                <p className="text-xs text-slate-400 max-w-lg">
                  Snap a quick photo. AI validates severity, estimates repair size, and routes directly to the municipal team.
                </p>
              </div>

              <button
                onClick={() => setIsReportFlowOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-sky-500/30 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <Camera className="w-5 h-5" />
                <span>{t('snapReport')} (Under 30s)</span>
              </button>
            </div>

            {/* Live GPS Proximity Status & Sort Controls */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                  isLiveGpsFix
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                }`}>
                  <Navigation className={`w-4 h-4 ${isGpsTracking ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white">Live Proximity Feed</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                      isLiveGpsFix
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {isLiveGpsFix
                        ? `GPS Locked • ±${userGpsAccuracy || 6}m`
                        : isGpsLocating
                        ? 'Acquiring GPS...'
                        : 'Default City Center'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {gpsError ? (
                      <span className="text-amber-400">{gpsError}</span>
                    ) : (
                      <>
                        {isLiveGpsFix ? 'Tracing live GPS' : 'GPS standby'} ({userLat.toFixed(5)}, {userLng.toFixed(5)})
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-500 font-semibold px-2">Sort:</span>
                  <button
                    onClick={() => setSortBy('distance')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                      sortBy === 'distance'
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Nearest First</span>
                  </button>
                  <button
                    onClick={() => setSortBy('severity')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                      sortBy === 'severity'
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flame className="w-3 h-3" />
                    <span>Urgent</span>
                  </button>
                  <button
                    onClick={() => setSortBy('upvotes')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                      sortBy === 'upvotes'
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Upvotes</span>
                  </button>
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                      sortBy === 'recent'
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>Latest</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={toggleGpsTracking}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isGpsTracking
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                      : 'bg-sky-500 hover:bg-sky-400 text-white border-sky-400'
                  }`}
                  title={isGpsTracking ? 'Pause continuous GPS trace' : 'Activate continuous GPS trace'}
                >
                  <Crosshair className={`w-3.5 h-3.5 ${isGpsTracking ? 'animate-pulse' : ''}`} />
                  <span>{isGpsTracking ? 'GPS Tracing ON' : 'Activate GPS'}</span>
                </button>

                <button
                  type="button"
                  onClick={refreshUserGPS}
                  disabled={isGpsLocating}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition cursor-pointer shrink-0"
                  title="Refresh GPS Coordinates Now"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGpsLocating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* View Mode Switcher: Cards Feed vs Bengaluru Map vs Split */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-white px-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Bengaluru Spatial View:</span>
                <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                  ({issues.length} reported defects across wards)
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setFeedViewMode('feed')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    feedViewMode === 'feed'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Cards Feed ({feedIssues.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedViewMode('map')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    feedViewMode === 'map'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Full Bengaluru Map</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedViewMode('split')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 hidden md:flex ${
                    feedViewMode === 'split'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Split: Map + Cards</span>
                </button>
              </div>
            </div>

            {/* 1. Mode: Pure Map View */}
            {feedViewMode === 'map' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Interactive municipal map centered on Bengaluru wards. Click any pin for defect photos and AI repair audit.</span>
                  <span className="font-mono text-sky-400">{feedIssues.length} issues plotted</span>
                </div>
                <CityMapView
                  issues={issues}
                  selectedCategory={categoryFilter}
                  selectedStatus={statusFilter}
                  onSelectIssue={(i) => setSelectedIssue(i)}
                  userCoords={{ lat: userLat, lng: userLng }}
                  userAccuracy={userGpsAccuracy}
                  isGpsTracking={isGpsTracking}
                  isLiveGpsFix={isLiveGpsFix}
                  gpsTrail={gpsTrail}
                  onActivateGPS={startGpsTracking}
                  focusedIssueId={focusedIssueId}
                  heightClass="h-[600px]"
                />
              </div>
            )}

            {/* 2. Mode: Cards Feed with Embedded Live Map */}
            {feedViewMode === 'feed' && (
              <div className="space-y-6">
                {/* Embedded Live Bengaluru Civic Map Card */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-3.5 sm:p-4 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                        <Map className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                          <span>Live Bengaluru Civic Map</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                            LIVE PINS
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Ward quick-fly, satellite aerials, and real-time hazard clusters
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowEmbeddedMap(!showEmbeddedMap)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-white border border-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Map className="w-3.5 h-3.5" />
                      <span>{showEmbeddedMap ? 'Minimize Map' : 'Show Bengaluru Map'}</span>
                    </button>
                  </div>

                  {showEmbeddedMap && (
                    <CityMapView
                      issues={issues}
                      selectedCategory={categoryFilter}
                      selectedStatus={statusFilter}
                      onSelectIssue={(i) => setSelectedIssue(i)}
                      userCoords={{ lat: userLat, lng: userLng }}
                      userAccuracy={userGpsAccuracy}
                      isGpsTracking={isGpsTracking}
                      isLiveGpsFix={isLiveGpsFix}
                      gpsTrail={gpsTrail}
                      onActivateGPS={startGpsTracking}
                      focusedIssueId={focusedIssueId}
                      heightClass="h-[380px] sm:h-[440px]"
                    />
                  )}
                </div>

                {/* Issues Cards Grid or Clean Empty State */}
                {feedIssues.length === 0 ? (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-10 sm:p-14 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
                    <div className="w-16 h-16 rounded-3xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5 max-w-md">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        No civic issues reported yet. Be the first to report an issue.
                      </h3>
                      <p className="text-xs text-slate-400">
                        Spot a road defect, broken street light, garbage heap, or water leakage in your ward? Snap a photo with GPS to alert municipal teams.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsReportFlowOpen(true)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-sky-500/30 transition active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Report Issue</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feedIssues.map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => setSelectedIssue(issue)}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-4 shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col justify-between group space-y-3"
                      >
                        <div className="space-y-3">
                          {/* Top Meta info */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sky-400">#{issue.id}</span>
                              <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-slate-800 text-slate-300">
                                {issue.category}
                              </span>
                            </div>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              issue.status === 'Resolved'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : issue.status === 'In Progress'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            }`}>
                              {issue.status}
                            </span>
                          </div>

                          {/* Image with severity overlay */}
                          <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800">
                            <img
                              src={issue.images[0]}
                              alt={issue.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-sky-400" />
                              <span>{issue.ward}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-emerald-300 font-mono flex items-center gap-0.5">
                                <Navigation className="w-2.5 h-2.5" />
                                {formatDistance(calculateDistanceMeters(userLat, userLng, issue.lat, issue.lng))}
                              </span>
                            </div>

                            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-black ${
                              issue.severity >= 8 ? 'bg-rose-500 text-white' : 'bg-slate-900/80 text-amber-400'
                            }`}>
                              Severity: {issue.severity}/10
                            </div>

                            {issue.isEmergency && (
                              <div className="absolute bottom-2 left-2 bg-rose-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                                <AlertTriangle className="w-3 h-3" />
                                <span>EMERGENCY HAZARD</span>
                              </div>
                            )}

                            {issue.status === 'Resolved' && (
                              <div className="absolute bottom-2 right-2 bg-emerald-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>AI VERIFIED FIX</span>
                              </div>
                            )}
                          </div>

                          {/* Title and Address */}
                          <div className="space-y-1">
                            <h3 className="font-bold text-sm text-white group-hover:text-sky-400 transition line-clamp-1">
                              {issue.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-2">
                              {issue.description}
                            </p>

                            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                              <span className="font-semibold text-sky-400">Agency: {issue.nodalAgency || 'BBMP'}</span>
                              <span className="font-bold text-emerald-400">₹{(issue.estimatedCostINR || 4500).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Upvote, SLA & Locate on Map */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpvote(issue.id);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                              issue.upvotedByMe
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${issue.upvotedByMe ? 'fill-current' : ''}`} />
                            <span>{issue.upvotes}</span>
                          </button>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFocusedIssueId(issue.id);
                                setShowEmbeddedMap(true);
                                window.scrollTo({ top: 350, behavior: 'smooth' });
                              }}
                              className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                              title="Focus on Bengaluru Map"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>Locate</span>
                            </button>

                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Mode: Split View (Map on Left, Cards on Right) */}
            {feedViewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 sticky top-24">
                  <CityMapView
                    issues={issues}
                    selectedCategory={categoryFilter}
                    selectedStatus={statusFilter}
                    onSelectIssue={(i) => setSelectedIssue(i)}
                    userCoords={{ lat: userLat, lng: userLng }}
                    userAccuracy={userGpsAccuracy}
                    isGpsTracking={isGpsTracking}
                    isLiveGpsFix={isLiveGpsFix}
                    gpsTrail={gpsTrail}
                    onActivateGPS={startGpsTracking}
                    focusedIssueId={focusedIssueId}
                    heightClass="h-[600px]"
                  />
                </div>

                <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {feedIssues.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3 shadow-lg">
                      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mx-auto">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-200">
                        No civic issues reported yet. Be the first to report an issue.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsReportFlowOpen(true)}
                        className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Report Issue
                      </button>
                    </div>
                  ) : (
                    feedIssues.map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => {
                          setSelectedIssue(issue);
                          setFocusedIssueId(issue.id);
                        }}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 shadow-md hover:shadow-lg transition cursor-pointer flex gap-3 group"
                      >
                        <img
                          src={issue.images[0]}
                          alt={issue.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono text-sky-400 font-bold">#{issue.id}</span>
                            <span className="text-emerald-400 font-mono text-[10px] font-bold">
                              {formatDistance(calculateDistanceMeters(userLat, userLng, issue.lat, issue.lng))}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-white truncate group-hover:text-sky-400">
                            {issue.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">{issue.address}</p>
                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="text-slate-300 font-medium">{issue.ward}</span>
                            <span className="font-bold text-emerald-400">₹{(issue.estimatedCostINR || 4500).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Interactive City Map View */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-sky-400" />
                  <span>Citywide Real-time Hazard Map</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Color-coded pins by department, severity clusters, and heatmap mode.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                >
                  <option value="All">All Categories</option>
                  {CIVIC_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Verified">Verified</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="h-[600px] w-full">
              <CityMapView
                issues={issues}
                selectedCategory={categoryFilter}
                selectedStatus={statusFilter}
                onSelectIssue={(i) => setSelectedIssue(i)}
                userCoords={{ lat: userLat, lng: userLng }}
                userAccuracy={userGpsAccuracy}
                isGpsTracking={isGpsTracking}
                isLiveGpsFix={isLiveGpsFix}
                gpsTrail={gpsTrail}
                onActivateGPS={startGpsTracking}
                heightClass="h-[600px]"
              />
            </div>
          </div>
        )}

        {/* 3. Authority Dashboard View */}
        {activeTab === 'authority' && (
          <AuthorityDashboard
            issues={issues}
            onUpdateStatus={handleUpdateStatus}
            onAssignTeam={handleAssignTeam}
            onSelectIssue={(i) => setSelectedIssue(i)}
          />
        )}

        {/* 4. Transparency Portal View */}
        {activeTab === 'transparency' && (
          <TransparencyPortal
            issues={issues}
            onSelectWardFilter={(ward) => {
              setSearchQuery(ward);
              setActiveTab('feed');
            }}
          />
        )}

        {/* 5. Gamification Leaderboard & Impact */}
        {activeTab === 'leaderboard' && (
          <LeaderboardAndImpact userProfile={userProfile} />
        )}
      </main>

      {/* Floating Action Button (FAB) on Mobile for One-Tap Report */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsReportFlowOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 text-white font-black text-sm shadow-2xl shadow-sky-500/40 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <Camera className="w-5 h-5 animate-pulse" />
          <span>Report Hazard</span>
        </button>
      </div>

      {/* Mobile Sticky Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-30 px-2 py-2 flex items-center justify-around text-[10px] font-bold">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'feed' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <List className="w-5 h-5" />
          <span>Feed</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'map' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <Map className="w-5 h-5" />
          <span>Map</span>
        </button>
        <button
          onClick={() => setActiveTab('authority')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'authority' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span>Queue</span>
        </button>
        <button
          onClick={() => setActiveTab('transparency')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'transparency' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span>Wards</span>
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'leaderboard' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span>Impact</span>
        </button>
      </nav>

      {/* Modals */}
      {isReportFlowOpen && (
        <CitizenReportFlow
          existingIssues={issues}
          initialCoords={isLiveGpsFix ? { lat: userLat, lng: userLng } : undefined}
          onSubmitIssue={handleAddNewIssue}
          onUpvoteExisting={handleUpvote}
          onCancel={() => setIsReportFlowOpen(false)}
        />
      )}

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpvote={handleUpvote}
          onConfirmFix={handleConfirmFix}
          onReopenIssue={handleReopenIssue}
          onAddComment={handleAddComment}
          isAuthorityMode={activeTab === 'authority'}
          onResolveWithPhoto={(id, photo, notes) => {
            setIssues((prev) =>
              prev.map((i) => {
                if (i.id === id) {
                  return {
                    ...i,
                    status: 'Resolved',
                    resolutionPhoto: photo,
                    resolutionConfidence: 96,
                    resolutionNotes: notes,
                    updatedAt: new Date().toISOString(),
                    timeline: [
                      ...i.timeline,
                      {
                        status: 'Resolved',
                        timestamp: new Date().toISOString(),
                        note: notes,
                        actor: 'Municipal Field Supervisor',
                      },
                    ],
                  };
                }
                return i;
              })
            );
            setSelectedIssue((prev) =>
              prev ? { ...prev, status: 'Resolved', resolutionPhoto: photo, resolutionNotes: notes } : null
            );
          }}
        />
      )}

      <AIChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        issues={issues}
        onSelectIssue={(i) => {
          setIsChatOpen(false);
          setSelectedIssue(i);
        }}
      />

      <GuidedDemoRunner
        isOpen={isDemoRunnerOpen}
        onClose={() => setIsDemoRunnerOpen(false)}
        onCompleteDemoScenario={(demoIssue) => {
          setIssues((prev) => [demoIssue, ...prev]);
          setSelectedIssue(demoIssue);
        }}
      />
    </div>
  );
}
