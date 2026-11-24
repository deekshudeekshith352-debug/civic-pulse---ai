import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  FastForward,
  Camera,
  Layers,
  Users,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CivicIssue } from '../types';
import { PHOTO_PRESETS } from '../data/seedReports';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCompleteDemoScenario: (demoIssue: CivicIssue) => void;
}

export const GuidedDemoRunner: React.FC<Props> = ({
  isOpen,
  onClose,
  onCompleteDemoScenario,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { num: 1, title: 'Citizen Snaps Photo', desc: 'Citizen notices hazardous road crater on 80ft Road.' },
    { num: 2, title: 'AI Vision Analysis', desc: 'Gemini Vision rates Severity 8/10, estimates size & flags hazards.' },
    { num: 3, title: 'Auto-Routing & Priority', desc: 'Dispatched to Public Works with AI Priority Score 138.' },
    { num: 4, title: 'Field Crew Assignment', desc: 'Assigned to Road Rapid Squad Alpha with 24h SLA target.' },
    { num: 5, title: 'Before & After AI Audit', desc: 'Fix photo uploaded & AI verifies 96% resolution confidence.' },
    { num: 6, title: 'Citizen Sign-off & Reward', desc: 'Citizen confirms fix, closes ticket, and collects +100 Pts!' },
  ];

  const handleNextStep = () => {
    if (currentStep < 6) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep((prev) => prev + 1);
        if (currentStep === 5) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
      }, 700);
    } else {
      // Completed! Add simulated issue to live system
      const demoIssue: CivicIssue = {
        id: 'CP-DEMO-99',
        title: 'Rim-Bending Road Crater Outside Indiranagar Metro',
        description: 'Deep 15cm depression across two-wheeler lane repaired with hot-mix asphalt and compacted flush.',
        category: 'Potholes',
        status: 'Resolved',
        severity: 8,
        sizeEstimate: '1.8m x 1.2m, 15cm depth',
        safetyHazards: ['Two-wheeler skid risk', 'Pedestrian crosswalk hazard'],
        isEmergency: true,
        department: 'BBMP Major Roads & Infrastructure',
        nodalAgency: 'BBMP',
        assignedTeam: 'Road Rapid Squad Alpha',
        juniorEngineer: 'Er. Suresh Gowda (AEE Nodal Officer)',
        lat: 12.9781,
        lng: 77.6399,
        address: '80 Feet Rd, Indiranagar, Ward 12',
        ward: 'Ward 12',
        upvotes: 48,
        upvotedByMe: true,
        reporterName: 'Priya Sharma (Demo)',
        isAnonymous: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        slaHours: 24,
        slaDeadline: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
        estimatedCostINR: 6500,
        whatsappUpdatesEnabled: true,
        images: [PHOTO_PRESETS.pothole[0]],
        resolutionPhoto: PHOTO_PRESETS.potholeFixed[0],
        resolutionConfidence: 96,
        resolutionNotes: 'AI audit confirms high compaction bitumen fill leveled flush with road gradient.',
        citizenConfirmed: true,
        comments: [
          {
            id: 'c-demo-1',
            user: 'Praja Voice AI',
            text: 'AI verified fix with 96% confidence score.',
            timestamp: new Date().toISOString(),
            isOfficial: true,
          },
        ],
        timeline: [
          {
            status: 'Submitted',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            note: 'Captured by citizen with verified GPS.',
            actor: 'Citizen App',
          },
          {
            status: 'Verified',
            timestamp: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString(),
            note: 'AI rated Severity 8/10. Routed to Public Works.',
            actor: 'Praja Voice AI',
          },
          {
            status: 'Assigned',
            timestamp: new Date(Date.now() - 3.2 * 60 * 60 * 1000).toISOString(),
            note: 'Assigned to Road Rapid Squad Alpha.',
            actor: 'Central Dispatch',
          },
          {
            status: 'In Progress',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            note: 'Bitumen laying and roller compaction in progress.',
            actor: 'Road Rapid Squad Alpha',
          },
          {
            status: 'Resolved',
            timestamp: new Date().toISOString(),
            note: 'Fix verified by AI Inspector. Citizen confirmed.',
            actor: 'Field Supervisor & Citizen',
          },
        ],
      };

      onCompleteDemoScenario(demoIssue);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl border border-sky-500/40 bg-slate-900 shadow-2xl text-slate-100 p-5 sm:p-6 relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 p-0.5 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/30">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Play className="w-5 h-5 text-sky-400 fill-current" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">90-Second Guided Demo</h3>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold">
                HACKATHON WALKTHROUGH
              </span>
            </div>
            <p className="text-xs text-slate-400">
              End-to-end lifecycle: Citizen photo → AI analysis → Auto-routing → Fix verification
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-6 gap-1 mb-6 text-center">
          {steps.map((st) => (
            <div key={st.num} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition ${
                  st.num <= currentStep ? 'bg-sky-400' : 'bg-slate-800'
                }`}
              ></div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:block">
                0{st.num}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Scenario Content by Step */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 mb-5 min-h-[260px] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span>Step {currentStep} of 6</span>
              <span>•</span>
              <span>{steps[currentStep - 1].title}</span>
            </div>
            <p className="text-xs text-slate-300 mb-4">{steps[currentStep - 1].desc}</p>

            {/* Visual simulation content */}
            {currentStep === 1 && (
              <div className="flex items-center gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                <img
                  src={PHOTO_PRESETS.pothole[0]}
                  alt="Citizen snap"
                  className="w-24 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white">Citizen snaps single photo in Indiranagar</div>
                  <div className="text-slate-400">GPS: 12.9724° N, 77.6412° E (Verified 80 Feet Rd)</div>
                  <div className="text-emerald-400 font-semibold">Elapsed time: 8 seconds</div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-sky-500/30 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Category Detected:</span>
                  <span className="font-bold text-orange-400">Potholes (Confidence 98%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Severity Score:</span>
                  <span className="font-bold text-rose-400">8 / 10 (High vehicular damage risk)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Estimated Size:</span>
                  <span className="text-slate-200">1.8m x 1.2m, 15cm depth</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Safety Hazards:</span>
                  <span className="text-rose-300">Skid risk • Near school entrance</span>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/50 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Assigned Department:</span>
                  <strong className="text-sky-400">Public Works & Roads</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Calculated Priority Score:</span>
                  <strong className="text-emerald-400 text-sm">138 (Top 5% queue urgency)</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Monitored SLA:</span>
                  <span className="text-amber-400 font-bold">24 Hours Target</span>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="flex items-center gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/50 text-xs">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white">Dispatched to: Road Rapid Squad Alpha</div>
                  <div className="text-slate-400">Field crew alerted via mobile dispatch terminal with GPS route.</div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold">Before (Citizen)</span>
                  <img src={PHOTO_PRESETS.pothole[0]} alt="Before" className="rounded-xl h-24 w-full object-cover" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold">After (Crew Repair)</span>
                  <img src={PHOTO_PRESETS.potholeFixed[0]} alt="After" className="rounded-xl h-24 w-full object-cover border border-emerald-500/50" />
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="text-center py-4 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-sm text-white">Issue Fully Closed & Confirmed!</h4>
                <p className="text-xs text-slate-400">
                  Citizen confirmed fix. Ward 12 Health Score bumped to 81/100. Priya Sharma awarded +100 Civic Points!
                </p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 italic pt-2">
            Tip: Judge this entire flow against manual municipal paper complaints that take 30+ days.
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Exit Demo
          </button>

          <button
            onClick={handleNextStep}
            disabled={isProcessing}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-xl shadow-sky-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{currentStep === 6 ? 'Complete & Add to Live Feed' : 'Next Step in Scenario'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
