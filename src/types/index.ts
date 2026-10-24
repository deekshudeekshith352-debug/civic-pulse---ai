export type IssueCategory =
  | 'Potholes'
  | 'Street Light'
  | 'Garbage'
  | 'Water Leakage'
  | 'Drainage Overflow'
  | 'Open Manhole'
  | 'Exposed Wire'
  | string;

export type IssueStatus =
  | 'Submitted'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved';

export interface TimelineEvent {
  status: IssueStatus;
  timestamp: string;
  note: string;
  actor: string;
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isOfficial?: boolean;
}

export interface CivicIssue {
  id: string; // e.g. 'CP-KA-1001'
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  severity: number; // 1 - 10
  sizeEstimate: string;
  safetyHazards: string[];
  isEmergency: boolean;
  department: string;
  nodalAgency: string; // e.g. BBMP, BESCOM, BWSSB, Traffic Police
  assignedTeam?: string | null;
  juniorEngineer?: string | null; // e.g. 'Er. H. Suresh (AEE Ward 12)'
  lat: number;
  lng: number;
  address: string;
  ward: string;
  assemblyConstituency?: string; // e.g. 'Shantinagar', 'CV Raman Nagar', 'BTM Layout'
  upvotes: number;
  upvotedByMe?: boolean;
  reporterName: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  slaHours: number;
  slaDeadline: string; // ISO string
  estimatedCostINR: number; // in Indian Rupees (₹)
  images: string[];
  resolutionPhoto?: string;
  resolutionConfidence?: number;
  resolutionNotes?: string;
  citizenConfirmed?: boolean;
  whatsappUpdatesEnabled?: boolean;
  isGVPBlackspot?: boolean; // Garbage Vulnerable Point (Swachh Bharat)
  comments: Comment[];
  timeline: TimelineEvent[];
}

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  city: string;
  state: string;
  ward: string;
  points: number;
  streakDays: number;
  badges: { id: string; name: string; icon: string; description: string; unlockedAt: string }[];
  reportsSubmitted: number;
  reportsResolved: number;
  upvotesGiven: number;
  isAnonymous: boolean;
  whatsappOptIn: boolean;
}

export interface WardMetric {
  ward: string;
  name: string;
  healthScore: number;
  activeIssues: number;
  resolvedThisMonth: number;
  avgResolutionHours: number;
  topCategory: string;
  highRiskHazards: number;
  nodalOfficer: string;
  corporatorName: string;
}
