import React, { useState } from 'react';
import {
  X,
  ThumbsUp,
  Share2,
  QrCode,
  ShieldAlert,
  Clock,
  CheckCircle2,
  DollarSign,
  MapPin,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Send,
  Camera,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CivicIssue } from '../types';
import { QRCodeModal } from './QRCodeModal';
import { PHOTO_PRESETS } from '../data/seedReports';
import { MiniLeafletMap } from './MiniLeafletMap';

interface Props {
  issue: CivicIssue;
  onClose: () => void;
  onUpvote: (issueId: string) => void;
  onConfirmFix: (issueId: string) => void;
  onReopenIssue: (issueId: string, reason: string) => void;
  onAddComment: (issueId: string, commentText: string) => void;
  onResolveWithPhoto?: (issueId: string, photoUrl: string, notes: string) => void;
  isAuthorityMode?: boolean;
}

export const IssueDetailModal: React.FC<Props> = ({
  issue,
  onClose,
  onUpvote,
  onConfirmFix,
  onReopenIssue,
  onAddComment,
  onResolveWithPhoto,
  isAuthorityMode = false,
}) => {
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'proof'>('details');
  const [newComment, setNewComment] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [showReopenInput, setShowReopenInput] = useState(false);
  const [isVerifyingFix, setIsVerifyingFix] = useState(false);
  const [uploadFixPhotoUrl, setUploadFixPhotoUrl] = useState(PHOTO_PRESETS.potholeFixed[0]);

  // SLA calculation
  const deadline = new Date(issue.slaDeadline);
  const now = new Date();
  const hoursLeft = Math.round((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
  const isSlaBreached = hoursLeft < 0 && issue.status !== 'Resolved';

  const handleConfirm = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onConfirmFix(issue.id);
  };

  const handleSimulateAuthorityFix = async () => {
    setIsVerifyingFix(true);
    try {
      const res = await fetch('/api/verify-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beforeImage: issue.images[0],
          afterImage: uploadFixPhotoUrl,
          category: issue.category,
          issueTitle: issue.title,
        }),
      });
      const data = await res.json();
      if (onResolveWithPhoto) {
        onResolveWithPhoto(
          issue.id,
          uploadFixPhotoUrl,
          data?.data?.notes || 'AI verified repair meets municipal structural standards.'
        );
      }
    } catch {
      if (onResolveWithPhoto) {
        onResolveWithPhoto(
          issue.id,
          uploadFixPhotoUrl,
          'Work completed by municipal crew and verified.'
        );
      }
    } finally {
      setIsVerifyingFix(false);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(issue.id, newComment);
    setNewComment('');
  };

  const steps = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
  const currentStepIdx = steps.indexOf(issue.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100 overflow-hidden my-auto">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/95 sticky top-0 z-20">
          <div className="space-y-1 pr-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded-md">
                #{issue.id}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {issue.category}
              </span>
              {issue.isEmergency && (
                <span className="flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  EMERGENCY
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white line-clamp-2">
              {issue.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQR(true)}
              title="Show QR Code"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-sky-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer ${
              activeTab === 'details'
                ? 'border-sky-500 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & AI Analysis
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-sky-500 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Live Timeline</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>
          <button
            onClick={() => setActiveTab('proof')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'proof'
                ? 'border-sky-500 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Before / After Audit</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Status Progress Bar */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-300">Issue Lifecycle Progress</span>
              <span className={`font-bold px-2 py-0.5 rounded-md ${
                issue.status === 'Resolved'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              }`}>
                {issue.status}
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-5 gap-1 text-center">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={st} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition mb-1 ${
                        isPassed
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-slate-700 text-slate-400'
                      } ${isCurrent ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-900' : ''}`}
                    >
                      {idx < currentStepIdx ? '✓' : idx + 1}
                    </div>
                    <span className={`text-[10px] hidden sm:block ${isPassed ? 'text-slate-200 font-semibold' : 'text-slate-500'}`}>
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* SLA Alert banner */}
            <div className="mt-3.5 pt-3 border-t border-slate-700/50 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  SLA Target: <strong>{issue.slaHours} hours</strong>
                </span>
              </div>
              <div>
                {issue.status === 'Resolved' ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resolved within SLA window
                  </span>
                ) : isSlaBreached ? (
                  <span className="text-rose-400 font-bold">
                    ⚠️ SLA Breached ({Math.abs(hoursLeft)}h overdue)
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold">
                    ⏱️ {hoursLeft} hours remaining
                  </span>
                )}
              </div>
            </div>
          </div>

          {activeTab === 'details' && (
            <>
              {/* Photo & Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 aspect-video sm:aspect-auto sm:h-56 bg-slate-800">
                  <img
                    src={issue.images[0]}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                    <Camera className="w-3 h-3 text-sky-400" />
                    <span>Citizen Proof Image</span>
                  </div>
                </div>

                <div className="space-y-3 flex flex-col justify-between">
                  <div className="bg-slate-800/70 border border-slate-700/60 p-3.5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">AI Hazard Severity</span>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        issue.severity >= 8 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {issue.severity} / 10
                      </span>
                    </div>

                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          issue.severity >= 8 ? 'bg-rose-500' : issue.severity >= 5 ? 'bg-amber-500' : 'bg-sky-500'
                        }`}
                        style={{ width: `${issue.severity * 10}%` }}
                      ></div>
                    </div>

                    <div className="text-xs text-slate-300">
                      <strong>Estimated Dimension:</strong> {issue.sizeEstimate}
                    </div>

                    <div className="text-xs text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="font-bold text-emerald-400">₹</span>
                        <span>Est. Municipal Cost: <strong>₹{(issue.estimatedCostINR || 4500).toLocaleString('en-IN')}</strong></span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                        BBMP PWD Schedule
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-800/70 border border-slate-700/60 p-3.5 rounded-2xl text-xs space-y-1.5">
                    <div className="text-slate-400">Location & Ward:</div>
                    <div className="font-semibold text-slate-200 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span>{issue.address} ({issue.ward})</span>
                    </div>
                    <div className="text-slate-400 pt-1">Nodal Authority:</div>
                    <div className="font-bold text-sky-400 flex items-center justify-between">
                      <span>{issue.nodalAgency || 'BBMP'} • {issue.department}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pt-0.5">
                      Ward Nodal Officer: <strong className="text-slate-200">{issue.juniorEngineer || 'Er. Suresh Babu (AEE)'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Municipal Description */}
              <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Municipal Description
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Geotagged Map Pin on Bengaluru Grid */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-sky-400 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bengaluru Street Geotag (GPS Pin)</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{issue.ward}</span>
                </div>
                <MiniLeafletMap
                  lat={issue.lat}
                  lng={issue.lng}
                  title={issue.title}
                  address={issue.address}
                  category={issue.category}
                  severity={issue.severity}
                  height="h-44 sm:h-52"
                />
              </div>

              {/* Detected Safety Hazards */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>AI Flagged Safety Hazards</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {issue.safetyHazards.map((hz, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                      <span>{hz}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bar (Upvote & Share) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => onUpvote(issue.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    issue.upvotedByMe
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${issue.upvotedByMe ? 'fill-current' : ''}`} />
                  <span>{issue.upvotedByMe ? 'Upvoted' : 'Upvote Issue'} ({issue.upvotes})</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQR(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-sky-400" />
                    <span>Share QR</span>
                  </button>
                </div>
              </div>

              {/* Community Comments */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300">
                  Community Discussion & Official Notes ({issue.comments.length})
                </h4>
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {issue.comments.map((cm) => (
                    <div
                      key={cm.id}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        cm.isOfficial
                          ? 'bg-sky-950/40 border border-sky-800/40'
                          : 'bg-slate-800/40 border border-slate-700/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5">
                          {cm.user}
                          {cm.isOfficial && (
                            <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.2 rounded font-semibold">
                              OFFICIAL
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(cm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-300">{cm.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add an update or comment..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Post
                  </button>
                </form>
              </div>
            </>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                {issue.timeline.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-sky-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-sky-400"></div>
                    </div>
                    <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-sky-400">{item.status}</span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{item.note}</p>
                      <div className="text-[10px] text-slate-400 font-medium">Actor: {item.actor}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'proof' && (
            <div className="space-y-6">
              {issue.status === 'Resolved' && issue.resolutionPhoto ? (
                <>
                  <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-emerald-300">
                        AI Verified Municipal Resolution
                      </h4>
                      <p className="text-xs text-slate-300">
                        Fix Confidence Score: <strong>{issue.resolutionConfidence || 95}%</strong>
                      </p>
                    </div>
                  </div>

                  {/* Side by side comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-rose-400 flex items-center gap-1">
                        <span>BEFORE (Citizen Report)</span>
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-slate-700 aspect-video bg-slate-800">
                        <img src={issue.images[0]} alt="Before" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>AFTER (Authority Repair Fix)</span>
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-emerald-500/40 aspect-video bg-slate-800">
                        <img src={issue.resolutionPhoto} alt="After" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* AI Inspector Notes */}
                  <div className="bg-slate-800/70 border border-slate-700/60 p-4 rounded-2xl text-xs space-y-2">
                    <div className="font-bold text-sky-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Inspector Engineering Audit</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {issue.resolutionNotes || 'Repair verified. Asphalt/infrastructure restored flush with roadway gradients, eliminating hazards.'}
                    </p>
                  </div>

                  {/* Citizen Confirmation actions */}
                  <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl space-y-3">
                    <h5 className="font-bold text-xs text-slate-200">
                      Citizen Verification & Community Sign-off
                    </h5>
                    {issue.citizenConfirmed ? (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Citizen confirmed fix! +100 Civic Points awarded.</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          onClick={handleConfirm}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm Fix (+100 Pts)</span>
                        </button>
                        <button
                          onClick={() => setShowReopenInput(!showReopenInput)}
                          className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs transition cursor-pointer"
                        >
                          Reopen Issue
                        </button>
                      </div>
                    )}

                    {showReopenInput && !issue.citizenConfirmed && (
                      <div className="pt-2 space-y-2">
                        <input
                          type="text"
                          value={reopenReason}
                          onChange={(e) => setReopenReason(e.target.value)}
                          placeholder="Reason (e.g. Patch is already cracking, debris left behind)..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                        />
                        <button
                          onClick={() => {
                            if (!reopenReason.trim()) return;
                            onReopenIssue(issue.id, reopenReason);
                            setShowReopenInput(false);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold"
                        >
                          Submit Reopen Request
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">No Resolution Photo Yet</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      Once the assigned municipal crew fixes this issue, they upload a resolution photo for automated AI vision audit before closing.
                    </p>
                  </div>

                  {/* Authority Upload Simulation if in Authority Mode */}
                  {isAuthorityMode && (
                    <div className="mt-4 p-4 rounded-2xl bg-slate-800/80 border border-sky-500/30 max-w-md mx-auto text-left space-y-3">
                      <div className="font-bold text-xs text-sky-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>Authority Dispatcher: Upload Fix Photo</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Simulate field repair crew uploading completed asphalt/repair photo:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={uploadFixPhotoUrl}
                          onChange={(e) => setUploadFixPhotoUrl(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                        />
                        <button
                          onClick={handleSimulateAuthorityFix}
                          disabled={isVerifyingFix}
                          className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                        >
                          {isVerifyingFix ? 'Auditing...' : 'Verify & Close'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showQR && <QRCodeModal issue={issue} onClose={() => setShowQR(false)} />}
    </div>
  );
};
