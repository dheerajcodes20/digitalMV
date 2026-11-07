import React, { useState } from 'react';
import './PublicIntake.css';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  Upload, 
  Search, 
  AlertCircle, 
  FileText, 
  Zap,
  Lock
} from 'lucide-react';

export const PublicIntake = ({ onAddComplaint, complaints, addAuditEvent }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    contactPerson: '',
    phone: '',
    email: '',
    region: 'Central Region (Riyadh)',
    city: 'Riyadh',
    siteLocation: '',
    assetHint: '',
    requestType: 'Emergency Fault Attendance',
    priority: 'HIGH',
    originalComplaint: '',
  });

  const [errors, setErrors] = useState({});
  const [submittedReceipt, setSubmittedReceipt] = useState(null);

  // Status lookup state (restricted by reference ID only)
  const [searchRef, setSearchRef] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.customerName.trim()) errs.customerName = 'Customer or Utility organization name is required.';
    if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact person is required.';
    if (!formData.phone.trim()) errs.phone = 'Contact telephone is required.';
    if (!formData.siteLocation.trim()) errs.siteLocation = 'Site name / Substation location is required.';
    if (!formData.originalComplaint.trim()) errs.originalComplaint = 'Original complaint statement cannot be empty.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newIdNum = complaints.length + 34;
    const refNumber = `REF-2026-${String(newIdNum).padStart(4, '0')}`;
    const cmpId = `CMP-2026-${String(newIdNum).padStart(4, '0')}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newComplaint = {
      id: cmpId,
      referenceNo: refNumber,
      receivedDateTime: formattedDate,
      customerName: formData.customerName,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      region: formData.region,
      city: formData.city,
      siteLocation: formData.siteLocation,
      assetHint: formData.assetHint || 'MV Switchgear Panel',
      requestType: formData.requestType,
      priority: formData.priority,
      originalComplaint: formData.originalComplaint,
      status: 'New',
      linkedWorkOrder: null,
      assignedSupervisor: null,
      assignedEngineer: null,
      dueDate: null,
      faultCategory: 'Unclassified Intake',
    };

    onAddComplaint(newComplaint);

    addAuditEvent({
      user: 'External Reporter',
      role: 'External reporter',
      action: 'Public Complaint Intake Submission',
      recordId: cmpId,
      details: `Submitted complaint via public portal. Generated stable reference ${refNumber}. Original statement locked.`,
    });

    setSubmittedReceipt({
      referenceNo: refNumber,
      complaintId: cmpId,
      timestamp: formattedDate,
      customerName: formData.customerName,
      siteLocation: formData.siteLocation,
    });

    // Reset form
    setFormData({
      customerName: '',
      contactPerson: '',
      phone: '',
      email: '',
      region: 'Central Region (Riyadh)',
      city: 'Riyadh',
      siteLocation: '',
      assetHint: '',
      requestType: 'Emergency Fault Attendance',
      priority: 'HIGH',
      originalComplaint: '',
    });
  };

  const handleLookup = (e) => {
    e.preventDefault();
    setLookupError('');
    setLookupResult(null);

    const query = searchRef.trim().toUpperCase();
    if (!query) {
      setLookupError('Please enter a valid Reference Number (e.g. REF-2026-0034).');
      return;
    }

    const found = complaints.find(c => c.referenceNo.toUpperCase() === query || c.id.toUpperCase() === query);
    if (found) {
      // In accordance with security rules: only return safe public status info; never leak internal engineer GPS, internal audit trails or confidential documents
      setLookupResult({
        referenceNo: found.referenceNo,
        receivedDateTime: found.receivedDateTime,
        customerName: found.customerName,
        siteLocation: found.siteLocation,
        status: found.status,
        requestType: found.requestType,
        originalStatement: found.originalComplaint,
      });
    } else {
      setLookupError(`No complaint record found matching "${query}". Please check your submission receipt.`);
    }
  };

  return (
    <div className="public-intake-page">
      {/* Security Banner */}
      <div className="public-security-banner">
        <Lock size={16} className="lock-icon" />
        <span>
          <strong>Public Submission Portal:</strong> No Microsoft account or internal login required. 
          To safeguard grid infrastructure security, public users cannot browse, search, or list internal records.
        </span>
      </div>

      <div className="intake-grid-layout">
        {/* Left Form: Submit New Complaint */}
        <div className="intake-form-card">
          <div className="form-card-header">
            <Zap size={22} className="form-head-icon" />
            <div>
              <h2>Submit MV Service Complaint / Query</h2>
              <p>Direct ticket intake to Alfanar MV Customer Service Management Pipeline</p>
            </div>
          </div>

          {submittedReceipt ? (
            <div className="receipt-success-box">
              <CheckCircle2 size={48} className="success-icon" />
              <h3>Complaint Successfully Registered</h3>
              <p className="receipt-sub">
                Your complaint has been queued for supervisor triage. Keep your stable Reference Number to track status:
              </p>
              <div className="reference-display-box">
                <span className="ref-label">Official Reference Number:</span>
                <span className="ref-code">{submittedReceipt.referenceNo}</span>
              </div>
              <div className="receipt-meta">
                <div><strong>Site:</strong> {submittedReceipt.siteLocation}</div>
                <div><strong>Registered:</strong> {submittedReceipt.timestamp}</div>
              </div>
              <button 
                className="btn-new-ticket"
                onClick={() => setSubmittedReceipt(null)}
              >
                Submit Another Complaint
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="intake-form">
              {/* Row 1 */}
              <div className="form-row-2">
                <div className="form-group">
                  <label>Customer / Utility Organization <span className="req">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Saudi Electricity Company (SEC)" 
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className={errors.customerName ? 'input-error' : ''}
                  />
                  {errors.customerName && <span className="field-err">{errors.customerName}</span>}
                </div>

                <div className="form-group">
                  <label>Contact Person / Designation <span className="req">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Operations Desk Officer" 
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className={errors.contactPerson ? 'input-error' : ''}
                  />
                  {errors.contactPerson && <span className="field-err">{errors.contactPerson}</span>}
                </div>
              </div>

              {/* Row 2 */}
              <div className="form-row-2">
                <div className="form-group">
                  <label>Contact Phone <span className="req">*</span></label>
                  <input 
                    type="text" 
                    placeholder="+966 11 000 0000" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <span className="field-err">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="contact@utility.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="form-row-2">
                <div className="form-group">
                  <label>Region <span className="req">*</span></label>
                  <select 
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  >
                    <option value="Central Region (Riyadh)">Central Region (Riyadh)</option>
                    <option value="Western Region (Red Sea)">Western Region (Red Sea)</option>
                    <option value="Western Region (Jeddah)">Western Region (Jeddah)</option>
                    <option value="Eastern Region (Dammam)">Eastern Region (Dammam)</option>
                    <option value="Southern Region">Southern Region</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Substation / Site Location <span className="req">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Riyadh Substation 8044 — Al-Malaz" 
                    value={formData.siteLocation}
                    onChange={(e) => setFormData({ ...formData, siteLocation: e.target.value })}
                    className={errors.siteLocation ? 'input-error' : ''}
                  />
                  {errors.siteLocation && <span className="field-err">{errors.siteLocation}</span>}
                </div>
              </div>

              {/* Row 4 */}
              <div className="form-row-2">
                <div className="form-group">
                  <label>Asset or Panel Hint (If known)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. SLBS 13.8kV Feeder Bay 3 / Serial No." 
                    value={formData.assetHint}
                    onChange={(e) => setFormData({ ...formData, assetHint: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Request Type <span className="req">*</span></label>
                  <select 
                    value={formData.requestType}
                    onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                  >
                    <option value="Emergency Fault Attendance">Emergency Fault Attendance</option>
                    <option value="Tripping Breakdown">Tripping Breakdown</option>
                    <option value="Mechanical Interlock Sticking">Mechanical Interlock Sticking</option>
                    <option value="Commissioning Assistance">Commissioning Assistance</option>
                    <option value="Routine Inspection / Health Check">Routine Inspection / Health Check</option>
                  </select>
                </div>
              </div>

              {/* Priority */}
              <div className="form-group">
                <label>Reported Priority <span className="req">*</span></label>
                <div className="priority-radio-group">
                  {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                    <label key={p} className={`priority-radio-label ${formData.priority === p ? 'selected ' + p.toLowerCase() : ''}`}>
                      <input 
                        type="radio" 
                        name="priority" 
                        value={p}
                        checked={formData.priority === p}
                        onChange={() => setFormData({ ...formData, priority: p })}
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Original Complaint Statement */}
              <div className="form-group">
                <label>
                  Original Complaint Statement <span className="req">*</span>
                  <span className="immutable-warning">(Recorded verbatim and preserved immutably)</span>
                </label>
                <textarea 
                  rows={4}
                  placeholder="Describe the electrical issue, alarm triggers, protection trips, or observed abnormal symptoms in detail..."
                  value={formData.originalComplaint}
                  onChange={(e) => setFormData({ ...formData, originalComplaint: e.target.value })}
                  className={errors.originalComplaint ? 'input-error' : ''}
                />
                {errors.originalComplaint && <span className="field-err">{errors.originalComplaint}</span>}
              </div>

              {/* Attachments Note */}
              <div className="attachment-upload-box">
                <Upload size={20} className="upload-icon" />
                <div>
                  <strong>Attach Site Photos or Single Line Diagrams</strong>
                  <p>Files uploaded here are transferred to private S3 storage with access restricted to certified engineers.</p>
                </div>
              </div>

              <button type="submit" className="btn-submit-complaint">
                <Send size={16} />
                <span>Submit Complaint & Generate Reference Receipt</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Card: Reference ID Status Lookup */}
        <div className="intake-lookup-card">
          <div className="lookup-header">
            <Search size={20} className="search-icon" />
            <div>
              <h3>Track Complaint by Reference ID</h3>
              <p>Check processing progress using your stable reference code</p>
            </div>
          </div>

          <form onSubmit={handleLookup} className="lookup-input-bar">
            <input 
              type="text" 
              placeholder="e.g. REF-2026-0034"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
            />
            <button type="submit">Verify Status</button>
          </form>

          {lookupError && (
            <div className="lookup-error-box">
              <AlertCircle size={16} />
              <span>{lookupError}</span>
            </div>
          )}

          {lookupResult && (
            <div className="lookup-result-box">
              <div className="result-header">
                <span className="res-ref">{lookupResult.referenceNo}</span>
                <span className={`status-pill ${lookupResult.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {lookupResult.status}
                </span>
              </div>

              <div className="result-field">
                <span className="field-k">Received:</span>
                <span className="field-v">{lookupResult.receivedDateTime} AST</span>
              </div>

              <div className="result-field">
                <span className="field-k">Site Location:</span>
                <span className="field-v">{lookupResult.siteLocation}</span>
              </div>

              <div className="result-field">
                <span className="field-k">Request Type:</span>
                <span className="field-v">{lookupResult.requestType}</span>
              </div>

              <div className="result-statement-box">
                <span className="stmt-label">Original Recorded Statement:</span>
                <p>"{lookupResult.originalStatement}"</p>
              </div>

              <div className="security-notice-small">
                ✓ Verified via Alfanar MV Dispatch Engine. Engineering details are scoped to assigned personnel.
              </div>
            </div>
          )}

          {/* Quick Demo Reference Codes */}
          <div className="demo-codes-helper">
            <span className="helper-title">Sample Reference Numbers:</span>
            <div className="codes-chips">
              <button type="button" onClick={() => setSearchRef('REF-2026-0034')}>REF-2026-0034</button>
              <button type="button" onClick={() => setSearchRef('REF-2026-0035')}>REF-2026-0035</button>
              <button type="button" onClick={() => setSearchRef('REF-2026-0036')}>REF-2026-0036</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PublicIntake;

