import React, { useState } from 'react';
import './NCRManagement.css';
import { 
  AlertOctagon, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw, 
  Package, 
  Plus, 
  Download, 
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';

export const NCRManagement = ({ 
  ncrs, 
  inventory, 
  currentUser, 
  onAddNcr, 
  onUpdateNcrDisposition, 
  onPerformStockReversal,
  addAuditEvent,
  setActiveTab 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNcr, setSelectedNcr] = useState(ncrs[0] || null);
  const [dispositionModalOpen, setDispositionModalOpen] = useState(false);
  const [qcaDispositionInput, setQcaDispositionInput] = useState('Replacement Approved — Factory RMA raised');
  const [qcaFindingsInput, setQcaFindingsInput] = useState('Laboratory helium leak test confirmed 0.04 bar/day micro-fissure on port B.');
  const [custodyStateInput, setCustodyStateInput] = useState('Quarantined in Base Store Room 2');

  // Stock reversal modal
  const [reversalModalOpen, setReversalModalOpen] = useState(false);
  const [reversalReason, setReversalReason] = useState('');

  // QCA permission check
  const isQcaUser = currentUser.role === 'QCA / storekeeper';

  const filteredNcrs = ncrs.filter(n => 
    n.ncrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.sapCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveDisposition = (e) => {
    e.preventDefault();
    if (!isQcaUser) {
      alert('Permission Denied (RULE-12): Only users with the QCA role can approve material disposition. Admin rights do not replace it.');
      return;
    }

    onUpdateNcrDisposition({
      ncrNumber: selectedNcr.ncrNumber,
      qcaDisposition: qcaDispositionInput,
      testingQcaFinding: qcaFindingsInput,
      custodyState: custodyStateInput,
      qcaApprovedBy: currentUser.name,
    });

    addAuditEvent({
      user: currentUser.name,
      role: currentUser.role,
      action: 'QCA Material Disposition Sign-off',
      recordId: selectedNcr.ncrNumber,
      details: `Updated disposition: "${qcaDispositionInput}". Custody state: "${custodyStateInput}".`,
    });

    setDispositionModalOpen(false);
  };

  const handleSaveReversal = (e) => {
    e.preventDefault();
    if (!reversalReason.trim()) return;

    onPerformStockReversal({
      ncrNumber: selectedNcr.ncrNumber,
      reason: reversalReason,
      reversedBy: currentUser.name,
      date: new Date().toISOString(),
    });

    addAuditEvent({
      user: currentUser.name,
      role: currentUser.role,
      action: 'Append-Only Stock Transaction Reversal',
      recordId: selectedNcr.ncrNumber,
      details: `Reversed stock movement for item on ${selectedNcr.ncrNumber}. Reason: "${reversalReason}". Historical records preserved.`,
    });

    setReversalModalOpen(false);
    setReversalReason('');
  };

  return (
    <div className="ncr-page-container">
      <div className="ncr-head-row">
        <div>
          <h1 className="ncr-title">07 Non-Conformance Reports (NCR) & Material Custody</h1>
          <p className="ncr-sub">
            Independent approval and custody states, QCA lab findings, and audited stock movement reversals.
          </p>
        </div>

        <button 
          className="btn-export-ncr-16"
          onClick={() => setActiveTab('reports')}
        >
          <FileSpreadsheet size={15} />
          <span>Export Approved 16-Col NCR Excel</span>
        </button>
      </div>

      {/* QCA Access Banner */}
      {!isQcaUser && (
        <div className="qca-notice-banner">
          <ShieldCheck size={16} />
          <span>
            Logged in as <strong>{currentUser.name}</strong> ({currentUser.role}). 
            <strong>RULE-12 Enforcement:</strong> Only users with the <strong>QCA / storekeeper</strong> role can approve material disposition. Administrator status alone does not replace QCA authority.
          </span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="ncr-filter-bar">
        <div className="search-wrap">
          <Search size={15} />
          <input 
            type="text" 
            placeholder="Search NCR Number, SAP Code, Serial No, or defect..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="ncr-cards-layout">
        {/* Left: NCR Records List */}
        <div className="ncr-list-card">
          <div className="table-responsive">
            <table className="ncr-table">
              <thead>
                <tr>
                  <th>NCR No. & SAP Code</th>
                  <th>Affected Equipment</th>
                  <th>Defect Description</th>
                  <th>NCR Approval State</th>
                  <th>Physical Custody State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredNcrs.map(n => (
                  <tr 
                    key={n.ncrNumber} 
                    className={selectedNcr?.ncrNumber === n.ncrNumber ? 'selected-row' : ''}
                    onClick={() => setSelectedNcr(n)}
                  >
                    <td>
                      <div className="ncr-id-cell">
                        <strong className="mono">{n.ncrNumber}</strong>
                        <span className="mono-sub">{n.sapCode}</span>
                        <span className="date-sub">Received: {n.complaintReceivedDate}</span>
                      </div>
                    </td>

                    <td>
                      <div className="equip-cell">
                        <strong>{n.make}</strong>
                        <span className="mono">{n.serialNo}</span>
                        <span className="model-sub">{n.ordModelNo}</span>
                      </div>
                    </td>

                    <td>
                      <div className="defect-cell">
                        <span className="nature-tag">{n.natureOfComplaint}</span>
                        <p className="desc-text">{n.description}</p>
                        <span className="cause-text">Cause: {n.causeOfComplaint}</span>
                      </div>
                    </td>

                    <td>
                      <div className="state-badge-wrap">
                        <span className="disposition-badge">
                          {n.qcaDisposition || 'Pending QCA Review'}
                        </span>
                        <span className="approver-sub">Approved by: {n.qcaApprovedBy}</span>
                      </div>
                    </td>

                    <td>
                      <div className="custody-badge-wrap">
                        <span className="custody-pill">{n.custodyState}</span>
                        <span className="mat-status-sub">{n.materialStatus}</span>
                      </div>
                    </td>

                    <td>
                      <button 
                        className="btn-select-ncr"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNcr(n);
                          setDispositionModalOpen(true);
                        }}
                      >
                        QCA Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected NCR Deep Dive & QCA Disposition Controls */}
        {selectedNcr && (
          <div className="ncr-detail-card">
            <div className="detail-head">
              <AlertOctagon size={20} className="ncr-icon" />
              <div>
                <h3>{selectedNcr.ncrNumber}</h3>
                <span className="detail-sub">Work Order: {selectedNcr.workOrderId} • Panel: {selectedNcr.panelSerial}</span>
              </div>
            </div>

            <div className="detail-fields-list">
              <div className="d-item">
                <span className="label">Site & Region:</span>
                <span className="val">{selectedNcr.siteRegionSalesOrder}</span>
              </div>

              <div className="d-item">
                <span className="label">Customer Observation / Comment:</span>
                <span className="val italic">"{selectedNcr.customerComment}"</span>
              </div>

              <div className="d-item">
                <span className="label">QCA Laboratory Findings:</span>
                <span className="val findings-box">{selectedNcr.testingQcaFinding}</span>
              </div>

              <div className="d-item">
                <span className="label">Current Material Custody:</span>
                <span className="val custody-highlight">{selectedNcr.custodyState}</span>
              </div>

              <div className="d-item">
                <span className="label">Attended By:</span>
                <span className="val"><strong>{selectedNcr.attendedBy}</strong></span>
              </div>
            </div>

            {/* Custody Reversal History (RULE-14) */}
            <div className="reversals-section">
              <h4>Append-Only Stock Reversals (RULE-14)</h4>
              <p className="rev-note">Old stock events are never altered. Mistakes are fixed via audited reversal.</p>
              {selectedNcr.reversals && selectedNcr.reversals.length > 0 ? (
                selectedNcr.reversals.map((r, i) => (
                  <div key={i} className="reversal-log-item">
                    <span>Reversed by {r.reversedBy} on {r.date}: "{r.reason}"</span>
                  </div>
                ))
              ) : (
                <div className="no-rev-text">No reversals recorded on this ledger line.</div>
              )}
            </div>

            <div className="detail-actions-bar">
              <button 
                className="btn-trigger-reversal"
                onClick={() => setReversalModalOpen(true)}
              >
                <RotateCcw size={14} />
                <span>Audited Stock Reversal</span>
              </button>

              <button 
                className="btn-open-disposition"
                onClick={() => setDispositionModalOpen(true)}
              >
                <span>Edit QCA Findings & Disposition</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QCA Disposition Modal */}
      {dispositionModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <ShieldCheck size={18} className="modal-icon" />
                <div>
                  <h3>Record QCA Findings & Material Disposition</h3>
                  <span className="modal-subtitle">NCR: {selectedNcr.ncrNumber} ({selectedNcr.sapCode})</span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setDispositionModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveDisposition} className="triage-form">
              <div className="callout-yellow">
                <strong>RULE-12:</strong> Only users with the QCA role can approve material disposition. Admin rights do not replace it.
              </div>

              <div className="form-group">
                <label>QCA Material Disposition Decision <span className="req">*</span></label>
                <select 
                  value={qcaDispositionInput}
                  onChange={(e) => setQcaDispositionInput(e.target.value)}
                  required
                >
                  <option value="Replacement Approved — Factory RMA raised">Replacement Approved — Factory RMA raised</option>
                  <option value="Approved for Re-work / In-house repair">Approved for Re-work / In-house repair</option>
                  <option value="Scrap & Decommission">Scrap & Decommission</option>
                  <option value="Customer Return (Non-defective)">Customer Return (Non-defective)</option>
                  <option value="Quarantined for Further Lab Analysis">Quarantined for Further Lab Analysis</option>
                </select>
              </div>

              <div className="form-group">
                <label>Laboratory Testing & Inspection Findings <span className="req">*</span></label>
                <textarea 
                  rows={3}
                  value={qcaFindingsInput}
                  onChange={(e) => setQcaFindingsInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Independent Physical Custody State <span className="req">*</span></label>
                <input 
                  type="text" 
                  value={custodyStateInput}
                  onChange={(e) => setCustodyStateInput(e.target.value)}
                  placeholder="e.g. Quarantined in Base Store Room 2"
                  required
                />
                <span className="permit-note">
                  * In accordance with RULE-14, NCR approval state and custody state never depend on each other.
                </span>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-cancel" onClick={() => setDispositionModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-confirm-assign" disabled={!isQcaUser}>
                  Save QCA Disposition Sign-off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Reversal Modal */}
      {reversalModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <RotateCcw size={18} className="modal-icon" />
                <div>
                  <h3>Append-Only Stock Movement Reversal (RULE-14)</h3>
                  <span className="modal-subtitle">NCR: {selectedNcr.ncrNumber}</span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setReversalModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveReversal} className="triage-form">
              <div className="callout-yellow">
                Database entries for stock events are append-only and cannot be updated in-place. This reversal creates a compensating audit ledger entry.
              </div>

              <div className="form-group">
                <label>Mandatory Justification for Stock Reversal <span className="req">*</span></label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Serial tag mismatch during bay transit; reversed quarantine transaction to return item to inspection holding bay."
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-cancel" onClick={() => setReversalModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-confirm-return">
                  Commit Audited Reversal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default NCRManagement;

