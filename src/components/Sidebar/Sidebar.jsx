import React from 'react';
import './Sidebar.css';
import { 
  LayoutDashboard, 
  Inbox, 
  Briefcase, 
  Clock, 
  CheckSquare, 
  FileSpreadsheet, 
  CheckCircle2, 
  Cpu, 
  AlertOctagon, 
  Package, 
  Headphones, 
  PowerOff, 
  Activity, 
  Wrench, 
  UserCheck, 
  GraduationCap, 
  Camera, 
  MapPin, 
  FileText, 
  ShieldAlert, 
  Users, 
  Bell, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed,
  complaintCount = 1,
  ncrCount = 1
}) => {
  const menuSections = [
    {
      title: 'CORE OPERATIONS',
      items: [
        { id: 'dashboard', label: '01 Dashboard', icon: LayoutDashboard },
        { id: 'complaints', label: '02 Complaints / Intake', icon: Inbox, badge: complaintCount, badgeColor: 'red' },
        { id: 'workorders', label: '03 Work Orders', icon: Briefcase },
        { id: 'jobtimer', label: 'Three-Stage Timer', icon: Clock },
        { id: 'supervisorreview', label: 'Supervisor Review Queue', icon: CheckSquare },
        { id: 'visitwizard', label: '04 Visit Report Wizard', icon: FileSpreadsheet },
      ]
    },
    {
      title: 'ENGINEERING & QUALITY',
      items: [
        { id: 'visitwizard', label: '05 Technical Checklists', icon: CheckCircle2 },
        { id: 'equipmentregister', label: '06 Equipment Register', icon: Cpu },
        { id: 'ncrmanagement', label: '07 NCR Management', icon: AlertOctagon, badge: ncrCount, badgeColor: 'red' },
        { id: 'inventory', label: '08 Materials & Inventory', icon: Package },
      ]
    },
    {
      title: 'SPECIALIST WORKFLOWS',
      items: [
        { id: 'specialist_remote', label: '09 Remote Support', icon: Headphones },
        { id: 'specialist_shutdown', label: '10 Shutdown Planning', icon: PowerOff },
        { id: 'specialist_commissioning', label: '11 Commissioning', icon: Activity },
        { id: 'specialist_pm', label: '12 Preventive Maint.', icon: Wrench },
        { id: 'specialist_closure', label: '13 Customer Closure', icon: UserCheck },
        { id: 'specialist_training', label: '14 Training Records', icon: GraduationCap },
      ]
    },
    {
      title: 'GOVERNANCE & PLATFORM',
      items: [
        { id: 'photoevidence', label: '15 Photo Evidence', icon: Camera },
        { id: 'gpsmap', label: '16 GPS & Site Map', icon: MapPin },
        { id: 'reports', label: '17 Reports & 25-Col', icon: FileText },
        { id: 'audittrail', label: '18 Audit Trail', icon: ShieldAlert },
        { id: 'rbac', label: '19 Users & RBAC', icon: Users },
        { id: 'notifications', label: '20 Notifications & SLA', icon: Bell },
        { id: 'usermanual', label: 'User Manual & SOP', icon: BookOpen },
      ]
    }
  ];

  return (
    <aside className={`operational-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <span className="sidebar-header-title">OPERATIONAL MENU</span>}
        <button 
          className="collapse-toggle-btn" 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="sidebar-scrollable-content">
        {menuSections.map((sec, secIdx) => (
          <div key={secIdx} className="sidebar-section">
            {!collapsed && <div className="section-title">{sec.title}</div>}
            <div className="section-items">
              {sec.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                    title={collapsed ? item.label : ''}
                  >
                    <IconComponent size={17} className="item-icon" />
                    {!collapsed && (
                      <>
                        <span className="item-label">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`item-badge badge-${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Database connection badge */}
      <div className="sidebar-footer-status">
        <div className="status-indicator">
          <span className="live-dot"></span>
          {!collapsed && <span className="status-text">Live Database Connected</span>}
        </div>
        {!collapsed && (
          <div className="system-version-info">
            Alfanar MV Portal v1.0 - Kanpri Tech
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;

