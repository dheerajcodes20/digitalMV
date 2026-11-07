import React, { useState } from 'react';
import './SpecialistWorkflows.css';
import { 
  Headphones, 
  PowerOff, 
  Activity, 
  Wrench, 
  UserCheck, 
  GraduationCap, 
  CheckCircle, 
  Calendar, 
  FileText, 
  Layers
} from 'lucide-react';

export const SpecialistWorkflows = () => {
  const [activeWorkflow, setActiveWorkflow] = useState('remote'); // remote, shutdown, commissioning, pm, closure, training

  return (
    <div className="specialist-page-container">
      <div className="specialist-header-row">
        <div>
          <h1 className="spec-title">Specialist Service Workflows (Phase 3 Modules)</h1>
          <p className="spec-sub">
            Technical modules covering remote support, isolation planning, commissioning, preventive maintenance, and customer handover.
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="specialist-nav-bar">
        <button 
          className={`spec-tab ${activeWorkflow === 'remote' ? 'active' : ''}`}
          onClick={() => setActiveWorkflow('remote')}
        >
          <Headphones size={15} />
          <span>09 Remote Support</span>
        </button>

        <button 
          className={`spec-tab ${activeWorkflow === 'shutdown' ? 'active' : ''}`}
          onClick={() => setActiveWorkflow('shutdown')}
        >
          <PowerOff size={15} />
          <span>10 Shutdown Planning</span>
        </button>

        <button 
          className={`spec-tab ${activeWorkflow === 'commissioning' ? 'active' : ''}`}
          onClick={() => setActiveWorkflow('commissioning')}
        >
          <Activity size={15} />
          <span>11 Commissioning</span>
        </button>

        <button 
          className={`spec-tab ${activeWorkflow === 'pm' ? 'active' : ''}`}
          onClick={() => setActiveWorkflow('pm')}
        >
          <Wrench size={15} />
          <span>12 Preventive Maint.</span>
        </button>

        <button 
          className={`spec-tab ${activeWorkflow === 'closure' ? 'active' : ''}`}
          onClick={() => setActiveWorkflow('closure')}
        >
          <UserCheck size={15} />
          <span>13 Customer Closure</span>
        </button>

        <button 
          className={`spec-tab ${activeWorkflow === 'training' ? 'active' : ''}`}
          onClick={() => setActiveWorkflow('training')}
        >
          <GraduationCap size={15} />
          <span>14 Training Records</span>
        </button>
      </div>

      {/* Content cards */}
      <div className="workflow-detail-card">
        {activeWorkflow === 'remote' && (
          <div>
            <h3>09 Remote Technical Support Sessions</h3>
            <p className="wf-desc">
              Connect field staff directly with senior Alfanar MV technical specialists for remote telemetry diagnostics.
            </p>

            <div className="wf-records-list">
              <div className="wf-item">
                <div className="wf-item-head">
                  <strong>Session #RTS-2026-041</strong>
                  <span className="wf-status-tag">Completed</span>
                </div>
                <div className="wf-meta">Linked WO: <strong>WO-2026-0108</strong> • Specialist: Senior MV Technical Lead</div>
                <p className="wf-notes">
                  "Remotely guided the field engineer through RTU analog 4-20mA transducer loop zero-span calibration after viton seal replacement."
                </p>
              </div>
            </div>
          </div>
        )}

        {activeWorkflow === 'shutdown' && (
          <div>
            <h3>10 Substation Shutdown & Electrical Isolation Planning</h3>
            <p className="wf-desc">
              <strong>RULE-19 Safety Mandate:</strong> Substation shutdown requirements, customer utility approvals, 
              and PTW permits remain separate fields. An application status NEVER authorizes physical electrical switching.
            </p>

            <div className="wf-records-list">
              <div className="wf-item">
                <div className="wf-item-head">
                  <strong>Plan #SDP-2026-019 — Southern Dunes Solar Grid Station</strong>
                  <span className="wf-status-tag approved">PTW Validated</span>
                </div>
                <div className="wf-meta">Permit Ref: <strong>RSG-ELEC-4401</strong> • Customer Utility Approver: Red Sea Grid Control</div>
                <p className="wf-notes">
                  "De-energization of 33kV Solar Bay required prior to mechanical interlock adjustment. Lockout-Tagout (LOTO) key interlock verified."
                </p>
              </div>
            </div>
          </div>
        )}

        {activeWorkflow === 'commissioning' && (
          <div>
            <h3>11 Structured Commissioning Checklists</h3>
            <p className="wf-desc">
              Standardized factory and on-site acceptance testing (FAT/SAT) protocols for 13.8kV and 33kV switchgear lineups.
            </p>

            <div className="commissioning-checks-grid">
              <div className="comm-box">
                <CheckCircle size={16} className="comm-icon" />
                <div>
                  <strong>Busbar Insulation Resistance (5kV Megger)</strong>
                  <span>Phases R-Y, Y-B, B-R &gt; 2000 MΩ required.</span>
                </div>
              </div>
              <div className="comm-box">
                <CheckCircle size={16} className="comm-icon" />
                <div>
                  <strong>Contact Resistance (Ductor 100A DC)</strong>
                  <span>Main vacuum interrupter contacts &lt; 45 µΩ.</span>
                </div>
              </div>
              <div className="comm-box">
                <CheckCircle size={16} className="comm-icon" />
                <div>
                  <strong>Protection Relay Trip Logic Verification</strong>
                  <span>Ingeteam / ZIV controller secondary injection verified.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeWorkflow === 'pm' && (
          <div>
            <h3>12 Preventive Maintenance Schedules</h3>
            <p className="wf-desc">
              Periodic health assessments for installed switchgear, SF6 gas monitoring, and mechanism lubrication.
            </p>

            <div className="wf-records-list">
              <div className="wf-item">
                <div className="wf-item-head">
                  <strong>PM Cycle 2026-Q4 — Central Region Feeders</strong>
                  <span className="wf-status-tag pending">Scheduled</span>
                </div>
                <div className="wf-meta">Cycle Target: 14 RMU / SLBS units • Due: 2026-11-30</div>
                <p className="wf-notes">
                  "Annual SF6 pressure verification, operating mechanism spring charge inspection, and battery charger float voltage test."
                </p>
              </div>
            </div>
          </div>
        )}

        {activeWorkflow === 'closure' && (
          <div>
            <h3>13 Customer Acceptance & Final Formal Closure</h3>
            <p className="wf-desc">
              <strong>RULE-11:</strong> Final closure requires supervisor sign-off, client acceptance acknowledgement, and recorded closure reason.
            </p>

            <div className="closure-summary-box">
              <div className="cs-row">
                <span>Total Registered Cases:</span>
                <strong>3 Cases</strong>
              </div>
              <div className="cs-row">
                <span>Active Field Work:</span>
                <strong>2 Work Orders</strong>
              </div>
              <div className="cs-row">
                <span>Awaiting Customer Sign-off:</span>
                <strong>1 Case</strong>
              </div>
            </div>
          </div>
        )}

        {activeWorkflow === 'training' && (
          <div>
            <h3>14 Technical Training & Certification Records</h3>
            <p className="wf-desc">
              Field personnel certification tracking for medium-voltage safety, Ingeteam controller configuration, and SF6 gas handling.
            </p>

            <div className="wf-records-list">
              <div className="wf-item">
                <div className="wf-item-head">
                  <strong>Training #TRN-2026-08: Ingeteam 33kV Controller Firmware & Diagnostics</strong>
                  <span className="wf-status-tag approved">Completed</span>
                </div>
                <div className="wf-meta">Date: 2026-09-20 • Location: Alfanar Training Center, Riyadh</div>
                <p className="wf-notes">
                  "Attendees: Certified Field Engineering Crew. Certified on fault record analysis and event log extraction."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SpecialistWorkflows;

