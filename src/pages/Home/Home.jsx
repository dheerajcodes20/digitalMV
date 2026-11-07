import React from 'react';
import './Home.css';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Users, 
  Activity, 
  Cpu, 
  MapPin, 
  Database,
  ExternalLink
} from 'lucide-react';

export const Home = ({ setActiveTab, setCurrentUser, users }) => {
  const supervisorUser = users.find(u => u.id === 'usr-1');
  const engineerUser = users.find(u => u.id === 'usr-2');
  const auditorUser = users.find(u => u.id === 'usr-5');
  const qcaUser = users.find(u => u.id === 'usr-4');

  const services = [
    {
      title: 'Customer Complaint Intake',
      desc: 'Safe public submission portal with unique reference generation, immutable complaint retention, and zero public record exposure.',
      tab: 'publicintake',
      icon: FileText,
      badge: 'Public & Internal'
    },
    {
      title: 'Triage & Work Order Dispatch',
      desc: 'Supervisor assessment, duplicate checking, priority setting, permit/shutdown verification, and engineer assignment.',
      tab: 'workorders',
      icon: Activity,
      badge: 'Supervisor Gate'
    },
    {
      title: 'Three-Stage Job Timekeeping',
      desc: 'Strict 6-ordered actions: Base → Site, On-site Work, and Site → Base. Supports midnight crossing with auditable corrections.',
      tab: 'jobtimer',
      icon: Clock,
      badge: 'Strict 6-Action'
    },
    {
      title: 'Site Visit & Panel Inspection',
      desc: 'Multi-panel records under one attendance header. Equipment tree for LBS, Auto-Recloser, RMU, and component checklists.',
      tab: 'visitwizard',
      icon: Cpu,
      badge: '13.8 kV / 33 kV'
    },
    {
      title: 'NCR & Material Quality Control',
      desc: 'Independent approval and custody states. QCA testing findings, serialized replacement tracking, and audited stock reversals.',
      tab: 'ncrmanagement',
      icon: AlertTriangle,
      badge: 'QCA Governed'
    },
    {
      title: '25-Col & 16-Col Legacy Exports',
      desc: 'Strictly preserved legacy Excel schema with exact headers, official PDF reports, and KML/KMZ GPS mapping exports.',
      tab: 'reports',
      icon: Database,
      badge: 'Zero Schema Drift'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={14} className="hero-badge-icon" />
            <span>ALFANAR ELECTRICAL SYSTEMS • MEDIUM-VOLTAGE CUSTOMER SERVICE</span>
          </div>
          <h1 className="hero-title">
            Digital MV Customer Service <br />
            <span className="hero-title-highlight">Management System</span>
          </h1>
          <p className="hero-subtitle">
            An enterprise-grade, mobile-responsive management system for medium-voltage complaints, 
            supervisor triage, 6-action field timesheets, technical inspections, NCR quality control, 
            and audited closure across Saudi Arabia.
          </p>

          <div className="hero-cta-group">
            <button 
              className="btn-primary-hero"
              onClick={() => setActiveTab('dashboard')}
            >
              <span>Open Operations Dashboard</span>
              <ArrowRight size={16} />
            </button>
            <button 
              className="btn-secondary-hero"
              onClick={() => setActiveTab('publicintake')}
            >
              <span>Submit Public Complaint</span>
              <ExternalLink size={16} />
            </button>
          </div>

          <div className="hero-meta-points">
            <div className="meta-point">
              <CheckCircle size={16} className="point-icon" />
              <span>Strict 8-Step Complaint-to-Closure Workflow</span>
            </div>
            <div className="meta-point">
              <CheckCircle size={16} className="point-icon" />
              <span>Separation of Duties & Least Privilege RBAC</span>
            </div>
            <div className="meta-point">
              <CheckCircle size={16} className="point-icon" />
              <span>Exact 25-Col Visit & 16-Col NCR Export Contracts</span>
            </div>
          </div>
        </div>

        {/* Quick Role Login / Switcher Card */}
        <div className="hero-login-card">
          <div className="login-card-header">
            <ShieldCheck size={20} className="login-shield" />
            <div>
              <h3>Role-Based Access (Prototype Demo)</h3>
              <p>Select a persona to explore tailored dashboards and permission boundaries:</p>
            </div>
          </div>

          <div className="login-options-grid">
            <button 
              className="login-role-box"
              onClick={() => {
                if (supervisorUser) setCurrentUser(supervisorUser);
                setActiveTab('dashboard');
              }}
            >
              <div className="role-avatar-circle sup">DS</div>
              <div className="role-text">
                <span className="role-user-name">Dispatcher Supervisor</span>
                <span className="role-user-badge">Supervisor (ALF-SUP-01)</span>
                <span className="role-desc">Triage, assign work orders, review reports, close cases</span>
              </div>
            </button>

            <button 
              className="login-role-box"
              onClick={() => {
                if (engineerUser) setCurrentUser(engineerUser);
                setActiveTab('jobtimer');
              }}
            >
              <div className="role-avatar-circle eng">FE</div>
              <div className="role-text">
                <span className="role-user-name">Lead Field Engineer</span>
                <span className="role-user-badge">Field Engineer (ALF-FE-309)</span>
                <span className="role-desc">Record 6-action time logs, panel inspections, readings & photos</span>
              </div>
            </button>

            <button 
              className="login-role-box"
              onClick={() => {
                if (qcaUser) setCurrentUser(qcaUser);
                setActiveTab('ncrmanagement');
              }}
            >
              <div className="role-avatar-circle qca">QC</div>
              <div className="role-text">
                <span className="role-user-name">QCA / Storekeeper</span>
                <span className="role-user-badge">Quality & Inventory Custody</span>
                <span className="role-desc">Record lab findings, approve material disposition, handle stock</span>
              </div>
            </button>

            <button 
              className="login-role-box"
              onClick={() => {
                if (auditorUser) setCurrentUser(auditorUser);
                setActiveTab('dashboard');
              }}
            >
              <div className="role-avatar-circle aud">MA</div>
              <div className="role-text">
                <span className="role-user-name">Manager / Auditor</span>
                <span className="role-user-badge">Management & Compliance</span>
                <span className="role-desc">Read-only oversight, historical audit logs, export validations</span>
              </div>
            </button>
          </div>

          <div className="login-card-footer">
            <span className="note-text">
              * Note: In compliance with client rules, all staff accounts are individual; no shared logins.
            </span>
          </div>
        </div>
      </section>

      {/* Services & Core Capabilities Grid */}
      <section className="services-section">
        <div className="section-head">
          <span className="section-tag">COMPREHENSIVE CAPABILITIES</span>
          <h2 className="section-title">End-to-End Medium-Voltage Workflow</h2>
          <p className="section-desc">
            Designed to support 5 to 100+ technical personnel across the Kingdom of Saudi Arabia, 
            ensuring audit traceability and zero undocumented data loss.
          </p>
        </div>

        <div className="services-grid">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div 
                key={idx} 
                className="service-card"
                onClick={() => setActiveTab(srv.tab)}
              >
                <div className="service-header">
                  <div className="service-icon-wrap">
                    <Icon size={22} />
                  </div>
                  <span className="service-badge">{srv.badge}</span>
                </div>
                <h3 className="service-title">{srv.title}</h3>
                <p className="service-desc">{srv.desc}</p>
                <div className="service-footer-link">
                  <span>Explore Module</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8-Step Lifecycle Diagram Banner */}
      <section className="lifecycle-section">
        <div className="lifecycle-card">
          <h3 className="lifecycle-title">Documented 8-Step Case Lifecycle Flow</h3>
          <p className="lifecycle-subtitle">
            From initial public complaint intake through supervisor triage, on-site multi-panel inspection, 
            ordered time logging, supervisor review return loop, QCA material custody, to 4-event final closure.
          </p>

          <div className="steps-flow-container">
            {[
              { num: '1', title: 'Intake', subtitle: 'Public Form', role: 'External' },
              { num: '2', title: 'Triage', subtitle: 'Assign Engineer', role: 'Supervisor' },
              { num: '3', title: 'Site Visit', subtitle: 'Panel Records', role: 'Engineer' },
              { num: '4', title: 'Time Log', subtitle: '6 Ordered Actions', role: 'Engineer' },
              { num: '5', title: 'Review', subtitle: 'Approve or Return', role: 'Supervisor' },
              { num: '6', title: 'NCR / Mat.', subtitle: 'QCA Decision', role: 'QCA / Store' },
              { num: '7', title: 'Closure', subtitle: '4 Separate Events', role: 'Supervisor' },
              { num: '8', title: 'Reports', subtitle: '25-Col / PDF / KML', role: 'System' },
            ].map((st, i) => (
              <div key={i} className="flow-step-item">
                <div className="step-circle">{st.num}</div>
                <div className="step-name">{st.title}</div>
                <div className="step-sub">{st.subtitle}</div>
                <div className="step-role-tag">{st.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
