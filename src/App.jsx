import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Sidebar from './components/Sidebar/Sidebar';

// Pages
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Complaints from './pages/Complaints/Complaints';
import PublicIntake from './pages/PublicIntake/PublicIntake';
import WorkOrders from './pages/WorkOrders/WorkOrders';
import JobTimer from './pages/JobTimer/JobTimer';
import VisitWizard from './pages/VisitWizard/VisitWizard';
import SupervisorReview from './pages/SupervisorReview/SupervisorReview';
import NCRManagement from './pages/NCRManagement/NCRManagement';
import EquipmentRegister from './pages/EquipmentRegister/EquipmentRegister';
import Reports from './pages/Reports/Reports';
import SpecialistWorkflows from './pages/SpecialistWorkflows/SpecialistWorkflows';
import AuditTrail from './pages/AuditTrail/AuditTrail';
import ScopeMatrix from './pages/ScopeMatrix/ScopeMatrix';

// Mock Data
import { 
  INITIAL_USERS, 
  INITIAL_COMPLAINTS, 
  INITIAL_WORK_ORDERS, 
  INITIAL_VISITS, 
  INITIAL_TIMERS, 
  INITIAL_NCRS, 
  INITIAL_INVENTORY, 
  INITIAL_AUDIT_TRAIL,
  EQUIPMENT_CATALOGUE
} from './data/mockData';

