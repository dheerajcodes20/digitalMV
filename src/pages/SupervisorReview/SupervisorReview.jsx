import React, { useState } from 'react';
import './SupervisorReview.css';
import { 
  CheckSquare, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Clock, 
  ShieldAlert, 
  User, 
  Layers, 
  Send,
  Eye,
  Check
} from 'lucide-react';

export const SupervisorReview = ({ 
  visits, 
  complaints, 
  currentUser, 
  onApproveVisit, 
  onReturnVisit, 
  onCompleteClosureEvent,
  addAuditEvent 
}) => {
  const [selectedVisitId, setSelectedVisitId] = useState(visits[0]?.visitId || '');
  const [returnComments, setReturnComments] = useState('');
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [closureModalOpen, setClosureModalOpen] = useState(false);
  const [closureReason, setClosureReason] = useState('Satisfactory repair verified with client signature');

  const activeVisit = visits.find(v => v.visitId === selectedVisitId) || visits[0];
  const linkedComplaint = activeVisit ? complaints.find(c => c.linkedWorkOrder === activeVisit.workOrderId || c.id === activeVisit.complaintId) : null;

  // Separation of duties rule check
  const isAuthor = activeVisit && (activeVisit.leadEngineer === currentUser.name);
  const isSupervisor = currentUser.role.includes('Supervisor') || currentUser.role === 'System administrator';
  const canApprove = isSupervisor && !isAuthor;

  const handleApprove = () => {
    if (!canApprove) {
      alert('Separation of Duties Violation (RULE-11): The author of the report cannot approve their own technical closure.');
      return;
    }

    onApproveVisit(activeVisit.visitId);

    addAuditEvent({
      user: currentUser.name,
      role: currentUser.role,
      action: 'Supervisor Technical Approval',
      recordId: activeVisit.visitId,
      details: `Approved Revision ${activeVisit.revision} for ${activeVisit.workOrderId}. Technical closure confirmed.`,
    });
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!returnComments.trim()) return;

    onReturnVisit(activeVisit.visitId, returnComments);

    addAuditEvent({
      user: currentUser.name,
      role: currentUser.role,
      action: 'Report Returned for Correction',
      recordId: activeVisit.visitId,
      details: `Returned Revision ${activeVisit.revision} to ${activeVisit.leadEngineer}. Reason: "${returnComments}". New revision created.`,
    });

    setReturnModalOpen(false);
    setReturnComments('');
  };

  const handleExecuteClosureEvent = (eventStep) => {
    if (!isSupervisor) {
      alert('Only an authorized Supervisor or Administrator can record closure milestones.');
      return;
    }

    onCompleteClosureEvent(linkedComplaint?.id || 'CMP-2026-0034', eventStep, closureReason);

    addAuditEvent({
      user: currentUser.name,
      role: currentUser.role,
      action: `Case Closure Event: ${eventStep}`,
      recordId: linkedComplaint?.id || activeVisit.workOrderId,
      details: `Recorded distinct milestone "${eventStep}". Reason: ${closureReason}.`,
    });
  };

  return (
    <div className="supervisor-review-page">
      <div className="review-head-bar">
        <div>
          <h1 className="review-title">Supervisor Review & 4-Event Case Closure</h1>
          <p className="review-sub">
            Step 5 Review & Return loop (Revision tracking) and Step 7 Four Distinct Closure Milestones.
          </p>
        </div>

        {/* Visit selector */}
        <div className="visit-select-wrap">
          <label>Reviewing Attendance:</label>
          <select 
            value={selectedVisitId}
            onChange={(e) => setSelectedVisitId(e.target.value)}
          >
            {visits.map(v => (
              <option key={v.visitId} value={v.visitId}>
                {v.visitId} — {v.workOrderId} ({v.reviewState})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Separation of Duties Warning */}
      {isAuthor && (
        <div className="sod-warning-banner">
          <ShieldAlert size={18} />
          <span>
            <strong>Separation of Duties Restriction (RULE-11):</strong> You are logged in as <strong>{currentUser.name}</strong>, who authored this technical report. System policy blocks engineers from self-approving their own work.
          </span>
        </div>
      )}

      {activeVisit && (
        <div className="review-grid-layout">
          {/* Left Column: Report Inspection Review */}
          <div className="report-review-card">
            <div className="report-head">
              <div className="report-id-group">
                <span className="rep-id">{activeVisit.visitId}</span>
                <span className="rep-rev">Revision {activeVisit.revision}</span>
                <span className={`rep-state ${activeVisit.reviewState.toLowerCase().replace(/\s+/g, '-')}`}>
                  {activeVisit.reviewState}
                </span>
              </div>
              <div className="rep-meta">
                <span>Date: {activeVisit.visitDate}</span> • <span>Author: <strong>{activeVisit.leadEngineer}</strong></span>
              </div>
            </div>

            {/* Visit Details */}
            <div className="visit-details-summary">
              <div className="sum-item">
                <span className="k">Site & Location:</span>
                <span className="v">{activeVisit.siteLocation}</span>
              </div>
              <div className="sum-item">
                <span className="k">Customer:</span>
                <span className="v">{activeVisit.customerName}</span>
              </div>
              <div className="sum-item">
                <span className="k">Work Order:</span>
                <span className="v">{activeVisit.workOrderId}</span>
              </div>
              <div className="sum-item">
                <span className="k">Crew:</span>
                <span className="v">{activeVisit.crew}</span>
              </div>
              <div className="sum-item">
                <span className="k">GPS Point:</span>
                <span className="v mono">{activeVisit.gps?.latitude}° N, {activeVisit.gps?.longitude}° E</span>
              </div>
            </div>

            {/* Inspected Panels in this Visit */}
            <div className="review-panels-list">
              <h4>Inspected Panels ({activeVisit.panels.length})</h4>
              {activeVisit.panels.map((p, pIdx) => (
                <div key={pIdx} className="review-panel-card">
                  <div className="p-header">
                    <span className="p-badge">{p.panelId}</span>
                    <strong className="mono">{p.serialNo}</strong>
                    <span>{p.panelType || p.panelFamily} ({p.voltage})</span>
                    <span className={`eng-tag ${p.energyState.toLowerCase().replace(/\s+/g, '-')}`}>
                      {p.energyState}
                    </span>
                  </div>

                  <div className="p-details-row">
                    <div><strong>RTU:</strong> {p.rtuType}</div>
                    <div><strong>SO:</strong> {p.salesOrder}</div>
                    <div><strong>Job Status:</strong> {p.jobStatus}</div>
                  </div>

                  <div className="findings-quote">
                    <div><strong>Observed Finding:</strong> {p.finding}</div>
                    <div><strong>Confirmed Cause:</strong> {p.confirmedCause}</div>
                    <div><strong>Work Performed:</strong> {p.actualWork}</div>
                  </div>

                  {/* Checklist Summary */}
                  <div className="checklist-chips">
                    {Object.entries(p.checklist).map(([chk, res]) => (
                      <span key={chk} className={`chk-chip ${res.toLowerCase().replace(/\s+/g, '-')}`}>
                        {chk}: {res}
                      </span>
                    ))}
                  </div>

                  {p.defectiveMaterialSlNo && (
                    <div className="ncr-attached-tag">
                      <AlertTriangle size={13} />
                      <span>Linked NCR Raised: <strong>{p.defectiveMaterialSlNo}</strong> ({p.defectiveItem})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions for Supervisor */}
            <div className="supervisor-decision-bar">
              <button 
                className="btn-return-report"
                onClick={() => setReturnModalOpen(true)}
                disabled={!isSupervisor}
              >
                <RotateCcw size={16} />
                <span>Return for Correction (Create Rev 2)</span>
              </button>

              <button 
                className="btn-approve-report"
                onClick={handleApprove}
                disabled={!canApprove || activeVisit.reviewState === 'Approved'}
              >
                <CheckCircle2 size={16} />
                <span>{activeVisit.reviewState === 'Approved' ? 'Report Approved' : 'Approve Technical Report'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Step 7 Four Distinct Closure Events */}
          <div className="closure-milestones-card">
            <h3 className="closure-card-title">Step 7: Case Closure Milestones</h3>
            <p className="closure-card-sub">
              Enforces four separate events (RULE-11). The four closure events stay distinct and are never merged into one automatic status flip.
            </p>

            <div className="milestones-steps-list">
              {/* Event 1 */}
              <div className="milestone-item completed">
                <div className="m-icon">1</div>
                <div className="m-content">
                  <div className="m-title">1. Internal Technical Resolution</div>
                  <div className="m-desc">Recorded by field engineer upon successful technical checks.</div>
                  <span className="m-status-tag done">Recorded ✓</span>
                </div>
              </div>

              {/* Event 2 */}
              <div className={`milestone-item ${activeVisit.reviewState === 'Approved' ? 'completed' : 'pending'}`}>
                <div className="m-icon">2</div>
                <div className="m-content">
                  <div className="m-title">2. Supervisor Technical Approval</div>
                  <div className="m-desc">Sign-off by dispatch supervisor confirming scope & readings.</div>
                  {activeVisit.reviewState === 'Approved' ? (
                    <span className="m-status-tag done">Approved by Dispatcher Supervisor ✓</span>
                  ) : (
                    <button 
                      className="btn-m-action"
                      onClick={handleApprove}
                      disabled={!canApprove}
                    >
                      Sign Off Milestone
                    </button>
                  )}
                </div>
              </div>

              {/* Event 3 */}
              <div className="milestone-item">
                <div className="m-icon">3</div>
                <div className="m-content">
                  <div className="m-title">3. Customer Utility Acceptance</div>
                  <div className="m-desc">Customer representative sign-off and service acceptance acknowledgement.</div>
                  <button 
                    className="btn-m-action"
                    onClick={() => handleExecuteClosureEvent('Customer Acceptance Recorded')}
                    disabled={!isSupervisor || activeVisit.reviewState !== 'Approved'}
                  >
                    Record Customer Acceptance
                  </button>
                </div>
              </div>

              {/* Event 4 */}
              <div className="milestone-item">
                <div className="m-icon">4</div>
                <div className="m-content">
                  <div className="m-title">4. Final Administrative Case Closure</div>
                  <div className="m-desc">Formal case closure with documented reason. Reopening requires authorized exception.</div>
                  <button 
                    className="btn-m-action close-final"
                    onClick={() => handleExecuteClosureEvent('Final Case Closure')}
                    disabled={!isSupervisor || activeVisit.reviewState !== 'Approved'}
                  >
                    Authorize Final Case Closure
                  </button>
                </div>
              </div>
            </div>

            <div className="rule-note-box">
              <strong>Audit Policy:</strong> Every milestone creates an immutable timestamped event with actor credentials in the system audit trail.
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {returnModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <RotateCcw size={18} className="modal-icon" />
                <div>
                  <h3>Return Report for Revision Correction</h3>
                  <span className="modal-subtitle">
                    Returning {activeVisit.visitId} (Rev {activeVisit.revision}) to {activeVisit.leadEngineer}
                  </span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setReturnModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleReturnSubmit} className="triage-form">
              <div className="callout-yellow">
                Upon return, a new Revision {activeVisit.revision + 1} will be initialized for the engineer to correct. Revision {activeVisit.revision} is permanently preserved in the audit log.
              </div>

              <div className="form-group">
                <label>Supervisor Correction Instructions & Comments <span className="req">*</span></label>
                <textarea 
                  rows={4}
                  placeholder="Detail the required corrections (e.g. clarify the insulation resistance test instrument calibration date and re-verify tamper seal photo)..."
                  value={returnComments}
                  onChange={(e) => setReturnComments(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-cancel" onClick={() => setReturnModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-confirm-return">
                  <RotateCcw size={14} />
                  <span>Return Report (Spawn Revision {activeVisit.revision + 1})</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default SupervisorReview;

