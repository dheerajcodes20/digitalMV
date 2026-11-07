import React, { useState, useEffect } from 'react';
import './JobTimer.css';
import { 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  Square, 
  ArrowRight, 
  ShieldCheck, 
  Edit3, 
  RotateCcw,
  Navigation,
  Calendar
} from 'lucide-react';

export const JobTimer = ({ 
  timers, 
  workOrders, 
  currentUser, 
  onUpdateTimer, 
  addAuditEvent,
  selectedWorkOrder 
}) => {
  // Select active timer
  const [selectedTimerId, setSelectedTimerId] = useState(
    selectedWorkOrder 
      ? (timers.find(t => t.workOrderId === selectedWorkOrder.id)?.id || timers[0]?.id)
      : (timers[0]?.id || '')
  );

  const [activeTimer, setActiveTimer] = useState(
    timers.find(t => t.id === selectedTimerId) || timers[0]
  );

  // Correction state
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionActionIdx, setCorrectionActionIdx] = useState(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [newTimestampVal, setNewTimestampVal] = useState('');

  // GPS on-demand capture state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [capturedGps, setCapturedGps] = useState(null);

  // Sync active timer when timers prop or selection changes
  useEffect(() => {
    const found = timers.find(t => t.id === selectedTimerId);
    if (found) setActiveTimer(found);
  }, [selectedTimerId, timers]);

  const ORDERED_STEPS = [
    { step: 1, segment: 'Room/base → site', name: 'Start Travel from Room/base', type: 'start' },
    { step: 2, segment: 'Room/base → site', name: 'Arrive at Site / End Outbound Travel', type: 'end' },
    { step: 3, segment: 'Work at site', name: 'Start Work at Site', type: 'start' },
    { step: 4, segment: 'Work at site', name: 'End Work at Site', type: 'end' },
    { step: 5, segment: 'Site → room/base', name: 'Start Return Travel', type: 'start' },
    { step: 6, segment: 'Site → room/base', name: 'Arrive at Room/base / End Return Travel', type: 'end' },
  ];

  const currentStep = activeTimer ? (activeTimer.actions.length + 1) : 1;
  const isComplete = activeTimer && activeTimer.actions.length === 6;

  // Format date in Saudi local time (AST: UTC+3)
  const getSaudiTimestamp = (date = new Date()) => {
    // Saudi Arabia is UTC+3
    const options = {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(date);
    const d = {};
    parts.forEach(p => { d[p.type] = p.value; });
    return `${d.year}-${d.month}-${d.day} ${d.hour}:${d.minute}:${d.second} AST`;
  };

  const handleNextAction = () => {
    if (!activeTimer || currentStep > 6) return;

    const stepDef = ORDERED_STEPS.find(s => s.step === currentStep);
    const now = new Date();
    const formatted = getSaudiTimestamp(now);

    const newAction = {
      step: currentStep,
      segment: stepDef.segment,
      name: stepDef.name,
      timestamp: formatted,
      raw: now.toISOString(),
    };

    const updatedActions = [...activeTimer.actions, newAction];

    // Compute durations
    const newDurations = calculateDurations(updatedActions);

    const updatedTimer = {
      ...activeTimer,
      actions: updatedActions,
      currentStep: currentStep + 1,
      status: currentStep === 6 ? 'Completed' : 'In Progress',
      durations: newDurations,
    };

    onUpdateTimer(updatedTimer);

    addAuditEvent({
      user: currentUser.name,
      role: currentUser.role,
      action: `Timer Action ${currentStep}: ${stepDef.name}`,
      recordId: activeTimer.id,
      details: `Recorded server time: ${formatted} for ${activeTimer.workOrderId}. Segment: ${stepDef.segment}.`,
    });
  };

  const calculateDurations = (actions) => {
    let outbound = 'Not Started';
    let onSite = 'Not Started';
    let returnT = 'Not Started';

    const a1 = actions.find(a => a.step === 1);
    const a2 = actions.find(a => a.step === 2);
    const a3 = actions.find(a => a.step === 3);
    const a4 = actions.find(a => a.step === 4);
    const a5 = actions.find(a => a.step === 5);
    const a6 = actions.find(a => a.step === 6);

    const diffMinutes = (t1, t2) => {
      const d1 = new Date(t1.raw);
      const d2 = new Date(t2.raw);
      // Support visits that cross midnight!
      let diffMs = d2 - d1;
      if (diffMs < 0) diffMs += 24 * 3600 * 1000;
      return Math.round(diffMs / (60 * 1000));
    };

    if (a1 && a2) {
      const m = diffMinutes(a1, a2);
      outbound = `${m} mins (${(m / 60).toFixed(1)} hrs)`;
    } else if (a1) {
      outbound = 'In Progress (Active)';
    }

    if (a3 && a4) {
      const m = diffMinutes(a3, a4);
      onSite = `${m} mins (${(m / 60).toFixed(1)} hrs)`;
    } else if (a3) {
      onSite = 'In Progress (Working at Site)';
    }

    if (a5 && a6) {
      const m = diffMinutes(a5, a6);
      returnT = `${m} mins (${(m / 60).toFixed(1)} hrs)`;
    } else if (a5) {
      returnT = 'In Progress (Returning to Base)';
    }

    let totalStr = 'In Progress';
    if (a1 && a2 && a3 && a4 && a5 && a6) {
      const totalMin = diffMinutes(a1, a2) + diffMinutes(a3, a4) + diffMinutes(a5, a6);
      totalStr = `${totalMin} mins (${(totalMin / 60).toFixed(1)} hrs)`;
    }

    return {
      outboundTravel: outbound,
      onSiteWork: onSite,
      returnTravel: returnT,
      total: totalStr,
    };
  };

  const handleCaptureGps = () => {
    setGpsLoading(true);
    // On-demand simulation with accurate Saudi coordinates
    setTimeout(() => {
      setCapturedGps({
        lat: 24.6625 + (Math.random() * 0.002 - 0.001),
        lng: 46.7328 + (Math.random() * 0.002 - 0.001),
        accuracy: '±3m (RTK high precision)',
        method: 'On-demand mobile capture',
        time: getSaudiTimestamp(),
      });
      setGpsLoading(false);
    }, 600);
  };

  const handleOpenCorrection = (idx) => {
    setCorrectionActionIdx(idx);
    setNewTimestampVal(activeTimer.actions[idx].timestamp);
    setCorrectionReason('');
    setCorrectionModalOpen(true);
  };

  const handleSaveCorrection = (e) => {
    e.preventDefault();
    if (correctionActionIdx === null || !correctionReason.trim()) return;

    const origAction = activeTimer.actions[correctionActionIdx];
    const updatedActions = [...activeTimer.actions];
    updatedActions[correctionActionIdx] = {
      ...origAction,
      timestamp: newTimestampVal,
      corrected: true,
      correctedBy: currentUser.name,
      correctionReason: correctionReason,
    };

    const newDur = calculateDurations(updatedActions);

    const updatedTimer = {
      ...activeTimer,
      actions: updatedActions,
      durations: newDur,
      correctionHistory: [
        ...(activeTimer.correctionHistory || []),
        {
          step: origAction.step,
          originalTimestamp: origAction.timestamp,
          newTimestamp: newTimestampVal,
          reason: correctionReason,
          user: currentUser.name,
          date: getSaudiTimestamp(),
        }
      ]
    };

    onUpdateTimer(updatedTimer);

    addAuditEvent({
      user: currentUser.name,
      role: currentUser.role,
      action: 'Time Log Audited Correction',
      recordId: activeTimer.id,
      details: `Step ${origAction.step} adjusted from "${origAction.timestamp}" to "${newTimestampVal}". Reason: ${correctionReason}. Original retained in audit log.`,
    });

    setCorrectionModalOpen(false);
  };

  return (
    <div className="job-timer-page">
      {/* Page Header */}
      <div className="timer-header-row">
        <div>
          <h1 className="timer-title">Three-Stage Job Timer (RULE-05 to RULE-09)</h1>
          <p className="timer-sub">
            Exactly 3 timed segments and 6 ordered actions. Displays only the next valid action. Time recorded in Saudi Arabia local time (AST).
          </p>
        </div>

        {/* Timer selector */}
        <div className="timer-selector-box">
          <label>Selected Work Order:</label>
          <select 
            value={selectedTimerId}
            onChange={(e) => setSelectedTimerId(e.target.value)}
          >
            {timers.map(t => (
              <option key={t.id} value={t.id}>
                {t.workOrderId} — {t.engineerName} ({t.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandatory Validation Rule Notice */}
      <div className="timer-rule-callout">
        <AlertTriangle size={18} className="callout-icon" />
        <div>
          <strong>Strict Timesheet Requirement:</strong> Exactly 3 segments (Base→Site, Work at Site, Site→Base) 
          and 6 ordered actions. No lunch, break, waiting, or miscellaneous categories permitted. 
          Multi-panel visits share this single trip log and are never multiplied per panel.
        </div>
      </div>

      {activeTimer && (
        <div className="timer-main-layout">
          {/* Left: Active Action & Segments */}
          <div className="timer-controls-card">
            <div className="timer-card-head">
              <div className="job-meta-pill">
                <span className="wo-badge">{activeTimer.workOrderId}</span>
                <span className="eng-badge">{activeTimer.engineerName} ({activeTimer.engineerCode})</span>
                <span className={`timer-status-badge ${activeTimer.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {activeTimer.status}
                </span>
              </div>
              <div className="location-pill">
                <MapPin size={13} />
                <span>{activeTimer.siteLocation}</span>
              </div>
            </div>

            {/* Next Action Prominent Button Area */}
            <div className="next-action-hero-box">
              {isComplete ? (
                <div className="completed-log-banner">
                  <CheckCircle2 size={36} className="comp-icon" />
                  <h3>Three-Stage Job Time Log Completed</h3>
                  <p>All 6 ordered timestamps captured. Outbound, on-site, and return segments finalized.</p>
                </div>
              ) : (
                <div className="active-action-prompt">
                  <span className="step-count-label">NEXT MANDATORY ACTION (Step {currentStep} of 6)</span>
                  <h2 className="next-action-title">
                    {ORDERED_STEPS[currentStep - 1]?.name}
                  </h2>
                  <span className="next-action-segment">
                    Segment: <strong>{ORDERED_STEPS[currentStep - 1]?.segment}</strong>
                  </span>

                  <button 
                    className="btn-trigger-action"
                    onClick={handleNextAction}
                  >
                    <Play size={20} fill="#ffffff" />
                    <span>Record Action & Server Timestamp</span>
                  </button>

                  <span className="enforcement-note">
                    * The interface blocks skipping or reordering steps. Timestamps are logged in AST (Saudi Arabia Standard Time).
                  </span>
                </div>
              )}
            </div>

            {/* Step Progression Timeline (1 to 6) */}
            <div className="ordered-steps-timeline">
              <h3 className="timeline-title">Six Ordered Timestamps Progression</h3>
              <div className="steps-list">
                {ORDERED_STEPS.map((s, idx) => {
                  const logged = activeTimer.actions.find(a => a.step === s.step);
                  const isCurrent = currentStep === s.step;
                  const isPast = logged !== undefined;

                  return (
                    <div 
                      key={s.step} 
                      className={`timeline-step-row ${isPast ? 'logged' : ''} ${isCurrent ? 'current' : ''}`}
                    >
                      <div className="step-num-bubble">
                        {isPast ? '✓' : s.step}
                      </div>

                      <div className="step-info">
                        <div className="step-name-row">
                          <span className="s-name">{s.name}</span>
                          <span className="s-seg">({s.segment})</span>
                        </div>

                        {logged ? (
                          <div className="logged-timestamp-row">
                            <span className="timestamp-text">{logged.timestamp}</span>
                            {logged.corrected && <span className="corrected-flag">(Corrected)</span>}

                            {/* Supervisor or Auditor can audit/correct */}
                            {(currentUser.role.includes('Supervisor') || currentUser.role === 'System administrator') && (
                              <button 
                                className="btn-edit-timestamp"
                                onClick={() => handleOpenCorrection(idx)}
                                title="Supervisor Audited Correction"
                              >
                                <Edit3 size={13} />
                                <span>Correct</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="pending-label">
                            {isCurrent ? 'Pending execution (Ready)' : 'Blocked until prior step completion'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Three Durations Summary & GPS Permission Box */}
          <div className="timer-summary-card">
            <h3 className="summary-title">Three Segment Durations</h3>
            <p className="summary-sub">Calculated strictly between paired timestamps:</p>

            <div className="durations-boxes-list">
              {/* Segment 1 */}
              <div className="duration-metric-box">
                <div className="dur-top">
                  <span className="dur-seg-name">1. Outbound Travel</span>
                  <span className="dur-seg-sub">Room/base → site</span>
                </div>
                <div className="dur-val">{activeTimer.durations.outboundTravel}</div>
              </div>

              {/* Segment 2 */}
              <div className="duration-metric-box highlight">
                <div className="dur-top">
                  <span className="dur-seg-name">2. On-Site Work</span>
                  <span className="dur-seg-sub">Actual work at substation</span>
                </div>
                <div className="dur-val">{activeTimer.durations.onSiteWork}</div>
              </div>

              {/* Segment 3 */}
              <div className="duration-metric-box">
                <div className="dur-top">
                  <span className="dur-seg-name">3. Return Travel</span>
                  <span className="dur-seg-sub">Site → room/base</span>
                </div>
                <div className="dur-val">{activeTimer.durations.returnTravel}</div>
              </div>

              {/* Total Job Time */}
              <div className="duration-metric-box total">
                <div className="dur-top">
                  <span className="dur-seg-name">Total Combined Duration</span>
                  <span className="dur-seg-sub">Outbound + On-site + Return</span>
                </div>
                <div className="dur-val total-accent">{activeTimer.durations.total}</div>
              </div>
            </div>

            {/* GPS Location On-Demand Separation */}
            <div className="gps-ondemand-box">
              <div className="gps-box-head">
                <Navigation size={16} className="nav-icon" />
                <div>
                  <h4>On-Demand GPS Location Capture</h4>
                  <p>GPS is separate from timekeeping. Request permission only for site actions; continuous tracking is forbidden.</p>
                </div>
              </div>

              {capturedGps ? (
                <div className="gps-result-box">
                  <div><strong>Latitude:</strong> {capturedGps.lat.toFixed(5)}° N</div>
                  <div><strong>Longitude:</strong> {capturedGps.lng.toFixed(5)}° E</div>
                  <div><strong>Accuracy:</strong> {capturedGps.accuracy}</div>
                  <div><strong>Capture Time:</strong> {capturedGps.time}</div>
                </div>
              ) : (
                <button 
                  className="btn-capture-gps"
                  onClick={handleCaptureGps}
                  disabled={gpsLoading}
                >
                  <MapPin size={15} />
                  <span>{gpsLoading ? 'Acquiring GPS...' : 'Capture Site GPS Location'}</span>
                </button>
              )}
            </div>

            {/* Correction Audit Log Display */}
            {activeTimer.correctionHistory && activeTimer.correctionHistory.length > 0 && (
              <div className="correction-audit-box">
                <h4>Audit Correction Records</h4>
                {activeTimer.correctionHistory.map((ch, i) => (
                  <div key={i} className="audit-corr-item">
                    <div>Step {ch.step}: Adjusted by {ch.user} at {ch.date}</div>
                    <div className="corr-reason">Reason: "{ch.reason}"</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Supervisor Correction Modal */}
      {correctionModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Edit3 size={18} className="modal-icon" />
                <div>
                  <h3>Audited Timesheet Correction</h3>
                  <span className="modal-subtitle">
                    Step {activeTimer.actions[correctionActionIdx]?.step}: {activeTimer.actions[correctionActionIdx]?.name}
                  </span>
                </div>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setCorrectionModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCorrection} className="correction-form">
              <div className="callout-yellow">
                A correction requires an auditable reason, keeps the original timestamp in history, and logs supervisor identity.
              </div>

              <div className="form-group">
                <label>Adjusted Timestamp (AST) <span className="req">*</span></label>
                <input 
                  type="text" 
                  value={newTimestampVal}
                  onChange={(e) => setNewTimestampVal(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mandatory Correction Reason <span className="req">*</span></label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Substation access security clearance delayed travel log entry by 15 minutes."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions-bar">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setCorrectionModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-assign">
                  Save Audited Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default JobTimer;

