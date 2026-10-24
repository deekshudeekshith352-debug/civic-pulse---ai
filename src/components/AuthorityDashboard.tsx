import React, { useState } from 'react';
import {
  Kanban,
  ListFilter,
  Users,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  Download,
  Sparkles,
  TrendingUp,
  Building2,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Flame,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { CivicIssue, IssueStatus } from '../types';
import { CIVIC_CATEGORIES, WARDS_DATA } from '../data/seedReports';

interface Props {
  issues: CivicIssue[];
  onUpdateStatus: (issueId: string, newStatus: IssueStatus) => void;
  onAssignTeam: (issueId: string, team: string) => void;
  onSelectIssue: (issue: CivicIssue) => void;
}

export const AuthorityDashboard: React.FC<Props> = ({
  issues,
  onUpdateStatus,
  onAssignTeam,
  onSelectIssue,
}) => {
  const [viewMode, setViewMode] = useState<'queue' | 'kanban' | 'analytics'>('queue');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'priority' | 'severity' | 'sla' | 'upvotes'>('priority');

  // Compute AI Priority Score: (Severity * 10) + (Upvotes * 3) + (isEmergency ? 50 : 0) + (hoursPending * 0.8)
  const getPriorityScore = (issue: CivicIssue) => {
    const hoursPending = Math.max(1, (Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60));
    let score = issue.severity * 10 + issue.upvotes * 3 + hoursPending * 0.5;
    if (issue.isEmergency) score += 60;
    if (issue.description.toLowerCase().includes('school') || issue.description.toLowerCase().includes('hospital')) {
      score += 25;
    }
    return Math.round(score);
  };

  // Filter issues
  const filtered = issues.filter((i) => {
    if (departmentFilter === 'All') return true;
    return i.department.toLowerCase().includes(departmentFilter.toLowerCase());
  });

  // Sort issues
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'priority') return getPriorityScore(b) - getPriorityScore(a);
    if (sortBy === 'severity') return b.severity - a.severity;
    if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
    if (sortBy === 'sla') {
      return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
    }
    return 0;
  });

  // Available teams for assignment
  const teamsList = [
    'BBMP Road Rapid Patching Squad Alpha',
    'BBMP Pothole Jetpatcher Unit 4',
    'BESCOM High Mast & Transformer Unit 2',
    'BESCOM Emergency Wire Patrol',
    'BBMP Swachh Auto Tipper Gang 7',
    'BBMP Biohazard & Market Sanitation',
    'BWSSB Cauvery Trunk Line Emergency Unit',
    'BWSSB Valve & Flow Control Cell',
    'BBMP Rajakaluve JCB Desilting Squad 2',
    'BBMP Suction Jetting Super Sucker',
  ];

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['TicketID', 'Title', 'Category', 'NodalAgency', 'Department', 'Severity', 'Status', 'Ward', 'Address', 'PriorityScore', 'Upvotes', 'EstCostINR', 'Created'];
    const rows = sorted.map((i) => [
      i.id,
      `"${i.title.replace(/"/g, '""')}"`,
      i.category,
      i.nodalAgency || 'BBMP',
      `"${i.department}"`,
      i.severity,
      i.status,
      i.ward,
      `"${i.address.replace(/"/g, '""')}"`,
      getPriorityScore(i),
      i.upvotes,
      i.estimatedCostINR || 4500,
      i.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CivicPulse_India_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF simulated / printable summary
  const handleExportPDF = () => {
    window.print();
  };

  // Department metrics
  const totalCount = issues.length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;
  const emergencyCount = issues.filter((i) => i.isEmergency && i.status !== 'Resolved').length;
  const avgResolutionHours = 24.8;

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Queue</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{totalCount - resolvedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across 8 municipal wards</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
            <span>Critical Hazards</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1">{emergencyCount}</div>
          <div className="text-[11px] text-rose-400/80 mt-0.5">Dispatched to priority teams</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Resolved This Month</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{resolvedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{((resolvedCount / totalCount) * 100).toFixed(0)}% resolution rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Turnaround SLA</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{avgResolutionHours}h</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">↓ 22% faster via AI routing</div>
        </div>
      </div>

      {/* Predictive Insights AI Notification Banner */}
      <div className="bg-gradient-to-r from-sky-950/70 via-indigo-950/60 to-purple-950/70 border border-sky-500/30 p-4 rounded-3xl shadow-xl flex items-start gap-3.5">
        <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-sky-300 uppercase tracking-wider">
              AI Predictive Municipal Insight
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
              High Confidence (89%)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong>Ward 12 & Ward 56</strong> show a 3.4x spike in stormwater drainage reports over the past 48 hours. Historical meteorological telemetry indicates monsoon pre-showers in 4 days. <em>Recommendation: Preemptively deploy excavator desilting unit to 100 Feet Rd culvert to avert street flash flooding.</em>
          </p>
        </div>
      </div>

      {/* Control Bar: View Toggle, Filters, Exports */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        {/* View switcher */}
        <div className="flex rounded-xl bg-slate-800/80 p-1 text-xs font-bold">
          <button
            onClick={() => setViewMode('queue')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'queue' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Priority Queue
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'kanban' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'analytics' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics & Trends
          </button>
        </div>

        {/* Filter and Exports */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Nodal Agencies</option>
            <option value="Roads">BBMP Major Roads</option>
            <option value="BESCOM">BESCOM (Electricity)</option>
            <option value="Solid Waste">BBMP Solid Waste (SWM)</option>
            <option value="BWSSB">BWSSB (Water Board)</option>
            <option value="Drainage">BBMP SWD (Rajakaluve)</option>
          </select>

          {viewMode === 'queue' && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-sky-500"
            >
              <option value="priority">Sort: AI Priority Score</option>
              <option value="severity">Sort: Severity (High to Low)</option>
              <option value="upvotes">Sort: Most Upvoted</option>
              <option value="sla">Sort: Urgent SLA Deadline</option>
            </select>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer font-semibold"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer font-semibold"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* 1. AI Priority Queue View */}
      {viewMode === 'queue' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400 flex items-center justify-between px-1">
            <span>Displaying {sorted.length} prioritized reports</span>
            <span className="font-semibold text-sky-400">Formula: Severity + Upvotes + Critical Location + Wait Time</span>
          </div>

          <div className="space-y-2.5">
            {sorted.map((item, idx) => {
              const priority = getPriorityScore(item);
              const deadline = new Date(item.slaDeadline);
              const hoursLeft = Math.round((deadline.getTime() - Date.now()) / (1000 * 60 * 60));
              const isOverdue = hoursLeft < 0 && item.status !== 'Resolved';

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  {/* Left priority rank badge & photo */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Rank</span>
                      <span className="text-sm font-black text-white">#{idx + 1}</span>
                    </div>

                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 cursor-pointer"
                      onClick={() => onSelectIssue(item)}
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-sky-400">#{item.id}</span>
                        <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-slate-800 text-slate-300">
                          {item.category}
                        </span>
                        {item.isEmergency && (
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                            EMERGENCY
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-slate-400">
                          Ward: {item.ward}
                        </span>
                      </div>

                      <h4
                        onClick={() => onSelectIssue(item)}
                        className="text-xs sm:text-sm font-bold text-white hover:text-sky-400 transition cursor-pointer line-clamp-1"
                      >
                        {item.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                        <span>Dept: <strong className="text-slate-300">{item.department}</strong></span>
                        <span>Severity: <strong className={item.severity >= 8 ? 'text-rose-400' : 'text-amber-400'}>{item.severity}/10</strong></span>
                        <span>Upvotes: <strong>{item.upvotes}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right actions: SLA, Team assignment, Status change */}
                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Priority Score</div>
                      <div className="text-base font-black text-sky-400">{priority}</div>
                    </div>

                    {/* Team assign selector */}
                    <select
                      value={item.assignedTeam || ''}
                      onChange={(e) => onAssignTeam(item.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl max-w-[150px]"
                    >
                      <option value="">Assign Crew...</option>
                      {teamsList.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>

                    {/* Status updater */}
                    <select
                      value={item.status}
                      onChange={(e) => onUpdateStatus(item.id, e.target.value as IssueStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : item.status === 'In Progress'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                      }`}
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Verified">Verified</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                    <button
                      onClick={() => onSelectIssue(item)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {(['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'] as IssueStatus[]).map((st) => {
            const colIssues = filtered.filter((i) => i.status === st);
            return (
              <div key={st} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col h-[650px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-white">{st}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                      {colIssues.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {colIssues.map((issue) => (
                    <div
                      key={issue.id}
                      onClick={() => onSelectIssue(issue)}
                      className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-sky-500 transition shadow-sm cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold text-sky-400">#{issue.id}</span>
                        <span className={`font-bold px-1.5 py-0.2 rounded ${
                          issue.severity >= 8 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-300'
                        }`}>
                          Sev: {issue.severity}
                        </span>
                      </div>

                      <h5 className="font-bold text-xs text-slate-100 group-hover:text-sky-300 transition line-clamp-2">
                        {issue.title}
                      </h5>

                      <div className="text-[10px] text-slate-400">
                        {issue.ward} • {issue.category}
                      </div>

                      <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{issue.assignedTeam ? issue.assignedTeam.split(' ')[0] : 'Unassigned'}</span>
                        <span className="font-bold text-sky-400">Score {getPriorityScore(issue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Analytics & Predictive Hotspots View */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          {/* Ward Health Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Ward Infrastructure Health Index & Turnaround</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3 rounded-l-xl">Ward</th>
                    <th className="p-3">Health Score</th>
                    <th className="p-3">Active Issues</th>
                    <th className="p-3">Resolved (30d)</th>
                    <th className="p-3">Avg Turnaround</th>
                    <th className="p-3 rounded-r-xl">Dominant Defect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {WARDS_DATA.map((w) => (
                    <tr key={w.ward} className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-white">
                        {w.ward} <span className="text-slate-400 font-normal">({w.name})</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                          w.healthScore >= 85 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {w.healthScore} / 100
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-white">{w.activeIssues}</td>
                      <td className="p-3 text-emerald-400 font-semibold">{w.resolvedThisMonth}</td>
                      <td className="p-3 text-slate-300">{w.avgResolutionHours} hrs</td>
                      <td className="p-3 font-medium text-sky-400">{w.topCategory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
              <h4 className="font-bold text-sm text-white">Department Resolution SLA Compliance</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Public Works & Roads</span>
                    <span className="font-bold text-emerald-400">91% On-time</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[91%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Electricity & Lighting Dept</span>
                    <span className="font-bold text-emerald-400">94% On-time</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[94%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Sanitation & Solid Waste</span>
                    <span className="font-bold text-amber-400">86% On-time</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[86%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Water Supply & Sewerage Board</span>
                    <span className="font-bold text-emerald-400">88% On-time</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[88%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Stormwater & Drainage Dept</span>
                    <span className="font-bold text-rose-400">76% On-time (Pre-Monsoon Surge)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[76%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Budget Impact & Savings */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
              <h4 className="font-bold text-sm text-white">Smart Budget Impact & Early Intervention (INR)</h4>
              <p className="text-xs text-slate-400">
                Potholes repaired early with cold-mix asphalt prevent ₹95,000+ deep sub-base water damage.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                  <div className="text-[11px] text-slate-400">Est. Ward Maintenance Budget</div>
                  <div className="text-xl font-black text-white mt-0.5">₹14.8 Lakhs</div>
                  <div className="text-[10px] text-slate-500">65 tracked ward issues</div>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                  <div className="text-[11px] text-emerald-400 font-bold">Prevented Road Damage</div>
                  <div className="text-xl font-black text-emerald-400 mt-0.5">₹52.4 Lakhs</div>
                  <div className="text-[10px] text-slate-500">Early intervention multiplier</div>
                </div>
              </div>

              <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl text-xs text-sky-200">
                <strong>Weekly AI Executive Summary:</strong> Bengaluru Ward Infrastructure Health Index improved by 7.4 points this sprint. 96% of critical pothole craters resolved within 36 hours.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
