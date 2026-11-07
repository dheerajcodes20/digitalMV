import React, { useState } from 'react';
import './VisitWizard.css';
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  MapPin, 
  Upload, 
  Cpu, 
  Layers, 
  Save, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const VisitWizard = ({ 
  visits, 
  workOrders, 
  currentUser, 
  onSubmitVisitReport, 
  addAuditEvent,
  selectedWorkOrder,
  setActiveTab 
}) => {
  const initialWO = selectedWorkOrder || workOrders[0];

  // Visit Header (One attendance header)
  const [headerData, setHeaderData] = useState({
    workOrderId: initialWO?.id || 'WO-2026-0108',
    customerName: initialWO?.customerName || 'Saudi Electricity Company (SEC)',
    siteLocation: initialWO?.siteLocation || 'Riyadh Substation 8044 — Al-Malaz',
    visitDate: '2026-10-23',
    leadEngineer: currentUser.name || 'Lead Field Engineer (ALF-FE-309)',
    crew: 'Lead Field Engineer, Field Assistant',
    customerContact: 'SEC Operations Desk',
    workType: 'Corrective Maintenance & Sensor Check',
    siteLimitations: 'Standard substation safety protocol; flash hood mandatory.',
    gps: {
      latitude: 24.6625,
      longitude: 46.7328,
      method: 'On-demand mobile capture',
      accuracy: '±3m',
    }
  });

  // Repeatable Panels
  const [panels, setPanels] = useState([
    {
      panelId: 'PNL-01',
      panelFamily: 'LBS / SLBS',
      subtype: 'SLBS',
      voltage: '13.8 kV',
      serialNo: 'ALF-MV-2024-8841',
      salesOrder: 'SO-99214',
      sapAssetId: 'SAP-AST-88410',
      csdTicket: 'CSD-2026-441',
      feederPole: 'Bay 3 - Outgoing Feeder',
      rtuType: 'ZIV',
      energyState: 'Energized',
      energyExceptionReason: '',
      complaintReported: 'Gas pressure alarm trigger during peak load',
      symptoms: 'Substation alarm panel annunciator lit up for SF6 low limit.',
      finding: 'Micro-leakage on VT manifold sensor valve seals.',
      suspectedCause: 'Thermal cycling stress on nitrile seal gasket.',
      confirmedCause: 'Worn gasket after high load ambient heat.',
      solutionCategory: 'Component Replacement & Re-calibration',
      actualWork: 'Depressurized sensor port, replaced seal with OEM viton kit, pressurized to 0.15 MPa, verified RTU analog loop.',
      remainingWork: 'None. Pressure steady.',
      jobStatus: 'Work Completed',
      status1: 'Active',
      ipAddress: '10.14.88.24',
      defectiveItem: 'TAM Sensor Card / Gas Pressure Sensor',
      defectiveMaterialSlNo: 'NCR-2026-0040',
      materialFlag: true,
      checklist: {
        installationProper: 'Pass',
        groundingAvailable: 'Pass',
        surgeArrestersProvided: 'Pass',
        chainFixedProperly: 'Pass',
        rtuCondition: 'Pass',
        uvsSensor: 'Pass',
        tamCard: 'Fail',
        gasPressure: 'Pass',
        operatingBehavior: 'Pass',
      },
      checklistReasons: {
        tamCard: 'Sensor seal degradation caused abnormal reading drop.',
      },
      readings: [
        { item: 'Gas Pressure', value: '0.15', unit: 'MPa', instrument: 'WIKA Precision Gauge', time: '10:15 AST' },
        { item: 'Contact Resistance', value: '38.2', unit: 'µΩ', instrument: 'Ductor Tester', time: '10:45 AST' },
        { item: 'Insulation Resistance', value: '2500', unit: 'MΩ', instrument: '5kV Megger', time: '11:10 AST' },
      ],
      attachments: ['photo_gauge_calibration.jpg', 'thermal_inspection_bay3.jpg']
    }
  ]);

  const [expandedPanelIdx, setExpandedPanelIdx] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');

  // Add another panel to this same attendance (Multi-panel site support)
  const handleAddPanel = () => {
    const newIdx = panels.length + 1;
    const newPanel = {
      panelId: `PNL-0${newIdx}`,
      panelFamily: 'Auto-Recloser',
      subtype: 'Standard Auto-Recloser',
      voltage: '33 kV',
      serialNo: `ALF-MV-2024-910${newIdx}`,
      salesOrder: 'SO-99430',
      sapAssetId: `SAP-AST-910${newIdx}`,
      csdTicket: `CSD-2026-44${newIdx}`,
      feederPole: `Bay ${newIdx} - Secondary Feeder`,
      rtuType: 'Ingeteam',
      energyState: 'De-energized',
      energyExceptionReason: '',
      complaintReported: 'Secondary bus health check',
      symptoms: 'Routine inspection',
      finding: 'Visual integrity verified. No mechanical binding.',
      suspectedCause: 'Normal operational wear',
      confirmedCause: 'No active fault observed',
      solutionCategory: 'Inspection & Lubrication',
      actualWork: 'Cleaned mechanism, verified auxiliary switch contacts.',
      remainingWork: 'None',
      jobStatus: 'Work Completed',
      status1: 'Active',
      ipAddress: '10.14.88.25',
      defectiveItem: '',
      defectiveMaterialSlNo: '',
      materialFlag: false,
      checklist: {
        installationProper: 'Pass',
        groundingAvailable: 'Pass',
        surgeArrestersProvided: 'Pass',
        chainFixedProperly: 'Pass',
        rtuCondition: 'Pass',
        uvsSensor: 'Pass',
        tamCard: 'Pass',
        gasPressure: 'Pass',
        operatingBehavior: 'Pass',
      },
      checklistReasons: {},
      readings: [
        { item: 'Insulation Resistance', value: '3000', unit: 'MΩ', instrument: '5kV Megger', time: '11:30 AST' },
      ],
      attachments: []
    };

    setPanels([...panels, newPanel]);
    setExpandedPanelIdx(panels.length);
  };

  const handleRemovePanel = (idx) => {
    if (panels.length === 1) {
      alert('A site visit must have at least one panel record.');
      return;
    }
    const updated = panels.filter((_, i) => i !== idx);
    setPanels(updated);
    setExpandedPanelIdx(0);
  };

  const handleUpdatePanel = (idx, field, value) => {
    const updated = [...panels];
    updated[idx][field] = value;
    setPanels(updated);
  };

  const handleChecklistChange = (panelIdx, checkKey, value) => {
    const updated = [...panels];
    updated[panelIdx].checklist[checkKey] = value;
    if (value === 'Pass' || value === 'Not Applicable') {
      delete updated[panelIdx].checklistReasons[checkKey];
    }
    setPanels(updated);
  };

  const handleChecklistReasonChange = (panelIdx, checkKey, reason) => {
    const updated = [...panels];
    if (!updated[panelIdx].checklistReasons) updated[panelIdx].checklistReasons = {};
    updated[panelIdx].checklistReasons[checkKey] = reason;
    setPanels(updated);
  };

  const handleSubmitVisit = (e) => {
    e.preventDefault();

    // Check mandatory validation: Fail or Not Checked results must have reasons
    for (let pIdx = 0; pIdx < panels.length; pIdx++) {
      const p = panels[pIdx];
      for (const [key, val] of Object.entries(p.checklist)) {
        if ((val === 'Fail' || val === 'Not Checked') && (!p.checklistReasons[key] || !p.checklistReasons[key].trim())) {
          alert(`Panel ${p.panelId} (${p.serialNo}): Checklist item "${key}" is set to "${val}" and requires a documented reason and corrective action.`);
          setExpandedPanelIdx(pIdx);
          return;
        }
      }

      if (p.energyState === 'Not verified' && (!p.energyExceptionReason || !p.energyExceptionReason.trim())) {
        alert(`Panel ${p.panelId}: Energization status "Not verified" requires an exception reason and supervisor review.`);
        setExpandedPanelIdx(pIdx);
        return;
      }
    }

    const visitRecord = {
      visitId: `VISIT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      workOrderId: headerData.workOrderId,
      customerName: headerData.customerName,
      siteLocation: headerData.siteLocation,
      visitDate: headerData.visitDate,
      leadEngineer: headerData.leadEngineer,
      crew: headerData.crew,
      customerContact: headerData.customerContact,
      workType: headerData.workType,
      siteLimitations: headerData.siteLimitations,
      reviewState: 'Submitted for Review',
      revision: 1,
      gps: headerData.gps,
      panels: panels,
    };

    if (onSubmitVisitReport) {
      onSubmitVisitReport(visitRecord);
    }

    addAuditEvent({
      user: currentUser.name,
      role: currentUser.role,
      action: 'Site Visit Report Submitted (Revision 1)',
      recordId: visitRecord.visitId,
      details: `Submitted attendance report with ${panels.length} panel inspection(s) for ${headerData.workOrderId}. Locked for Supervisor Review.`,
    });

    setSuccessMsg(`Visit report successfully submitted for supervisor review! Revision 1 locked.`);
    setTimeout(() => {
      setActiveTab('supervisorreview');
    }, 1200);
  };

  return (
    <div className="visit-wizard-page">
      <div className="wizard-page-header">
        <div>
          <h1 className="wizard-title">04 Visit Report Wizard & Technical Inspections</h1>
          <p className="wizard-sub">
            One attendance header per site visit; repeatable panel records, equipment family tree, checklists, and readings.
          </p>
        </div>

        <button 
          className="btn-add-panel-top"
          onClick={handleAddPanel}
        >
          <Plus size={16} />
          <span>Add Inspected Panel to this Visit</span>
        </button>
      </div>

      {successMsg && (
        <div className="success-banner">
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitVisit} className="wizard-form">
        {/* Card 1: Shared Visit Header */}
        <div className="wizard-card">
          <div className="wizard-card-head">
            <Layers size={18} className="head-icon" />
            <div>
              <h3>1. Shared Attendance Header (One per visit attendance)</h3>
              <span className="card-hint">
                Multi-panel inspections share this header. Shared visit time is counted once, not per panel.
              </span>
            </div>
          </div>

          <div className="header-grid-3">
            <div className="form-group">
              <label>Work Order Reference <span className="req">*</span></label>
              <input 
                type="text" 
                value={headerData.workOrderId} 
                readOnly
                className="input-readonly"
              />
            </div>

            <div className="form-group">
              <label>Customer Name <span className="req">*</span></label>
              <input 
                type="text" 
                value={headerData.customerName} 
                readOnly
                className="input-readonly"
              />
            </div>

            <div className="form-group">
              <label>Substation / Site Location <span className="req">*</span></label>
              <input 
                type="text" 
                value={headerData.siteLocation} 
                onChange={(e) => setHeaderData({ ...headerData, siteLocation: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="header-grid-4">
            <div className="form-group">
              <label>Visit Date <span className="req">*</span></label>
              <input 
                type="date" 
                value={headerData.visitDate}
                onChange={(e) => setHeaderData({ ...headerData, visitDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Lead Field Engineer <span className="req">*</span></label>
              <input 
                type="text" 
                value={headerData.leadEngineer}
                readOnly
                className="input-readonly"
              />
            </div>

            <div className="form-group">
              <label>Crew Members</label>
              <input 
                type="text" 
                value={headerData.crew}
                onChange={(e) => setHeaderData({ ...headerData, crew: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Customer Site Contact</label>
              <input 
                type="text" 
                value={headerData.customerContact}
                onChange={(e) => setHeaderData({ ...headerData, customerContact: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.6rem' }}>
            <label>Work Type & Scope</label>
            <input 
              type="text" 
              value={headerData.workType}
              onChange={(e) => setHeaderData({ ...headerData, workType: e.target.value })}
            />
          </div>

          <div className="gps-header-tag">
            <MapPin size={14} />
            <span>
              GPS Site Coordinates: {headerData.gps.latitude}° N, {headerData.gps.longitude}° E ({headerData.gps.accuracy}, {headerData.gps.method})
            </span>
          </div>
        </div>

        {/* Section 2: Repeatable Inspected Panels */}
        <div className="panels-section-head">
          <h3>2. Inspected Panels ({panels.length} Panel Record{panels.length > 1 ? 's' : ''})</h3>
          <span className="panels-sub">Each panel captures dependent equipment selections, checklist rows, readings, and defect state.</span>
        </div>

        {panels.map((p, idx) => {
          const isExpanded = expandedPanelIdx === idx;
          return (
            <div key={idx} className="panel-accordion-card">
              <div 
                className="accordion-header"
                onClick={() => setExpandedPanelIdx(isExpanded ? -1 : idx)}
              >
                <div className="acc-left">
                  <span className="panel-idx-pill">{p.panelId}</span>
                  <strong className="panel-serial-title">Serial No: {p.serialNo}</strong>
                  <span className="panel-type-tag">{p.panelFamily} ({p.voltage})</span>
                  <span className={`panel-energy-badge ${p.energyState.toLowerCase().replace(/\s+/g, '-')}`}>
                    {p.energyState}
                  </span>
                </div>

                <div className="acc-right">
                  {panels.length > 1 && (
                    <button 
                      type="button" 
                      className="btn-trash-panel"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePanel(idx);
                      }}
                      title="Remove this panel record"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {isExpanded && (
                <div className="accordion-body">
                  {/* Equipment Selection Tree */}
                  <div className="sub-section-title">Equipment Selection Tree & Ratings</div>
                  <div className="form-grid-3">
                    <div className="form-group">
                      <label>Equipment Family <span className="req">*</span></label>
                      <select 
                        value={p.panelFamily}
                        onChange={(e) => handleUpdatePanel(idx, 'panelFamily', e.target.value)}
                      >
                        <option value="LBS / SLBS">LBS / SLBS</option>
                        <option value="Auto-Recloser">Auto-Recloser</option>
                        <option value="RMU / MRMU / SRMU">RMU / MRMU / SRMU</option>
                        <option value="Other MV equipment">Other MV equipment</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Rated Voltage <span className="req">*</span></label>
                      <select 
                        value={p.voltage}
                        onChange={(e) => handleUpdatePanel(idx, 'voltage', e.target.value)}
                      >
                        <option value="13.8 kV">13.8 kV</option>
                        <option value="33 kV">33 kV</option>
                        {p.panelFamily === 'Other MV equipment' && (
                          <option value="Owner-approved rating">Owner-approved rating</option>
                        )}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Subtype / Model Specification</label>
                      <input 
                        type="text" 
                        value={p.subtype}
                        onChange={(e) => handleUpdatePanel(idx, 'subtype', e.target.value)}
                        placeholder="e.g. SLBS, Smart OH-LBS, etc."
                      />
                    </div>
                  </div>

                  <div className="form-grid-4">
                    <div className="form-group">
                      <label>Panel Serial Number <span className="req">*</span></label>
                      <input 
                        type="text" 
                        value={p.serialNo}
                        onChange={(e) => handleUpdatePanel(idx, 'serialNo', e.target.value)}
                        required
                        className="mono-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Sales Order No. (SO)</label>
                      <input 
                        type="text" 
                        value={p.salesOrder}
                        onChange={(e) => handleUpdatePanel(idx, 'salesOrder', e.target.value)}
                        className="mono-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>SAP / Asset ID</label>
                      <input 
                        type="text" 
                        value={p.sapAssetId}
                        onChange={(e) => handleUpdatePanel(idx, 'sapAssetId', e.target.value)}
                        className="mono-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Feeder / Pole / Bay Location</label>
                      <input 
                        type="text" 
                        value={p.feederPole}
                        onChange={(e) => handleUpdatePanel(idx, 'feederPole', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* RTU and Energy State */}
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>RTU / Controller Type <span className="req">*</span></label>
                      <select 
                        value={p.rtuType}
                        onChange={(e) => handleUpdatePanel(idx, 'rtuType', e.target.value)}
                      >
                        <option value="ZIV">ZIV</option>
                        <option value="DFE">DFE</option>
                        <option value="Ingeteam">Ingeteam (Controller)</option>
                        <option value="IKI-55">IKI-55</option>
                        <option value="Other">Other</option>
                        <option value="No RTU/Not Applicable">No RTU/Not Applicable</option>
                        <option value="Unknown/Not Confirmed">Unknown/Not Confirmed</option>
                      </select>
                      <span className="field-note">
                        * Ingeteam is a controller choice, not a voltage.
                      </span>
                    </div>

                    <div className="form-group">
                      <label>Energization State <span className="req">*</span></label>
                      <select 
                        value={p.energyState}
                        onChange={(e) => handleUpdatePanel(idx, 'energyState', e.target.value)}
                      >
                        <option value="Energized">Energized</option>
                        <option value="De-energized">De-energized</option>
                        <option value="Not verified">Not verified (Exception)</option>
                      </select>
                      {p.energyState === 'Not verified' && (
                        <input 
                          type="text" 
                          placeholder="Mandatory exception reason for 'Not verified'..."
                          value={p.energyExceptionReason || ''}
                          onChange={(e) => handleUpdatePanel(idx, 'energyExceptionReason', e.target.value)}
                          style={{ marginTop: '0.4rem' }}
                          required
                        />
                      )}
                    </div>
                  </div>

                  {/* Technical Inspection Checklist Table */}
                  <div className="checklist-container">
                    <div className="sub-section-title">
                      Technical Inspection Checklist (Pass / Fail / Not Checked / N/A)
                    </div>
                    <div className="table-responsive">
                      <table className="checklist-table">
                        <thead>
                          <tr>
                            <th>Inspection Component</th>
                            <th>Status Result</th>
                            <th>Required Reason / Action for Exceptions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { key: 'installationProper', label: '1. Installation Proper & Mounted Rigidly' },
                            { key: 'groundingAvailable', label: '2. Grounding Available (Main/VT/Tank)' },
                            { key: 'surgeArrestersProvided', label: '3. Surge Arresters Provided & Connected' },
                            { key: 'chainFixedProperly', label: '4. Chain / Handle Fixed Properly' },
                            { key: 'rtuCondition', label: '5. RTU / Controller Wiring & Auxiliary Power' },
                            { key: 'uvsSensor', label: '6. UVS (Under Voltage Sensor)' },
                            { key: 'tamCard', label: '7. TAM Sensor Card / Transducer' },
                            { key: 'gasPressure', label: '8. Gas Pressure (SF6 Manifold)' },
                            { key: 'operatingBehavior', label: '9. Operating / Protection Behavior' },
                          ].map(item => {
                            const val = p.checklist[item.key] || 'Pass';
                            const isException = val === 'Fail' || val === 'Not Checked';
                            return (
                              <tr key={item.key} className={isException ? 'row-exception' : ''}>
                                <td><strong>{item.label}</strong></td>
                                <td>
                                  <select 
                                    value={val}
                                    onChange={(e) => handleChecklistChange(idx, item.key, e.target.value)}
                                    className={`check-select ${val.toLowerCase().replace(/\s+/g, '-')}`}
                                  >
                                    <option value="Pass">Pass</option>
                                    <option value="Fail">Fail</option>
                                    <option value="Not Checked">Not Checked</option>
                                    <option value="Not Applicable">Not Applicable</option>
                                  </select>
                                </td>
                                <td>
                                  {isException ? (
                                    <input 
                                      type="text" 
                                      placeholder="Document mandatory reason & corrective action taken..."
                                      value={p.checklistReasons[item.key] || ''}
                                      onChange={(e) => handleChecklistReasonChange(idx, item.key, e.target.value)}
                                      className="reason-input required"
                                      required
                                    />
                                  ) : (
                                    <span className="no-reason-text">Normal / Conforming</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quantitative Electrical Readings */}
                  <div className="readings-container">
                    <div className="sub-section-title">Measurements & Instrument Readings</div>
                    <div className="readings-grid">
                      {p.readings.map((r, rIdx) => (
                        <div key={rIdx} className="reading-card">
                          <span className="reading-item-title">{r.item}</span>
                          <div className="reading-val-line">
                            <span className="reading-val">{r.value}</span>
                            <span className="reading-unit">{r.unit}</span>
                          </div>
                          <div className="reading-meta">
                            <span>{r.instrument}</span> • <span>{r.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Observations & Root Cause Separation */}
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Observed Fact (Symptoms / Issue Observed by Alfanar)</label>
                      <textarea 
                        rows={2}
                        value={p.finding}
                        onChange={(e) => handleUpdatePanel(idx, 'finding', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Suspected Cause vs Confirmed Cause</label>
                      <textarea 
                        rows={2}
                        value={p.confirmedCause}
                        onChange={(e) => handleUpdatePanel(idx, 'confirmedCause', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Actual Work Performed</label>
                      <textarea 
                        rows={2}
                        value={p.actualWork}
                        onChange={(e) => handleUpdatePanel(idx, 'actualWork', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Remaining Work & Follow-up</label>
                      <textarea 
                        rows={2}
                        value={p.remainingWork}
                        onChange={(e) => handleUpdatePanel(idx, 'remainingWork', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Defective Material / NCR Link */}
                  <div className="material-ncr-strip">
                    <div className="ncr-strip-left">
                      <label className="checkbox-item">
                        <input 
                          type="checkbox" 
                          checked={p.materialFlag}
                          onChange={(e) => handleUpdatePanel(idx, 'materialFlag', e.target.checked)}
                        />
                        <span>Defective Material Identified (Linked to NCR Workflow)</span>
                      </label>
                    </div>

                    {p.materialFlag && (
                      <div className="ncr-strip-inputs">
                        <input 
                          type="text" 
                          placeholder="Defective Item Name"
                          value={p.defectiveItem}
                          onChange={(e) => handleUpdatePanel(idx, 'defectiveItem', e.target.value)}
                        />
                        <input 
                          type="text" 
                          placeholder="NCR Reference (e.g. NCR-2026-0040)"
                          value={p.defectiveMaterialSlNo}
                          onChange={(e) => handleUpdatePanel(idx, 'defectiveMaterialSlNo', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Submit Actions */}
        <div className="wizard-submit-bar">
          <button 
            type="button" 
            className="btn-add-another-panel"
            onClick={handleAddPanel}
          >
            <Plus size={16} />
            <span>Add Another Panel to Attendance</span>
          </button>

          <button type="submit" className="btn-finalize-submit">
            <Send size={16} />
            <span>Submit Report for Supervisor Review (Step 5)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default VisitWizard;

