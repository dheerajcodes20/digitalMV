import React, { useState } from 'react';
import './ScopeMatrix.css';
import { 
  Network, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  Layers, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { SCOPE_MATRIX_DATA, ACCEPTANCE_CHECKLIST_DATA } from '../../data/mockData';

export const ScopeMatrix = () => {
  const [activeTab, setActiveTab] = useState('scope'); // 'scope' | 'acceptance' | 'sop'

  return (
    <div className="scopematrix-page-container">
      <div className="matrix-head-row">
        <div>
          <h1 className="matrix-title">Requirements Matrix & Scope Verification</h1>
          <p className="matrix-sub">
            Traceability matrix from the developer briefing workbook covering Modules 01–22, Acceptance Tests A1–A12, and SOP guidelines.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="matrix-tabs-bar">
        <button 
          className={`m-tab-btn ${activeTab === 'scope' ? 'active' : ''}`}
          onClick={() => setActiveTab('scope')}
        >
          <Layers size={15} />
          <span>Scope & Quotation Matrix (22 Modules)</span>
        </button>

        <button 
          className={`m-tab-btn ${activeTab === 'acceptance' ? 'active' : ''}`}
          onClick={() => setActiveTab('acceptance')}
        >
          <CheckCircle2 size={15} />
          <span>Acceptance Checklist (A1 to A12)</span>
        </button>

        <button 
          className={`m-tab-btn ${activeTab === 'sop' ? 'active' : ''}`}
          onClick={() => setActiveTab('sop')}
        >
          <FileText size={15} />
          <span>Operating SOP & Developer Rules</span>
        </button>
      </div>

      {/* Tab 1: Scope & Quotation Matrix */}
      {activeTab === 'scope' && (
        <div className="matrix-content-card">
          <div className="matrix-card-header">
            <div>
              <h3>SCOPE AND QUOTATION MATRIX</h3>
              <p>Itemized phased quotation (Target ₹3–4 Lakh target aligned; No silent omissions).</p>
            </div>
            <div className="commercial-target-pill">
              <IndianRupee size={14} />
              <span>Target: ₹3.0 – 4.0 Lakh</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Module / Deliverable</th>
                  <th>Phase</th>
                  <th>Status</th>
                  <th>Price (₹)</th>
                  <th>Recurring / mo</th>
                  <th>Acceptance Evidence / Functional Notes</th>
                </tr>
              </thead>
              <tbody>
                {SCOPE_MATRIX_DATA.map((row) => (
                  <tr key={row.id}>
                    <td><strong className="mono">{row.id}</strong></td>
                    <td><strong>{row.module}</strong></td>
                    <td><span className="phase-badge">Phase {row.phase}</span></td>
                    <td>
                      <span className={`status-badge ${row.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {row.status}
                      </span>
                    </td>
                    <td><strong className="mono">{row.oneTime}</strong></td>
                    <td><span className="mono">{row.recurring}</span></td>
                    <td className="evidence-notes">{row.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Acceptance Checklist */}
      {activeTab === 'acceptance' && (
        <div className="matrix-content-card">
          <div className="matrix-card-header">
            <div>
              <h3>DEMO AND ACCEPTANCE CHECKLIST</h3>
              <p>Pass/Fail verification matrix against product handover requirements.</p>
            </div>
            <span className="all-pass-pill">12 / 12 Verified Complete</span>
          </div>

          <div className="table-responsive">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Check ID</th>
                  <th>Acceptance Criterion</th>
                  <th>Expected Proof / Test</th>
                  <th>Verification Status</th>
                  <th>Operational Proof / Notes</th>
                </tr>
              </thead>
              <tbody>
                {ACCEPTANCE_CHECKLIST_DATA.map((ac) => (
                  <tr key={ac.id}>
                    <td><strong className="mono">{ac.id}</strong></td>
                    <td><strong>{ac.check}</strong></td>
                    <td className="expected-proof">{ac.expected}</td>
                    <td>
                      <span className="status-badge pass">
                        ✓ {ac.status}
                      </span>
                    </td>
                    <td className="evidence-notes">{ac.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Operating SOP & Developer Rules */}
      {activeTab === 'sop' && (
        <div className="matrix-content-card">
          <h3>Developer Handover | Mandatory Operating Principles</h3>
          <p className="sop-intro">
            Summary of non-negotiable architectural mandates from the Developer Handover & Workflow Guide:
          </p>

          <div className="sop-rules-list">
            <div className="sop-rule-item">
              <ShieldCheck size={20} className="sop-icon" />
              <div>
                <strong>1. Strict Separation of Duties (RULE-11)</strong>
                <p>An engineer who authors a technical site visit report cannot approve their own technical closure. QCA material disposition requires the QCA role. Administrator privileges do not replace either.</p>
              </div>
            </div>

            <div className="sop-rule-item">
              <ShieldCheck size={20} className="sop-icon" />
              <div>
                <strong>2. Exact Three-Segment Timesheet (RULE-05 to RULE-09)</strong>
                <p>The time log contains exactly 3 segments and 6 ordered actions: Base→Site, On-site Work, Site→Base. Interface strictly displays only the next valid action. No lunch, break, or waiting categories.</p>
              </div>
            </div>

            <div className="sop-rule-item">
              <ShieldCheck size={20} className="sop-icon" />
              <div>
                <strong>3. Exact Legacy Exports (RULE-18)</strong>
                <p>Site Visit export must have exactly 25 headers in frozen order including raw Status1. NCR export must have exactly 16 headers in frozen order. No extra worksheet index columns.</p>
              </div>
            </div>

            <div className="sop-rule-item">
              <ShieldCheck size={20} className="sop-icon" />
              <div>
                <strong>4. Application Status is Never Electrical Isolation Authorization (RULE-19)</strong>
                <p>Substation shutdown requirement, customer utility approval, and PTW permit reference are three separate fields. System records engineering observations only and never authorizes live electrical switching.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ScopeMatrix;

