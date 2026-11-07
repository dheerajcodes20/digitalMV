import React, { useState } from 'react';
import './Navbar.css';
import { 
  Zap, 
  BookOpen, 
  Network, 
  PlusCircle, 
  Bell, 
  ChevronDown, 
  Shield, 
  UserCheck, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  setCurrentUser, 
  users, 
  unreadNotifications = 1,
  toggleSidebar,
  sidebarOpen
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'complaints', label: 'Complaints' },
    { id: 'workorders', label: 'Work Orders' },
    { id: 'jobtimer', label: '3-Stage Job Timer' },
    { id: 'visitwizard', label: 'Visit Wizard' },
    { id: 'reports', label: '25-Col Reports' },
  ];

  return (
    <header className="top-navbar">
      {/* Left Branding */}
      <div className="navbar-brand-section">
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleSidebar} 
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="navbar-logo-wrap" onClick={() => setActiveTab('home')}>
          <div className="brand-logo-icon">
            <Zap className="bolt-icon" size={20} />
          </div>
          <div className="brand-titles">
            <span className="brand-title-main">Digital MV</span>
            <span className="brand-title-sub">ALFANAR ELECTRICAL SYSTEMS</span>
          </div>
        </div>
      </div>

      {/* Center Links */}
      <nav className="navbar-links">
        <button 
          className={`nav-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          Home Portal
        </button>
        {mainNavItems.map(item => (
          <button
            key={item.id}
            className={`nav-tab-btn ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right Controls */}
      <div className="navbar-right-controls">
        <button 
          className="nav-action-pill pill-gold" 
          onClick={() => setActiveTab('usermanual')}
          title="View Operating SOP & Developer Briefing"
        >
          <BookOpen size={14} />
          <span>User Manual</span>
        </button>

        <button 
          className="nav-action-pill pill-blue" 
          onClick={() => setActiveTab('scopematrix')}
          title="Traceability & Deliverable Scope Matrix"
        >
          <Network size={14} />
          <span>Traceability</span>
        </button>

        <button 
          className="nav-action-pill pill-green" 
          onClick={() => setActiveTab('publicintake')}
          title="Open Public Complaint Intake Form"
        >
          <PlusCircle size={14} />
          <span>Public Intake</span>
        </button>

        {/* Notifications */}
        <div className="nav-notification-wrapper">
          <button 
            className="nav-icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="System Notifications & Alerts"
          >
            <Bell size={18} />
            {unreadNotifications > 0 && <span className="notification-badge">{unreadNotifications}</span>}
          </button>

          {showNotifications && (
            <div className="notification-popover">
              <div className="popover-header">
                <strong>Operational Alerts</strong>
                <span className="badge-tag">1 Pending</span>
              </div>
              <div className="popover-item unread">
                <div className="item-title">Gas pressure alarm alert</div>
                <div className="item-desc">WO-2026-0108 at Riyadh Substation 8044 is active in field.</div>
                <div className="item-time">10 mins ago</div>
              </div>
              <div className="popover-item">
                <div className="item-title">Critical Solar Feeder Assigned</div>
                <div className="item-desc">WO-2026-0109 assigned to Field Engineer (ALF-FE-312).</div>
                <div className="item-time">1 hour ago</div>
              </div>
            </div>
          )}
        </div>

        {/* User Account / Role Switcher */}
        <div className="nav-user-wrapper">
          <button 
            className="user-profile-button" 
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            title="Switch Active Persona / Role"
          >
            <div className="user-avatar">{currentUser.avatarInitials || currentUser.name.charAt(0)}</div>
            <div className="user-details">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role-title">{currentUser.roleBadge || currentUser.role}</span>
            </div>
            <ChevronDown size={14} className="user-caret" />
          </button>

          {showRoleDropdown && (
            <div className="role-switcher-dropdown">
              <div className="dropdown-heading">
                <Shield size={12} />
                <span>SWITCH PERSONA / ROLE (RBAC)</span>
              </div>
              <div className="dropdown-caption">
                Switch accounts to verify least-privilege role boundaries and permissions.
              </div>
              <div className="role-options-list">
                {users.map(u => (
                  <button
                    key={u.id}
                    className={`role-option-item ${currentUser.id === u.id ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowRoleDropdown(false);
                    }}
                  >
                    <div className="opt-avatar">{u.avatarInitials}</div>
                    <div className="opt-info">
                      <div className="opt-name">
                        {u.name}
                        {currentUser.id === u.id && <UserCheck size={14} className="check-icon" />}
                      </div>
                      <div className="opt-role">{u.role} ({u.code})</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;

