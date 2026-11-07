import React, { useState } from 'react';
import './Dashboard.css';
import { 
  Mail, 
  Briefcase, 
  Clock, 
  AlertCircle, 
  Cpu, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink, 
  ChevronRight, 
  SlidersHorizontal,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export const Dashboard = ({ 
  complaints, 
  workOrders, 
  timers, 
  ncrs, 
  inventory, 
  setActiveTab 
}) => {
  const [selectedRegion, setSelectedRegion] = useState('All Regions (KSA)');

  // Filter complaints & work orders based on region
  const filteredWorkOrders = selectedRegion === 'All Regions (KSA)' 
    ? workOrders 
    : workOrders.filter(w => w.region && w.region.includes(selectedRegion.split(' ')[0]));

  const filteredComplaints = selectedRegion === 'All Regions (KSA)'
    ? complaints
    : complaints.filter(c => c.region && c.region.includes(selectedRegion.split(' ')[0]));

  // Metric counts strictly matching requirements
  const unverifiedIntakeCount = complaints.filter(c => c.status === 'New').length;
  const activeWOCount = workOrders.filter(w => w.status === 'IN PROGRESS' || w.status === 'ASSIGNED').length;
  const activeTimersCount = timers.filter(t => t.status === 'In Progress').length;
  const pendingApprovalsCount = complaints.filter(c => c.status === 'Submitted for Review').length;
  const openNcrCount = ncrs.filter(n => n.complaintClosedDate.includes('Open')).length;
  const registeredAssetsCount = 4; // 13.8 / 33 kV panels
  const inventorySkusCount = inventory.length;
  const closedCasesCount = complaints.filter(c => c.status === 'Closed').length;

  return (
    <div className="dashboard-container">
      {/* Top Title & Filters Bar */}
      <div className="dashboard-header-bar">
        <div className="title-area">
          <div className="title-with-pill">
            <h1 className="dash-title">Alfanar MV Operations Dashboard</h1>
            <span className="live-ops-pill">Live Enterprise Ops</span>
          </div>
          <p className="dash-subtitle">
            Real-time medium-voltage customer service pipeline, engineer dispatch, and quality control.
          </p>
        </div>

        <div className="header-actions">
          <div className="region-filter-wrapper">
            <SlidersHorizontal size={14} className="filter-icon" />
            <span className="filter-label">Region:</span>
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="region-select"
            >
              <option value="All Regions (KSA)">All Regions (KSA)</option>
              <option value="Central Region (Riyadh)">Central Region (Riyadh)</option>
              <option value="Western Region (Red Sea)">Western Region (Red Sea)</option>
              <option value="Western Region (Jeddah)">Western Region (Jeddah)</option>
            </select>
          </div>

          <button 
            className="req-matrix-btn" 
            onClick={() => setActiveTab('scopematrix')}
          >
            <span>Requirements Matrix</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* 8 Metric Cards Grid (2 rows of 4) */}
      <div className="metrics-grid">
        {/* Card 1 */}
        <div className="metric-card" onClick={() => setActiveTab('complaints')}>
          <div className="metric-header">
            <span className="metric-title">Unverified Intake</span>
            <div className="metric-icon-wrap icon-blue">
              <Mail size={16} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-main-num">{unverifiedIntakeCount}</span>
            <span className="metric-sub-label label-blue">Triage Pending</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="metric-card" onClick={() => setActiveTab('workorders')}>
          <div className="metric-header">
            <span className="metric-title">Active Work Orders</span>
            <div className="metric-icon-wrap icon-purple">
              <Briefcase size={16} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-main-num">{activeWOCount}</span>
            <span className="metric-sub-label label-purple">In Field</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="metric-card" onClick={() => setActiveTab('jobtimer')}>
          <div className="metric-header">
            <span className="metric-title">Active Timers</span>
            <div className="metric-icon-wrap icon-orange">
              <Clock size={16} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-main-num">{activeTimersCount}</span>
            <span className="metric-sub-label label-orange">Live Clock</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="metric-card" onClick={() => setActiveTab('supervisorreview')}>
          <div className="metric-header">
            <span className="metric-title">Pending Approvals</span>
            <div className="metric-icon-wrap icon-violet">
              <Clock size={16} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-main-num">{pendingApprovalsCount}</span>
            <span className="metric-sub-label label-violet">Supervisor Gate</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="metric-card" onClick={() => setActiveTab('ncrmanagement')}>
          <div className="metric-header">
            <span className="metric-title">Open Quality NCRs</span>
            <div className="metric-icon-wrap icon-red">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-main-num">{openNcrCount}</span>
            <span className="metric-sub-label label-red">QCA Review</span>
          </div>
        </div>

        {/* Card 6 */}
        <div className="metric-card" onClick={() => setActiveTab('equipmentregister')}>
          <div className="metric-header">
            <span className="metric-title">Registered MV Assets</span>
            <div className="metric-icon-wrap icon-slate">
              <Cpu size={16} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-main-num">{registeredAssetsCount}</span>
            <span className="metric-sub-label label-slate">13.8 / 33 kV</span>
          </div>
        </div>

        {/* Card 7 */}
        <div className="metric-card" onClick={() => setActiveTab('inventory')}>
          <div className="metric-header">
            <span className="metric-title">Inventory SKUs</span>
            <div className="metric-icon-wrap icon-green">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-main-num">{inventorySkusCount}</span>
            <span className="metric-sub-label label-green">Ledger Tracked</span>
          </div>
        </div>

        {/* Card 8 */}
        <div className="metric-card" onClick={() => setActiveTab('complaints')}>
          <div className="metric-header">
            <span className="metric-title">Closed Cases</span>
            <div className="metric-icon-wrap icon-teal">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-main-num">{closedCasesCount}</span>
            <span className="metric-sub-label label-teal">Signed Off</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Charts */}
      <div className="dashboard-charts-grid">
        {/* Left Chart: Complaint Categories & Fault Distribution */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h2 className="chart-title">Complaint Categories & Fault Distribution</h2>
              <p className="chart-subtitle">Volume by medium-voltage issue classification</p>
            </div>
            <span className="chart-count-badge">3 Total Cases</span>
          </div>

          <div className="bar-chart-container">
            <div className="chart-y-axis">
              <span>4</span>
              <span>3</span>
              <span>2</span>
              <span>1</span>
              <span>0</span>
            </div>

            <div className="bars-area">
              <div className="grid-line" style={{ bottom: '75%' }}></div>
              <div className="grid-line" style={{ bottom: '50%' }}></div>
              <div className="grid-line" style={{ bottom: '25%' }}></div>
              <div className="grid-line" style={{ bottom: '0%' }}></div>

              <div className="bar-column">
                <div className="bar-fill" style={{ height: '25%' }} title="Gas pressure alarm: 1 case">
                  <span className="bar-val">1</span>
                </div>
                <span className="bar-label" title="Gas pressure alarm trigger">Gas pressure alarm..</span>
              </div>

              <div className="bar-column">
                <div className="bar-fill" style={{ height: '25%' }} title="Trip during operation: 1 case">
                  <span className="bar-val">1</span>
                </div>
                <span className="bar-label" title="Trip during operation">Trip during operat..</span>
              </div>

              <div className="bar-column">
                <div className="bar-fill" style={{ height: '25%' }} title="Mechanical interlock: 1 case">
                  <span className="bar-val">1</span>
                </div>
                <span className="bar-label" title="Mechanical interlock">Mechanical interlo..</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Chart: Priority & SLA Distribution */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h2 className="chart-title">Priority & SLA Distribution</h2>
              <p className="chart-subtitle">Operational triage severity</p>
            </div>
          </div>

          <div className="donut-chart-container">
            {/* SVG Donut Chart */}
            <div className="donut-graphic-wrapper">
              <svg viewBox="0 0 100 100" className="donut-svg">
                {/* Background circle */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                {/* Critical segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="14"
                  strokeDasharray="79.5 238.5"
                  strokeDashoffset="0"
                />
                {/* High segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="14"
                  strokeDasharray="79.5 238.5"
                  strokeDashoffset="-79.5"
                />
                {/* Medium segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="14"
                  strokeDasharray="79.5 238.5"
                  strokeDashoffset="-159"
                />
              </svg>
              <div className="donut-center-label">
                <span className="center-num">3</span>
                <span className="center-text">Severity</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="donut-legend-list">
              <div className="legend-item">
                <span className="legend-dot red"></span>
                <span className="legend-name">Critical:</span>
                <strong className="legend-count">1</strong>
              </div>
              <div className="legend-item">
                <span className="legend-dot orange"></span>
                <span className="legend-name">High:</span>
                <strong className="legend-count">1</strong>
              </div>
              <div className="legend-item">
                <span className="legend-dot blue"></span>
                <span className="legend-name">Medium:</span>
                <strong className="legend-count">1</strong>
              </div>
              <div className="legend-item">
                <span className="legend-dot green"></span>
                <span className="legend-name">Low:</span>
                <strong className="legend-count">0</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: Engineer Deployment & Priority Queue */}
      <div className="dashboard-lower-grid">
        {/* Left: Field Engineer Deployment & Hours */}
        <div className="info-card">
          <div className="info-card-header">
            <div>
              <h2 className="info-title">Field Engineer Deployment & Hours</h2>
              <p className="info-subtitle">Live attendance logs and active assignment queue</p>
            </div>
            <button 
              className="card-action-link"
              onClick={() => setActiveTab('jobtimer')}
            >
              <span>Open Timers</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="table-responsive">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Field Engineer</th>
                  <th>Active WOs</th>
                  <th>Completed Timers</th>
                  <th>Logged Hours</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="engineer-cell">
                      <span className="eng-name">Lead Field Engineer</span>
                      <span className="eng-code">ALF-FE-309</span>
                    </div>
                  </td>
                  <td><span className="num-badge">1</span></td>
                  <td><span className="logs-muted">0 logs</span></td>
                  <td><strong className="hours-highlight">0.6 hrs</strong></td>
                </tr>
                <tr>
                  <td>
                    <div className="engineer-cell">
                      <span className="eng-name">Field Engineer</span>
                      <span className="eng-code">ALF-FE-312</span>
                    </div>
                  </td>
                  <td><span className="num-badge">1</span></td>
                  <td><span className="logs-muted">0 logs</span></td>
                  <td><strong className="hours-highlight">0.0 hrs</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Priority Operations Queue */}
        <div className="info-card">
          <div className="info-card-header">
            <div>
              <h2 className="info-title">Priority Operations Queue</h2>
              <p className="info-subtitle">High severity tickets requiring dispatcher or field response</p>
            </div>
            <button 
              className="card-action-link"
              onClick={() => setActiveTab('workorders')}
            >
              <span>All Work Orders</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="priority-queue-list">
            {/* WO 1 */}
            <div 
              className="queue-item"
              onClick={() => setActiveTab('workorders')}
            >
              <div className="queue-item-top">
                <div className="wo-tag-wrap">
                  <span className="wo-id">WO-2026-0108</span>
                  <span className="priority-pill badge-high">HIGH</span>
                </div>
                <span className="status-badge in-progress">IN PROGRESS</span>
              </div>
              <div className="queue-location">
                Riyadh Substation 8044 — Al-Malaz — Saudi Electricity Company (SEC)
              </div>
              <div className="queue-footer">
                <span className="assigned-text">Assigned: <strong>Lead Field Engineer (ALF-FE-309)</strong></span>
                <span className="due-text">Due: 2026-10-23</span>
              </div>
            </div>

            {/* WO 2 */}
            <div 
              className="queue-item"
              onClick={() => setActiveTab('workorders')}
            >
              <div className="queue-item-top">
                <div className="wo-tag-wrap">
                  <span className="wo-id">WO-2026-0109</span>
                  <span className="priority-pill badge-critical">CRITICAL</span>
                </div>
                <span className="status-badge assigned">ASSIGNED</span>
              </div>
              <div className="queue-location">
                Southern Dunes Solar Grid Station — Red Sea Global Infrastructure
              </div>
              <div className="queue-footer">
                <span className="assigned-text">Assigned: <strong>Field Engineer (ALF-FE-312)</strong></span>
                <span className="due-text">Due: 2026-10-24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
