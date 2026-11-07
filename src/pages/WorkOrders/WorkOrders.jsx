import React, { useState } from 'react';
import './WorkOrders.css';
import { 
  Briefcase, 
  Search, 
  Clock, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  MapPin, 
  Calendar, 
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const WorkOrders = ({ 
  workOrders, 
  currentUser, 
  setActiveTab,
  onSelectWorkOrderForVisit,
  onSelectWorkOrderForTimer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Scoped view for engineers: an engineer should see assigned jobs, supervisors see all
  const isEngineer = currentUser.role === 'Engineer';
  const visibleOrders = isEngineer
    ? workOrders.filter(w => w.assignedEngineer === currentUser.name)
    : workOrders;

  const filteredOrders = visibleOrders.filter(w => {
    const matchesSearch = 
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.siteLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.assignedEngineer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="work-orders-page">
      <div className="wo-header-bar">
        <div>
          <h1 className="wo-page-title">Work Orders & Field Dispatch Queue</h1>
          <p className="wo-page-sub">
            Managed medium-voltage site dispatches, safety permits, planned schedules, and engineer assignments.
          </p>
        </div>
      </div>

      {isEngineer && (
        <div className="scoped-view-badge">
          <ShieldCheck size={16} />
          <span>
            Engineer Scoped View: Showing jobs assigned to <strong>{currentUser.name}</strong> ({currentUser.code}).
          </span>
        </div>
      )}

      {/* Filter bar */}
      <div className="wo-filter-bar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search WO ID, customer, site, or engineer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-select-wrap">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="SUBMITTED FOR REVIEW">Submitted for Review</option>
            <option value="APPROVED">Approved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="wo-cards-grid">
        {filteredOrders.length === 0 ? (
          <div className="no-records-box">
            No work orders found matching the filter criteria.
          </div>
        ) : (
          filteredOrders.map(wo => (
            <div key={wo.id} className="wo-card">
              <div className="wo-card-top">
                <div className="wo-id-badge-group">
                  <span className="wo-main-id">{wo.id}</span>
                  <span className={`wo-priority-pill p-${wo.priority.toLowerCase()}`}>
                    {wo.priority}
                  </span>
                </div>
                <span className={`wo-status-tag s-${wo.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {wo.status}
                </span>
              </div>

              <div className="wo-customer-line">
                <strong>{wo.customerName}</strong>
              </div>

              <div className="wo-location-line">
                <MapPin size={14} className="pin-icon" />
                <span>{wo.siteLocation}</span>
              </div>

              {/* Safety & Isolation Attributes */}
              <div className="safety-tags-row">
                <div className={`safety-tag ${wo.shutdownRequired ? 'shutdown-yes' : 'shutdown-no'}`}>
                  <span>Shutdown: {wo.shutdownRequired ? 'REQUIRED' : 'Not Required'}</span>
                </div>
                <div className="safety-tag permit-tag">
                  <span>PTW: {wo.permitReference || 'Pending Permit'}</span>
                </div>
                {wo.materialFlag && (
                  <div className="safety-tag mat-tag">
                    <span>Defective Mat. Flag: Set</span>
                  </div>
                )}
              </div>

              <div className="wo-dates-row">
                <div className="date-item">
                  <Calendar size={13} />
                  <span>Planned: <strong>{wo.plannedDate}</strong></span>
                </div>
                <div className="date-item due">
                  <Clock size={13} />
                  <span>Due: <strong>{wo.dueDate}</strong></span>
                </div>
              </div>

              <div className="wo-personnel-row">
                <div className="person-box">
                  <User size={13} />
                  <span>Engineer: <strong>{wo.assignedEngineer}</strong> ({wo.engineerCode})</span>
                </div>
                <div className="person-box sup">
                  <span>Supervisor: <strong>{wo.assignedSupervisor}</strong></span>
                </div>
              </div>

              {/* Actions */}
              <div className="wo-card-actions">
                <button 
                  className="btn-action-timer"
                  onClick={() => {
                    if (onSelectWorkOrderForTimer) onSelectWorkOrderForTimer(wo);
                    setActiveTab('jobtimer');
                  }}
                  title="Open 3-Stage Timer for this job"
                >
                  <Clock size={14} />
                  <span>Launch Timer</span>
                </button>

                <button 
                  className="btn-action-visit"
                  onClick={() => {
                    if (onSelectWorkOrderForVisit) onSelectWorkOrderForVisit(wo);
                    setActiveTab('visitwizard');
                  }}
                  title="Open Site Visit Wizard"
                >
                  <FileSpreadsheet size={14} />
                  <span>Visit Report Wizard</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default WorkOrders;

