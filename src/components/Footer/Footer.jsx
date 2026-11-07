import React from 'react';
import './Footer.css';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  return (
    <footer className="system-footer">
      {/* Safety Mandate Banner */}
      <div className="safety-mandate-banner">
        <div className="mandate-content">
          <AlertTriangle size={16} className="warning-icon" />
          <span>
            <strong>Safety Mandate:</strong> This system records engineering observations only. It does not authorize MV electrical switching or issue safety permits.
          </span>
        </div>
        <div className="confidential-tag">
          <ShieldCheck size={14} />
          <span>Confidential & Proprietary to Alfanar Electrical Systems</span>
        </div>
      </div>

      {/* Main Footer Metadata Bar */}
      <div className="footer-meta-bar">
        <div className="meta-left">
          <div className="meta-title">Digital MV Customer Service Management System</div>
          <div className="meta-sub">
            <span>Client: <strong>Alfanar Electrical Systems — MV Customer Service</strong></span>
            <span className="dot-divider">•</span>
            <span>Developed by: <strong>Kanpri Technologies LLP</strong></span>
          </div>
        </div>

        <div className="meta-links">
          <button onClick={() => setActiveTab && setActiveTab('usermanual')}>User Manual</button>
          <span className="dot-divider">•</span>
          <button onClick={() => setActiveTab && setActiveTab('scopematrix')}>Traceability Matrix</button>
          <span className="dot-divider">•</span>
          <button onClick={() => setActiveTab && setActiveTab('publicintake')}>Public Intake</button>
          <span className="dot-divider">•</span>
          <button onClick={() => setActiveTab && setActiveTab('audittrail')}>Audit Trail</button>
          <span className="dot-divider">•</span>
          <span className="version-tag">v1.0 (2026)</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