export function App() {
  const [users] = useState(INITIAL_USERS);
  // Default logged in user: Dispatcher Supervisor (ALF-SUP-01)
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  // Core stateful entities
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);
  const [visits, setVisits] = useState(INITIAL_VISITS);
  const [timers, setTimers] = useState(INITIAL_TIMERS);
  const [ncrs, setNcrs] = useState(INITIAL_NCRS);
  const [inventory] = useState(INITIAL_INVENTORY);
  const [auditTrail, setAuditTrail] = useState(INITIAL_AUDIT_TRAIL);

  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  // Helper to add timestamped audit event
  const addAuditEvent = (event) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} AST`;
    const newEntry = {
      id: `AUD-${String(auditTrail.length + 1).padStart(3, '0')}`,
      timestamp: formatted,
      user: event.user,
      role: event.role,
      action: event.action,
      recordId: event.recordId,
      details: event.details,
    };
    setAuditTrail(prev => [newEntry, ...prev]);
  };

  // Add new complaint (Public Intake)
  const handleAddComplaint = (newComplaint) => {
    setComplaints(prev => [newComplaint, ...prev]);
  };

  // Step 2 Triage & Work Order creation
  const handleTriageAndAssign = (triageData) => {
    const updatedComplaints = complaints.map(c => {
      if (c.id === triageData.complaintId) {
        return {
          ...c,
          status: 'Assigned',
          assignedEngineer: triageData.assignedEngineer,
          assignedSupervisor: triageData.assignedSupervisor,
          priority: triageData.priority,
          dueDate: triageData.dueDate,
          linkedWorkOrder: `WO-2026-0${108 + workOrders.length}`,
        };
      }
      return c;
    });
    setComplaints(updatedComplaints);

    const targetComplaint = complaints.find(c => c.id === triageData.complaintId);
    const newWoId = `WO-2026-0${108 + workOrders.length}`;
    const newWorkOrder = {
      id: newWoId,
      complaintId: triageData.complaintId,
      customerName: targetComplaint?.customerName || 'Utility Client',
      siteLocation: targetComplaint?.siteLocation || 'Substation Bay',
      region: targetComplaint?.region || 'Central Region',
      priority: triageData.priority,
      status: 'ASSIGNED',
      assignedSupervisor: triageData.assignedSupervisor,
      assignedEngineer: triageData.assignedEngineer,
      engineerCode: triageData.assignedEngineerCode,
      plannedDate: triageData.plannedDate,
      dueDate: triageData.dueDate,
      shutdownRequired: triageData.shutdownRequired,
      customerApproval: triageData.customerApproval,
      permitReference: triageData.permitReference,
      materialFlag: triageData.materialFlag,
      summary: `${targetComplaint?.siteLocation} — ${targetComplaint?.customerName}`,
    };
    setWorkOrders(prev => [newWorkOrder, ...prev]);

    // Also initialize a 3-Stage timer for this engineer and work order
    const newTimer = {
      id: `TMR-2026-0${108 + workOrders.length}`,
      workOrderId: newWoId,
      engineerName: triageData.assignedEngineer,
      engineerCode: triageData.assignedEngineerCode,
      siteLocation: targetComplaint?.siteLocation,
      status: 'Not Started',
      currentStep: 1,
      actions: [],
      durations: {
        outboundTravel: 'Not Started',
        onSiteWork: 'Not Started',
        returnTravel: 'Not Started',
        total: '0.0 hrs',
      },
      correctionHistory: [],
    };
    setTimers(prev => [...prev, newTimer]);

    addAuditEvent({
      user: currentUser.name,
      role: currentUser.role,
      action: 'Supervisor Triage & Work Order Dispatched',
      recordId: newWoId,
      details: `Created Work Order ${newWoId} for ${targetComplaint?.referenceNo}; assigned to ${triageData.assignedEngineer}; Priority: ${triageData.priority}.`,
    });
  };

  // Update timer
  const handleUpdateTimer = (updatedTimer) => {
    setTimers(prev => prev.map(t => t.id === updatedTimer.id ? updatedTimer : t));
    
    // Update Work order status if started
    if (updatedTimer.actions.length > 0) {
      setWorkOrders(prev => prev.map(w => {
        if (w.id === updatedTimer.workOrderId && w.status === 'ASSIGNED') {
          return { ...w, status: 'IN PROGRESS' };
        }
        return w;
      }));
    }
  };

  // Submit visit report
  const handleSubmitVisitReport = (newVisit) => {
    setVisits(prev => [newVisit, ...prev]);

    // Update Work order status to SUBMITTED FOR REVIEW
    setWorkOrders(prev => prev.map(w => {
      if (w.id === newVisit.workOrderId) {
        return { ...w, status: 'SUBMITTED FOR REVIEW' };
      }
      return w;
    }));

    // Update complaint status
    setComplaints(prev => prev.map(c => {
      if (c.linkedWorkOrder === newVisit.workOrderId) {
        return { ...c, status: 'Submitted for Review' };
      }
      return c;
    }));
  };

  // Supervisor approval
  const handleApproveVisit = (visitId) => {
    setVisits(prev => prev.map(v => {
      if (v.visitId === visitId) {
        return { ...v, reviewState: 'Approved' };
      }
      return v;
    }));

    const targetVisit = visits.find(v => v.visitId === visitId);
    if (targetVisit) {
      setWorkOrders(prev => prev.map(w => {
        if (w.id === targetVisit.workOrderId) {
          return { ...w, status: 'APPROVED' };
        }
        return w;
      }));

      setComplaints(prev => prev.map(c => {
        if (c.linkedWorkOrder === targetVisit.workOrderId) {
          return { ...c, status: 'Approved' };
        }
        return c;
      }));
    }
  };

  // Supervisor return
  const handleReturnVisit = (visitId, returnComments) => {
    setVisits(prev => prev.map(v => {
      if (v.visitId === visitId) {
        return {
          ...v,
          reviewState: 'Returned for correction',
          revision: v.revision + 1,
          supervisorComments: returnComments,
        };
      }
      return v;
    }));

    const targetVisit = visits.find(v => v.visitId === visitId);
    if (targetVisit) {
      setComplaints(prev => prev.map(c => {
        if (c.linkedWorkOrder === targetVisit.workOrderId) {
          return { ...c, status: 'Returned for correction' };
        }
        return c;
      }));
    }
  };

  // Complete distinct closure milestone
  const handleCompleteClosureEvent = (complaintId, eventStep, reason) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        let nextStatus = c.status;
        if (eventStep === 'Customer Acceptance Recorded') nextStatus = 'Customer accepted';
        if (eventStep === 'Final Case Closure') nextStatus = 'Closed';
        return { ...c, status: nextStatus, closureReason: reason };
      }
      return c;
    }));

    if (eventStep === 'Final Case Closure') {
      const targetCmp = complaints.find(c => c.id === complaintId);
      if (targetCmp?.linkedWorkOrder) {
        setWorkOrders(prev => prev.map(w => {
          if (w.id === targetCmp.linkedWorkOrder) {
            return { ...w, status: 'CLOSED' };
          }
          return w;
        }));
      }
    }
  };

  // QCA disposition update
  const handleUpdateNcrDisposition = (update) => {
    setNcrs(prev => prev.map(n => {
      if (n.ncrNumber === update.ncrNumber) {
        return {
          ...n,
          qcaDisposition: update.qcaDisposition,
          testingQcaFinding: update.testingQcaFinding,
          custodyState: update.custodyState,
          qcaApprovedBy: update.qcaApprovedBy,
        };
      }
      return n;
    }));
  };

  // Append-only stock reversal
  const handlePerformStockReversal = ({ ncrNumber, reason, reversedBy, date }) => {
    setNcrs(prev => prev.map(n => {
      if (n.ncrNumber === ncrNumber) {
        return {
          ...n,
          reversals: [
            ...(n.reversals || []),
            { reason, reversedBy, date }
          ]
        };
      }
      return n;
    }));
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        users={users}
        unreadNotifications={1}
        toggleSidebar={() => setSidebarMobileOpen(!sidebarMobileOpen)}
        sidebarOpen={sidebarMobileOpen}
      />

      <div className="app-layout-body">
        {/* Left Operational Sidebar */}
        {activeTab !== 'home' && (
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setSidebarMobileOpen(false);
            }}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            complaintCount={complaints.filter(c => c.status === 'New').length}
            ncrCount={ncrs.filter(n => n.complaintClosedDate.includes('Open')).length}
          />
        )}

        {/* Main Content Area */}
        <main className={`app-main-content ${activeTab === 'home' ? 'home-view' : ''}`}>
          {activeTab === 'home' && (
            <Home 
              setActiveTab={setActiveTab} 
              setCurrentUser={setCurrentUser} 
              users={users} 
            />
          )}

          {activeTab === 'dashboard' && (
            <Dashboard 
              complaints={complaints}
              workOrders={workOrders}
              timers={timers}
              ncrs={ncrs}
              inventory={inventory}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'complaints' && (
            <Complaints 
              complaints={complaints}
              workOrders={workOrders}
              users={users}
              currentUser={currentUser}
              onTriageAndAssign={handleTriageAndAssign}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'publicintake' && (
            <PublicIntake 
              onAddComplaint={handleAddComplaint}
              complaints={complaints}
              addAuditEvent={addAuditEvent}
            />
          )}

          {activeTab === 'workorders' && (
            <WorkOrders 
              workOrders={workOrders}
              currentUser={currentUser}
              setActiveTab={setActiveTab}
              onSelectWorkOrderForVisit={(wo) => setSelectedWorkOrder(wo)}
              onSelectWorkOrderForTimer={(wo) => setSelectedWorkOrder(wo)}
            />
          )}

          {activeTab === 'jobtimer' && (
            <JobTimer 
              timers={timers}
              workOrders={workOrders}
              currentUser={currentUser}
              onUpdateTimer={handleUpdateTimer}
              addAuditEvent={addAuditEvent}
              selectedWorkOrder={selectedWorkOrder}
            />
          )}

          {activeTab === 'visitwizard' && (
            <VisitWizard 
              visits={visits}
              workOrders={workOrders}
              currentUser={currentUser}
              onSubmitVisitReport={handleSubmitVisitReport}
              addAuditEvent={addAuditEvent}
              selectedWorkOrder={selectedWorkOrder}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'supervisorreview' && (
            <SupervisorReview 
              visits={visits}
              complaints={complaints}
              currentUser={currentUser}
              onApproveVisit={handleApproveVisit}
              onReturnVisit={handleReturnVisit}
              onCompleteClosureEvent={handleCompleteClosureEvent}
              addAuditEvent={addAuditEvent}
            />
          )}

          {(activeTab === 'ncrmanagement' || activeTab === 'inventory') && (
            <NCRManagement 
              ncrs={ncrs}
              inventory={inventory}
              currentUser={currentUser}
              onAddNcr={() => {}}
              onUpdateNcrDisposition={handleUpdateNcrDisposition}
              onPerformStockReversal={handlePerformStockReversal}
              addAuditEvent={addAuditEvent}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'equipmentregister' && (
            <EquipmentRegister 
              EQUIPMENT_CATALOGUE={EQUIPMENT_CATALOGUE}
              visits={visits}
            />
          )}

          {(activeTab === 'reports' || activeTab === 'photoevidence' || activeTab === 'gpsmap') && (
            <Reports 
              visits={visits}
              ncrs={ncrs}
              addAuditEvent={addAuditEvent}
              currentUser={currentUser}
            />
          )}

          {(activeTab.startsWith('specialist_')) && (
            <SpecialistWorkflows />
          )}

          {(activeTab === 'audittrail' || activeTab === 'rbac') && (
            <AuditTrail 
              auditTrail={auditTrail}
              users={users}
              currentUser={currentUser}
            />
          )}

          {(activeTab === 'scopematrix' || activeTab === 'usermanual' || activeTab === 'notifications') && (
            <ScopeMatrix />
          )}
        </main>
      </div>

      {/* Standard Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
