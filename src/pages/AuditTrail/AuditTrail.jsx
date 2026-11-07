import React, { useState } from 'react';
import './AuditTrail.css';
import { 
  ShieldAlert, 
  Search, 
  Lock, 
  User, 
  Clock, 
  FileText, 
  CheckCircle, 
  ShieldCheck,
  Filter
} from 'lucide-react';

export const AuditTrail = ({ auditTrail, users, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredLogs = auditTrail.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || log.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="audit-page-container">
      <div className="audit-head-row">
        <div>
          <h1 className="audit-title">18 Immutable Audit Trail & RBAC Authorization</h1>
          <p className="audit-sub">
            Append-only security log recording every intake, assignment, timer action, revision submission, supervisor approval, and stock transaction.
          </p>
        </div>
      </div>

      {/* Security notice */}
      <div className="audit-policy-banner">
        <Lock size={16} className="lock-icon" />
        <span>
          <strong>Audit Policy:</strong> Every significant operational action is attributed to an authenticated individual with server timestamps in AST. 
          Audit records cannot be edited, rolled back, or deleted.
        </span>
      </div>

      {/* Staff Accounts & Scoped Roles Table */}
      <div className="rbac-card">
        <h3>19 Registered Staff Accounts & Role Matrix (Document Section 2)</h3>
        <p className="rbac-sub">Strict separation of duties enforced across the Medium-Voltage service hierarchy:</p>

        <div className="table-responsive">
          <table className="rbac-table">
            <thead>
              <tr>
                <th>Account Name & Code</th>
                <th>Assigned Role</th>
                <th>Region Scope</th>
                <th>Key Authorities</th>
                <th>Strict Access Boundaries</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={currentUser.id === u.id ? 'current-active-user' : ''}>
                  <td>
                    <div className="u-cell">
                      <div className="u-avatar">{u.avatarInitials}</div>
                      <div>
                        <strong>{u.name}</strong>
                        <span className="mono u-code">{u.code}</span>
                      </div>
                    </div>
                  </td>

                  <td><span className="role-tag">{u.role}</span></td>
                  <td>{u.region}</td>

                  <td>
                    <span className="auth-text">
                      {u.role === 'Engineer' && 'Record visits, panels, readings, photos, 6-action timers, raise NCR'}
                      {u.role.includes('Supervisor') && 'Triage, assign work orders, review reports, approve, close cases'}
                      {u.role === 'QCA / storekeeper' && 'QCA findings, disposition approval, stock transactions'}
                      {u.role === 'Manager / auditor' && 'Read-only dashboard oversight, reports, audit history'}
                      {u.role === 'System administrator' && 'Manage accounts, dropdown catalogues, system settings'}
                    </span>
                  </td>

                  <td>
                    <span className="boundary-text">
                      {u.role === 'Engineer' && 'Cannot self-approve technical closure or change catalogues'}
                      {u.role.includes('Supervisor') && 'Cannot approve QCA material disposition without QCA role'}
                      {u.role === 'QCA / storekeeper' && 'Cannot edit old stock events (audited reversals required)'}
                      {u.role === 'Manager / auditor' && 'Read-only by default (no modification rights)'}
                      {u.role === 'System administrator' && 'Privileged actions audited; admin rights do not replace QCA/technical sign-off'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Events Table */}
      <div className="audit-log-card">
        <div className="audit-filter-row">
          <div className="search-wrap">
            <Search size={15} />
            <input 
              type="text" 
              placeholder="Search user, action, record ID, or event details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="role-filter-select"
          >
            <option value="ALL">All Roles</option>
            <option value="Supervisor / dispatcher">Supervisor / Dispatcher</option>
            <option value="Engineer">Engineer</option>
            <option value="QCA / storekeeper">QCA / Storekeeper</option>
            <option value="External reporter">External Reporter</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Timestamp (AST)</th>
                <th>Actor & Role</th>
                <th>Action Event</th>
                <th>Target Record</th>
                <th>Audit Event Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, i) => (
                <tr key={i}>
                  <td>
                    <span className="mono audit-ts">{log.timestamp}</span>
                  </td>

                  <td>
                    <div className="actor-cell">
                      <strong>{log.user}</strong>
                      <span className="actor-role">{log.role}</span>
                    </div>
                  </td>

                  <td>
                    <span className="action-pill">{log.action}</span>
                  </td>

                  <td>
                    <span className="mono rec-id">{log.recordId}</span>
                  </td>

                  <td>
                    <span className="details-text">{log.details}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AuditTrail;

