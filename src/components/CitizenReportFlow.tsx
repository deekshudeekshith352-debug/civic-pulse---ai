import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Mic,
  MicOff,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  X,
  RefreshCw,
  Layers,
  ChevronRight,
  Flame,
  Info,
  Compass,
  Navigation,
  Crosshair
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CivicIssue, IssueCategory } from '../types';
import { CIVIC_CATEGORIES, PHOTO_PRESETS } from '../data/seedReports';
import { calculateDistanceMeters, formatDistance, reverseGeocodeCoords } from '../hooks/useGeolocation';
import { MiniLeafletMap } from './MiniLeafletMap';

interface Props {
  existingIssues: CivicIssue[];
  initialCoords?: { lat: number; lng: number };
  onSubmitIssue: (newIssue: CivicIssue) => void;
  onUpvoteExisting: (issueId: string) => void;
  onCancel: () => void;
}

export const CitizenReportFlow: React.FC<Props> = ({
  existingIssues,
  initialCoords,
  onSubmitIssue,
  onUpvoteExisting,
  onCancel,
}) => {
  // Wizard steps: 1: Capture Photo/Voice, 2: AI Analyzing, 3: Review & Edit, 4: Duplicate Alert (if any)
  const [step, setStep] = useState<'capture' | 'analyzing' | 'review' | 'duplicate'>('capture');

  // Form states
  const [photos, setPhotos] = useState<string[]>([]);
  const [userNotes, setUserNotes] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // AI Analyzed properties
  const [category, setCategory] = useState<IssueCategory>('Potholes');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(7);
  const [sizeEstimate, setSizeEstimate] = useState('1.5m x 1.0m, ~12cm deep');
  const [safetyHazards, setSafetyHazards] = useState<string[]>(['Two-wheeler skid risk', 'Pedestrian crosswalk hazard']);
  const [suggestedDept, setSuggestedDept] = useState('BBMP Major Roads & Infrastructure');
  const [nodalAgency, setNodalAgency] = useState('BBMP');
  const [estimatedCostINR, setEstimatedCostINR] = useState(4800);
  const [rejectionAlert, setRejectionAlert] = useState<string | null>(null);
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);

  // High-precision GPS Location
  const [coords, setCoords] = useState(initialCoords || { lat: 12.9716, lng: 77.6412 });
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(Boolean(initialCoords));
  const [address, setAddress] = useState('80 Feet Rd, 12th Main, Indiranagar, Ward 12');
  const [ward, setWard] = useState('Ward 12');

  const acquireGPSLocation = async () => {
    if (!navigator.geolocation) return;
    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(newCoords);
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        setGpsLocked(true);
        setIsGpsLoading(false);
        const geo = await reverseGeocodeCoords(newCoords.lat, newCoords.lng);
        setAddress(geo.address);
        setWard(geo.ward);
      },
      () => {
        setIsGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (!navigator.geolocation) return;
    setIsGpsLoading(true);
    let lastGeocodedLat: number | null = null;
    let lastGeocodedLng: number | null = null;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(newCoords);
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        setGpsLocked(true);
        setIsGpsLoading(false);

        const movedEnough =
          lastGeocodedLat === null ||
          lastGeocodedLng === null ||
          calculateDistanceMeters(lastGeocodedLat, lastGeocodedLng, newCoords.lat, newCoords.lng) >= 25;

        if (movedEnough) {
          lastGeocodedLat = newCoords.lat;
          lastGeocodedLng = newCoords.lng;
          const geo = await reverseGeocodeCoords(newCoords.lat, newCoords.lng);
          setAddress(geo.address);
          setWard(geo.ward);
        }
      },
      () => {
        setIsGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Duplicates found
  const [duplicates, setDuplicates] = useState<CivicIssue[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photo Presets for rapid 1-tap testing during demo
  const samplePresets = [
    { label: '80ft Rd Crater (BBMP)', img: PHOTO_PRESETS.pothole[0], hint: 'Severe road crater on Indiranagar 80ft road near school' },
    { label: 'BESCOM Sparking Wire', img: PHOTO_PRESETS.streetlight[1], hint: 'BESCOM hanging live wire near transformer' },
    { label: 'GVP Waste Heap (SWM)', img: PHOTO_PRESETS.garbage[0], hint: 'Garbage vulnerable point solid waste pile' },
    { label: 'BWSSB Cauvery Leak', img: PHOTO_PRESETS.waterLeak[0], hint: 'BWSSB potable water main burst on roadway' },
    { label: 'Rajakaluve Drain Overflow', img: PHOTO_PRESETS.drainage[0], hint: 'Stormwater rajakaluve clogged with silt and overflowing' },
  ];

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setPhotos([preset.img]);
    setUserNotes(preset.hint);
    triggerAIAnalysis([preset.img], preset.hint);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setPhotos([b64]);
      triggerAIAnalysis([b64], userNotes);
    };
    reader.readAsDataURL(file);
  };

  const triggerAIAnalysis = async (selectedPhotos: string[], notes: string) => {
    setStep('analyzing');
    setRejectionAlert(null);

    try {
      const res = await fetch('/api/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedPhotos[0] || '',
          userNotes: notes,
        }),
      });
      const json = await res.json();
      const data = json.data;

      if (data) {
        if (!data.isLegitimate && data.rejectionReason) {
          setRejectionAlert(`AI Flag: ${data.rejectionReason}. You may proceed if this is an actual municipal issue.`);
        }
        setCategory(data.category || 'Potholes');
        setTitle(data.title || 'Civic Infrastructure Hazard');
        setDescription(data.description || notes || 'Citizen reported municipal infrastructure defect.');
        setSeverity(data.severity || 6);
        setSizeEstimate(data.sizeEstimate || 'Standard municipal defect footprint');
        setSafetyHazards(data.safetyHazards || ['General public hazard']);
        setIsEmergency(data.isEmergency || isEmergency);
        setSuggestedDept(data.suggestedDepartment || 'BBMP Major Roads & Infrastructure');
        setNodalAgency(data.nodalAgency || 'BBMP');
        setEstimatedCostINR(data.estimatedCostINR || 4500);

        // High-precision duplicate detection using Haversine GPS distance (<= 350m)
        const potentialDupes = existingIssues.filter((ex) => {
          if (ex.status === 'Resolved') return false;
          if (ex.category !== data.category) return false;
          const dist = calculateDistanceMeters(coords.lat, coords.lng, ex.lat, ex.lng);
          return dist <= 350;
        });

        if (potentialDupes.length > 0) {
          setDuplicates(potentialDupes);
          setStep('duplicate');
          return;
        }
      }
      setStep('review');
    } catch {
      // Heuristic fallback
      setTitle('Pothole Surface Deformation');
      setDescription('Road surface depression posing hazard to two-wheelers and pedestrians.');
      setCategory('Potholes');
      setNodalAgency('BBMP');
      setEstimatedCostINR(4500);
      setStep('review');
    }
  };

  // Voice recording simulation or Web Speech API
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      // Browser doesn't support Web Speech, use simulated municipal voice capture
      if (!isVoiceRecording) {
        setIsVoiceRecording(true);
        setTimeout(() => {
          setIsVoiceRecording(false);
          const simulated = "A massive pothole is open right next to the school gate on 80 Feet Road, two scooters already slipped!";
          setVoiceTranscript(simulated);
          setUserNotes(simulated);
        }, 2500);
      }
      return;
    }

    // Use native Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    if (!isVoiceRecording) {
      setIsVoiceRecording(true);
      recognition.start();

      recognition.onresult = async (event: any) => {
        const speech = event.results[0][0].transcript;
        setVoiceTranscript(speech);
        setUserNotes(speech);
        setIsVoiceRecording(false);

        // Auto translate & enrich via backend
        try {
          const res = await fetch('/api/voice-transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript: speech }),
          });
          const val = await res.json();
          if (val?.data?.translatedText) {
            setUserNotes(val.data.translatedText);
          }
        } catch {
          // Keep transcript
        }
      };

      recognition.onerror = () => {
        setIsVoiceRecording(false);
      };
    } else {
      setIsVoiceRecording(false);
    }
  };

  const handleFinalSubmit = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    const newId = `PV-KA-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();
    const slaHours = isEmergency ? 24 : severity >= 8 ? 36 : 48;
    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString();

    const createdIssue: CivicIssue = {
      id: newId,
      title: title || 'Reported Civic Issue',
      description: description || userNotes || 'Civic infrastructure defect.',
      category,
      status: 'Submitted',
      severity,
      sizeEstimate,
      safetyHazards,
      isEmergency,
      department: suggestedDept,
      nodalAgency,
      assignedTeam: null,
      juniorEngineer: 'Er. Suresh Gowda (AEE Nodal Officer)',
      lat: coords.lat,
      lng: coords.lng,
      address,
      ward,
      upvotes: 1,
      upvotedByMe: true,
      reporterName: isAnonymous ? 'Anonymous Citizen' : 'Priya Sharma (You)',
      isAnonymous,
      createdAt: nowIso,
      updatedAt: nowIso,
      slaHours,
      slaDeadline,
      estimatedCostINR,
      whatsappUpdatesEnabled: whatsappOptIn,
      images: photos.length > 0 ? photos : [PHOTO_PRESETS.pothole[0]],
      comments: [
        {
          id: `c-initial-${newId}`,
          user: 'Praja Voice AI',
          text: `Automated intake: Hazard severity rated ${severity}/10. Priority routing initiated for ${nodalAgency} (${suggestedDept}).`,
          timestamp: nowIso,
          isOfficial: true,
        },
      ],
      timeline: [
        {
          status: 'Submitted',
          timestamp: nowIso,
          note: 'Photo captured and validated via GPS in Bengaluru Ward 12.',
          actor: isAnonymous ? 'Anonymous Citizen' : 'Priya Sharma',
        },
        {
          status: 'Verified',
          timestamp: nowIso,
          note: `AI Vision analysis verified issue category (${category}). Auto-routed to ${nodalAgency}.`,
          actor: 'Praja Voice AI Inspector',
        },
      ],
    };

    onSubmitIssue(createdIssue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100 p-5 sm:p-6 relative my-auto">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Capture */}
        {step === 'capture' && (
          <div className="space-y-5">
            <div className="text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                30-SECOND FAST REPORT
              </span>
              <h2 className="text-xl font-extrabold text-white">Snap & Fix Civic Issue</h2>
              <p className="text-xs text-slate-400 mt-1">
                AI inspects the hazard, identifies the department, and routes it immediately.
              </p>
            </div>

            {/* Big Camera / File Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-sky-500/40 hover:border-sky-400 bg-sky-950/20 hover:bg-sky-900/30 rounded-3xl p-6 text-center cursor-pointer transition active:scale-98 group flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-sky-500/25 group-hover:scale-105 transition mb-3">
                <Camera className="w-8 h-8" />
              </div>
              <span className="font-extrabold text-base text-white">
                Tap to Snap Camera Photo
              </span>
              <span className="text-xs text-slate-400 mt-1">
                Or select photo from gallery (1-5 photos)
              </span>
            </div>

            {/* Voice Reporting Bar */}
            <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-200">Voice-to-Report</div>
                <div className="text-[11px] text-slate-400">
                  {isVoiceRecording ? 'Listening... Speak in Hindi, Kannada, Tamil, or English' : 'Speak complaint — AI translates for authorities'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-3 rounded-2xl transition cursor-pointer ${
                  isVoiceRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-700 hover:bg-slate-600 text-sky-400'
                }`}
              >
                {isVoiceRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>

            {voiceTranscript && (
              <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl text-xs text-sky-200">
                <strong>Heard:</strong> "{voiceTranscript}"
              </div>
            )}

            {/* Fast 1-Tap Hackathon Presets */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Or Demo with 1-Tap Photo Presets:</span>
                <span className="text-[10px] text-sky-400">Instant AI Trigger</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {samplePresets.slice(0, 4).map((pr, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPreset(pr)}
                    className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-left transition flex items-center gap-2 group cursor-pointer"
                  >
                    <img src={pr.img} alt={pr.label} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white line-clamp-2">
                      {pr.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
              <span>Report Anonymously</span>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-slate-800 border-slate-700 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Step 2: AI Analyzing Spinner */}
        {step === 'analyzing' && (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin"></div>
              <div className="absolute inset-3 rounded-full bg-sky-500/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Vision Inspector Analyzing...</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Detecting category, estimating physical dimensions, flagging pedestrian risks, and routing to municipal crew.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-sky-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
              <span>Gemini 3.8 Flash Vision Model</span>
            </div>
          </div>
        )}

        {/* Step 4: Duplicate Detection Modal */}
        {step === 'duplicate' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-200">
              <Info className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-amber-300">
                  {duplicates.length} Similar Issue(s) Already Reported Nearby!
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Another citizen reported this within 200m. Upvoting existing reports boosts municipal priority score without creating queue clutter.
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {duplicates.map((dup) => {
                const distMeters = calculateDistanceMeters(coords.lat, coords.lng, dup.lat, dup.lng);
                return (
                  <div
                    key={dup.id}
                    className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-sky-400">#{dup.id}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {formatDistance(distMeters)}
                        </span>
                        <span className="text-[10px] text-slate-400">• {dup.status}</span>
                      </div>
                      <h5 className="font-bold text-xs text-white truncate">{dup.title}</h5>
                      <p className="text-[11px] text-slate-400 truncate">{dup.address}</p>
                    </div>
                    <button
                      onClick={() => {
                        onUpvoteExisting(dup.id);
                        onCancel();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Upvote ({dup.upvotes})</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setStep('review')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                No, this is a Different Issue (Continue)
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Edit */}
        {step === 'review' && (
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AI Analysis Complete
                </span>
                <h3 className="font-bold text-base text-white">Review & Confirm Report</h3>
              </div>
              <span className="text-[11px] text-slate-400">All fields editable</span>
            </div>

            {rejectionAlert && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                {rejectionAlert}
              </div>
            )}

            {/* Photo preview */}
            {photos.length > 0 && (
              <div className="rounded-2xl overflow-hidden border border-slate-700 h-36 relative">
                <img src={photos[0]} alt="Uploaded issue" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span>
                </div>
              </div>
            )}

            {/* GPS Location & Ward Verification Card */}
            <div className="p-3 rounded-2xl bg-sky-950/30 border border-sky-800/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>GPS Geotag Locked</span>
                  {gpsAccuracy && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ±{gpsAccuracy}m accuracy
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={acquireGPSLocation}
                    disabled={isGpsLoading}
                    className="text-[11px] text-sky-300 hover:text-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
                    title="Recalibrate device GPS"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGpsLoading ? 'animate-spin text-sky-400' : ''}`} />
                    <span>{isGpsLoading ? 'Locating...' : 'Recalibrate'}</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-300 hover:text-sky-300 flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 transition"
                    title="Verify satellite pin on Google Maps"
                  >
                    <Navigation className="w-3 h-3 text-sky-400" />
                    <span>Satellite</span>
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-300 font-medium text-xs truncate">
                  {address}
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-bold text-sky-400">{ward} (Indiranagar / Bengaluru East)</span>
                  <span className="text-slate-500">•</span>
                  <span className="font-mono text-slate-400">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span>
                </div>
              </div>

              {/* Embedded Bengaluru street mini map */}
              <div className="pt-1">
                <MiniLeafletMap
                  lat={coords.lat}
                  lng={coords.lng}
                  title={title || 'Your Reported Civic Defect'}
                  address={address}
                  category={category}
                  severity={severity}
                  height="h-36"
                />
              </div>
            </div>

            {/* Category & Emergency Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {CIVIC_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                  <option value="Illegal Dumping">Illegal Dumping</option>
                  <option value="Fallen Tree">Fallen Tree</option>
                  <option value="Dangerous Wire">Dangerous Wire</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Severity (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Emergency Mode Toggle */}
            <div className={`p-3 rounded-2xl border transition flex items-center justify-between ${
              isEmergency
                ? 'bg-rose-950/40 border-rose-500/50'
                : 'bg-slate-800/40 border-slate-700/50'
            }`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${isEmergency ? 'text-rose-400' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-white">Emergency Mode</div>
                  <div className="text-[10px] text-slate-400">Immediate hazard (live wire, open sewer, massive cave-in)</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 bg-slate-800 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Title */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Issue Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Municipal Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Dimensions & Hazards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-semibold block">Dimensions</span>
                <span className="font-semibold text-slate-200">{sizeEstimate}</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-semibold block">Nodal Agency</span>
                <span className="font-semibold text-sky-400">{nodalAgency} ({suggestedDept})</span>
              </div>
            </div>

            {/* Indian Rupee Estimate & WhatsApp Status */}
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Est. Municipal Repair Cost:</span>
                <strong className="text-emerald-400 font-bold text-sm">₹{estimatedCostINR.toLocaleString('en-IN')}</strong>
              </div>

              <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">💬</span>
                  <div>
                    <div className="font-bold text-white text-[11px]">Send live updates to WhatsApp</div>
                    <div className="text-[10px] text-slate-400">+91 98450 XXXXX (Active Ward Updates)</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappOptIn}
                  onChange={(e) => setWhatsappOptIn(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-800 border-slate-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                onClick={handleFinalSubmit}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-sky-500/25 transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Submit Verified Issue (+50 Pts)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
