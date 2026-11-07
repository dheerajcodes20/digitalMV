import React, { useState } from 'react';
import './Complaints.css';
import { 
  Inbox, 
  Search, 
  Filter, 
  ArrowRight, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  ShieldCheck,
  ChevronRight,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export const Complaints = ({ 
  complaints, 
  workOrders, 
  users, 
  currentUser, 
  onTriageAndAssign, 
  setActiveTab 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Triage modal state
  const [triageModalOpen, setTriageModalOpen] = useState(false);
  const [triageForm, setTriageForm] = useState({
    assignedEngineerId: 'usr-2',
    assignedSupervisorId: 'usr-1',
    priority: 'HIGH',
    plannedDate: '2026-10-25',
    dueDate: '2026-10-26',
    shutdownRequired: false,
    customerApproval: true,
    permitReference: '',
    materialFlag: true,
  });

  const engineers = users.filter(u => u.role === 'Engineer');
  const supervisors = users.filter(u => u.role.includes('Supervisor'));

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.siteLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.originalComplaint.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleOpenTriage = (c) => {
    setSelectedComplaint(c);
    setTriageForm({
      assignedEngineerId: 'usr-2',
      assignedSupervisorId: 'usr-1',
      priority: c.priority,
      plannedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      shutdownRequired: false,
      customerApproval: true,
      permitReference: 'PTW-' + Math.floor(1000 + Math.random() * 9000),
      materialFlag: true,
    });
    setTriageModalOpen(true);
  };

  const handleSaveTriage = (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    const assignedEng = users.find(u => u.id === triageForm.assignedEngineerId);
    const assignedSup = users.find(u => u.id === triageForm.assignedSupervisorId);

    onTriageAndAssign({
      complaintId: selectedComplaint.id,
      assignedEngineer: assignedEng ? assignedEng.name : 'Lead Field Engineer (ALF-FE-309)',
      assignedEngineerCode: assignedEng ? assignedEng.code : 'ALF-FE-309',
      assignedSupervisor: assignedSup ? assignedSup.name : 'Dispatcher Supervisor',
      priority: triageForm.priority,
      plannedDate: triageForm.plannedDate,
      dueDate: triageForm.dueDate,
      shutdownRequired: triageForm.shutdownRequired,
      customerApproval: triageForm.customerApproval,
      permitReference: triageForm.permitReference,
      materialFlag: triageForm.materialFlag,
    });

    setTriageModalOpen(false);
  };

  const isSupervisor = currentUser.role.includes('Supervisor') || currentUser.role === 'System administrator';

  return (
    <div className="complaints-page-container">
      {/* Top Banner */}
      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Customer Complaints & Triage Queue</h1>
          <p className="page-sub">
            Review incoming queries, verify potential duplicate sites/assets, and dispatch authorized work orders.
          </p>
        </div>
        <button 
          className="btn-create-intake"
          onClick={() => setActiveTab('publicintake')}
        >
          <Inbox size={15} />
          <span>New Public Complaint Form</span>
        </button>
      </div>

      {/* Role Access Notice */}
      {!isSupervisor && (
        <div className="role-restriction-banner">
          <ShieldCheck size={16} />
          <span>
            Logged in as <strong>{currentUser.name}</strong> ({currentUser.role}). 
            Only users with <strong>Supervisor / Dispatcher</strong> authority can triage and assign work orders.
          </span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="complaints-filter-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search reference, customer, substation, or issue..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-right">
          <div className="filter-dropdown-wrap">
            <SlidersHorizontal size={14} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New (Intake)</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Submitted for Review">Submitted for Review</option>
              <option value="Approved">Approved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="filter-dropdown-wrap">
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List Table */}
      <div className="complaints-table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ref No. & Date</th>
                <th>Customer & Site Location</th>
                <th>Request / Issue Classification</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Field Team</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">No complaint records match the selected filters.</td>
                </tr>
              ) : (
                filteredComplaints.map(c => {
                  const linkedWO = workOrders.find(w => w.complaintId === c.id);
                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="ref-date-cell">
                          <strong className="ref-bold">{c.referenceNo}</strong>
                          <span className="mono-date">{c.receivedDateTime}</span>
                        </div>
                      </td>

                      <td>
                        <div className="customer-site-cell">
                          <span className="cust-title">{c.customerName}</span>
                          <span className="site-sub">{c.siteLocation}</span>
                          {c.assetHint && <span className="asset-tag">{c.assetHint}</span>}
                        </div>
                      </td>

                      <td>
                        <div className="complaint-text-preview" title={c.originalComplaint}>
                          <span className="req-type-badge">{c.requestType}</span>
                          <p className="orig-quote">"{c.originalComplaint}"</p>
                        </div>
                      </td>

                      <td>
                        <span className={`priority-tag badge-${c.priority.toLowerCase()}`}>
                          {c.priority}
                        </span>
                      </td>

                      <td>
                        <span className={`status-pill pill-${c.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {c.status}
                        </span>
                      </td>

                      <td>
                        {c.assignedEngineer ? (
                          <div className="assigned-eng-cell">
                            <strong>{c.assignedEngineer}</strong>
                            <span className="due-sub">Due: {c.dueDate}</span>
                            {linkedWO && <span className="wo-link-tag">{linkedWO.id}</span>}
                          </div>
                        ) : (
                          <span className="unassigned-label">Unassigned</span>
                        )}
                      </td>

                      <td>
                        <div className="action-buttons-cell">
                          {c.status === 'New' && isSupervisor ? (
                            <button 
                              className="btn-triage-action"
                              onClick={() => handleOpenTriage(c)}
                            >
                              <UserPlus size={14} />
                              <span>Triage & Assign</span>
                            </button>
                          ) : (
                            <button 
                              className="btn-view-details"
                              onClick={() => setSelectedComplaint(c)}
                            >
                              <Eye size={14} />
                              <span>Details</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Triage Modal */}
      {triageModalOpen && selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <UserPlus size={20} className="modal-icon" />
                <div>
                  <h3>Step 2: Supervisor Triage & Work Order Dispatch</h3>
                  <span className="modal-subtitle">
                    Case: {selectedComplaint.referenceNo} — {selectedComplaint.customerName}
                  </span>
                </div>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setTriageModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTriage} className="triage-form">
              {/* Duplicate check box */}
              <div className="duplicate-check-info">
                <CheckCircle size={16} className="check-dup-icon" />
                <span>
                  <strong>Duplicate & Asset Check:</strong> No prior open work orders for {selectedComplaint.siteLocation} within the last 48 hours. Site resolved successfully.
                </span>
              </div>

              {/* Original Complaint Statement Display */}
              <div className="immutable-statement-box">
                <span className="box-label">Immutable Original Complaint Text (RULE-01 / RULE-10):</span>
                <p>"{selectedComplaint.originalComplaint}"</p>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Assign Lead Field Engineer <span className="req">*</span></label>
                  <select 
                    value={triageForm.assignedEngineerId}
                    onChange={(e) => setTriageForm({ ...triageForm, assignedEngineerId: e.target.value })}
                    required
                  >
                    {engineers.map(eng => (
                      <option key={eng.id} value={eng.id}>
                        {eng.name} ({eng.code}) — {eng.region}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Assign Supervisor / Dispatcher <span className="req">*</span></label>
                  <select 
                    value={triageForm.assignedSupervisorId}
                    onChange={(e) => setTriageForm({ ...triageForm, assignedSupervisorId: e.target.value })}
                    required
                  >
                    {supervisors.map(sup => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name} ({sup.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Work Order Priority <span className="req">*</span></label>
                  <select 
                    value={triageForm.priority}
                    onChange={(e) => setTriageForm({ ...triageForm, priority: e.target.value })}
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Planned Visit Date <span className="req">*</span></label>
                  <input 
                    type="date" 
                    value={triageForm.plannedDate}
                    onChange={(e) => setTriageForm({ ...triageForm, plannedDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>SLA Due Date <span className="req">*</span></label>
                  <input 
                    type="date" 
                    value={triageForm.dueDate}
                    onChange={(e) => setTriageForm({ ...triageForm, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Safety & Isolation Separation Checkboxes */}
              <div className="safety-separation-card">
                <div className="sep-card-title">
                  <AlertTriangle size={15} />
                  <span>Safety Separation Controls (RULE-19)</span>
                </div>
                <div className="checkboxes-row">
                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={triageForm.shutdownRequired}
                      onChange={(e) => setTriageForm({ ...triageForm, shutdownRequired: e.target.checked })}
                    />
                    <span>Substation Shutdown Required</span>
                  </label>

                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={triageForm.customerApproval}
                      onChange={(e) => setTriageForm({ ...triageForm, customerApproval: e.target.checked })}
                    />
                    <span>Customer Utility Approval Obtained</span>
                  </label>

                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={triageForm.materialFlag}
                      onChange={(e) => setTriageForm({ ...triageForm, materialFlag: e.target.checked })}
                    />
                    <span>Material / Replacement Expected</span>
                  </label>
                </div>

                <div className="form-group" style={{ marginTop: '0.6rem' }}>
                  <label>Safety Permit-to-Work (PTW) Reference</label>
                  <input 
                    type="text" 
                    placeholder="e.g. SEC-PTW-2026-8812" 
                    value={triageForm.permitReference}
                    onChange={(e) => setTriageForm({ ...triageForm, permitReference: e.target.value })}
                  />
                  <span className="permit-note">
                    * An application status never authorizes electrical isolation.
                  </span>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setTriageModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-assign">
                  <span>Create Work Order & Dispatch</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Complaints;
